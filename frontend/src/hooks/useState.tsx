import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useSigner } from "@thirdweb-dev/react";
import axios from "axios";
import {
  loandiskAPIBaseURL,
  loandiskAuthCode,
  contractABI,
  contractAddress,
} from "../utils/constants";
import { LoanDiskTransaction } from "@/context/TransactionsContext";

interface CustomEthereumTransaction
  extends ethers.providers.TransactionReceipt {
  amount: string;
  timestamp: string;
  message?: string;
}

const fetchLoanDiskTransactions = async (
  borrowerId: string
): Promise<LoanDiskTransaction[]> => {
  try {
    const response = await axios.get(
      `${loandiskAPIBaseURL}/transactions/${borrowerId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loandiskAuthCode}`,
        },
      }
    );

    if (!response.status || response.status >= 400) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching LoanDisk transactions:", error);
    throw error;
  }
};

const useCustomState = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loanDiskTransactions, setLoanDiskTransactions] = useState<
    LoanDiskTransaction[]
  >([]);
  const [ethTransactions, setEthTransactions] = useState<
    CustomEthereumTransaction[]
  >([]);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null
  );
  const [transactionError, setTransactionError] = useState<Error | null>(null);
  const signer = useSigner();

  const createEthereumContract = useCallback((): ethers.Contract => {
    if (!signer) {
      throw new Error("Signer not available");
    }
    return new ethers.Contract(contractAddress, contractABI, signer);
  }, [signer]);

  const fetchLoanDiskTransactionsCallback = useCallback(
    async (borrowerId: string): Promise<void> => {
      setIsLoading(true);
      try {
        const transactions = await fetchLoanDiskTransactions(borrowerId);
        setLoanDiskTransactions(transactions);
      } catch (error) {
        setTransactionError(error as Error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const recordTransaction = useCallback(
    async (amount: string, transactionType: string) => {
      try {
        if (!signer) return;
        setIsLoading(true);
        const contract = createEthereumContract();
        const transaction = await contract.recordTransaction(
          amount,
          transactionType
        );
        const receipt = await transaction.wait();
        setTransactionStatus("success");
        setEthTransactions((prevTransactions) => [
          ...prevTransactions,
          { ...receipt, amount, timestamp: new Date().toISOString() },
        ]);
      } catch (error) {
        console.error("Error recording transaction:", error);
        setTransactionStatus("error");
        setTransactionError(error as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [signer, createEthereumContract]
  );

  return {
    isLoading,
    loanDiskTransactions,
    ethTransactions,
    transactionStatus,
    transactionError,
    fetchLoanDiskTransactions: fetchLoanDiskTransactionsCallback,
    recordTransaction,
  };
};

export default useCustomState;
