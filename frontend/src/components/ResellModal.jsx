import React, { useState } from "react";
import axios from "axios";

function ResellModal({ isOpen, onClose, nft, userHolding }) {
  const [sellAmount, setSellAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResell = async () => {
    if (!sellAmount || sellAmount <= 0 || sellAmount > userHolding.percentage) {
      setMessage("Please enter a valid amount to sell");
      return;
    }

    setIsLoading(true);
    try {
      // Implementation for reselling would go here
      // You'll need to create a corresponding backend endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/resell-nft-share`,
        {
          tokenId: nft.tokenId,
          serialNumber: nft.serialNumber,
          sellerAccountId: "0.0.9918642", // Demo account
          sellAmount: parseFloat(sellAmount)
        }
      );

      if (response.data.success) {
        setMessage("Share listed for resale successfully!");
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error listing share for resale:", error);
      setMessage("Failed to list share for resale");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xl flex items-center justify-center z-50">
      <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full mx-4 
                    border border-white/20">
        <div className="relative">
          <h2 className="text-2xl font-bold text-white/90 mb-6">Resell Your Share</h2>
          
          <div className="space-y-6">
            <div>
              <label className="text-lg font-medium text-white/80 mb-2 block">
                Your Current Share: {userHolding?.percentage}%
              </label>
              <input
                type="number"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                placeholder="Enter percentage to sell"
                max={userHolding?.percentage}
                className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl"
              />
            </div>

            <button
              onClick={handleResell}
              disabled={isLoading}
              className="w-full bg-purple-500/80 hover:bg-purple-600/80 text-white py-3 px-4 rounded-xl 
                       transition-all duration-200 text-lg font-medium"
            >
              {isLoading ? "Processing..." : "List for Resale"}
            </button>

            {message && (
              <div className="text-center">
                <p className="text-lg font-medium text-white/80">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResellModal; 