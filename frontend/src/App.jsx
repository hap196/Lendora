import React, { useState } from "react";
import axios from "axios";
import NFTMarketplace from "./NFTMarketplace";

function App() {
  const [loanAmount, setLoanAmount] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Used to trigger NFT refresh

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
    <div>
      <h1>Loan NFT Minting</h1>

      {/* ✅ Loan Amount Input */}
      <label>Loan Amount ($):</label>
      <input
        type="number"
        value={loanAmount}
        onChange={handleLoanAmountChange}
        placeholder="Enter loan amount"
      />

      {/* ✅ File Upload Input */}
      <label>Upload Loan Document:</label>
      <input type="file" onChange={handleFileChange} accept=".pdf,.docx,.txt" />

      {/* ✅ Mint NFT Button */}
      <button onClick={mintLoanNFT}>Mint Loan NFT</button>

      {/* ✅ Display Status Messages */}
      <p>{message}</p>

      {/* ✅ Display NFT Marketplace with Automatic Refresh */}
      <NFTMarketplace refreshTrigger={refreshTrigger} />
    </div>
  );
}

export default App;
