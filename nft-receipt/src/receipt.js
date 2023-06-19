import React, { useEffect, useState } from 'react';
import './receipt.css'; // Importing a CSS file to style the component

function Receipt({ transactionHash }) {
  const [transactionData, setTransactionData] = useState(null);
  const [error, setError] = useState(null);
  
  // The API key should be stored securely, not in source code
  const apiKey = process.env.REACT_APP_COVALENT_API_KEY;
  const apiUrl = `https://api.covalenthq.com/v1/eth-mainnet/transaction_v2/${transactionHash}/?&no-logs=true&with-nft-sales=true&key=${apiKey}`;

  useEffect(() => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const transactions = data.data.items;
        const transaction = transactions.find(tx => tx.nft_sale_details && tx.nft_sale_details.length > 0);
        if (transaction) {
          setTransactionData(transaction);
        } else {
          setError('No NFT sale details found in this transaction.');
        }
      })
      .catch(error => {
        setError(`Error fetching data: ${error}`);
      });
  }, [transactionHash, apiUrl]); // Re-fetch when transactionHash changes

  // Don't render anything until we have data
  if (!transactionData && !error) {
    return null;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const nftDetails = transactionData.nft_sale_details[0];

  // Inside the Receipt component's return function
return (
  <div className="receipt">
      <div className="banner"></div>
      <div className="header">
          <img src="https://www.datocms-assets.com/86369/1683821198-blur.png" alt="Logo" />
          <h2>NFT Sale Receipt</h2>
      </div>
      <div className="details">
          <p><strong>Transaction Link:</strong> <a href={`https://etherscan.io/tx/${transactionData.tx_hash}`} target="_blank" rel="noopener noreferrer">{transactionData.tx_hash}</a></p>
          <p><strong>Wallet Address:</strong> {transactionData.from_address}</p>
          <p><strong>NFT Collection:</strong> {nftDetails.collection_name}</p>
          <img src={nftDetails.image} alt={nftDetails.name} />
          <p><strong>NFT Name:</strong> {nftDetails.name}</p>
          <p><strong>Description:</strong> {nftDetails.description}</p>
      </div>
      <div className="total">
          <h3>Total: ${nftDetails.nft_token_price_usd.toFixed(2)}</h3>
      </div>
      <div className="footer">
          <p><strong>Fees paid (USD):</strong> {transactionData.pretty_gas_quote}</p>
      </div>
  </div>
);

}

export default Receipt;
