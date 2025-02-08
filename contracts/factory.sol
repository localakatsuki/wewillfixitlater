// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./fundraisingCampaign.sol";

contract FundraisingCampaignFactory {
    // Mapping to store campaigns by their contract address
    mapping(address => FundraisingCampaign) private campaignsByAddress;

    // Mapping to store the campaign owner by contract address
    mapping(address => address[]) public userCampaigns;

    // Event to emit when a new fundraising campaign is created
    event CampaignCreated(address campaignAddress, address owner, string name, uint goalAmount, uint duration, address usdcToken);

    // USDC token contract address
    address private tokenAddress;

    // Constructor to initialize the factory with the USDC token address
    constructor(address _tokenAddress) {
        tokenAddress = _tokenAddress;
    }

    // Function to deploy a new fundraising campaign
    function createCampaign(
        string memory _name,
        uint _goalAmount,
        uint _durationInDays,
        string memory _description,
        string memory _image
    ) external {
        // Create a new instance of the FundraisingCampaign contract
        FundraisingCampaign newCampaign = new FundraisingCampaign(
            msg.sender,          // The owner of the campaign (the sender of the transaction)
            _name,               // Campaign name
            _goalAmount,        // Fundraising goal amount (in USDC, 6 decimals)
            _durationInDays,    // Duration in days
            _description,       // Campaign description
            _image,             // Campaign image
            tokenAddress    // USDC token contract address
        );

        // Store the deployed campaign in the mapping using the contract address as the key
        campaignsByAddress[address(newCampaign)] = newCampaign;
        
        // Store the owner of the campaign
        userCampaigns[msg.sender].push(address(newCampaign));

        // Emit the CampaignCreated event
        emit CampaignCreated(address(newCampaign), msg.sender, _name, _goalAmount, _durationInDays, tokenAddress);
    }

    // Function to get a campaign by its address
    function getCampainDetailsByAddress(address[] memory campaignAddresses) external view returns (CampaignDetails[] memory) {
        // Initialize an array to store the details of all campaigns
        CampaignDetails[] memory campaigns = new CampaignDetails[](campaignAddresses.length);

        // Loop through all campaign addresses and populate the details
        for (uint i = 0; i < campaignAddresses.length; i++) {
            FundraisingCampaign campaign = campaignsByAddress[campaignAddresses[i]];

            // Populate the struct with details of each campaign
            campaigns[i] = campaign.getCampaignDetails();
        }

        // Return the array of campaign details
        return campaigns;
    }

    function getCampaignsByUser(address userAddress) external view returns (address[] memory) {
        return userCampaigns[userAddress];
    }

    // Function to get the USDC token address
    function getTokenAddress() external view returns (address) {
        return tokenAddress;
    }
}

// 0x3020580b000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000002540be4000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000e50726979616e6b27732062696b65000000000000000000000000000000000000
// import { ethers } from "ethers";
// import { encodeAbiParameters } from "viem";

// async function generateCallData() {
//   // Define the function selector
//   const functionSelector = "0x3020580b"; // Given function selector

//   // Parameters for the createCampaign function
//   const campaignName = "Priyank's bike";
//   const goalAmount = 10000000000;  // 10 billion tokens
//   const campaignDuration = 1;      // 1 second

//   // ABI encode the parameters
//   const encodedData = encodeAbiParameters(
//     [
//       { type: 'string' },
//       { type: 'uint256' },
//       { type: 'uint256' }
//     ],
//     [campaignName, goalAmount, campaignDuration]
//   );

//   // Combine the function selector with the encoded parameters
//   const callData = functionSelector + encodedData.slice(2);  // Remove the leading '0x' from encoded data

//   console.log("Call Data:", callData);
// }

// generateCallData();
