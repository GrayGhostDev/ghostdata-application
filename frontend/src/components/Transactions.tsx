// /frontend/src/components/Transactions.tsx

import React from "react";
import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { useTransactions } from "@/hooks/useTransactions";
import { LoanDiskTransaction } from "@/context/TransactionsContext"; // Correct import
import Loader from "./Loader";
import TransactionsCard from "@/components/TransactionsCard"; // Import your Loader component

const Transactions: React.FC = () => {
  const { ethTransactions, loanDiskTransactions, isLoading } =
    useTransactions();

  // Combine transactions
  const allTransactions: (TransactionReceipt | LoanDiskTransaction)[] = [
    ...ethTransactions,
    ...loanDiskTransactions,
  ];

  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        <h3 className="text-white text-3xl text-center my-2">
          Latest Transactions
        </h3>

        {isLoading ? (
          <Loader message="Loading Transactions..." /> // Show Loader while loading
        ) : allTransactions.length > 0 ? (
          <div className="flex flex-wrap justify-center items-center mt-10">
            {allTransactions.map((transaction, i) => {
              if ("transactionHash" in transaction) {
                // It's an Ethereum transaction
                const ethTx = transaction as TransactionReceipt;
                return (
                  <TransactionsCard
                    key={i}
                    addressTo={ethTx.to ?? ""}
                    addressFrom={ethTx.from ?? ""}
                    timestamp={new Date(
                      ethTx.blockNumber * 1000
                    ).toLocaleString()}
                    message="" // Add message logic if available
                    keyword="ETH"
                    amount={ethTx.effectiveGasPrice?.toString() ?? "0"} // Change this line
                    transactionHash={ethTx.transactionHash}
                  />
                );
              } else {
                // It's a LoanDisk transaction
                const loanDiskTx = transaction as LoanDiskTransaction;
                return (
                  <TransactionsCard
                    key={i}
                    addressTo={loanDiskTx.borrower_id}
                    addressFrom="LoanDisk"
                    timestamp={new Date(
                      loanDiskTx.transaction_date
                    ).toLocaleString()}
                    message={loanDiskTx.transaction_description || ""}
                    keyword="LOAN"
                    amount={loanDiskTx.transaction_amount.toString()}
                    transactionHash={loanDiskTx.transaction_id}
                  />
                );
              }
            })}
          </div>
        ) : (
          <p className="text-white text-center">No transactions to display.</p>
        )}
      </div>
    </div>
  );
};

export default Transactions;
