import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWalletInterface } from "../wallets/useWalletInterface";
import { WalletSelectionDialog } from "./WalletSelectionDialog";
import { Button } from "@mui/material";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { accountId, walletInterface } = useWalletInterface();

  const handleConnect = async () => {
    if (accountId) {
      walletInterface.disconnect();
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    if (accountId) {
      setOpen(false);
    }
  }, [accountId]);

  return (
    <nav className="bg-transparent p-4 backdrop-blur-sm">
      <div className="max-w-6xl container mx-auto flex justify-between items-center">
        {/* Left: Branding */}
        <div className="flex-1">
          <Link
            to="/"
            className="text-white hover:text-gray-300 transition-colors font-bold text-xl"
          >
            lendora
          </Link>
        </div>

        {/* Center: Nav Links */}
        <div className="flex space-x-8">
          <Link
            to="/marketplace"
            className="text-white hover:text-gray-300 transition-colors font-bold text-lg"
          >
            marketplace
          </Link>
          <Link
            to="/profile"
            className="text-white hover:text-gray-300 transition-colors font-bold text-lg"
          >
            profile
          </Link>
        </div>

        {/* Right: Wallet Connect Button */}
        <div className="ml-4">
          <Button variant="contained" color="primary" onClick={handleConnect}>
            {accountId ? `Connected: ${accountId}` : "Connect Wallet"}
          </Button>
        </div>
      </div>

      <WalletSelectionDialog
        open={open}
        setOpen={setOpen}
        onClose={() => setOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
