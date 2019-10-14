const fs = require('fs');

fs.writeFile('metaCoin.json', JSON.stringify({
    arguments: []
}), () => console.log('done'));
/*
fs.readFile('Voting.json', 'utf-8', (err, data) => {
    if (err) return console.error(err);
    console.log(JSON.parse(data));
});
*/
/*
var input = JSON.parse(fs.readFileSync('test.json').toString());
console.log(JSON.stringify(input.options.address));

var code = 'var web3 = new Web3(new Web3.providers.HttpProvider(\'' + input.currentProvider.host + '\'));';
code += '\n\nvar abi = JSON.parse(\'' + JSON.stringify(input.options.jsonInterface) + '\');';
code += '\n\nVotingContract = web3.eth.contract(abi);';
code += '\n\nvar contractInstance = VotingContract.at(\'' + input.options.address + '\');'

input.options.jsonInterface.filter(item => {
    return item.type === "function";
}).forEach(item => {
    console.log(item.name);
    code += '\n\nfunction ' + item.name + '(' + createInput(item.inputs, false) + ') {';
    code += '\n\tcontractInstance.' + item.name + '(' + createInput(item.inputs, true) + '{';
    code += '\n\t\tfrom: \'' + input.defaultAccount + '\'';
    code += '\n\t})';
    code += '\n\t.then((' + (item.outputs.length > 0 ? 'res' : '') + ') => {' + (item.outputs.length > 0 ? '\n\t\treturn res;\n\t' : '') + '})';
    code += '\n\t.catch(console.error);'
    code += '\n}';
});

fs.writeFile('output.js', code, () => console.log('done'));

function createInput(inputs, trailing) {
    var array = [];
    inputs.forEach(input => {
        if (input.name.length > 0) array.push(input.name)
    });
    var res =  array.length > 0 ? array.join(', ')  : '';
    return trailing && array.length > 0 ? res + ', ' : res;
}
*/