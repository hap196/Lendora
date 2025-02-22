import React, { useEffect, useState } from "react";
import axios from "axios";
import NFTCard from "./components/NFTCard";
import MintModal from "./components/MintModal";

function NFTMarketplace({ refreshTrigger }) {
  const [nfts, setNfts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Available NFTs</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg 
                   hover:bg-blue-700 transition-colors text-lg font-medium
                   flex items-center gap-2"
        >
          <span>Mint NFT</span>
          <span className="text-xl">+</span>
        </button>
      </div>

      {/* Modal */}
      <MintModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {nfts.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700">
          <p className="text-gray-400 text-lg">No NFTs available</p>
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
