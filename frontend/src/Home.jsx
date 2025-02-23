import React from "react";
import distributedLedger from "./assets/distributed-ledger.png";

function Home() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-32">
      {/* main content */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 mb-16 md:mb-32">
          <div className="text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Transform Loans into Tokens
            </h1>
            <h1 className="text-3xl md:text-4xl font-bold text-blue-300 mb-4 md:mb-6">
              Secure Your Future on Hedera
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-xl">
              A decentralized platform for tokenizing and managing loan
              documents on the Hedera network
            </p>
            {/* button to view the marketplace */}
            <div className="flex justify-left gap-4 mt-6 md:mt-8">
              <a
                href="/marketplace"
                className="bg-blue-900/50 text-blue-300 px-6 md:px-8 py-3 rounded-lg 
                     hover:bg-blue-800/50 transition-colors duration-200 
                     font-medium border border-blue-700/30"
              >
                View Marketplace
              </a>
            </div>
          </div>
          <img
            src={distributedLedger}
            alt="Distributed Ledger"
            className="w-48 h-48 md:w-72 md:h-72 animate-pulse"
          />
        </div>

        {/* features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-gray-800/40 backdrop-blur-md p-6 md:p-8 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">
              Create Loan NFTs
            </h2>
            <p className="text-sm md:text-base text-gray-300">
              Convert your loan documents into unique NFTs on the Hedera
              network, ensuring immutable record-keeping and easy transfer of
              ownership.
            </p>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-md p-6 md:p-8 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">
              Manage Documents
            </h2>
            <p className="text-sm md:text-base text-gray-300">
              Securely store and manage your loan documents using IPFS
              technology, with permanent links to your original documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
