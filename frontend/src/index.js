import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { OktoProvider } from '@okto_web3/react-sdk';
import App from './App';
import ErrorBoundary from './Components/ErrorBoundary';
import { Buffer } from "buffer";

// Ensure Buffer is available globally
window.Buffer = Buffer;

const config = {
  environment: "sandbox",
  vendorPrivKey: '0xadf2181a7b2dec0f1ed22061ab31bd6182691c619d9e874a956e71ab7ecca413',
  vendorSWA: '0x6b6Fad2600Bc57075ee560A6fdF362FfefB9dC3C',
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <ErrorBoundary>
      <OktoProvider config={config}>
        <App />
      </OktoProvider>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
