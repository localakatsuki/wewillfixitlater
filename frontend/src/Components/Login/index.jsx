import React from 'react';
import './Login.css'
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useOkto } from '@okto_web3/react-sdk';

const Login = ({ setIsAuthenticated }) => {
  const oktoClient = useOkto();
  const navigate = useNavigate();

  const handleGoogleLogin = async (response) => {
    try {

      try {
        
        await oktoClient.loginUsingOAuth({
            idToken: response.credential,
            provider: "google",
        });
      } catch (error) {
          console.error("Authentication error:", error);
      }
      console.log('User authenticated successfully!');
      setIsAuthenticated(true);
      navigate('/home'); // Redirect to Home page after successful login
    } catch (err) {
      console.error('Authentication failed:', err);
    }
  };

  return (
    <div className="login-container">
      <h1>Welcome to the Web3 Platform</h1>
      <GoogleLogin onSuccess={handleGoogleLogin} onError={(err) => console.log('Login Failed:', err)} />
    </div>
  );
};

export default Login;
