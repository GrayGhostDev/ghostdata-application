// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // For handling ERC20 tokens (like LINK)

contract SavingsDataBridge is ChainlinkClient, Ownable {
    using Chainlink for Chainlink.Request;

    IERC20 private linkToken;
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    struct SavingsAccount {
        uint256 savingsId;
        uint256 balance;
    }

    mapping(address => SavingsAccount) public savingsAccounts;

    event SavingsDeposit(address indexed user, uint256 amount);
    event SavingsWithdrawal(address indexed user, uint256 amount);
    event EthWithdrawal(address indexed user, uint256 amount);
    event ChainlinkRequested(bytes32 indexed requestId);
    event ChainlinkFulfilled(bytes32 indexed requestId, uint256 amount);

    constructor(
        address _linkTokenAddress,
        address _oracle,
        string memory _jobId,
        uint256 _fee
    ) {
        setChainlinkToken(_linkTokenAddress);
        linkToken = IERC20(_linkTokenAddress);
        oracle = _oracle;
        jobId = stringToBytes32(_jobId);
        fee = _fee;
    }

    function depositSavings(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        savingsAccounts[msg.sender].balance += amount;
        emit SavingsDeposit(msg.sender, amount);
    }

    function withdrawSavings(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(savingsAccounts[msg.sender].balance >= amount, "Insufficient balance");
        savingsAccounts[msg.sender].balance -= amount;
        emit SavingsWithdrawal(msg.sender, amount);
    }

    function requestEthWithdrawal(uint256 loanDiskSavingsId) external {
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfillEthWithdrawal.selector);
        req.addUint("savingsId", loanDiskSavingsId);
        bytes32 requestId = sendChainlinkRequestTo(oracle, req, fee);
        emit ChainlinkRequested(requestId);
    }

    function fulfillEthWithdrawal(bytes32 _requestId, uint256 amount) external recordChainlinkFulfillment(_requestId) {
        require(amount > 0, "Amount must be greater than zero");
        address user = tx.origin;
        require(savingsAccounts[user].balance >= amount, "Insufficient balance");
        savingsAccounts[user].balance -= amount;
        payable(user).transfer(amount);
        emit EthWithdrawal(user, amount);
        emit ChainlinkFulfilled(_requestId, amount);
    }

    function stringToBytes32(string memory source) internal pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

    receive() external payable {}
}
