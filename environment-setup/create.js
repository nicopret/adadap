const { exec } = require('child_process'),
    async = require('async'),
    fs = require('fs'),
    readline = require('readline'),
    request = require('request'),
    util = require('./util');

const params = {
    basedir: 'D:/ether-local/nodes/test',
    nodes: [{
        count: 1,
        min: 10,
        miner: true,
        name: 'miner',
        port: 30303,
        primary: true,
        rpcport: 8080
    }, {
        count: 5,
        max: 10,
        min: 5,
        miner: false,
        name: 'base',
        port: 30304,
        primary: false,
        rpcport: 8081
    }, {
        count: 10,
        max: 5,
        min: 1,
        miner: false,
        name: 'guests',
        port: 30305,
        primary: false,
        rpcport: 8082
    }],
    password: 'aaa'
}

var genesis = {
    config: { 
        chainId: 15, 
        homesteadBlock: 0, 
        eip155Block: 0, 
        eip158Block: 0 
    }, 
    nonce: "0x0000000000000042", 
    timestamp: "0x0", 
    parentHash: "0x0000000000000000000000000000000000000000000000000000000000000000", 
    gasLimit: "0x8000000", 
    difficulty: "0x400", 
    mixhash: "0x0000000000000000000000000000000000000000000000000000000000000000", 
    coinbase: "0x3333333333333333333333333333333333333333", 
    alloc: {}
};

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

startHere(params.basedir);

function startHere(dir) {
    var array = dir.split('/');
    if (array.length < 3) {
        console.log('You need to supply a drive and at least one directory where to install, e.g. c:/ether/nodes/test.');
        process.exit();
    }
    if (fs.existsSync(new URL('file:///' + dir))) {
        rl.pause();
        getInput('The folder already exist, this operation might overwrite existing content, are you sure you want to continue(y/N)?', res => {
            if (res !== 'y') process.exit();
            rl.close();
            createNodes(params.nodes);
        });
    } else {
        createBaseDir(new URL('file:///' + array.splice(0, 2).join('/')), array, success => {
            if (!success) throw 'Could not create base dir';
            createNodes(params.nodes);
        });
    }
}

//createNode('test', (res) => console.log(res));

//createAccounts('test', 5, 1, 5, {}, accounts => {
//    console.log(accounts);
//});

function createAccounts(dir, count, min, max, output, index, callback) {
    var amount = min;
    if (max) {
        amount = Math.floor(Math.random() * max) + min;
    }
    exec('geth --password ./password --datadir ./' + dir + '/data account new', (err, stdout, stderr) => {
        var key = '0x' + stdout.substring(stdout.indexOf('{') + 1, stdout.indexOf('}'));
       output[key] = {
            balance: (amount * 1000000000000000000).toString()
        }
        console.log('created ' + index + ': ' + key);
        count > 1 ? createAccounts(dir, count -1, min, max, output, ++index, callback) : callback(output);
    });
}

/**
 * This function creates the base directory where the development nodes will be created at. All the admin scripts
 * will also be saved in this directory.
 * 
 * @param {string} path 
 * @param {array} dirs 
 * @param {boolean} callback 
 */
function createBaseDir(path, dirs, callback) {
    if (!fs.existsSync(path)) fs.mkdirSync(path);
    if (dirs.length > 0) {
        createBaseDir(new URL(path + '/' + dirs.splice(0, 1)[0]), dirs, callback);
    } else {
        callback(true);
    }
}

function createFile(path, file, content, callback) {
    fs.writeFile([path, file].join('/'), content, () => callback(true));
}

function createNodes(array) {
    var node = array.splice(0, 1)[0];
    var path = params.basedir + '/' + node.name;
    async.series([
        function(callback) {
            createNode(createURL(path), success => {
                callback(null, node.name);
            });
        },
        function(callback) {
            console.log(node.name);
            console.log('========================');
            createAccounts(path, node.count, node.min, node.max ? node.max : null, {}, 1, res => {
                genesis.alloc = res;
                callback(null, res);
            });
        },
        function(callback) {
            createFile(path, 'genesis.json', JSON.stringify(genesis, null, 2), () => callback(null, true));
        },
        function (callback) {
            var cmd = 'geth --identity "' + ['local', node.name, 'node'].join(' ').camelcase() + '" --rpc --rpcport ' + node.rpcport + 
            ' --rpccorsdomain "*" --datadir ' + path + '/data --port ' + node.port + ' --nodiscover --rpcapi admin,db,eth,net,web3,personal' + 
            ' --networkid 1999 --maxpeers 0';

            if (node.primary) {
                getData('http://localhost:8080', {
                    id: 1,
                    method: "admin_nodeInfo"                                
                }, (res) => console.log(res));
            } else {
                createFile(path, 'start_' + node.name + '.bat', cmd + ' console', res => callback(null, res));
            }
//            fs.writeFile('--port 30303 --nodiscover --rpcapi db,eth,net,web3,personal --networkid 1999 --maxpeers 0 console', err => callback(null, err ? false : { file: true }));
        },
        function(callback) {
            createFile(path, 'mist_' + node.name + '.bat', 
                'Mist --rpc http://localhost:' + node.rpcport + ' --swarmurl "null"',
                res => callback(null, res));
        }
    ], (err, res) => {
        if (err) return console.error('error: ' + err);
        if (array.length > 0) {
            createNodes(array);
        } else {
            console.log(params);
        }
    });
}

/**
 * This function creates the test node and all relevant directories to run geth.
 * 
 * @param {string} dir 
 * @param {boolean} callback 
 */
function createNode(dir, callback) {
    async.series([
        function(callback) {
            fs.mkdir(dir, () => callback(null, dir.pathname));
        },
        function(callback) {
            fs.mkdir(createURL(dir.pathname + '/data'), () => callback(null, 'data'));
        },
        function(callback) {
            fs.mkdir(createURL(dir.pathname + '/logs'), () => callback(null, 'logs'));
        },
        function(callback) {
            fs.writeFile(createURL(dir.pathname + '/logs/00.log'), '', err => callback(null, err ? false : { file: true }));
        }
    ], (err, res) => {
        if (err) return console.error(err);
        callback(res.file);
    });
}

/**
 * Create a URL from the paths to create folders with
 * 
 * @param {string} path 
 */
function createURL(path) {
    return new URL('file:///' + path);
}

function getData(url, params, callback) {
    request({
        uri: url,
        method: 'POST',
        json: params
    }, (err, res) => {
        if (err) return console.error(err);
        callback(res.body);
    });
}

/**
 * This function is used to enable input from the user
 * 
 * @param {string} prompt 
 * @param {boolean} callback 
 */
function getInput(prompt, callback) {
    rl.question(prompt + '\n', answer => {
        callback(answer);
    });
}