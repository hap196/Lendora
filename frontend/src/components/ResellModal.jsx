import React, { useState } from "react";
import axios from "axios";
import { useWalletInterface } from "../wallets/useWalletInterface"; // ✅ Import wallet info

function ResellModal({ isOpen, onClose, nft, userHolding }) {
  const [sellAmount, setSellAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { accountId } = useWalletInterface(); // ✅ Get logged-in wallet

  const handleResell = async () => {
    if (!accountId) {
      alert("Please connect your wallet to resell your share.");
      return;
    }

    if (!sellAmount || sellAmount <= 0 || sellAmount > userHolding.percentage) {
      setMessage("Please enter a valid amount to sell");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/resell-nft`,
        {
          tokenId: nft.tokenId,
          serialNumber: nft.serialNumber,
          metadata: nft.metadata,
          sellerAccountId: accountId, // ✅ Use real seller
          buyerAccountId: "0.0.5518642", // <- Placeholder for the buyer (could become dynamic later)
          resellAmount: parseFloat(sellAmount),
        }
      );

      if (response.data.success) {
        setMessage("Share resold successfully!");
        setTimeout(() => {
          onClose();
          if (nft.onUpdateMetadata) {
            nft.onUpdateMetadata(response.data.updatedMetadata);
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Error reselling share:", error);
      setMessage(error.response?.data?.error || "Failed to resell share");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="bg-gray-800/40 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-gray-700 z-10 w-full h-full">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              Resell Your Share
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="bg-gray-900/40 rounded-lg p-3 border border-gray-700/50">
            <p className="text-gray-300 text-md mb-2">
              Your current share: {userHolding?.percentage}%
            </p>
            <p className="text-gray-300 text-md mb-4">
              Enter the percentage you want to resell:
            </p>
            <input
              type="number"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              max={userHolding?.percentage}
              className="bg-gray-700/50 text-white px-4 py-2 rounded-lg w-full border border-gray-600/50 focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="Enter percentage to sell..."
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700/50 text-gray-300 text-sm font-medium px-3 py-1.5 rounded-full hover:bg-gray-600/50 transition-colors duration-200 flex items-center justify-center"
            >
              Cancel
            </button>
            <button
              onClick={handleResell}
              disabled={isLoading}
              className="flex-1 bg-purple-900/50 text-purple-300 text-sm font-medium px-3 py-1.5 rounded-full hover:bg-purple-800/50 transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                "Confirm Sale"
              )}
            </button>
          </div>

          {message && (
            <div className="text-center animate-fade-in">
              <p className="text-lg font-medium text-white/80">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResellModal;
