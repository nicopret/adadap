var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8080'));

abi = JSON.parse('[{"constant":true,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x2f265cf7"},{"constant":true,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x392e6678"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x7021939f"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xb13c744b"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xcc9ab267"},{"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor","signature":"constructor"}]');

VotingContract = web3.eth.contract(abi);

constractInstance = VotingContract.at('0x557eed4D17660672c41602F31B3d322B35d1abf7');

candidates = {
    "Rama": "candidate-1",
    "Nick": "candidate-2",
    "Jose": "candidate-3"
};

var accounts = web3.eth.accounts;
console.log(accounts);

console.log(VotingContract);

console.log(constractInstance);
console.log(constractInstance.candidateList(0x557eed4D17660672c41602F31B3d322B35d1abf7));

function voteForCandidate() {
    candidateName = $("#candidate").val();
    constractInstance.voteForCandidate(candidateName, {
        from: accounts[0]
    }, function() {
        console.log('done');
        let div_id = candidates[candidateName];
        $("#" + div_id).html(constractInstance.totalVotesFor.call(candidateName).toString());
    })
}