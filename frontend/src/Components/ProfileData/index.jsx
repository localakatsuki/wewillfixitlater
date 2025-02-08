import React, { useEffect, useState } from 'react';
import { getPortfolio, useOkto } from '@okto_web3/react-sdk';
import { getAccount } from '@okto_web3/react-sdk';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './index.css';

const Profile = () => {
    const oktoClient = useOkto();
    const [wallets, setWallets] = useState([]);
    const [portfolio, setPortfolio] = useState({
        aggregatedData: {
            holdingsCount: "5",
            holdingsPriceInr: "100000",
            holdingsPriceUsdt: "1200",
            totalHoldingPriceInr: "100000",
            totalHoldingPriceUsdt: "1200"
        },
        groupTokens: [{
            id: "token_1",
            name: "Ethereum",
            symbol: "ETH",
            // ... other fields
            tokens: [{
                id: "token_1_1",
                name: "Ethereum",
                symbol: "ETH",
                // ... other token fields
            }]
        }]
    });

    useEffect(() => {
        // Fetch wallets from Okto on component mount
        const fetchWallets = async () => {
            try {
                // Get the wallet(s) using Okto SDK
                const accounts = await getAccount(oktoClient);

                // Map the wallets to extract the required details
                const walletDetails = accounts.map(account => ({
                    caipId: account.caipId,
                    networkName: account.networkName,
                    address: account.address,
                    networkId: account.networkId,
                    networkSymbol: account.networkSymbol
                }));

                // Set the wallets to state
                setWallets(walletDetails);
            } catch (error) {
                console.error("Error fetching wallet data:", error);
            }
        };

        const fetchBlances = async () => {
            try {
                // Get the wallet(s) using Okto SDK
                const portfolio = await getPortfolio(oktoClient);

                // Set the wallets to state
                setPortfolio(portfolio);
            } catch (error) {
                console.error("Error fetching wallet data:", error);
            }
        };

        fetchWallets();
        fetchBlances();
    }, [oktoClient]);

    return (
        <>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="wallets-content"
                    id="wallets-header"
                >
                    <h2>Your Wallets</h2>
                </AccordionSummary>

                <AccordionDetails>
                    <div className="wallet-list">
                        {wallets.map((wallet, index) => (
                            <div key={index} className="wallet-item">
                                <p><strong>CAIP ID:</strong> {wallet.caipId}</p>
                                <p><strong>Network Name:</strong> {wallet.networkName}</p>
                                <p><strong>Address:</strong> {wallet.address}</p>
                                <p><strong>Network ID:</strong> {wallet.networkId}</p>
                                <p><strong>Network Symbol:</strong> {wallet.networkSymbol}</p>
                            </div>
                        ))}
                    </div>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="wallets-content"
                    id="wallets-header"
                >
                    <h2>Your Portfolio</h2>
                </AccordionSummary>

                <AccordionDetails>
                    {/* Show Aggregated Data */}
                    <div className="aggregated-data">
                        <p><strong>Holdings Count:</strong> {portfolio.aggregatedData.holdingsCount}</p>
                        <p><strong>Holdings Price (INR):</strong> ₹{portfolio.aggregatedData.holdingsPriceInr}</p>
                        <p><strong>Holdings Price (USDT):</strong> ${portfolio.aggregatedData.holdingsPriceUsdt}</p>
                        <p><strong>Total Holding Price (INR):</strong> ₹{portfolio.aggregatedData.totalHoldingPriceInr}</p>
                        <p><strong>Total Holding Price (USDT):</strong> ${portfolio.aggregatedData.totalHoldingPriceUsdt}</p>
                    </div>

                    {/* Group Tokens - Nested Accordion for each group */}
                    <div className="group-tokens">
                        {portfolio.groupTokens.map((group, index) => (
                            <Accordion key={index}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={`group-${group.id}-content`}
                                    id={`group-${group.id}-header`}
                                >
                                    <h4>{group.name} ({group.symbol})</h4>
                                </AccordionSummary>

                                <AccordionDetails>
                                    {group.tokens.map((token, tokenIndex) => (                                        
                                        <div key={tokenIndex} className="token-details">
                                            <p><strong>Token Name:</strong> {token.name}</p>
                                            <p><strong>Token Symbol:</strong> {token.symbol}</p>
                                            <p><strong>Balance:</strong> {token.balance}</p>
                                            <p><strong>Holding Price (INR):</strong> ₹{token.holdingsPriceInr}</p>
                                            <p><strong>Holding Price (USDT):</strong> ${token.holdingsPriceUsdt}</p>
                                        </div>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </div>
                </AccordionDetails>

            </Accordion>

        </>
    );
};

export default Profile;
