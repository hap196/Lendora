import React from "react";
import distributedLedger from "./assets/distributed-ledger.png";

function Home() {
  return (
    <div className="container mx-auto px-4 py-48">
      <div className="max-w-6xl mx-auto text-left">
        <div className="flex items-center justify-between gap-16 mb-32">
          <div className="text-left flex-1">
            <h1 className="text-5xl font-bold text-white mb-2">
              Transform Loans into Tokens
            </h1>
            <h1 className="text-4xl font-bold text-blue-300 mb-6">
              Secure Your Future on Hedera
            </h1>
            <p className="text-xl text-gray-300 max-w-xl">
              A decentralized platform for tokenizing and managing loan
              documents on the Hedera network
            </p>
            <div className="flex justify-left gap-4 mt-8">
              <a
                href="/marketplace"
                className="bg-blue-900/50 text-blue-300 px-8 py-3 rounded-lg 
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
            className="w-72 h-72 animate-pulse"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800/40 backdrop-blur-md p-8 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Create Loan NFTs
            </h2>
            <p className="text-gray-300">
              Convert your loan documents into unique NFTs on the Hedera
              network, ensuring immutable record-keeping and easy transfer of
              ownership.
            </p>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-md p-8 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Manage Documents
            </h2>
            <p className="text-gray-300">
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
