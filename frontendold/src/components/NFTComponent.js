import React, { useState, useEffect } from "react";
import axios from "axios";

function NFTMarketplace() {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    try {
      const res = await axios.get("http://localhost:3001/available-nfts");
      setNfts(res.data);
    } catch (error) {
      console.error("❌ Error fetching NFTs:", error);
    }
  };

  return (
    <div>
      <h2>Available NFTs for Purchase</h2>
      <div className="nft-grid">
        {nfts.length === 0 ? (
          <p>No NFTs available.</p>
        ) : (
          nfts.map((nft) => (
            <div key={nft.serialNumber} className="nft-card">
              <h3>Token ID: {nft.tokenId}</h3>
              <p>
                <strong>Serial Number:</strong> {nft.serialNumber}
              </p>
              <p>
                <strong>Owner:</strong> {nft.owner}
              </p>
              <p>
                <strong>Metadata:</strong> {nft.metadata}
              </p>
              <button>Buy NFT</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NFTMarketplace;
