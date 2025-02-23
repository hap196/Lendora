import React, { useState } from "react";

function BuyModal({ isOpen, onClose, nft, onBuy }) {
  const [loanAmount, setLoanAmount] = useState(0);

  const handleBuy = () => {
    onBuy(nft, loanAmount);
    onClose();
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
              Buy Fraction of Loan
            </h2>
            {/* close button */}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="bg-gray-900/40 rounded-lg p-3 border border-gray-700/50">
            <p className="text-gray-300 text-md mb-4">
              Enter the amount of loan you want to purchase a fraction of:
            </p>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="bg-gray-700/50 text-white px-4 py-2 rounded-lg w-full 
                       border border-gray-600/50 focus:outline-none focus:border-blue-500/50
                       transition-colors"
              placeholder="Enter amount..."
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700/50 text-gray-300 text-sm font-medium px-3 py-1.5 
                       rounded-full hover:bg-gray-600/50 transition-colors duration-200 
                       flex items-center justify-center"
            >
              Cancel
            </button>
            <button
              onClick={handleBuy}
              className="flex-1 bg-blue-900/50 text-blue-300 text-sm font-medium px-3 py-1.5 
                       rounded-full hover:bg-blue-800/50 transition-colors duration-200 
                       flex items-center justify-center"
            >
              Confirm Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyModal;
