// src/components/AssetTransferForm.tsx
import React, { useState, FormEvent } from "react";
import { useContract, useSigner } from "@thirdweb-dev/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import { contractABI, contractAddress } from "@/utils/constants";
import useContractFunction from "@/hooks/useContractFunction";

interface TransferDetails {
  recipient: string;
  tokenId: string;
}


const AssetTransferForm: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [toAddress, setToAddress] = useState("")
  const { data, isLoading, error, callFunction } = useContractFunction("transferAsset");
  const [transferDetails, setTransferDetails] = useState<TransferDetails>({
    recipient: "",
    tokenId: "",
  });
  const { contract } = useContract(contractAddress, contractABI);
  const signer = useSigner();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await callFunction(toAddress, amount);

    if (!contract || !signer) return; // Check if contract and signer are defined

    try {
      // Assuming the contract has a method like 'transferAsset'
      const tx = await contract.call("transferAsset", [
        transferDetails.recipient,
        transferDetails.tokenId,
      ]);
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
          value={toAddress}
          onChange={(e) =>
            setToAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Token ID"
          value={transferDetails.tokenId}
          onChange={(e) =>
            setTransferDetails({ ...transferDetails, tokenId: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="transfer details"
          value={transferDetails.recipient}
          onChange={(e) =>
            setTransferDetails({...transferDetails, recipient: e.target.value })
          }
        />
        <button type="submit" disabled={isLoading}>Transfer Asset</button>
      </form>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Result: {JSON.stringify(data)}</p>}
    </div>
  );
};

export default AssetTransferForm;
