import React, { useEffect, useState } from 'react';
import { evmRawTransaction, useOkto } from '@okto_web3/react-sdk';
import { getAccount } from '@okto_web3/react-sdk';
import { ethers } from 'ethers';
import '../OnGoingCampaigns/CampaignCard.css';
import './index.css'
import { factoryAbi, contractAddress } from '../../constant';

const UserCampaignCard = () => {
    const oktoClient = useOkto();
    const [userCampaigns, setUserCampaigns] = useState([]);
    const [ownerAdress, setOwnerAddress] = useState('');

    useEffect(() => {
        // Fetch campaigns from blockchain on component mount
        const fetchUserCampaigns = async () => {
            try {
                /**
                 * 
                 */
                const wallates = await getAccount(oktoClient);
                setOwnerAddress(wallates[0].address);

                // Create an Ethereum provider
                const provider = new ethers.JsonRpcProvider("https://alpha-frosty-pond.matic.quiknode.pro/d0050a7481b702dbfec24e97ca06c92ff77052ba/");

                // Create contract instance
                const contract = new ethers.Contract(contractAddress, factoryAbi, provider);

                // Fetch active campaign addresses
                const campaignAddresses = await contract.getCampaignsByUser(wallates[0].address);
                const campaignsData = await contract.getCampainDetailsByAddress(Array.from(campaignAddresses));

                // Map the data into a suitable format for the frontend
                let i=0;
                const campaignDetails = campaignsData.map(campaign => {
                    
                    const campaignDeetsArray = Array.from(campaign);
                    return {
                        campaignName: campaignDeetsArray[0],
                        goalAmount: campaignDeetsArray[1].toString(),
                        currentAmount: campaignDeetsArray[2].toString(),
                        campaignDeadline: new Date(parseInt(campaignDeetsArray[3].toString()) * 1000),
                        campaignDescription: campaignDeetsArray[4],
                        campaignImage: campaignDeetsArray[5],
                        campaignAddress: campaignAddresses[i++],
                        isActive: campaignDeetsArray[7],
                        isRedeemed: campaignDeetsArray[8],
                        owner: campaignDeetsArray[6],
                        tokenAddress: campaignDeetsArray[9]
                    };

                });

                setUserCampaigns(campaignDetails);
            } catch (error) {
                console.error("Error fetching user campaigns:", error);
            }
        };

        fetchUserCampaigns();
    }, [oktoClient]);


    const createRedeemFundsCallData = () => {
        const functionSelector = "0x216355ec"; // Given function selector
        return functionSelector;
    }

    const handleRedeemClick = async (campaign) => {
        const callData = createRedeemFundsCallData();
        const rawTxParams = {
            caip2Id: "eip155:137", // Ethereum Mainnet
            transaction: {
                from: ownerAdress,
                to: campaign.campaignAddress,
                data: callData,
                value: ethers.toBigInt(0),
            }
        };
        const userOp = await evmRawTransaction(oktoClient, rawTxParams);
        console.log("userOp: " + userOp)
        const signedOp = await oktoClient.signUserOp(userOp);
        console.log("signedUserOp: " + signedOp)
        const txHash = await oktoClient.executeUserOp(signedOp);
        console.log("txHash: " + txHash)
        console.log(`Redeem clicked for campaign: ${campaign.campaignName}`);
        alert("Redemption Initiated successfully! Please check After Some Time");
        // Add logic to redeem here
    };

    return (
        <div className="campaign-list">
            {userCampaigns.map((campaign) => {
                const progressPercentage = Math.min((parseFloat(campaign.currentAmount) / parseFloat(campaign.goalAmount)) * 100,100);
                const redeemable = campaign.currentAmount >= campaign.goalAmount & !campaign.isRedeemed;
                return (
                    <div className="campaign-card" key={campaign.campaignAddress}>
                        <h2>{campaign.campaignName}</h2>
                        <div className="campaign-image-container">
                            <img
                                src={campaign.campaignImage}
                                alt={campaign.campaignName}
                                className="campaign-image"
                            />
                        </div>
                        <div className="campaign-details">
                            <p><strong>Description:</strong> {campaign.campaignDescription}</p>
                            <p><strong>Goal Amount:</strong> ${campaign.goalAmount/10**6}</p>
                            <p><strong>Current Amount:</strong> ${campaign.currentAmount/10**6}</p>
                            <p><strong>Deadline:</strong> {new Date(campaign.campaignDeadline).toLocaleDateString()}</p>
                            <p><strong>Owner:</strong> {campaign.owner}</p>
                            <p><strong>Address:</strong> {campaign.campaignAddress}</p>
                            <p><strong>Status:</strong> {campaign.isActive ? 'Active' : 'Inactive'}</p>
                            <p><strong>Redeemable:</strong> {redeemable ? 'Yes' : 'No'}</p>

                            {/* Progress Bar */}
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>

                            {/* Redeem Button (Only shown when redeemable) */}
                            {redeemable && (
                                <button className="redeem-button" onClick={() => handleRedeemClick(campaign)}>
                                    Redeem
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default UserCampaignCard;
