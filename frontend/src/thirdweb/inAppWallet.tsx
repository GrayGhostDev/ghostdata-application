// /frontend/src/thirdweb/inAppWallet.tsx

// /frontend/src/thirdweb/inAppWallet.tsx

import React, { useState, useEffect } from "react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Sepolia } from "@thirdweb-dev/chains";
import { InAppWallet } from "@thirdweb-dev/react-native";

interface WalletMetadata {
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  hidePrivateKeyExport: boolean;
}

interface CreateWalletProps {
  chain: any;
  sponsorGas: boolean;
  metadata: WalletMetadata;
}

const InAppWalletComponent: React.FC = () => {
  const [wallet, setWallet] = useState<InAppWallet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeWallet = async () => {
      try {
        const sdk = new ThirdwebSDK(Sepolia);
        const inAppWallet = sdk.wallet.inApp(); 
        setWallet(inAppWallet);
      } catch (err: unknown) {
        handleError(err, "Error initializing wallet:");
      } finally {
        setIsLoading(false);
      }
    };
    initializeWallet();
  }, []);

  const createWallet = async (props: CreateWalletProps) => {
    try {
      if (!wallet) {
        throw new Error("Wallet not yet initialized");
      }
      const newWallet = await wallet.connect();
      console.log("Created wallet:", newWallet); // Optional: Log for debugging
      return newWallet; // Return the created wallet for further use
    } catch (err: unknown) {
      handleError(err, "Failed to create wallet:");
      throw err; // Re-throw the error to handle it at a higher level if needed
    }
  };

  const handleError = (err: unknown, prefix: string) => {
    if (err instanceof Error) {
      setError(err);
    } else {
      setError(new Error(`${prefix} ${err}`));
    }
    console.error(prefix, err);
  };

  return (
    <div>
      <button onClick={() => createWallet({
        chain: Sepolia,
        sponsorGas: false,
        metadata: {
          image: {
            src: "../../Image/logo/GGDataMan.svg",
            alt: "My logo",
            width: 100,
            height: 100,
          },
          hidePrivateKeyExport: true,
        },
      })}>
        Create Wallet
      </button>
    </div>
  );
};

export default InAppWalletComponent;
