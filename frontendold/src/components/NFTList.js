import React, { useState } from "react";
import axios from "axios";

function LoanNFT() {
  const [loanAmount, setLoanAmount] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [nftData, setNftData] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const mintLoanNFT = async () => {
    if (!loanAmount || !file) {
      setMessage("Please provide a loan amount and document.");
      return;
    }

    const formData = new FormData();
    formData.append("loanAmount", loanAmount);
    formData.append("loanDocument", file);

    try {
      const res = await axios.post(
        "http://localhost:3001/create-loan",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setNftData(res.data);
      setMessage("Loan NFT Minted Successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
      setMessage("Failed to mint NFT.");
    }
  };

  return (
    <div>
      <h1>Mint Loan NFT</h1>
      <input
        type="number"
        placeholder="Loan Amount"
        value={loanAmount}
        onChange={(e) => setLoanAmount(e.target.value)}
      />
      <input type="file" onChange={handleFileChange} />
      <button onClick={mintLoanNFT}>Mint Loan NFT</button>
      {message && <p>{message}</p>}
      {nftData && (
        <div>
          <h2>Minted NFT Details:</h2>
          <p>
            <strong>Token ID:</strong> {nftData.tokenId}
          </p>
          <p>
            <strong>Document Hash:</strong> {nftData.metadata.documentHash}
          </p>
          <p>
            <strong>Loan Amount:</strong> ${nftData.metadata.loanAmount}
          </p>
          <p>
            <strong>Ownership Percent:</strong>{" "}
            {nftData.metadata.ownershipPercent}%
          </p>
        </div>
      )}
    </div>
  );
}

export default LoanNFT;
