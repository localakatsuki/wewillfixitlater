import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './CampaignCard.css';
import { contractAddress, factoryAbi } from '../../constant';

const CampaignCard = () => {
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        // Fetch campaigns from blockchain on component mount
        const fetchCampaigns = async () => {
            try {
                // Create an Ethereum provider
                const provider = new ethers.JsonRpcProvider("https://polygon.llamarpc.com");

                // Create contract instance
                const contract = new ethers.Contract(contractAddress, factoryAbi, provider);

                // Fetch active campaign addresses
                const campaignAddresses = await contract.getActiveCampaigns();
                const campaignsData = await contract.getCampainDetailsByAddress(Array.from(campaignAddresses));

                // Map the data into a suitable format for the frontend
                const campaignDetails = campaignsData.map(campaign => {
                    console.log(campaign);
                    
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

                setCampaigns(campaignDetails); // Set the campaigns in state
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            }
        };

        fetchCampaigns();
    }, []);

    return (
        <div className="campaign-list">
            {campaigns.map((campaign) => {
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

export default CampaignCard;
