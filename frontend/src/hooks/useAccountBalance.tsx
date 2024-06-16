import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useSigner } from "@thirdweb-dev/react";
import { contractAddress, contractABI } from "@/utils/constants";

const useAccountBalance = () => {
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const signer = useSigner();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!signer) {
        setError(new Error("Signer is not available"));
        return;
      }

      setIsLoading(true);
      try {
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const balance = await contract.balanceOf(await signer.getAddress());
        setBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [signer]);

  return { balance, isLoading, error };
};

export default useAccountBalance;
