// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BitcoinEscrow is Ownable {
    address public buyer;
    address public seller;
    uint256 public amount;
    bytes32 public bitcoinTxHash;
    bool public fundsReleased;
    uint256 public disputeDeadline; // Timestamp for dispute window

    event FundsLocked(address indexed buyer, uint256 amount);
    event FundsReleased(address indexed seller);
    event DisputeInitiated(address indexed party);

    constructor(address _seller) payable Ownable(msg.sender) {
        buyer = msg.sender;
        seller = _seller;
        amount = msg.value;
        disputeDeadline = block.timestamp + 7 days; // 7-day dispute window
        emit FundsLocked(buyer, amount);
    }

    // Set Bitcoin TX hash (callable by buyer/seller)
    function setBitcoinTxHash(bytes32 _txHash) external {
        require(msg.sender == buyer || msg.sender == seller, "Unauthorized");
        bitcoinTxHash = _txHash;
    }

    // Release funds (oracle or multi-sig confirmation would trigger this)
    function releaseFunds() external onlyOwner {
        require(!fundsReleased, "Funds already released");
        fundsReleased = true;
        payable(seller).transfer(amount);
        emit FundsReleased(seller);
    }

    // Initiate dispute (e.g., if Bitcoin TX isn’t confirmed)
    function initiateDispute() external {
        require(msg.sender == buyer || msg.sender == seller, "Unauthorized");
        require(block.timestamp <= disputeDeadline, "Dispute window closed");
        emit DisputeInitiated(msg.sender);
    }
}