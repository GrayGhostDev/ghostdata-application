import { useState } from "react";
import axios from "axios";

const BASE_URL = "https://api-main.loandisk.com";
const PUBLIC_KEY = process.env.VITE_LOANDISK_PUBLIC_KEY as string;
const BRANCH_ID = process.env.VITE_LOANDISK_BRANCH_ID as string;
const AUTH_CODE = process.env.VITE_LOANDISK_AUTH_CODE as string;

const useLoanDiskApi = () => {
  const [borrowerData, setBorrowerData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBorrowerData = async (address: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/${PUBLIC_KEY}/${BRANCH_ID}/borrower_address/${address}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(AUTH_CODE)}`,
          },
        }
      );
      setBorrowerData(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { borrowerData, isLoading, error, fetchBorrowerData };
};

export default useLoanDiskApi;
