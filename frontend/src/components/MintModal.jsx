import React, { useState } from "react";
import axios from "axios";

function MintModal({ isOpen, onClose, onSuccess }) {
  const [loanAmount, setLoanAmount] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setMessage("");
    setLoanAmount("");
    setFile(null);
    onClose();
    if (onSuccess) onSuccess();
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleLoanAmountChange = (event) => {
    setLoanAmount(event.target.value);
  };

  const mintLoanNFT = async () => {
    if (!file || !loanAmount) {
      setMessage("Please upload a document and enter a loan amount.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("loanDocument", file);
    formData.append("loanAmount", loanAmount);

    try {
      // mint the loan nft by sending the form data to the server
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-loan`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // display a message
      setMessage("NFT Minted Successfully!");
      // close the modal after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Error minting NFT:", error);
      setMessage("Failed to mint NFT.");
    } finally {
      // reset the loading state
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xl flex items-center justify-center z-50">
      <div
        className="relative bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full mx-4 
                    border border-white/20 
                    shadow-[0_0_50px_rgba(255,255,255,0.15),0_0_100px_rgba(59,130,246,0.2)]"
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-green-500/20 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 rounded-2xl bg-white/5"></div>

        {/* modal content */}
        <div className="relative">
          {/* modal header - mint nft*/}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white/90">Mint Loan NFT</h2>
            {/* close button */}
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white/90 transition-colors
                       w-8 h-8 flex items-center justify-center text-xl
                       hover:bg-white/10 rounded-full"
            >
              ✕
            </button>
          </div>

          {/* form to mint the loan nft */}
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-lg font-medium text-white/80 mb-2">
                Loan Amount ($)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={handleLoanAmountChange}
                placeholder="Enter loan amount"
                className="px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl
                         focus:ring-2 focus:ring-blue-500/50 focus:outline-none focus:border-blue-500/50
                         transition-all duration-200 placeholder-white/30"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-medium text-white/80 mb-2">
                Upload Loan Document
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.docx,.txt"
                className="px-4 py-3 bg-white/5 text-white rounded-xl border border-white/10
                         file:mr-4 file:py-2 file:px-4 
                         file:rounded-xl file:border-0 
                         file:text-base file:font-medium
                         file:bg-blue-500/80 file:text-white
                         hover:file:bg-blue-600/80
                         file:transition-colors"
              />
            </div>

            <button
              onClick={mintLoanNFT}
              disabled={isLoading}
              className="w-full bg-blue-500/80 hover:bg-blue-600/80 text-white py-3 px-4 rounded-xl 
                       transition-all duration-200 text-lg font-medium
                       border border-blue-400/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]
                       hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {/* loading message */}
              {isLoading ? (
                <>
                  {/* loading icon */}
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  <span>Minting...</span>
                </>
              ) : (
                "Mint Loan NFT"
              )}
            </button>
            {message && (
              <div className="text-center animate-fade-in">
                <p className="text-lg font-medium text-white/80">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MintModal;
