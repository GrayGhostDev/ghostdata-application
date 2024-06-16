// src/hooks/useAddress.tsx
import { useState, useEffect } from "react";
import { useAddress as useThirdwebAddress, useThirdwebConnectedWalletContext } from "@thirdweb-dev/react";
import useLoanDiskApi from "./useLoanDiskApi"
import axios from "axios";


const useAddress = () => {
  const [loanDiskApiConnected, setLoanDiskApiConnected] = useState(false);
  const [loanDiskData, setLoanDiskData] = useState(null);
  const address = useThirdwebAddress();


  useEffect(() => {
    if (address) {
      const loandiskAPI = useLoanDiskApi();
      axios
        .get(`https://api.loandisk.com/user/${address}`)
        .then((response) => {
          setLoanDiskData(response.data);
          setLoanDiskApiConnected(true);
        })
        .catch((error) => {
          console.error("Error connecting to LoanDisk API:", error);
          setLoanDiskApiConnected(false);
        });
    }
  }, [address]);

  return {
    address,
    loanDiskApiConnected,
    loanDiskData,
  };
};

export default useAddress;
