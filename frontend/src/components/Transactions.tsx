// /frontend/src/components/Transactions.tsx

import React, { useState } from "react";
import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { useTransactions } from "@/hooks/useTransactions";
import { LoanDiskTransaction } from "@/context/TransactionsContext";
import Loader from "./Loader";
import TransactionsCard from "@/components/TransactionsCard";
import Pagination from "./Pagination";

// Define types for transaction data
interface TransactionData {
  addressTo: string;
  addressFrom: string;
  timestamp: string;
  message: string;
  amount: string;
  transactionHash: string;
}

const Transactions: React.FC = () => {
  const { ethTransactions, loanDiskTransactions, isLoading } = useTransactions();
  const allTransactions: (TransactionReceipt | LoanDiskTransaction)[] = [
    ...ethTransactions,
    ...loanDiskTransactions,
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = allTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderTransactionCard = (transaction: TransactionReceipt | LoanDiskTransaction) => {
    // Type narrowing without assertion
    const ethTx = transaction as TransactionReceipt;
    const loanDiskTx = transaction as LoanDiskTransaction;

    // Conditional extraction
    const transactionData: TransactionData = "transactionHash" in transaction
      ? { // Handle EthTransaction
          addressTo: ethTx.to ?? "",
          addressFrom: ethTx.from ?? "",
          timestamp: new Date(ethTx.blockNumber * 1000).toLocaleString(),
          message: "",
          amount: ethTx.effectiveGasPrice?.toString() ?? "0",
          transactionHash: ethTx.transactionHash,
        }
      : { // Handle LoanDiskTransaction
          addressTo: loanDiskTx.borrower_id,
          addressFrom: "LoanDisk",
          timestamp: new Date(loanDiskTx.transaction_date).toLocaleString(),
          message: loanDiskTx.transaction_description ?? "",
          amount: loanDiskTx.transaction_amount.toString(),
          transactionHash: loanDiskTx.transaction_id,
        };

    return (
      <TransactionsCard
        key={transactionData.transactionHash}
        addressTo={transactionData.addressTo}
        addressFrom={transactionData.addressFrom}
        timestamp={transactionData.timestamp}
        message={transactionData.message}
        keyword={transaction ? "ETH" : "LOAN"}
        amount={transactionData.amount}
        transactionHash={transactionData.transactionHash}
      />
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader message="Loading Transactions..." />;
    }

    if (allTransactions.length > 0) {
      return (
        <>
          <div className="flex flex-wrap justify-center items-center mt-10">
            {currentTransactions.map(renderTransactionCard)}
          </div>
          <Pagination
            transactionsPerPage={transactionsPerPage}
            totalTransactions={allTransactions.length}
            paginate={paginate}
          />
        </>
      );
    }

    return <p className="text-white text-center">No transactions to display.</p>;
  };

  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        <h3 className="text-white text-3xl text-center my-2">Latest Transactions</h3>
        {renderContent()}
      </div>
    </div>
  );
};

export default Transactions;
