var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'http://localhost:8080');

/*
var res = web3.eth.accounts.create();
console.log(res);
*/

//web3.eth.personal.newAccount('aaa').then(res => console.log(res));

var baseNumber = 1000000000000000000;
//var mainAccount = '0x20b24efdB4219D3f7F408b2830EBc88715A16960';
var mainAccount = '0xe97d65A1EeD49883c1B8e400f226776f1c1C1614';
//0x25074a3F810246C116fCFC09006EB660A0866fa5
web3.eth.getAccounts().then(array => {
    stepArray(array.filter(account => account !== mainAccount), res => console.log(res));
});

function stepArray(array, callback) {
    if (array.length > 0) {
        var account = array.pop();
        web3.eth.getBalance(account).then(balance => {
            web3.eth.personal.unlockAccount(account, 'aaa', 600).then(response => {
                if (response) {
                    web3.eth.sendTransaction({
                        from: account,
                        to: mainAccount,
                        value: getRandom(1, (balance / baseNumber) * baseNumber)
                        }).then(receipt => {
                            console.log(receipt);
                            setTimeout(() => stepArray(array, callback), 1000);
                        });
                } else {
                    setTimeout(() => stepArray(array, callback), 1000);
                }
            });
        });
    } else {
        callback('done');
    }
}

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
