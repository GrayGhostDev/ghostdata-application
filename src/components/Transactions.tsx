// src/components/Transactions.tsx

import React from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { shortenAddress } from '../utils/shortenAddress';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import Loader from './Loader';
import { ACTIVE_CHAIN_ID, NETWORKS } from '../utils/constants';
import useFetch from '../hooks/useFetch'; // Assuming you have a custom hook for fetching GIFs
import { LoanDiskTransaction } from '../context/TransactionContext'; // Ensure correct import

interface TransactionCardProps {
  addressTo: string;
  addressFrom: string;
  timestamp: string;
  message: string;
  keyword: string;
  amount: string;
  url?: string;
  transactionHash?: string;
}

const TransactionsCard: React.FC<TransactionCardProps> = ({ addressTo, addressFrom, timestamp, message, keyword, amount, url, transactionHash }) => {
  const gifUrl = useFetch({ keyword });
  const network = NETWORKS[ACTIVE_CHAIN_ID as keyof typeof NETWORKS];
  const explorerUrl = network.chainId === 1 ? "https://etherscan.io/" : "https://sepolia.etherscan.io/";
  const transactionHashLink = transactionHash ? (
    <a href={`${explorerUrl}/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
      {shortenAddress(transactionHash)}
    </a>
  ) : (
    <span className="text-gray-400">Pending...</span>
  );

  return (
    <div className="bg-[#181918] m-4 flex flex-1 2xl:min-w-[450px] 2xl:max-w-[500px] sm:min-w-[270px] sm:max-w-[300px] min-w-full flex-col p-3 rounded-md hover:shadow-2xl">
      <div className="flex flex-col items-center w-full mt-3">
        <div className="display-flex justify-start w-full mb-6 p-2">
          <a href={`${explorerUrl}/address/${addressFrom}`} target="_blank" rel="noreferrer">
            <p className="text-white text-base">From: {shortenAddress(addressFrom)}</p>
          </a>
          <a href={`${explorerUrl}/address/${addressTo}`} target="_blank" rel="noreferrer">
            <p className="text-white text-base">To: {shortenAddress(addressTo)}</p>
          </a>
          <p className="text-white text-base">Amount: {amount}</p>
          {message && (
            <>
              <br />
              <p className="text-white text-base">Message: {message}</p>
            </>
          )}
          <br />
          <p className="text-white text-base">TxHash: {transactionHashLink}</p>
        </div>
        <img
          src={gifUrl}
          alt="nature"
          className="w-full h-64 2xl:h-96 rounded-md shadow-lg object-cover"
        />
        <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
          <p className="text-[#37c7da] font-bold">{timestamp}</p>
        </div>
      </div>
    </div>
  );
};

const Transactions: React.FC = () => {
  const { ethTransactions, loanDiskTransactions, isLoading } = useTransactions();

  // Combine transactions
  const allTransactions: (TransactionReceipt | LoanDiskTransaction)[] = [
    ...ethTransactions,
    ...loanDiskTransactions,
  ];

  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        <h3 className="text-white text-3xl text-center my-2">Latest Transactions</h3>

        {isLoading ? (
          <Loader />
        ) : allTransactions.length > 0 ? (
          <div className="flex flex-wrap justify-center items-center mt-10">
            {allTransactions.map((transaction, i) => {
              if ('transactionHash' in transaction) {
                const ethTx = transaction as TransactionReceipt;
                return (
                  <TransactionsCard
                    key={i}
                    addressTo={ethTx.to || ""}
                    addressFrom={ethTx.from || ""}
                    timestamp={new Date(ethTx.blockNumber * 1000).toLocaleString()}
                    message=""
                    keyword="ETH"
                    amount={ethTx.value.toString()}
                    transactionHash={ethTx.transactionHash}
                  />
                );
              } else {
                const loanDiskTx = transaction as LoanDiskTransaction;
                return (
                  <TransactionsCard
                    key={i}
                    addressTo={loanDiskTx.addressTo}
                    addressFrom={loanDiskTx.addressFrom}
                    timestamp={loanDiskTx.timestamp}
                    message={loanDiskTx.message}
                    keyword={loanDiskTx.keyword}
                    amount={loanDiskTx.amount}
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
