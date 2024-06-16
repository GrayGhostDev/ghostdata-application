// src/components/TransactionsCard.tsx
import React from "react";

interface TransactionsCardProps {
  addressTo: string;
  addressFrom: string;
  timestamp: string;
  message: string;
  keyword: string;
  amount: string;
  transactionHash: string;
}

const TransactionsCard: React.FC<TransactionsCardProps> = ({
  addressTo,
  addressFrom,
  timestamp,
  message,
  keyword,
  amount,
  transactionHash,
}) => {
  return (
    <div
      className="bg-white m-4 flex flex-1
      2xl:min-w-[450px]
      2xl:max-w-[500px]
      sm:min-w-[270px]
      sm:max-w-[300px]
      min-w-full
      flex-col p-3 rounded-md hover:shadow-2xl"
    >
      <div className="flex flex-col items-start w-full mt-3">
        <p className="text-black text-base">From: {addressFrom}</p>
        <p className="text-black text-base">To: {addressTo}</p>
        <p className="text-black text-base">
          Amount: {amount} {keyword}
        </p>
        <p className="text-black text-base">Hash: {transactionHash}</p>
        <p className="text-black text-base">Timestamp: {timestamp}</p>
        {message && (
          <>
            <br />
            <p className="text-black text-base">Message: {message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionsCard;
