import React, { useEffect, useState } from "react";
import wallet from '../thirdweb/inAppWallet'; // Corrected import statement

const CreateWallet: React.FC = () => {
  const [isWalletInitialized, setIsWalletInitialized] = useState(false);

  useEffect(() => {
    const initWallet = async () => {
      setIsWalletInitialized(true);
    };
    initWallet();
  }, []);

  const createWallet = async () => {
    try {
      if (wallet) {
        const newWallet = await wallet.createWallet();
        console.log(newWallet);
      } else {
        console.error("Wallet not initialized yet.");
      }
    } catch (error) {
      console.error("Failed to create wallet:", error);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={createWallet}
        disabled={!isWalletInitialized}
        className="bg-secondary-color text-text-primary p-2 rounded-lg shadow-primary hover:filter-brightness"
      >
        Create Wallet
      </button>
    </div>
  );
};

export default CreateWallet;
