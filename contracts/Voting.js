var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8080'));

var abi = JSON.parse('[{"constant":true,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x2f265cf7"},{"constant":true,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x392e6678"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x7021939f"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xb13c744b"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xcc9ab267"},{"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor","signature":"constructor"}]');

Contract = web3.eth.contract(abi);

var contractInstance = Contract.at('0x3A5f4F20Fd7C64bA08ea17E9F1197F9Fb6e47102');

function totalVotesFor(candidate) {
	contractInstance.totalVotesFor(candidate, {
		from: '0x22CDFa500B9A22B2f7D9b4A4010A92a181a613E6'
	})
	.then((res) => {
		return res;
	})
	.catch(console.error);
}

function validCandidate(candidate) {
	contractInstance.validCandidate(candidate, {
		from: '0x22CDFa500B9A22B2f7D9b4A4010A92a181a613E6'
	})
	.then((res) => {
		return res;
	})
	.catch(console.error);
}

function votesReceived() {
	contractInstance.votesReceived({
		from: '0x22CDFa500B9A22B2f7D9b4A4010A92a181a613E6'
	})
	.then((res) => {
		return res;
	})
	.catch(console.error);
}

function candidateList() {
	contractInstance.candidateList({
		from: '0x22CDFa500B9A22B2f7D9b4A4010A92a181a613E6'
	})
	.then((res) => {
		return res;
	})
	.catch(console.error);
}

function voteForCandidate(candidate) {
	contractInstance.voteForCandidate(candidate, {
		from: '0x22CDFa500B9A22B2f7D9b4A4010A92a181a613E6'
	})
	.then(() => {})
	.catch(console.error);
}