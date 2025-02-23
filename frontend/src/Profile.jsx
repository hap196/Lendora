import React, { useState, useEffect } from "react";
import axios from "axios";
import NFTCard from "./components/NFTCard";

const Profile = () => {
  const [myNFTs, setMyNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyNFTs = async () => {
    try {
      console.log("🔄 Fetching NFTs from server...");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/all-nfts`
      );

      // Filter NFTs where metadata shows 0.0.9918642 as holder
      const userNFTs = await Promise.all(
        response.data.map(async (nft) => {
          try {
            if (!nft.metadata) return null;
            const metadataResponse = await fetch(nft.metadata);
            const metadata = await metadataResponse.json();
            return metadata.ownership.holders.some(
              (holder) => holder.account_id === "0.0.9918642"
            )
              ? nft
              : null;
          } catch (e) {
            console.error("Error processing NFT metadata:", e);
            return null;
          }
        })
      );

      // Filter out null values
      const filteredNFTs = userNFTs.filter((nft) => nft !== null);
      console.log("✅ Filtered NFTs:", filteredNFTs);
      setMyNFTs(filteredNFTs);
    } catch (error) {
      console.error("❌ Error fetching NFTs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyNFTs();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="text-center py-12 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700">
          <p className="text-gray-400 text-lg">Loading your NFTs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h2 className="text-3xl font-bold text-white mb-8">My NFT Portfolio</h2>

      {myNFTs.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700">
          <p className="text-gray-400 text-lg">You don't own any NFTs yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myNFTs.map((nft, index) => (
            <NFTCard key={index} nft={nft} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
