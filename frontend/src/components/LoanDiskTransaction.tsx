// src/components/LoanDiskTransaction.tsx
import React, { useState, FormEvent } from "react";
import { useTransactions } from "../hooks/useTransactions";
import useLoanDiskApi from "../hooks/useLoanDiskApi";

interface LoanDiskTransactionProps {
  transactionId: string;
  details: string;
}

const LoanDiskTransaction: React.FC<LoanDiskTransactionProps> = () => {
  const { transactions, addTransaction } = useTransactions();
  const [formData, setFormData] = useState({
    transactionId: "",
    details: "",
  });
  const { fetchBorrowerData, borrowerData, isLoading, error } = useLoanDiskApi();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTransaction(formData.transactionId, formData.details);
    fetchBorrowerData(formData.details); // Assuming 'details' contains the borrower email or relevant info
  };

  return (
    <div>
      <h2>Loan Disk Transactions</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="transactionId"
          placeholder="Transaction ID"
          value={formData.transactionId}
          onChange={handleChange}
        />
        <input
          type="text"
          name="details"
          placeholder="Details"
          value={formData.details}
          onChange={handleChange}
        />
        <button type="submit">Add Transaction</button>
      </form>
      <div>
        <h3>Existing Transactions</h3>
        <ul>
          {transactions.map((tx, index) => (
            <li key={index}>
              {tx.transactionId}: {tx.details}
            </li>
          ))}
        </ul>
      </div>
      {isLoading && <p>Loading borrower data...</p>}
      {error && <p>Error: {error.message}</p>}
      {borrowerData && (
        <div>
          <h3>Borrower Data</h3>
          <pre>{JSON.stringify(borrowerData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default LoanDiskTransaction;
