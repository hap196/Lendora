import React, { useState, useEffect } from "react";
import BuyModal from "./BuyModal";
import axios from "axios";

function NFTCard({ nft }) {
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        if (
          typeof nft.metadata === "string" &&
          nft.metadata.startsWith("http")
        ) {
          // Fetch from IPFS URL
          const ipfsUrl = nft.metadata;
          const response = await fetch(ipfsUrl);
          const data = await response.json();
          setMetadata(data);
        } else {
          setMetadata(nft.metadata);
        }
      } catch (e) {
        console.error("Error fetching metadata:", e);
        setMetadata({ error: "Failed to load metadata" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [nft.metadata]);

  const handleBuy = async (nft, amount) => {
    try {
      setIsUpdating(true);
      // For demo purposes, using a dummy buyer account
      const buyerAccountId = "dummyuser";

      const response = await axios.post(
        "http://localhost:3001/update-nft-ownership",
        {
          tokenId: nft.tokenId,
          serialNumber: nft.serialNumber,
          metadata: metadata,
          buyerAccountId: buyerAccountId,
          purchaseAmount: amount,
        }
      );

      if (response.data.success) {
        // Update the local metadata state
        setMetadata(response.data.updatedMetadata);
        console.log(
          "Successfully updated NFT ownership:",
          response.data.updatedMetadata
        );
      }
    } catch (error) {
      console.error("Error updating NFT ownership:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800/40 backdrop-blur-md rounded-xl shadow-lg overflow-hidden p-6 border border-gray-700">
        <p className="text-gray-400">Loading metadata...</p>
      </div>
    );
  }

  // Get ownership percentage from metadata, default to 100% if N/A
  const ownershipPercentage = (
    metadata?.ownership?.total_percentage || 100
  ).toString();

  // Get all holders information
  const holders = metadata?.ownership?.holders || [];

  // Format holders for display
  const holdersDisplay = holders.map((holder) => (
    <div key={holder.account_id} className="flex justify-between items-center">
      <span className="text-gray-400 text-sm">{holder.account_id}</span>
      <span className="font-medium text-gray-200">{holder.percentage}%</span>
    </div>
  ));

  return (
    <div className="relative bg-gray-800/40 backdrop-blur-md rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-700">
      {isUpdating && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-white text-sm">Updating ownership...</p>
          </div>
        </div>
      )}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white">
            {metadata.name || `NFT #${nft.serialNumber}`}
          </h3>
        </div>

        <div className="space-y-4">
          {metadata.description && (
            <div className="bg-gray-900/40 rounded-lg p-3 border border-gray-700/50">
              <span className="text-gray-400 text-md">Amount: </span>
              <span className="font-medium text-gray-200">
                ${metadata.description || "N/A"}
              </span>
            </div>
          )}

          <div className="bg-gray-900/40 rounded-lg p-3 space-y-3 border border-gray-700/50">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-md">Token ID</span>
              <span className="font-medium text-gray-200">{nft.tokenId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-md">Creator</span>
              <span className="font-medium text-gray-200">
                {metadata.creator || "Unknown"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-md">Available</span>
              <span className="font-medium text-gray-200">
                {ownershipPercentage}%
              </span>
            </div>
            {holders.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-700/50">
                <p className="text-gray-400 text-sm mb-2">Current Holders:</p>
                {holdersDisplay}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            {metadata.files && metadata.files.length > 0 && (
              <a
                href={metadata.files[0].uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-900/50 text-blue-300 text-sm font-medium px-3 py-1.5 
                         rounded-full hover:bg-blue-800/50 transition-colors duration-200 
                         flex items-center justify-center gap-1.5"
              >
                <span>View Doc</span>
                <span className="text-base">📄</span>
              </a>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 bg-green-900/50 text-green-300 text-sm font-medium px-3 py-1.5 
                       rounded-full hover:bg-green-800/50 transition-colors duration-200 
                       flex items-center justify-center gap-1.5"
            >
              <span>Buy Fraction</span>
              <span className="text-base">💰</span>
            </button>
          </div>
        </div>
      </div>
      <BuyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nft={nft}
        onBuy={handleBuy}
      />
    </div>
  );
}

export default NFTCard;
