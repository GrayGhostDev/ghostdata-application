import { useState, useEffect } from "react";
import { ethers, ContractInterface } from "ethers";
import { useSigner } from "@thirdweb-dev/react";
import { contractAddress, contractABI } from "../utils/constants";

const useContract = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const { data: signer } = useSigner();

  useEffect(() => {
    const initializeContract = async () => {
      if (!signer) return;

      try {
        const contractInstance = new ethers.Contract(contractAddress, contractABI as ContractInterface, signer);
        setContract(contractInstance);
      } catch (error) {
        console.error("Failed to create contract instance:", error);
      }
    };

    initializeContract();
  }, [signer]);

  return contract;
};

export default useContract;
