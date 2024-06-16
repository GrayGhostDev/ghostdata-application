// src/components/Transactions.tsx
import React from "react";
import { TransactionReceipt } from "@ethersproject/abstract-provider"; // Correct import
import { LoanDiskTransaction, useTransactions } from "./context/TransactionContext"; // Correct import
import useFetch from "../hooks/useFetch";
import { shortenAddress } from "../utils/shortenAddress";
import { ACTIVE_CHAIN_ID, NETWORKS } from "../utils/constants";
import Loader from "./Loader"; // Import your Loader component

// ... (Your interface and TransactionCard component)

const Transactions: React.FC = () => {
  const { ethTransactions, loandiskTransactions, isLoading } =
    useTransactions();

  // Combine transactions
  const allTransactions: (TransactionReceipt | LoanDiskTransaction)[] = [
    ...ethTransactions,
    ...loandiskTransactions,
  ];

  export const network = NETWORKS[ACTIVE_CHAIN_ID];
  const explorerUrl =
    network.chainId === 1
      ? "https://etherscan.io/"
      : "https://sepolia.etherscan.io/";

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
                    addressTo={ethTx.to}
                    addressFrom={ethTx.from}
                    timestamp={new Date(
                      ethTx.blockNumber * 1000
                    ).toLocaleString()}
                    message="" // Add message logic if available
                    keyword="ETH"
                    amount={ethTx.value.toString()}
                    transactionHash={ethTx.transactionHash}
                  />
                );
              } else {
                // It's a LoanDisk transaction
                return <TransactionsCard key={i} {...transaction} />;
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
