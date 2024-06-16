// src/components/ConnectWalletButton.tsx
import React from "react";
import { useAddress, ConnectWallet } from "@thirdweb-dev/react";
import shortenAddress from "../utils/shortenAddress";

const ConnectWalletButton: React.FC = () => {
  const address = useAddress();

  return (
    <div className="flex flex-col items-center">
      {!address ? (
        <ConnectWallet className="bg-blue-600 py-2 px-7 rounded-full text-white cursor-pointer hover:bg-blue-700" />
      ) : (
        <div className="flex flex-col items-center">
          <p className="mb-2">Connected Wallet: {shortenAddress(address)}</p>
          <p>
            <span className="text-green-500">Connected to Loan Disk API</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ConnectWalletButton;
