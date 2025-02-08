import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { OktoClientConfig, OktoProvider } from "@okto_web3/react-sdk";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const config: {
  environment: string;
  vendorPrivKey: `0x${string}`;
  vendorSWA: `0x${string}`;
} = {
  environment: "sandbox",
  vendorPrivKey: '0xadf2181a7b2dec0f1ed22061ab31bd6182691c619d9e874a956e71ab7ecca413',
  vendorSWA: '0x6b6Fad2600Bc57075ee560A6fdF362FfefB9dC3C',
};

root.render(
  <React.StrictMode>
      <GoogleOAuthProvider clientId={process.env.VITE_GOOGLE_CLIENT_ID!}>
          <OktoProvider config={config as OktoClientConfig}>
              <App />
          </OktoProvider>
      </GoogleOAuthProvider>
  </React.StrictMode>
);
