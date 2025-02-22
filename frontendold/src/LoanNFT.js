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
    console.log("✅ Mint Loan NFT button clicked!");

    if (!loanAmount || !file) {
      setMessage("❌ Please provide a loan amount and document.");
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

      console.log("✅ NFT Minted:", res.data);
      setNftData(res.data);
      setMessage("🎉 Loan NFT Minted Successfully!");
    } catch (error) {
      console.error("❌ Error minting NFT:", error);
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
      <p>{message}</p>

      {/* ✅ Only render NFT data if it exists */}
      {nftData && nftData.metadata && (
        <div>
          <h2>Minted NFT Details:</h2>
          <p>
            <strong>Token ID:</strong> {nftData.tokenId}
          </p>
          <p>
            <strong>Document SHA-384 Hash:</strong>{" "}
            {nftData.metadata.documentHash}
          </p>
          <p>
            <strong>Loan Amount:</strong> ${nftData.metadata.loanAmount}
          </p>
          <p>
            <strong>Ownership Percent:</strong>{" "}
            {nftData.metadata.ownershipPercent}%
          </p>
          <p>
            <strong>Document:</strong>{" "}
            <a
              href={nftData.metadata.ipfsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on IPFS
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export default LoanNFT;
