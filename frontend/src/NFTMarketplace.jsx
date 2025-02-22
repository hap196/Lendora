import React, { useEffect, useState } from "react";
import axios from "axios";
import NFTCard from "./components/NFTCard";

function NFTMarketplace({ refreshTrigger }) {
  const [nfts, setNfts] = useState([]);

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

  useEffect(() => {
    fetchNFTs();
  }, [refreshTrigger]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Available NFTs</h2>
        <button
          onClick={fetchNFTs}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg 
                   transition-colors duration-200 flex items-center gap-2"
        >
          <span>🔄</span> Refresh NFTs
        </button>
      </div>
      {nfts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No NFTs available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft, index) => (
            <NFTCard key={index} nft={nft} />
          ))}
        </div>
      )}
    </div>
  );
}

export default NFTMarketplace;
