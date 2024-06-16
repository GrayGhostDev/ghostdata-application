// src/utils/mockLoanData.ts
import { LoanDiskTransaction } from "../context/TransactionsContext";

// Example mock data for LoanDisk transactions
const mockLoanData: LoanDiskTransaction[] = [
  {
    transaction_id: "1",
    borrower_id: "user123",
    transaction_date: "2023-01-01T00:00:00Z",
    transaction_type_id: 1, // Assuming 1 represents deposit
    transaction_amount: 1000,
    transaction_description: "Initial deposit",
    transaction_balance: 1000,
  },
  {
    transaction_id: "2",
    borrower_id: "user123",
    transaction_date: "2023-01-15T00:00:00Z",
    transaction_type_id: 2, // Assuming 2 represents withdrawal
    transaction_amount: 500,
    transaction_description: "ATM withdrawal",
    transaction_balance: 500,
  },
  {
    transaction_id: "3",
    borrower_id: "user123",
    transaction_date: "2023-02-01T00:00:00Z",
    transaction_type_id: 1,
    transaction_amount: 2000,
    transaction_description: "Salary deposit",
    transaction_balance: 2500,
  },
  {
    transaction_id: "4",
    borrower_id: "user123",
    transaction_date: "2023-02-10T00:00:00Z",
    transaction_type_id: 2,
    transaction_amount: 300,
    transaction_description: "Grocery shopping",
    transaction_balance: 2200,
  },
];

export default mockLoanData;
