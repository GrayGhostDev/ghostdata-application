import React, { useState, useEffect, useContext, createContext, ReactNode } from "react";
import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";
import axios from "axios";

export interface LoanDiskTransaction {
  transaction_id: string;
  borrower_id: string;
  transaction_date: string;
  transaction_type_id: number;
  transaction_amount: number;
  transaction_description?: string;
  transaction_balance?: number;
}

interface TransactionsContextType {
  ethTransactions: TransactionReceipt[];
  loanDiskTransactions: LoanDiskTransaction[];
  fetchSavingTransactions: (accountId: string) => Promise<void>;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  currentAccount: string | null;
  recordTransaction: (
    amount: string,
    to: string,
    message: string
  ) => Promise<void>;
  addTransaction: (transactionId: string, details: string) => void;
  transactions: { transactionId: string; details: string }[];
}

interface TransactionsProviderProps {
  children: ReactNode;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionsProvider"
    );
  }
  return context;
};

export const TransactionsProvider: React.FC<TransactionsProviderProps> = ({
  children,
}) => {
  const [ethTransactions, setEthTransactions] = useState<TransactionReceipt[]>(
    []
  );
  const [loanDiskTransactions, setLoanDiskTransactions] = useState<
    LoanDiskTransaction[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<
    { transactionId: string; details: string }[]
  >([]);

  const fetchSavingTransactions = async (accountId: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.loandisk.com/user/${accountId}/transactions`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(
              `${process.env.VITE_LOANDISK_AUTH_CODE ?? ""}`
            )}`,
          },
        }
      );
      setLoanDiskTransactions(response.data);
    } catch (error) {
      console.error("Error fetching LoanDisk transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const recordTransaction = async (
    amount: string,
    to: string,
    message: string
  ) => {
    if (!currentAccount || !window.ethereum) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const transaction = await contract.recordTransaction(
        ethers.utils.parseEther(amount),
        to,
        message
      );
      const receipt: TransactionReceipt = await transaction.wait();
      setEthTransactions((prev) => [...prev, receipt]);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const addTransaction = (transactionId: string, details: string) => {
    setTransactions([...transactions, { transactionId, details }]);
  };

  useEffect(() => {
    if (currentAccount) {
      fetchSavingTransactions(currentAccount);
    }
  }, [currentAccount]);

  return (
    <TransactionsContext.Provider
      value={{
        ethTransactions,
        loanDiskTransactions,
        fetchSavingTransactions,
        isLoading,
        connectWallet,
        currentAccount,
        recordTransaction,
        addTransaction,
        transactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export default useTransactions;
