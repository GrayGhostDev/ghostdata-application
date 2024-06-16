import axios from "axios";
import logger from "../../../server/src/utils/logger.js";

// Base URL and Auth Code from environment variables
const LOANDISK_BASE_URL = process.env.VITE_LOANDISK_BASE_URL;
const LOANDISK_AUTH_CODE = process.env.VITE_LOANDISK_AUTH_CODE;

// Check for missing environment variables
if (!LOANDISK_BASE_URL || !LOANDISK_AUTH_CODE) {
  throw new Error("Missing environment variables for LoanDisk API");
}

// Setting up default headers for axios
axios.defaults.headers.common["Authorization"] = `Bearer ${LOANDISK_AUTH_CODE}`;
axios.defaults.headers.common["Content-Type"] = "application/json";

// Function to list transactions with pagination support
export const listTransactions = async (page: number, limit: number) => {
  try {
    const response = await axios.get(`${LOANDISK_BASE_URL}/transactions`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    logger.error("Error fetching transactions:", error);
    throw error;
  }
};

// Function to get a specific transaction by ID
export const getTransaction = async (id: string) => {
  try {
    const response = await axios.get(`${LOANDISK_BASE_URL}/transactions/${id}`);
    return response.data;
  } catch (error) {
    logger.error(`Error fetching transaction with ID ${id}:`, error);
    throw error;
  }
};

// Function to create a new transaction
export const createTransaction = async (transactionData: any) => {
  try {
    const response = await axios.post(
      `${LOANDISK_BASE_URL}/transactions`,
      transactionData
    );
    return response.data;
  } catch (error) {
    logger.error("Error creating transaction:", error);
    throw error;
  }
};

// Function to update an existing transaction by ID
export const updateTransaction = async (id: string, transactionData: any) => {
  try {
    const response = await axios.put(
      `${LOANDISK_BASE_URL}/transactions/${id}`,
      transactionData
    );
    return response.data;
  } catch (error) {
    logger.error(`Error updating transaction with ID ${id}:`, error);
    throw error;
  }
};

// Function to cancel a transaction by ID
export const cancelTransaction = async (id: string) => {
  try {
    const response = await axios.post(
      `${LOANDISK_BASE_URL}/transactions/${id}/cancel`
    );
    return response.data;
  } catch (error) {
    logger.error(`Error canceling transaction with ID ${id}:`, error);
    throw error;
  }
};

// Function to get transaction types
export const getTransactionTypes = async () => {
  try {
    const response = await axios.get(`${LOANDISK_BASE_URL}/transaction-types`);
    return response.data;
  } catch (error) {
    logger.error("Error fetching transaction types:", error);
    throw error;
  }
};

// Function to get transaction statistics
export const getTransactionStatistics = async () => {
  try {
    const response = await axios.get(
      `${LOANDISK_BASE_URL}/transactions/statistics`
    );
    return response.data;
  } catch (error) {
    logger.error("Error fetching transaction statistics:", error);
    throw error;
  }
};
