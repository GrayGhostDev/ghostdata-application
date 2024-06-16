// src/components/AssetTokenization.tsx
import React, { useState, FormEvent } from "react";
import { useContract, useSigner } from "@thirdweb-dev/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import { contractABI, contractAddress } from "@/utils/constants";

interface AssetDetails {
  name: string;
  description: string;
}

const AssetTokenization: React.FC = () => {
  const [assetDetails, setAssetDetails] = useState<AssetDetails>({
    name: "",
    description: "",
  });
  const { contract } = useContract(contractAddress, contractABI);
  const signer= useSigner();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!contract || !signer) return; // Check contract and signer are defined

    try {
      // Assuming the contract has a method like 'tokenizeAsset'
      const tx = await contract.call("tokenizeAsset", [
        assetDetails.name,
        assetDetails.description,
      ]);
      const receipt = await tx.wait();
      console.log(receipt);
    } catch (error) {
      console.error("Error tokenizing asset:", error);
    }
  };

  return (
    <div>
      <h2>Tokenize Your Asset</h2>
      <ConnectWallet />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Asset Name"
          value={assetDetails.name}
          onChange={(e) =>
            setAssetDetails({ ...assetDetails, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Asset Description"
          value={assetDetails.description}
          onChange={(e) =>
            setAssetDetails({ ...assetDetails, description: e.target.value })
          }
        />
        <button type="submit">Tokenize Asset</button>
      </form>
    </div>
  );
};

export default AssetTokenization;
