import React, { createContext, useState, ReactNode } from "react";

// Define the shape of the context
type WalletConnectContextType = {
  accountId: string;
  setAccountId: (newValue: string) => void;
  isConnected: boolean;
  setIsConnected: (newValue: boolean) => void;
};

// Default values for context
const defaultValue: WalletConnectContextType = {
  accountId: "",
  setAccountId: () => {},
  isConnected: false,
  setIsConnected: () => {},
};

// Create the context
export const WalletConnectContext =
  createContext<WalletConnectContextType>(defaultValue);

// Provider component
export const WalletConnectProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [accountId, setAccountId] = useState<string>(defaultValue.accountId);
  const [isConnected, setIsConnected] = useState<boolean>(
    defaultValue.isConnected
  );

  return (
    <WalletConnectContext.Provider
      value={{
        accountId,
        setAccountId,
        isConnected,
        setIsConnected,
      }}
    >
      {children}
    </WalletConnectContext.Provider>
  );
};
