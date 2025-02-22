import React from "react";

function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Welcome to NFT Loan Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A decentralized platform for tokenizing and managing loan documents on
          the Hedera network
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Create Loan NFTs
            </h2>
            <p className="text-gray-600">
              Convert your loan documents into unique NFTs on the Hedera
              network, ensuring immutable record-keeping and easy transfer of
              ownership.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Manage Documents
            </h2>
            <p className="text-gray-600">
              Securely store and manage your loan documents using IPFS
              technology, with permanent links to your original documentation.
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <a
            href="/marketplace"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg 
                     transition-colors duration-200 font-medium"
          >
            View Marketplace
          </a>
          <a
            href="/mint"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg 
                     transition-colors duration-200 font-medium"
          >
            Mint New NFT
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
