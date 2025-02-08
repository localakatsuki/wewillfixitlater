import React, { useState } from 'react';
import './Modal.css'; // You can keep or adjust the existing styling

const CreateCampaignModal = ({ isOpen, onClose, onSubmit }) => {
    const [campaignName, setCampaignName] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [campaignDescription, setCampaignDescription] = useState('');
    console.log(isOpen);
    

    const handleSubmit = () => {
        // Handle submit logic here
        const newCampaign = {
            campaignName,
            goalAmount,
            campaignDescription,
        };
        onSubmit(newCampaign); // Pass the new campaign data to the parent
        onClose(); // Close modal after submission
    };


    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Create a New Campaign</h2>
                <div className="form-group">
                    <label>Campaign Name:</label>
                    <input
                        type="text"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Goal Amount:</label>
                    <input
                        type="number"
                        value={goalAmount}
                        onChange={(e) => setGoalAmount(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        value={campaignDescription}
                        onChange={(e) => setCampaignDescription(e.target.value)}
                    />
                </div>
                <div className="modal-actions">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSubmit}>Create Campaign</button>
                </div>
            </div>
        </div>
    );
};

export default CreateCampaignModal;
