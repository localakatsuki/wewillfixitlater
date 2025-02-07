import React from 'react';
import './Login.css'
import { GoogleLogin } from '@react-oauth/google';
import { useOkto } from 'okto-sdk-react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
  const { authenticate } = useOkto();
  const navigate = useNavigate();

  const handleGoogleLogin = async (response) => {
    try {
      await authenticate(response.credential);
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
