import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { useContractWrite, useWatchTransactions } from "@thirdweb-dev/react";
import { contractAddress, contractABI } from "../utils/constants";

interface TransactionParams {
  to: string;
  value: string;
  data?: string;
}

function useTransaction() {
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutateAsync: sendTransaction, data: txResponse } = useContractWrite(
    contractAddress,
    contractABI as ethers.ContractInterface,
    "recordTransaction"
  );

  const { status, error: txError } = useWatchTransactions({
    hash: txResponse?.receipt.transactionHash,
  });

  const handleSendTransaction = useCallback(
    async ({ to, value, data }: TransactionParams) => {
      setIsLoading(true);
      setError(null);

      try {
        const parsedValue = ethers.utils.parseEther(value);

        const result = await sendTransaction({
          args: [to, parsedValue, data],
        });
        setTxHash(result.receipt.transactionHash);
      } catch (err) {
        setError(err as Error);
        console.error("Transaction failed:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [sendTransaction]
  );

  useEffect(() => {
    if (txError) {
      setError(txError);
    }
  }, [txError]);

  return {
    sendTransaction: handleSendTransaction,
    txHash,
    error,
    isLoading: isLoading || status === "loading",
  };
}

export default useTransactions;
