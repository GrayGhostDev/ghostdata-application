import { useState, useCallback, useEffect } from "react";
import { utils, ContractInterface } from "ethers";
import { useContractWrite, useContract } from "@thirdweb-dev/react";
import { contractAddress, contractABI } from "@/utils/constants";

interface TransactionParams {
  to: string;
  value: string;
  data?: string;
}

function useSendTransaction(functionName: string) {
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { contract } = useContract(contractAddress, contractABI as ContractInterface);

  const {
    mutateAsync: sendTransaction,
    data: txResponse,
    error: txError,
    isLoading: txLoading,
  } = useContractWrite(contract, functionName);

  const handleSendTransaction = useCallback(
    async ({ to, value, data }: TransactionParams) => {
      setIsLoading(true);
      setError(null);

      try {
        const parsedValue = utils.parseEther(value);
        const result = await sendTransaction({ args: [to, parsedValue, data] });
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
      setError(txError as Error);
    }
  }, [txError]);

  return {
    sendTransaction: handleSendTransaction,
    txHash,
    error,
    isLoading: isLoading || txLoading,
  };
}

export default useSendTransaction;
