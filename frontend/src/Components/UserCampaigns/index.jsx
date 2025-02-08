import React, { useEffect, useState } from 'react';
import { useOkto } from '@okto_web3/react-sdk';
import { getAccount } from '@okto_web3/react-sdk';
import { ethers } from 'ethers';
import '../OnGoingCampaigns/CampaignCard.css';
import { factoryAbi } from '../../constant';

const UserCampaignCard = () => {
    const oktoClient = useOkto();
    const [userCampaigns, setUserCampaigns] = useState([]);

    // Contract details
    const contractAddress = "0x5419ebfd86d6ea377b8a9af69490d51ac4bd939c"; // Your contract address

    useEffect(() => {
        // Fetch campaigns from blockchain on component mount
        
        const fetchUserCampaigns = async () => {
            try {
                const wallates = await getAccount(oktoClient);
                
                
                // Create an Ethereum provider
                const provider = new ethers.JsonRpcProvider("https://polygon.llamarpc.com");

                // Create contract instance
                const contract = new ethers.Contract(contractAddress, factoryAbi, provider);

                // Fetch active campaign addresses
                const campaignAddresses = await contract.getCampaignsByUser(wallates[0].address);
                const campaignsData = await contract.getCampainDetailsByAddress(Array.from(campaignAddresses));

                // Map the data into a suitable format for the frontend
                const campaignDetails = campaignsData.map(campaign => {
                    const campaignDeetsArray = Array.from(campaign);
                    return {
                        campaignName: campaignDeetsArray[0],
                        goalAmount: campaignDeetsArray[1].toString(),
                        currentAmount: campaignDeetsArray[2].toString(),
                        campaignDeadline: new Date(parseInt(campaignDeetsArray[3].toString())*1000),
                        campaignDescription: campaignDeetsArray[4],
                        campaignImage: campaignDeetsArray[5],
                        campaignAddress: campaignDeetsArray[9],
                        isActive: campaignDeetsArray[7],
                        isRedeemed: campaignDeetsArray[8],
                        owner: campaignDeetsArray[6],
                    };
                });

                setUserCampaigns(campaignDetails); 
            } catch (error) {
                console.error("Error fetching user campaigns:", error);
            }
        };

        fetchUserCampaigns();
    }, [oktoClient]);

    return (
        <div className="campaign-list">
            {userCampaigns.map((campaign) => {
                const progressPercentage = (campaign.currentAmount / campaign.goalAmount) * 100;
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
                            <p><strong>Goal Amount:</strong> ${campaign.goalAmount}</p>
                            <p><strong>Current Amount:</strong> ${campaign.currentAmount}</p>
                            <p><strong>Deadline:</strong> {new Date(campaign.campaignDeadline).toLocaleDateString()}</p>
                            <p><strong>Owner:</strong> {campaign.owner}</p>
                            <p><strong>Address:</strong> {campaign.campaignAddress}</p>
                            <p><strong>Status:</strong> {campaign.isActive ? 'Active' : 'Inactive'}</p>
                            <p><strong>Redeemable:</strong> {campaign.isRedeemed ? 'Yes' : 'No'}</p>

                            {/* Progress Bar */}
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default UserCampaignCard;
