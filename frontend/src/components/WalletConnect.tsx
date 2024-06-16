// src/components/WalletConnect.tsx
import React from "react";
import { useConnect, useAccount } from "@thirdweb-dev/react";
import { Web3Button } from "@thirdweb-dev/react";
import { contractAddress, ACTIVE_CHAIN_ID } from "../utils/constants";

const WalletConnect: React.FC = () => {
  const address = useAccount()?.address;
  const connect = useConnect();

  return (
    <div>
      {!address ? (
        // Connect Wallet Button
        <ConnectWallet accentColor="#F213A4" colorMode="dark" />
      ) : (
        <p>Connected Wallet: {address}</p>
      )}

      {/* Web3Button for interacting with the contract (Optional) */}
      {address && (
        <Web3Button
          contractAddress={contractAddress}
          action={(contract) =>
            // Replace with the actual function you want to call
            contract.call("yourContractFunction", ["arg1", "arg2"])
          }
        >
          Interact with Contract
        </Web3Button>
      )}
    </div>
  );
};

export default WalletConnect;
