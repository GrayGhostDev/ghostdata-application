// src/utils/loandiskEndpoints.ts

import axios from 'axios';

const BASE_URL = "https://api-main.loandisk.com";
const PUBLIC_KEY = process.env.VITE_LOANDISK_PUBLIC_KEY as string;
const BRANCH_ID = process.env.VITE_LOANDISK_BRANCH_ID as string;
const AUTH_CODE = process.env.VITE_LOANDISK_AUTH_CODE as string;

const loandiskAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${btoa(`${PUBLIC_KEY}:${AUTH_CODE}`)}`,
  },
});

export const getBorrowerDataByAddress = async (address: string) => {
  try {
    const response = await loandiskAPI.get(`/borrower_address/${address}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching borrower data by address:", error);
    throw error;
  }
};

export const getTransactionsByBorrowerId = async (borrowerId: string) => {
  try {
    const response = await loandiskAPI.get(`/borrower_transactions/${borrowerId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions by borrower ID:", error);
    throw error;
  }
};

// Additional endpoints can be added here as needed
