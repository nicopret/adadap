const async = require('async'),
    fs = require('fs'),
    solc = require('solc');

var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'http://localhost:8080');
var name = '';

if (process.argv.length > 2) {
    var file = process.argv[2].toString();
    async.series({
        contract: function(callback) {
            var compiled = solc.compile(fs.readFileSync(file + '.sol').toString());
            var key = Object.keys(compiled.contracts)[0];
            callback(null, {
                abi: compiled.contracts[key].interface,
                bytecode: '0x' + compiled.contracts[key].bytecode,
                contract: compiled,
                key: key
            });
        },
        params: function(callback) {
            fs.readFile(file + '.json', 'utf8', (err, res) => {
                if (res) callback(null, JSON.parse(res));
            });
        },
        address: function(callback) {
            web3.eth.defaultAccount ? callback(web3.eth.defaultAccount) : web3.eth.getAccounts().then(accounts => {
                web3.eth.defaultAccount = accounts[0];
                callback(null, accounts[0]);
            });            
        }
    }, (err, result) => {
        if (err) return console.error(err);
       var contract = new web3.eth.Contract(JSON.parse(result.contract.abi));
        web3.eth.personal.unlockAccount(result.address, 'aaa', 200).then(response => {
            if (response) {
                contract.deploy({
                    data: result.contract.bytecode,
                    arguments: result.params.arguments && result.params.arguments.length > 0 ? [result.params.arguments.map(Web3.utils.asciiToHex)] : []
                }).send({
                    from: result.address,
                    gas: 4612388
                })
                .on('error', error => console.log(error))
                .on('transactionHash', hash => console.log(hash))
                .on('receipt', receipt => console.log(receipt))
                .on('confirmation', (confirmationNumber, receipt) => console.log(confirmationNumber + ' - ' + JSON.stringify(receipt)))
                .then(result => writeJS(file, result));
            }
        });
    });
} else {
    console.log('Need a contract name, please run the command with: node compile.js ***.sol');
}

function writeJS(file, input) {
    var code = 'var web3 = new Web3(new Web3.providers.HttpProvider(\'' + input.currentProvider.host + '\'));';
    code += '\n\nvar abi = JSON.parse(\'' + JSON.stringify(input.options.jsonInterface) + '\');';
    code += '\n\n' + name + 'Contract = web3.eth.contract(abi);';
    code += '\n\nvar contractInstance = Contract.at(\'' + input.options.address + '\');'

    input.options.jsonInterface.filter(item => {
        return item.type === "function";
    }).forEach(item => {
        code += '\n\nfunction ' + item.name + '(' + createInput(item.inputs, false) + ') {';
        code += '\n\tcontractInstance.' + item.name + '(' + createInput(item.inputs, true) + '{';
        code += '\n\t\tfrom: \'' + input.defaultAccount + '\'';
        code += '\n\t})';
        code += '\n\t.then((' + (item.outputs.length > 0 ? 'res' : '') + ') => {' + (item.outputs.length > 0 ? '\n\t\treturn res;\n\t' : '') + '})';
        code += '\n\t.catch(console.error);'
        code += '\n}';
    });

    fs.writeFile(file + '.js', code, () => console.log('done'));
}

function createInput(inputs, trailing) {
    var array = [];
    inputs.forEach(input => {
        if (input.name.length > 0) array.push(input.name)
    });
    var res =  array.length > 0 ? array.join(', ')  : '';
    return trailing && array.length > 0 ? res + ', ' : res;
}