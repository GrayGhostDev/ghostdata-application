// src/components/WalletConnect.tsx
import React from "react";
import {
  useConnect,
  ConnectWallet,
  Web3Button,
  useContract,
  useAddress,
} from "@thirdweb-dev/react";
import { contractAddress } from "@/utils/constants";

const WalletConnect: React.FC = () => {
  const address = useAddress();
  const connect = useConnect();
  const { contract } = useContract(contractAddress);

  return (
    <div>
      {!address ? (
        // Connect Wallet Button
        <ConnectWallet />
      ) : (
        <p>Connected Wallet: {address}</p>
      )}

      {/* Web3Button for interacting with the contract (Optional) */}
      {address && contract && (
        <Web3Button
          contractAddress={contractAddress}
          action={async (contract) =>
            // Replace with the actual function you want to call
            await contract.call("yourContractFunction", ["arg1", "arg2"])
          }
        >
          Interact with Contract
        </Web3Button>
      )}
    </div>
  );
};

export default WalletConnect;
