import React, { useState, useEffect } from "react";
import axios from "axios";
import NFTCard from "./components/NFTCard";
import { useWalletInterface } from "./wallets/useWalletInterface";
import { WalletSelectionDialog } from "./components/WalletSelectionDialog";
import { Button } from "@mui/material";

const Profile = () => {
  const { accountId, walletInterface } = useWalletInterface();
  const [open, setOpen] = useState(false);
  const [myNFTs, setMyNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleConnect = async () => {
    if (accountId) {
      walletInterface?.disconnect();
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    if (accountId) {
      setOpen(false);
    }
  }, [accountId]);

  const fetchMyNFTs = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/all-nfts`
      );

      const userNFTs = await Promise.all(
        response.data.map(async (nft) => {
          try {
            if (!nft.metadata || !accountId) return null;
            const metadataResponse = await fetch(nft.metadata);
            const metadata = await metadataResponse.json();

            return metadata.ownership.holders.some(
              (holder) => holder.account_id === accountId
            )
              ? nft
              : null;
          } catch (e) {
            console.error("Error processing NFT metadata:", e);
            return null;
          }
        })
      );

      const filteredNFTs = userNFTs.filter((nft) => nft !== null);
      setMyNFTs(filteredNFTs);
    } catch (error) {
      console.error("❌ Error fetching NFTs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchMyNFTs();
    }
  }, [accountId]);

  if (!accountId) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="text-center py-12 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700">
          <p className="text-gray-400 text-lg mb-4">
            Please connect your wallet through WalletConnect to view your NFTs.
          </p>
          <Button variant="contained" color="primary" onClick={handleConnect}>
            Connect Wallet
          </Button>
        </div>
        <WalletSelectionDialog
          open={open}
          setOpen={setOpen}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="text-center py-12 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700">
          <p className="text-gray-400 text-lg">Loading your NFTs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h2 className="text-3xl font-bold text-white mb-2">My NFT Portfolio</h2>
      <p className="text-gray-400 text-sm mb-8">
        Connected Wallet: {accountId}
      </p>

      {myNFTs.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700">
          <p className="text-gray-400 text-lg">You don't own any NFTs yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myNFTs.map((nft, index) => (
            <NFTCard key={index} nft={nft} />
          ))}
        </div>
      )}

      <WalletSelectionDialog
        open={open}
        setOpen={setOpen}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default Profile;
