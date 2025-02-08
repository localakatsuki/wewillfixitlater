import React, { useState } from 'react';
import './Home.css';
import { MdExitToApp } from 'react-icons/md';
import { IoHome, IoPerson, IoGift, IoBook } from 'react-icons/io5';
import CampaignCard from '../OnGoingCampaigns';
import UserCampaignCard from '../UserCampaigns';
import CreateCampaignModal from './CreateCampaignModal'; // Import Modal

const Home = ({ setIsAuthenticated }) => {
    const [selectedTab, setSelectedTab] = useState('home'); // State to track selected tab
    const [isModalOpen, setModalOpen] = useState(false); // State for modal visibility

    const handleLogout = () => {
        localStorage.removeItem('oauthToken');
        setIsAuthenticated(false);
        window.location.href = '/'; // Redirect to login page
    };

    const handleCreateCampaignClick = () => {
        setModalOpen(true); // Open the modal when the "Create Campaign" button is clicked
    };

    const handleCloseModal = () => {
        setModalOpen(false); // Close the modal
    };

    const handleCreateCampaignSubmit = (newCampaign) => {
        console.log('New Campaign Created:', newCampaign);
        // Here, you would typically send the new campaign data to your backend to create it
    };

    return (
        <div className="home-container">
            <header className="navbar">
                <div
                    className={`nav-item ${selectedTab === 'home' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('home')}
                >
                    <IoHome /> Home
                </div>
                <div
                    className={`nav-item ${selectedTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('profile')}
                >
                    <IoPerson /> Profile
                </div>
                <div
                    className={`nav-item ${selectedTab === 'campaigns' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('campaigns')}
                >
                    <IoGift /> Campaigns
                </div>
                <div
                    className={`nav-item ${selectedTab === 'donations' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('donations')}
                >
                    <IoBook /> Donations
                </div>
                
                {/* Create Campaign Button */}
                <button className="create-campaign-btn" onClick={handleCreateCampaignClick}>
                    Create Campaign
                </button>

                {/* Logout Button */}
                <button className="logout-button" onClick={handleLogout}>
                    <MdExitToApp className="logout-icon" />
                    Logout
                </button>
            </header>

            <main className="content">
                {selectedTab === 'home' && <CampaignCard />}
                {selectedTab === 'profile' && <div>Your profile details go here.</div>}
                {selectedTab === 'campaigns' && <UserCampaignCard />}
                {selectedTab === 'donations' && <div>Your donation history goes here.</div>}
            </main>

            {isModalOpen &&< CreateCampaignModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                onSubmit={handleCreateCampaignSubmit} 
            />}
        </div>
    );
};

export default Home;
