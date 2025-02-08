import React, { useState } from 'react';
import { ethers } from 'ethers';
import { IoSend } from 'react-icons/io5';
import './Modal.css'; // You can keep or adjust the existing styling
import { useOkto } from '@okto_web3/react-sdk';
import { evmRawTransaction } from '@okto_web3/react-sdk';
import { getAccount } from '@okto_web3/react-sdk';
import { contractAddress } from '../../constant';

const CreateCampaignModal = ({ onClose }) => {
    const oktoClient = useOkto();
    const [formData, setFormData] = useState({
        campaignName: '',
        goalAmount: '',
        duration: '',
        campaignDescription: '',
        campaignImage: ''
    });

    const handleInputChange = (e) => {
    const { name, value } = e.target;
        setFormData({
            ...formData,
      [name]: value
        });
    };

  // Function to create the call data for the smart contract
  const createCampaignCallData = (ownerAdress,campaignName, goalAmount, campaignDuration, description, imageUrl, tokenAddress) => {
    const functionSelector = "0x80d99a32"; // This should be your actual function selector

    const encodedData = ethers.AbiCoder.defaultAbiCoder().encode(
      ['string', 'uint', 'uint', 'string', 'string', 'address'], // Parameter types
      [campaignName, goalAmount, campaignDuration, description, imageUrl, tokenAddress]
    );

    const encodedDataArgument = ethers.AbiCoder.defaultAbiCoder().encode(
        ['address','string', 'uint', 'uint', 'string', 'string', 'address'], // Parameter types
        [ownerAdress,campaignName, goalAmount, campaignDuration, description, imageUrl, tokenAddress]
      );

      console.log(encodedDataArgument);
      
    const callData = functionSelector + encodedData.slice(2); // Remove leading '0x' from encoded data

    console.log("Call Data:", callData); // For debugging
    return callData;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
        e.preventDefault();

    const { campaignName, goalAmount, duration, campaignDescription, campaignImage } = formData;

    // Convert goalAmount and duration to BigInt (as required)
    const goalAmountBigInt = ethers.toBigInt(goalAmount);
    const durationBigInt = ethers.toBigInt(duration);

    // Assuming `tokenAddress` is a valid Ethereum address (replace with actual if needed)
    
    try {
      // Generate the call data for the transaction
      const wallates = await getAccount(oktoClient);
      const ownerAdress = wallates[0].address; 

      console.log(ownerAdress);
      const tokenAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
      const callData = createCampaignCallData(ownerAdress,campaignName, goalAmountBigInt, durationBigInt, campaignDescription, campaignImage, tokenAddress);


      const rawTxParams = {
        caip2Id: "eip155:137", // Ethereum Mainnet
        transaction: {
            from: ownerAdress,
            to: contractAddress,
            data: callData,
            value: ethers.toBigInt(0),
        }
    };

    const userOp = await evmRawTransaction(oktoClient, rawTxParams);
    console.log("userOp: " + userOp)
    const signedOp = await oktoClient.signUserOp(userOp);
    console.log("signedUserOp: "+ signedOp)
    const txHash = await oktoClient.executeUserOp(signedOp);
    console.log("txHash: " + txHash)

      // Close the modal after submission
      onClose();
    } catch (error) {
      console.error('Error submitting campaign:', error);
    }
  };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Create New Campaign</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="campaignName">Campaign Name</label>
                        <input
                            type="text"
                            id="campaignName"
                            name="campaignName"
                            value={formData.campaignName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="goalAmount">Goal Amount</label>
                        <input
                            type="number"
                            id="goalAmount"
                            name="goalAmount"
                            value={formData.goalAmount}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="duration">Duration (in days)</label>
                        <input
                            type="number"
                            id="duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="campaignDescription">Description</label>
                        <textarea
                            id="campaignDescription"
                            name="campaignDescription"
                            value={formData.campaignDescription}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="campaignImage">Campaign Image URL</label>
                        <input
                            type="url"
                            id="campaignImage"
                            name="campaignImage"
                            value={formData.campaignImage}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">
              <IoSend className="send-icon" /> Create Campaign
            </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaignModal;
