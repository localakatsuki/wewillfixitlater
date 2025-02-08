import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './index.css'; // Create your CSS file for styling
import { contractAddress, factoryAbi } from '../../constant'; // Assume ABI and contract address
import { getPortfolioActivity, useOkto } from '@okto_web3/react-sdk';

const Donation = () => {
    const oktoClient = useOkto();
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                console.log("Fetching donations...");
                
                // Create an Ethereum provider
                const provider = new ethers.JsonRpcProvider("https://alpha-frosty-pond.matic.quiknode.pro/d0050a7481b702dbfec24e97ca06c92ff77052ba/");

                // Create contract instance
                const contract = new ethers.Contract(contractAddress, factoryAbi, provider);

                const activities = await getPortfolioActivity(oktoClient);
                let donationsList = [];
                for(let i=0; i<activities.length; i++) {
                    const activity = activities[i];
                    if(activity.description !== "Withdraw") continue;

                    console.log("Activity:", activity);
                    const tx = await provider.getTransaction(activity.txHash);
                    const receipt = await tx.wait();
                    const donation = await contract.getCampainDetailsByAddress([receipt.to]);
                    console.log("Donation:", donation);
                    
                    donationsList.push({
                        amount: activity.amount,
                        campaignName: donation[0][0],
                        txHash: activity.txHash,
                        timestamp: new Date(activity.timestamp*1000).toLocaleString(),
                        to: receipt.to
                    });
                }

                
                setDonations(donationsList); // Set the donations in state
            } catch (error) {
                console.error("Error fetching donations:", error);
            }
        };

        fetchDonations();
    }, [oktoClient]);

    return (
        <div className="donation-list">
            <h2>Your Donations</h2>
            {donations.length === 0 ? (
                <p>Loding......</p>
            ) : (
                <table className="donation-table">
                    <thead>
                        <tr>
                            <th>Amount</th>
                            <th>Campaign Name</th>
                            <th>Transaction Hash</th>
                            <th>Timestamp</th>
                            <th>To</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map((donation, index) => (
                            <tr key={index}>
                                <td>{donation.amount} USDT</td>
                                <td>{donation.campaignName}</td>
                                <td>
                                    <a
                                        href={`https://polygonscan.com/tx/${donation.txHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {donation.txHash.substring(0, 10)}...
                                    </a>
                                </td>
                                <td>{donation.timestamp}</td>
                                <td>
                                    <a
                                        href={`https://polygonscan.com/address/${donation.to}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {donation.to.substring(0, 10)}...
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Donation;
