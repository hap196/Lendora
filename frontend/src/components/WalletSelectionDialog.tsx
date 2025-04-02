import { Button, Dialog, Stack } from "@mui/material";
import { connectToMetamask } from "../wallets/metamask/metamaskClient";
import { openWalletConnectModal } from "../wallets/walletconnect/walletConnectClient";
import React from "react";

interface WalletSelectionDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onClose: (value: string) => void;
}

export const WalletSelectionDialog = (props: WalletSelectionDialogProps) => {
  const { onClose, open, setOpen } = props;

  return (
    <Dialog onClose={onClose} open={open}>
      <Stack p={2} gap={1}>
        <Button
          variant="contained"
          onClick={() => {
            openWalletConnectModal();
            setOpen(false);
          }}
        >
          WalletConnect
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            connectToMetamask();
          }}
        >
          Metamask
        </Button>
      </Stack>
    </Dialog>
  );
};
