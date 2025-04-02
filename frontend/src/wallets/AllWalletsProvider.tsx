import { ReactNode } from "react";
import { MetamaskContextProvider } from "../contexts/MetamaskContext";
import { WalletConnectProvider } from "../contexts/WalletConnectContext";
import { MetaMaskClient } from "./metamask/metamaskClient";
import { WalletConnectClient } from "./walletconnect/walletConnectClient";
import React from "react";

const AllWalletsProvider = (props: { children: ReactNode | undefined }) => {
  return (
    <MetamaskContextProvider>
      <WalletConnectProvider>
        <MetaMaskClient />
        <WalletConnectClient />
        {props.children}
      </WalletConnectProvider>
    </MetamaskContextProvider>
  );
};

export default AllWalletsProvider;
