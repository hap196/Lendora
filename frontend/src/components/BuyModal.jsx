import React, { useState } from "react";

function BuyModal({ isOpen, onClose, nft, onBuy }) {
  const [loanAmount, setLoanAmount] = useState(0);

  const handleBuy = () => {
    onBuy(nft, loanAmount);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-gray-800/40 backdrop-blur-md rounded-xl shadow-lg overflow-hidden p-6 border border-gray-700 z-10">
        <h2 className="text-xl font-semibold text-white mb-4">
          Buy Fraction of Loan
        </h2>
        <p className="text-gray-300 mb-4">
          Enter the amount of loan you want to purchase a fraction of:
        </p>
        <input
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg w-full mb-4"
        />
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleBuy}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuyModal;
