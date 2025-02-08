import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './DonationModal.css';
import { evmRawTransaction, getAccount, useOkto } from '@okto_web3/react-sdk';
import {notifySuccess} from '../../notify';

const DonationModal = ({ showModal, setShowModal, selectedCampaign }) => {
    const [donationAmount, setDonationAmount] = useState("");
    const oktoClient = useOkto();

    const handleDonationChange = (e) => {
        setDonationAmount(e.target.value);
    };

    const createContributeCallData = (amount) => {
        const functionSelector = "0xc1cbbca7";
    
        const encodedData = ethers.AbiCoder.defaultAbiCoder().encode(
            ["uint256"],
            [amount]
        );

        const callData = functionSelector + encodedData.slice(2);  // Remove the leading '0x' from encoded data
    
        console.log("Call Data:", callData); // For debugging
        return callData;
      };

      const createApproveCallData=(address, amount)=> {
        const functionSelector = "0x095ea7b3"; // Given function selector
        const encodedData = ethers.AbiCoder.defaultAbiCoder().encode(
            ["address", "uint256"],
            [address, amount]
        );

        const callData = functionSelector + encodedData.slice(2);  // Remove the leading '0x' from encoded data
      
        console.log("Call Data:", callData);
        return callData;
    }



    const handleDonationSubmit = async () => {
        if (!donationAmount || isNaN(donationAmount) || parseFloat(donationAmount) <= 0) {
            alert("Please enter a valid donation amount.");
            return;
        }



        try {
            
            const wallates = await getAccount(oktoClient);
            const ownerAdress = wallates[0].address;
            const callDataApproval = createApproveCallData(selectedCampaign.campaignAddress,donationAmount * 10**6 ); 
            const callDataDonation = createContributeCallData(donationAmount * 10**6);

            const rawTxParamsApproval = {
                caip2Id: "eip155:137", // Ethereum Mainnet
                transaction: {
                    from: ownerAdress,
                    to: selectedCampaign.tokenAddress,
                    data: callDataApproval,
                    value: ethers.toBigInt(0),
                }
            };

            const userOpApproval = await evmRawTransaction(oktoClient, rawTxParamsApproval);
            console.log("userOp: " + userOpApproval)
            const signedOpApproval = await oktoClient.signUserOp(userOpApproval);
            console.log("signedUserOp: "+ signedOpApproval)
            const txHashApproval = await oktoClient.executeUserOp(signedOpApproval);
            console.log("txHash: " + txHashApproval)

            const rawTxParams = {
                caip2Id: "eip155:137", // Ethereum Mainnet
                transaction: {
                    from: ownerAdress,
                    to: selectedCampaign.campaignAddress,
                    data: callDataDonation,
                    value: ethers.toBigInt(0),
                }
            };

            const userOp = await evmRawTransaction(oktoClient, rawTxParams);
            console.log("userOp: " + userOp)
            const signedOp = await oktoClient.signUserOp(userOp);
            console.log("signedUserOp: "+ signedOp)
            const txHash = await oktoClient.executeUserOp(signedOp);
            console.log("txHash: " + txHash)

            alert("Donation initiated successfully!");
            setShowModal(false);
        } catch (error) {
            console.error("Error during donation:", error);
            alert("Donation failed. Please try again.");
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    // Close modal when clicked outside
    useEffect(() => {
        if (showModal) {
            const handleClickOutside = (e) => {
                if (e.target.classList.contains('modal')) {
                    closeModal();
                }
            };
            // Attach the event listener to the document
            document.addEventListener('mousedown', handleClickOutside);

            // Clean up the event listener on component unmount
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [showModal]);

    return (
        showModal && (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <h3>Donate to {selectedCampaign?.campaignName}</h3>
                    <input
                        type="number"
                        value={donationAmount}
                        onChange={handleDonationChange}
                        placeholder="Enter donation amount (USDT)"
                        className="donation-input"
                    />
                    <button onClick={handleDonationSubmit} className="donate-submit">
                        Donate
                    </button>
                </div>
            </div>
        )
    );
};

export default DonationModal;
