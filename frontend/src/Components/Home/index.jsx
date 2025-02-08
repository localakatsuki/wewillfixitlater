import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { IoLogOut } from 'react-icons/io';
import { MdExitToApp } from 'react-icons/md';


const Home = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage on logout
    localStorage.removeItem('oauthToken');
    setIsAuthenticated(false); // Set authentication state to false
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="home-container">
      <h1>Welcome to Your Home Page</h1>
      <p>This is the page you see after logging in.</p>
      {/* Logout Button with React Icon */}
      <button className="logout-button" onClick={handleLogout}>
      <MdExitToApp className="logout-icon" />
        Logout
      </button>
    </div>
  );
};

export default Home;
