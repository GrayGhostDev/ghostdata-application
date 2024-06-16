// src/hooks/useAddress.tsx
import { useState, useEffect } from "react";
import { useAddress as useThirdwebAddress } from "@thirdweb-dev/react";
import useLoanDiskApi from "../hooks/useLoanDiskApi";

const useAddress = () => {
  const { borrowerData, isLoading, error, fetchBorrowerData } = useLoanDiskApi();
  const [address, setAddress] = useState<string | null>(null);
  const thirdwebAddress = useThirdwebAddress();
  const [loanDiskApiConnected, setLoanDiskApiConnected] = useState(false);

  useEffect(() => {
    if (thirdwebAddress) {
      setAddress(thirdwebAddress);
      fetchBorrowerData(thirdwebAddress);
    } else {
      setAddress(null);
      setLoanDiskApiConnected(false);
    }
  }, [thirdwebAddress, fetchBorrowerData]);

  useEffect(() => {
    if (borrowerData) {
      setLoanDiskApiConnected(true);
    }
  }, [borrowerData, address]);

  return {
    address,
    borrowerData,
    loanDiskApiConnected,
    fetchBorrowerData,
    isLoading,
    error,
  };
};

export default useAddress;
