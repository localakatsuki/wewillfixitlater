// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
   function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

// Struct to hold campaign details
struct CampaignDetails {
    string name;
    uint currentAmount;
    uint goalAmount;
    uint deadline;
    string description;
    string image;
    address creator;
    bool active;
    bool redeemed;
}

contract FundraisingCampaign {
    address public owner;
    string public name;
    uint public goalAmount;
    uint public currentAmount;
    uint public deadline;
    string description;
    string image;
    bool public active;
    bool public redeemed;

    IERC20 public usdcToken;  // USDC token contract

    mapping(address => uint) public contributors;

    // Modifier to allow only the owner to access certain functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        active = false;
        _;
    }

    // Modifier to check if the campaign is active (i.e., not completed or expired)
    modifier isActive() {
        require(block.timestamp < deadline, "The campaign has expired.");
        require(currentAmount < goalAmount, "The goal has already been reached.");
        _;
    }

    // Event to emit when a contribution is made
    event ContributionReceived(address contributor, uint amount, uint totalAmount);

    // Event to emit when the funds are redeemed by the owner
    event FundsRedeemed(address owner, uint amount);

    // Constructor to initialize the fundraising campaign
    constructor(address _owner, string memory _name, uint _goalAmount, uint _durationInDays, string memory _description, string memory _image, address _usdcToken) {
        owner = _owner;
        name = _name;
        goalAmount = _goalAmount;
        currentAmount = 0;
        deadline = block.timestamp + _durationInDays * 1 days;
        description = _description;
        image = _image;
        redeemed = false;
        active = true;
        usdcToken = IERC20(_usdcToken);  // USDC token contract address
    }

    // Deposit method to allow contributions to the campaign
    function contribute(uint _amount) external payable isActive {
        require(_amount > 0, "Contribution must be greater than 0.");

        // Transfer USDC from the contributor to the campaign
        bool success = usdcToken.transferFrom(msg.sender, address(this), _amount);
        require(success, "Transfer of USDC failed.");

        // Track the contribution from the sender
        contributors[msg.sender] += _amount;
        currentAmount += _amount;

        // Emit the ContributionReceived event
        emit ContributionReceived(msg.sender, _amount, currentAmount);
    }

    // Function for the owner to redeem the funds once the goal is met
    function redeemFunds() external onlyOwner {
        require(!redeemed, "The fund is redeemed");
        require(currentAmount >= goalAmount, "The fundraising goal has not been reached yet.");
        require(block.timestamp >= deadline, "The campaign is still ongoing.");

        uint amountToTransfer = currentAmount;
        currentAmount = 0; // Reset currentAmount to prevent re-entrancy issues
        active = false;
        redeemed = true;

       // Transfer the USDC funds to the owner
        bool success = usdcToken.transfer(owner, amountToTransfer);
        require(success, "Transfer of USDC to owner failed.");

        // Emit the FundsRedeemed event
        emit FundsRedeemed(owner, amountToTransfer);
    }

    // Function to check the current campaign status
    function getCampaignStatus() external view returns (string memory status) {
        if (currentAmount >= goalAmount) {
            status = "Goal Reached";
        } else if (block.timestamp >= deadline) {
            status = "Campaign Ended";
        } else {
            status = "Active";
        }

        return status;
    }

    // Function to check the current contribution of a user
    function getContributorContribution(address _contributor) external view returns (uint) {
        return contributors[_contributor];
    }

    function getCampaignDetails() external view returns (CampaignDetails memory) { 
        return CampaignDetails(name, goalAmount, currentAmount, deadline, description, image, owner, active, redeemed);
    }
}
