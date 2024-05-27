// src/context/TransactionContext.ts
import React, { createContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { ethers } from "ethers";
import { useSigner } from "@thirdweb-dev/react";
import { contractABI, contractAddress } from "../utils/constants";

enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw"
}

export interface LoanDiskTransaction {
  transaction_id: string;
  borrower_id: string;
  transaction_date: string;
  transaction_type_id: number;
  transaction_amount: number;
  transaction_description?: string;
  transaction_balance?: number;
}

interface EthereumTransaction extends ethers.providers.TransactionReceipt {
  // You can extend this with additional properties if needed
}

interface TransactionsContextType {
  ethTransactions: ethers.providers.TransactionReceipt[];
  loanDiskTransactions: LoanDiskTransaction[];
  addEthTransaction: (tx: ethers.providers.TransactionReceipt) => void;
  fetchLoanDiskTransactions: () => Promise<void>;
  connectWallet: () => void;
  isLoading: boolean;
  transactionStatus: string | null;
  transactionError: Error | null;
  fetchTransactions: () => Promise<void>;
  recordTransaction: (amount: string, transactionType: TransactionType) => Promise<void>;
  createEthereumContract: () => ethers.Contract;
}

const TransactionContext = createContext<TransactionsContextType | undefined>(undefined);

interface TransactionsProviderProps {
  children: ReactNode;
}

// Mark the props as read-only
export function TransactionsProvider({ children }: Readonly<TransactionsProviderProps>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<LoanDiskTransaction[]>([]);
  const [ethTransactions, setEthTransactions] = useState<EthereumTransaction[]>([]);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [transactionError, setTransactionError] = useState<Error | null>(null);
  const signer = useSigner();

  const createEthereumContract = useCallback((): ethers.Contract => {
    if (!signer) {
      throw new Error("Signer not available");
    }
    return new ethers.Contract(contractAddress, contractABI, signer);
  }, [signer]);

  const fetchTransactions = useCallback(async (): Promise<void> => {
    try {
      const borrowerId = "YOUR_BORROWER_ID"; // Replace with the actual borrower ID
      const apiResponse = process.env.REACT_APP_LOANDISK_RESPONSE;
      const authCode = process.env.REACT_APP_LOANDISK_AUTH_CODE;

      if (!apiResponse || !authCode) {
        throw new Error("API response URL or auth code is not defined in environment variables");
      }

      const response = await fetch(`${apiResponse}/saving_transaction/borrower/${borrowerId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${authCode}`
        }
      });

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return;
      }

      const data: LoanDiskTransaction[] = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching LoanDisk transactions:", error);
    }
  }, []);

  const recordTransaction = useCallback(async (amount: string, transactionType: TransactionType) => {
    try {
      if (!signer) return;
      setIsLoading(true);
      const contract = createEthereumContract();
      const transaction = await contract.recordTransaction(amount, transactionType);
      setTransactionStatus("pending");

      const receipt: EthereumTransaction = await transaction.wait();
      setTransactionStatus("success");
      setEthTransactions((prevTransactions) => [...prevTransactions, receipt]);
      await fetchTransactions();
    } catch (error) {
      console.error("Error recording transaction:", error);
      setTransactionStatus("error");
      setTransactionError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [signer, createEthereumContract, fetchTransactions]);

  const addEthTransaction = useCallback((tx: ethers.providers.TransactionReceipt) => {
    setEthTransactions((prevTransactions) => [...prevTransactions, tx as EthereumTransaction]);
  }, []);

  const fetchLoanDiskTransactions = useCallback(async () => {
    setIsLoading(true);
    await fetchTransactions();
    setIsLoading(false);
  }, [fetchTransactions]);

  useEffect(() => {
    fetchLoanDiskTransactions();
  }, [fetchLoanDiskTransactions]);

  const connectWallet = useCallback(async () => {
    // Implement wallet connection logic if needed
  }, []);

  const contextValue = useMemo(() => ({
    ethTransactions,
    loanDiskTransactions: transactions,
    addEthTransaction,
    fetchLoanDiskTransactions,
    connectWallet,
    isLoading,
    transactionStatus,
    transactionError,
    fetchTransactions,
    recordTransaction,
    createEthereumContract
  }), [
    ethTransactions,
    transactions,
    addEthTransaction,
    fetchLoanDiskTransactions,
    connectWallet,
    isLoading,
    transactionStatus,
    transactionError,
    fetchTransactions,
    recordTransaction,
    createEthereumContract
  ]);

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
}

export { TransactionContext, TransactionType, };
export type { EthereumTransaction, TransactionsContextType };
