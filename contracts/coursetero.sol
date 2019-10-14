pragma solidity ^0.4.21;

contract Coursetro {
    string fName;
    uint age;

    event Instructor(string name, uint age);

    function Coursetro(string _fName, uint _age) public {
        fName = _fName;
        age = _age;
    }

    function getInstructor() public constant returns (string, uint) {
        return (fName, age);
    }

    function setInstructor(string _fName, uint _age) public {
        fName = _fName;
        age = _age;
        emit Instructor(_fName, _age);
    }
}