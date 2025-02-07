import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { OktoProvider, BuildType } from 'okto-sdk-react';
import App from './App';

// const config = {
//   environment: "sandbox",
//   vendorPrivKey: process.env.VITE_VENDOR_PRIV_KEY,
//   vendorSWA: process.env.VITE_VENDOR_SWA,
// };

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <OktoProvider apiKey={process.env.REACT_APP_OKTO_CLIENT_API_KEY} buildType={BuildType.SANDBOX}>
        <App />
      </OktoProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);