import React, { useState } from "react";
import axios from "axios";

function TransferForm() {
  const [tokenId, setTokenId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");

  const transferNFT = async () => {
    try {
      const res = await axios.post("http://localhost:3001/transfer-loan", {
        tokenId,
        receiverId,
      });
      setMessage("Transfer Successful!");
    } catch (error) {
      console.error("Transfer failed:", error);
      setMessage("Transfer Failed.");
    }
  };

  return (
    <div>
      <h2>Transfer Loan NFT</h2>
      <input
        type="text"
        placeholder="Enter Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Receiver ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
      />
      <button onClick={transferNFT}>Transfer</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default TransferForm;
