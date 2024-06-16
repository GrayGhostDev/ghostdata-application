// src/components/ConnectWalletButton.tsx
import React from "react";
import { useAddress, useMetamask, ConnectWallet } from "@thirdweb-dev/react";

const ConnectWalletButton: React.FC = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  const handleConnect = async () => {
    try {
      await connectWithMetamask();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return (
    <div>
      {!address ? (
        <button
          onClick={handleConnect}
          className="bg-blue-600 py-2 px-7 rounded-full text-white cursor-pointer hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <p>Connected Wallet: {address}</p>
          <ConnectWallet className="bg-blue-600 py-2 px-7 rounded-full text-white cursor-pointer hover:bg-blue-700" />
        </div>
      )}
    </div>
  );
};

export default ConnectWalletButton;
