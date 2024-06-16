// src/components/ConnectWalletButton.tsx
import React from "react";
import { useAddress, ConnectWallet } from "@thirdweb-dev/react";

const ConnectWalletButton: React.FC = () => {
  const address = useAddress();

  return (
    <div>
      {!address ? (
        <ConnectWallet className="bg-blue-600 py-2 px-7 rounded-full text-white cursor-pointer hover:bg-blue-700" />
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
