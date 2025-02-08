import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './CampaignCard.css';
import { contractAddress, factoryAbi } from '../../constant';
import DonationModal from './DonationModal';  // Import the DonationModal component

const CampaignCard = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [showModal, setShowModal] = useState(false);  // Control modal visibility
    const [selectedCampaign, setSelectedCampaign] = useState(null); // Selected campaign to donate to

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const provider = new ethers.JsonRpcProvider("https://alpha-frosty-pond.matic.quiknode.pro/d0050a7481b702dbfec24e97ca06c92ff77052ba/");
                const contract = new ethers.Contract(contractAddress, factoryAbi, provider);

                const campaignAddresses = await contract.getActiveCampaigns();
                const campaignsData = await contract.getCampainDetailsByAddress(Array.from(campaignAddresses));
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

                setCampaigns(campaignDetails);
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            }
        };

        fetchCampaigns();
    }, []);

    // Handle open donate modal
    const handleDonateClick = (campaign) => {
        setSelectedCampaign(campaign);
        setShowModal(true);
    };

    return (
        <div className="campaign-list">
            {campaigns.map((campaign) => {
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
                            <p><strong>Token Address:</strong> {campaign.tokenAddress}</p>
                            <p><strong>Status:</strong> {campaign.isActive ? 'Active' : 'Inactive'}</p>
                            <p><strong>Redeemable:</strong> {redeemable ? 'Yes' : 'No'}</p>

                            {/* Progress Bar */}
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>

                            {/* Donate Button */}
                            <button className="donate-button" onClick={() => handleDonateClick(campaign)}>
                                Donate
                            </button>
                        </div>
                    </div>
                );
            })}

            {/* Donation Modal */}
            <DonationModal 
                showModal={showModal} 
                setShowModal={setShowModal} 
                selectedCampaign={selectedCampaign} 
            />
        </div>
    );
};

export default CampaignCard;
