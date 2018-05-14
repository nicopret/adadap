const { exec } = require('child_process'),
    { spawn } = require('child_process'),
    async = require('async'),
    fs = require('fs'),
    readline = require('readline');

const dir = process.argv[2];
const count = process.argv[3];

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

function createAccounts(dir, count, callback) {
    exec('geth --password ./password --datadir ./' + dir + '/data account new', (err, stdout, stderr) => {
        var key = '0x' + stdout.substring(stdout.indexOf('{') + 1, stdout.indexOf('}'));
        genesis.alloc[key] = {
            balance: "10000000000000000000"
        }
        console.log(key + ' created');
        Object.keys(genesis.alloc).length < count ? createAccounts(dir, count, callback) : callback();
    });
}

function getInput(prompt, callback) {
    rl.question(prompt + '\n', age => {
        callback(age);
    });
}

async.series({
    dir: function(callback) {
        getInput("What is your repository name?", name => callback(null, name));
    },
    count: function(callback) {
        getInput("How many test accounts do you want to create?", count => callback(null, count));
    }
}, (err, results) => {
    rl.close();
    if (err) return console.error(err);
    fs.mkdirSync(results.dir);
    fs.mkdirSync(results.dir + '/data');
    fs.mkdirSync(results.dir + '/logs');
    fs.writeFile(results.dir + '/logs/00.log', '');    
    createAccounts(results.dir, results.count, () => {
        fs.writeFile(results.dir + '/CustomGenesis.json', JSON.stringify(genesis, null, 2), () => {
            exec('geth --identity “LocalTestNode” --rpc --rpcport 8080 --rpccorsdomain “*” --datadir ./' + results.dir + '/data/ --port 30303 --nodiscover --rpcapi db,eth,net,web3,personal,admin,miner --networkid 1999 --maxpeers 0 --verbosity 6 init ./' + results.dir + '/CustomGenesis.json 2>> ./' + results.dir + '/logs/00.log', (err, stdout, stderr) => {
                if (err) return console.error(err);
                if (stderr) return console.error(stderr);
                console.log('\n\nNow run the following command in a new shell:\n\n');
                console.log('geth --identity “LocalTestNode” --rpc --rpcport 8080 --rpccorsdomain “*” --datadir ./' + results.dir + '/data/ --port 30303 --nodiscover --rpcapi db,eth,net,web3,personal --networkid 1999 --maxpeers 0 console');
                console.log('\n\nThen check for the account balances in the console with the following:\n\n');
                console.log('eth.getBalance(eth.accounts[0]);');
                console.log('\n\nThen run the following command to start MIST (When the insecure RPC connection warning pops up just click on OK):\n\n');
                console.log('Mist --rpc http://localhost:8080 --swarmurl “null”');
                console.log('\n\nTo reflect any payments or transactions on your local node, you need to start mining, you can do this in the javascript console created with the first command, just enter:\n\n');
                console.log('miner.start(2); ');
                console.log('\nThe "2" is the number of processes doing the mining, you can stop it by entering: "miner.stop();"');
            });
        });
    });
});