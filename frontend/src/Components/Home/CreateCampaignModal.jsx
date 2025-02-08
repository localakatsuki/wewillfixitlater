import React, { useState } from 'react';
import { IoSend } from 'react-icons/io5';
import './Modal.css'; // You can keep or adjust the existing styling

const CreateCampaignModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        campaignName: '',
        goalAmount: '',
        duration: '',
        campaignDescription: '',
        campaignImage: ''
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit form logic here, like making API requests or contract interaction
        console.log(formData);
        onClose();
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
                        <button type="submit"><IoSend className="send-icon" /> Create Campaign</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaignModal;


