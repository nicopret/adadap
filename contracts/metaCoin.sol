pragma solidity ^0.4.18;

contract metaCoin {
    mapping (address => uint) balances;

    constructor() public {
        balances[msg.sender] = 10000;
    }

    function sendCoin(address receiver, uint amount) public returns (bool sufficient) {
        if (balances[msg.sender] < amount) return false;
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        return true;
    }

    function getBalances() public returns (address[] balances) {
        return balances;
    }
}

//0x1623dbAA90F6e40d8F90F81468916963dCdabc2e