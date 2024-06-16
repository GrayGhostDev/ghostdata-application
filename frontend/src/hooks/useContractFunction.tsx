// src/hooks/useContractFunction.tsx

import { useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";
import { useThirdwebSDK } from "@thirdweb-dev/react";

interface ContractFunctionResult {
  data: any;
  isLoading: boolean;
  error: Error | null;
  callFunction: (...args: any[]) => Promise<void>;
}

const useContractFunction = (functionName: string): ContractFunctionResult => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const sdk = useThirdwebSDK();
  const contract = sdk.getContract(contractAddress, contractABI);

  const callFunction = async (...args: any[]) => {
    setIsLoading(true);
    try {
      const result = await contract.functions[functionName](...args);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    callFunction,
  };
};

export default useContractFunction;
