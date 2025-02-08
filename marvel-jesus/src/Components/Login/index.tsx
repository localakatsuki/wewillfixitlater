import React from 'react';
import './Login.css';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useOkto } from '@okto_web3/react-sdk';

// Define type for the props
interface LoginProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  console.log('Login component rendered');
  
  const oktoClient = useOkto();
  const navigate = useNavigate();

  const handleGoogleLogin = async (response: any) => {
    console.log('Google response:', response);
    
    if (!response?.credential) {
      console.error('No credential found in the response!');
      return;
    }

    try {
      console.log('Authenticating user...');
      
      try {
        console.log("oktoClient");
        
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
      <GoogleLogin 
        onSuccess={handleGoogleLogin} 
      />
    </div>
  );
};

export default Login;
