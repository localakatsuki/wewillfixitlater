import React, { useEffect } from 'react';
import './Login.css';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useOkto } from '@okto_web3/react-sdk';

const Login = ({ setIsAuthenticated }) => {
  const oktoClient = useOkto();
  const navigate = useNavigate();

  // Check if the user is already authenticated by checking localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('oauthToken');
    if (savedToken) {
      // If the token is found in localStorage, authenticate the user using Okto client
      oktoClient.loginUsingOAuth({
        idToken: savedToken,
        provider: 'google',
      })
        .then(() => {
          setIsAuthenticated(true);
          navigate('/home'); // Redirect to Home page after successful login
        })
        .catch((err) => {
          console.error('Authentication error:', err);
        });
    }
  }, [oktoClient, navigate, setIsAuthenticated]);

  const handleGoogleLogin = async (response) => {
    try {
      // Save the token to localStorage
      const oauthToken = response.credential;
      localStorage.setItem('oauthToken', oauthToken);

      try {
        await oktoClient.loginUsingOAuth({
          idToken: oauthToken,
          provider: 'google',
        });

        console.log('User authenticated successfully!');
        setIsAuthenticated(true);
        navigate('/home'); // Redirect to Home page after successful login
      } catch (error) {
        console.error('Authentication error:', error);
      }
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
