// src/components/TransactionsProvider.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { ethers } from "ethers";
import { useSigner, useContractRead, useAccount, useContractWrite } from "@thirdweb-dev/react";
import { contractAddress, contractABI, LOAN_DISK_ENDPOINTS } from "../utils/constants";
import { LoanDiskTransaction } from "./TransactionsContext";
import { readContract, getContractEvents } from "thirdweb";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

interface TransactionsProviderProps {
  children: ReactNode;
}

interface TransactionsContextType {
  ethTransactions: ethers.providers.TransactionReceipt[];
  loanDiskTransactions: LoanDiskTransaction[];
  isLoading: boolean;
  fetchLoanDiskTransactions: (loanDiskAccountId: string) => Promise<void>;
  createEthereumContract: () => ethers.Contract;
  connectWallet: () => Promise<void>;
}

const TransactionContext = createContext<TransactionsContextType | undefined>(undefined);

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionsProvider");
  }
  return context;
}

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savingTransactions, setSavingTransactions] = useState<LoanDiskTransaction[]>([]);
  const [ethTransactions, setEthTransactions] = useState<ethers.providers.TransactionReceipt[]>([]);
  const address = useAccount()?.address;
  const signer = useSigner();

  // Read Transactions from smart contract
  const { data: rawEthTransactions, isLoading: ethTxLoading } = useContractRead(
    contractAddress,
    contractABI,
    "transactions",
    [0] // Assuming you want to fetch the first transaction initially
  );

  // convert transactions data to correct type
  useEffect(() => {
    if (rawEthTransactions) {
      const _ethTransactions = (rawEthTransactions as any[]).map(
        (transaction: any) => ({
          transactionId: transaction[0].toNumber(),
          amount: transaction[1].toNumber(),
          transactionType: transaction[2],
        })
      );
      setEthTransactions(_ethTransactions);
    }
  }, [rawEthTransactions]);

  // Helper function to create a new Ethereum contract instance
  const createEthereumContract = () => {
    if (signer) {
      return new ethers.Contract(contractAddress, contractABI, signer);
    } else {
      throw new Error("Signer not available");
    }
  };

  const connectWallet = async () => {
    // ... wallet connection logic if needed ...
  };

  const fetchSavingTransactions = async (loanDiskAccountId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/loandisk/transactions?userAddress=${address}&chainId=${11155111}&loanDiskAccountId=${loanDiskAccountId}`,
        { method: "GET" }
      );
      if (response.ok) {
        const data = await response.json();
        setSavingTransactions(data.transactions || []);
      } else {
        const error = await response.text();
        console.error("Error fetching LoanDisk transactions:", error);
      }
    } catch (error) {
      console.error("Error fetching LoanDisk transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      // Fetch transactions when the user's address is available
      fetchSavingTransactions(address); // Assuming LoanDisk Account ID is the same as the user's address
    }
  }, [address]);

  // Wrap the context value in useMemo for optimization
  const contextValue = React.useMemo(
    () => ({
      ethTransactions,
      savingTransactions,
      connectWallet,
      isLoading: isLoading || ethTxLoading,
      fetchSavingTransactions,
      createEthereumContract,
    }),
    [ethTransactions, savingTransactions, isLoading, ethTxLoading]
  );

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
}
