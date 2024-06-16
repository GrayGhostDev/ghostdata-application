// src/components/AssetTransferForm.tsx
import React, { useState, FormEvent } from "react";
import { useContract, useSigner } from "@thirdweb-dev/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import { contractABI, contractAddress } from "../utils/constants";

interface TransferDetails {
  recipient: string;
  tokenId: string;
}

const AssetTransferForm: React.FC = () => {
  const [transferDetails, setTransferDetails] = useState<TransferDetails>({ recipient: "", tokenId: "" });
  const { contract } = useContract(contractAddress, contractABI);
  const { data: signer } = useSigner();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!contract || !signer) return; // Check if contract and signer are defined

    try {
      // Assuming the contract has a method like 'transferAsset'
      const tx = await contract.call("transferAsset", [transferDetails.recipient, transferDetails.tokenId]);
      const receipt = await tx.wait();
      console.log(receipt);
    } catch (error) {
      console.error("Error transferring asset:", error);
    }
  };

  return (
    <div>
      <h2>Transfer Your Asset</h2>
      <ConnectWallet />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Recipient Address"
          value={transferDetails.recipient}
          onChange={(e) =>
            setTransferDetails({ ...transferDetails, recipient: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Token ID"
          value={transferDetails.tokenId}
          onChange={(e) =>
            setTransferDetails({ ...transferDetails, tokenId: e.target.value })
          }
        />
        <button type="submit">
          Transfer Asset
        </button>
      </form>
    </div>
  );
};

export default AssetTransferForm;
