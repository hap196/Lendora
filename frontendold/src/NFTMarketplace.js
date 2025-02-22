import React, { useEffect, useState } from "react";
import axios from "axios";

function NFTMarketplace({ refreshTrigger }) {
  const [nfts, setNfts] = useState([]);

  // ✅ Function to Fetch NFTs from Backend
  const fetchNFTs = async () => {
    try {
      console.log("🔄 Fetching NFTs from server...");
      const response = await axios.get("http://localhost:3001/all-nfts");
      console.log("✅ Fetched NFTs:", response.data);
      setNfts(response.data);
    } catch (error) {
      console.error("❌ Error fetching NFTs:", error);
    }
  };

  // ✅ Fetch NFTs on Load & Whenever `refreshTrigger` Changes
  useEffect(() => {
    fetchNFTs();
  }, [refreshTrigger]); // Re-run whenever `refreshTrigger` changes

  return (
    <div>
      <h2>Available NFTs</h2>
      <button onClick={fetchNFTs}>🔄 Refresh NFTs</button>
      <ul>
        {nfts.length === 0 ? (
          <p>No NFTs available</p>
        ) : (
          nfts.map((nft, index) => (
            <li key={index}>
              <strong>Token ID:</strong> {nft.tokenId} <br />
              <strong>Serial Number:</strong> {nft.serialNumber} <br />
              <strong>Metadata:</strong>{" "}
              <a href={nft.metadata} target="_blank" rel="noopener noreferrer">
                View Metadata
              </a>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default NFTMarketplace;
