import React, { useState } from 'react';
import './Home.css';
import { MdExitToApp } from 'react-icons/md';
import { IoHome, IoPerson, IoGift, IoBook } from 'react-icons/io5';
import CampaignCard from '../OnGoingCampaigns';
import UserCampaignCard from '../UserCampaigns';
import CreateCampaignModal from './CreateCampaignModal'; // Import Modal
import Donation from '../Donations';
import Profile from '../ProfileData';

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
                {selectedTab === 'profile' && <Profile/>}
                {selectedTab === 'campaigns' && <UserCampaignCard />}
                {selectedTab === 'donations' && <Donation/>}
            </main>

            {isModalOpen &&< CreateCampaignModal 
                onClose={handleCloseModal}  
            />}
        </div>
    );
};

export default Home;
