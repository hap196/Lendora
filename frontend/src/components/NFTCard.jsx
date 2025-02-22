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
      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <p className="text-gray-600">Loading metadata...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {metadata.name || `NFT #${nft.serialNumber}`}
          </h3>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            Token ID: {nft.tokenId}
          </span>
        </div>

        <div className="space-y-3">
          {metadata.description && (
            <p className="text-gray-600">{metadata.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-sm">
              <span className="block text-gray-500">Serial Number</span>
              <span className="font-medium text-gray-800">
                {nft.serialNumber}
              </span>
            </div>
            <div className="text-sm">
              <span className="block text-gray-500">Creator</span>
              <span className="font-medium text-gray-800">
                {metadata.creator || "Unknown"}
              </span>
            </div>
            {metadata.properties && (
              <div className="col-span-2">
                <span className="block text-gray-500 text-sm">Properties</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {Object.entries(metadata.properties).map(([key, value]) => (
                    <span
                      key={key}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {key}: {value.toString()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {metadata.files && metadata.files.length > 0 && (
            <div className="mt-4">
              <a
                href={metadata.files[0].uri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full bg-blue-500 
                         hover:bg-blue-600 text-white font-medium py-2 px-4 
                         rounded-lg transition-colors duration-200"
              >
                View Document 📄
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NFTCard;
