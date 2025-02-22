import React, { useState, useEffect } from "react";

function NFTCard({ nft }) {
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        if (
          typeof nft.metadata === "string" &&
          nft.metadata.startsWith("http")
        ) {
          const response = await fetch(nft.metadata);
          const data = await response.json();
          setMetadata(data);
        } else {
          // Handle case where metadata might be already parsed
          setMetadata(
            typeof nft.metadata === "string"
              ? JSON.parse(nft.metadata)
              : nft.metadata
          );
        }
      } catch (e) {
        console.error("Error fetching metadata:", e);
        setMetadata({ error: "Failed to load metadata" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [nft.metadata]);

  if (isLoading) {
    return (
      <div className="bg-gray-800/40 backdrop-blur-md rounded-xl shadow-lg overflow-hidden p-6 border border-gray-700">
        <p className="text-gray-400">Loading metadata...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/40 backdrop-blur-md rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">
            {metadata.name || `NFT #${nft.serialNumber}`}
          </h3>
          {metadata.files && metadata.files.length > 0 && (
            <a
              href={metadata.files[0].uri}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-900/50 text-blue-300 text-md font-medium px-3 py-1.5 
                       rounded-full hover:bg-blue-800/50 transition-colors duration-200 
                       flex items-center gap-1.5"
            >
              <span>View</span>
              <span className="text-base">📄</span>
            </a>
          )}
        </div>

        <div className="space-y-4">
          {metadata.description && (
            <div className="bg-gray-900/40 rounded-lg p-3 border border-gray-700/50">
              <p className="text-gray-300 text-md">{metadata.description}</p>
            </div>
          )}

          <div className="bg-gray-900/40 rounded-lg p-3 space-y-3 border border-gray-700/50">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-md">Token ID</span>
              <span className="font-medium text-gray-200">{nft.tokenId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-md">Creator</span>
              <span className="font-medium text-gray-200">
                {metadata.creator || "Unknown"}
              </span>
            </div>
          </div>

          {/* {metadata.properties && (
            <div className="bg-gray-900/30 rounded-lg p-3">
              <span className="block text-gray-400 text-md mb-2">
                Properties
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(metadata.properties).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-gray-700/50 rounded-lg px-3 py-2 text-md"
                  >
                    <span className="text-gray-400">{key}:</span>
                    <span className="text-gray-200 ml-1">
                      {value.toString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default NFTCard;
