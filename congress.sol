pragma solidity ^0.4.16;

contract owned {
    address public owner;

    function owned() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) onlyOwner public {
        owner = newOwner;
    }
}

contract tokenRecipient {
    event receivedEther(address sender, uint amount);
    event receivedTokens(address _from, uint256 _value, address _token, bytes _extraData);

    function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData) public {
        Token t = Token(_token);
        require(t.transferFrom(_from, this, _value));
        emit receivedTokens(_from, _value, _token, _extraData);
    }
}

interface Token {
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);
}

contract Congress is owned, tokenRecipient {
    uint public minimumQuorum;
    uint public debatingPeriodInMinutes;
    int public majorityMargin;
    Proposal[] public proposals;
    uint public numProposals;
    mapping (address => uint) public memberId;
    Member[] public members;

    event PropsalAdded(uint proposalID, address recipient, uint amount, string description);
    event Voted(uint proposalID, bool position, address voter, string justification);
    event ProposalTallied(uint proposalID, int result, uint quorum, bool active);
    event MembershipChanged(address member, bool isMember);
    event ChangeOfRules(uint newMinimumQuorum, uint newDebatingPeriodInMinutes, int newMajorityMargin);

    struct Proposal {
        address recipient;
        uint amount;
        string description;
        uint minExecutionDate;
        bool executed;
        bool proposalPassed;
        uint numberOfVotes;
        int currentResult;
        bytes32 proposalHash;
        Vote[] votes;
        mapping(address => bool) voted;
    }

    struct Member {
        address member;
        string name;
        uint memberSince;
    }

    struct Vote {
        bool inSupport;
        address voter;
        string justification;
    }

    function Congress(
        uint minimumQuorumForProposals,
        uint minutesForDebate,
        int marginOfVotesForMajority
    ) payable public {
        changeVotingRules(minimumQuorumForProposals, minutesForDebate, marginOfVotesForMajority);
    }

    function addMember(address targetMember, string memberName) onlyOwner public {
        uint id = memberId[targetMember];
        if (id == 0) {
            memberId[targetMember] = members.length;
            id = members.length++;
        }
        members[id] = Member({
            member: targetMember,
            name: memberName,
            memberSince: now
        });
        emit MembershipChanged(targetMember, true);
    }

    function removeMember(address targetMember) onlyOwner public {
        require(memberId[targetMember] != 0);
        for (uint i = memberId[targetMember]; i < members.length - 1; i++) {
            members[i] = members[i + 1];
        }
        delete members[members.length - 1];
        members.length--;
    }

    function changeVotingRules(
        uint minimumQuorumForProposals,
        uint minutesForDebate,
        int marginOfVotesForMajority
    ) onlyOwner public {
        minimumQuorum = minimumQuorumForProposals;
        debatingPeriodInMinutes = minutesForDebate;
        majorityMargin = marginOfVotesForMajority;

        emit ChangeOfRules(minimumQuorum, debatingPeriodInMinutes, majorityMargin);
    }

    function newProposal(
        address beneficiary, 
        uint weiAmount, 
        string jobDescription, 
        bytes transactionBytecode
        ) onlyMembers public returns (uint proposalID) {
        proposalID = proposals.length++;
        Proposal storage p = proposals[proposalID];
        p.recipient = beneficiary;
        p.amount = weiAmount;
        p.description = jobDescription;
        p.proposalHash = keccak256(beneficiary, weiAmount, transactionBytecode);
        p.minExecutionDate = now + debatingPeriodInMinutes * 1 minutes;
        p.executed = false;
        p.proposalPassed = false;
        p.numberOfVotes = 0;
        ProposalAdded(proposalID, beneficiary, weiAmount, jobDescription);
        numProposals = proposalID + 1;
        return proposalID;
    }

    function newProposalInEther(
        address beneficiary,
        uint etherAmount,
        string jobDescription,
        bytes transactionBytecode
    ) onlyMembers public returns (uint proposalID) {
        return newPropsal(beneficairy, etherAmount * 1 ether, jobDescription, transactionBytecode);
    }

    function checkProposalCode(
        uint proposalNumber,
        address beneficairy,
        uint weiAmount,
        bytes transactionBytecode
    ) view public returns (bool codeChecksOut) {
        Proposal storage p = proposals[proposalNumber];
        return p.proposalHash == keccak256(beneficairy, weiAmount, transactionBytecode);
    }

    function vote(
        uint proposalNumber,
        bool supportsProposal,
        string justificationText
    ) onlyMembers public returns (uint voteID) {
        Proposal storage p = proposals[proposalNumber];
        require(!p.voted[msg.sender]);
        p.voted[msg.sender] = true;
        p.numberOfVotes++;
        if (supportsProposal) {
            p.currentResult++;
        } else {
            p.currentResult--;
        }

        emit Voted(proposalNumber, supportsProposal, msg.sender, justificationText);
        return p.numberOfVotes;
    }

    function exectuteProposal(
        uint proposalNumber,
        bytes transactionBytecode
    ) public {
        Proposal storage p = proposals[proposalNumber];
        require (now > p.minExecutionDate
            && !p.executed
            && p.proposalHash == keccak256(p.recipient, p.amount, transactionBytecode)
            && p.numberOfVotes >= minimumQuorum);

        if (p.currentResult > majorityMargin) {
            p.executed = true;
            require(p.recipient.transfer(p.amount)(transactionBytecode));
            p.proposalPassed = true;
        } else {
            p.proposalPassed = false;
        }

        emit ProposalTallied(proposalNumber, p.currentResult, p.numberOfVotes, p.proposalPassed);
    }
}