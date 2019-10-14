pragma solidity ^0.4.22;

contract SimpleAuction {
    // Parameters of the auction. Times are either absolute unix timestamps (seconds since 1970-01-01) or time periods in seconds
    address public beneficiary;
    uint public auctionEnd;

    // Current state of the auction
    address public highestBidder;
    uint public highestBid;

    // Allowed withdrawals of previous bids
    mapping(address => uint) pendingReturns;

    // Set to true at the end, disallows any change
    bool ended;

    // Events that will be fired on changes
    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);

    // The following is a so-called natspec comment, recognizable by the three slashes. It will be shown  when the user is asked to confirm a transaction.

    /// Create a simple auction with `_biddingTime` seconds bidding time on behal of the beneficiary address `_beneficiary`.
    function SimpleAuction(uint _biddingTime, address _beneficiary) public {
        beneficiary = _beneficiary;
        auctionEnd = now + _biddingTime;
    }

    /// Bid on the auction with the value sent together with this transaction. The value will only be refunded if the auction is won.
    function bid() public payable {
        // No arguments are neccessary, all information is already part of the transaction. The keyword payable is required for the function to be able to receive Ether

        // Revert the call if the bidding period is over.
        require(now <= auctionEnd);

        // If the bid is not higher, send the money back.
        require(msg.value > highestBid);

        // Sending back the money by simply using highestBidder.send(higestBid) is a security risk because it could execute an untrusted contract. It is always safer to let the recipiets withdraw their money themselves.
        if (highestBid != 0) {
            pendingReturns[highestBidder] += highestBid;
        }
        highestBidder = msg.sender;
        highestBid = msg.value;
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    /// Withdraw a bid that was overbid.
    function withdraw() public returns (bool) {
        uint amount = pendingReturns[msg.sender];
        // It is important to set ths to zero because the recipient can call this function again as part of the receiving call beofre `send` returns.
        if (amount > 0) {
            pendingReturns[msg.sender] = 0;

            if (!msg.sender.send(amount)) {
                pendingReturns[msg.sender] = amount;
                return false;
            }
        }
        return true;
    }

    /// End the auction and send the highest bid to the beneficiary
    function auctionEnd() public {
        // It is a good guideline to structure functions that interact with other contracts into three phases
        // 1. checking conditions
        // 2. performing actions (potentially changing conditions)
        // 3. interacting with other contracts
        // If these phases are mixed up, the other contract could call back into the current contract and modify the state or cause effects to be performed multiple times.
        // If functions called internally include interaction with external contracts, they also have to be considered interaction with external contracts.

        // 1. Conditions
        require(now >= auctionEnd);
        require(!ended);

        // 2. Effects
        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        // 3. Interaction
        beneficiary.transfer(highestBid);
    }
}