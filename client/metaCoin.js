var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8080'));

var abi = JSON.parse('[{"constant":false,"inputs":[],"name":"getBalances","outputs":[{"name":"balances","type":"address[]"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x00113e08"},{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"name":"sendCoin","outputs":[{"name":"sufficient","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x90b98a11"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor","signature":"constructor"}]');

Contract = web3.eth.contract(abi);

var contractInstance = Contract.at('0x43Ea443D1d5B93DA5402D9FA46bE2a6FeDD398F8');

function getBalances() {
	web3.personal.unlockAccount('0x22CDFa500B9A22B2f7D9b4A4010A92a181a613E6',"aaa", 15000);
	console.log(contractInstance.getBalances({from: '0x22CDFa500B9A22B2f7D9b4A4010A92a181a613E6'}));
	contractInstance.getBalances({
		from: '0x22CDFa500B9A22B2f7D9b4A4010A92a181a613E6'
	})
	.then((res) => {
		console.log(res);
		return res;
	})
	.catch(console.error);
}

function sendCoin(receiver, amount) {
	contractInstance.sendCoin(receiver, amount, {
		from: '0x22CDFa500B9A22B2f7D9b4A4010A92a181a613E6'
	})
	.then((res) => {
		return res;
	})
	.catch(console.error);
}

getBalances();