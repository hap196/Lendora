import React, { useState } from "react";
import axios from "axios";

const Mint = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  // ✅ Handles File Selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // ✅ Handles Loan Amount Input
  const handleLoanAmountChange = (event) => {
    setLoanAmount(event.target.value);
  };

  // ✅ Function to Mint Loan NFT
  const mintLoanNFT = async () => {
    if (!file || !loanAmount) {
      setMessage("Please upload a document and enter a loan amount.");
      return;
    }

    const formData = new FormData();
    formData.append("loanDocument", file);
    formData.append("loanAmount", loanAmount);

    try {
      console.log("✅ Minting Loan NFT...");
      const res = await axios.post(
        "http://localhost:3001/create-loan",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("✅ NFT Minted:", res.data);
      setMessage("NFT Minted Successfully!");

      // ✅ Trigger a refresh of NFTs in the marketplace
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("❌ Error minting NFT:", error);
      setMessage("Failed to mint NFT.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Loan NFT Minting
      </h1>

      <div className="space-y-4">
        {/* ✅ Loan Amount Input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Loan Amount ($):
          </label>
          <input
            type="number"
            value={loanAmount}
            onChange={handleLoanAmountChange}
            placeholder="Enter loan amount"
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        {/* ✅ File Upload Input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Upload Loan Document:
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* ✅ Mint NFT Button */}
        <button
          onClick={mintLoanNFT}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Mint Loan NFT
        </button>

        {/* ✅ Display Status Messages */}
        <p className="text-center text-sm font-medium text-gray-600">
          {message}
        </p>
      </div>
    </div>
  );
};

export default Mint;
