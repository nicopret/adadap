var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'http://localhost:8080');

function getAccounts(callback) {
    web3.eth.getAccounts().then(accounts => callback(accounts));
}

function getBalance(account, callback) {
    web3.eth.getBalance(account).then(balance => callback(balance));
}

function getGasPrice(callback) {
    web3.eth.getGasPrice().then(gas => callback(gas));
}

function makeBatchPayment(from, recipients, callback) {

}

function makePayment(from, to, value, callback) {
    unlockAccount(from, success => {
        if (success) {
            web3.eth.sendTransaction({
                from: from,
                to: to,
                value: value
            }).then(receipt => {
                callback(receipt);
            });
        }
    });
}

function unlockAccount(account, callback) {
    web3.eth.personal.unlockAccount(account, 'aaa', 600).then(response => callback(response));
}

//getAccounts(accounts => makePayment(accounts[3], accounts[2], '1000000000000000000', res => console.log(res)));

console.log(web3.eth.accounts.wallet);
/*
web3.eth.getGasPrice().then(gas => {
    console.log('gas: ' + gas);
    web3.eth.getAccounts().then(accounts => {
        web3.eth.signTransaction({
            from: accounts[0],
            gas: '21000',
            gasPrice: gas,
            to: accounts[1],
            value: 1000000000000000000,
            data: '',
            nonce: '0x0'
        }, 'aaa').then(console.log);
    });
});
*/
/*
web3.eth.personal.getAccounts().then(accounts => {
    web3.eth.personal.unlockAccount(accounts[0], 'aaa', 600)
	.then((response) => {
        

        
       var batch = new web3.BatchRequest();
       batch.add(web3.eth.sendTransaction({from: accounts[0], to: accounts[1], value: '10000000000000000000'}, callBack));
       batch.add(web3.eth.sendTransaction({from: accounts[0], to: accounts[2], value: '10000000000000000000'}, callBack));
       batch.execute();
    }).catch((error) => {
		console.log(error);
    });
});
*/