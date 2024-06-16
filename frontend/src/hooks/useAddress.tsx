import { useState, useEffect } from "react";
import { useAddress as useThirdwebAddress } from "@thirdweb-dev/react";
import useLoanDiskApi from "./useLoanDiskApi";

const useAddress = () => {
  const { borrowerData, isLoading, error, fetchBorrowerData } = useLoanDiskApi();
  const [address, setAddress] = useState<string | null>(null);
  const thirdwebAddress = useThirdwebAddress();

  useEffect(() => {
    if (thirdwebAddress) {
      setAddress(thirdwebAddress);
      fetchBorrowerData(thirdwebAddress);
    } else {
      setAddress(null);
    }
  }, [thirdwebAddress, fetchBorrowerData]);

  return {
    address,
    borrowerData,
    isLoading,
    error,
  };
};

export default useAddress;
