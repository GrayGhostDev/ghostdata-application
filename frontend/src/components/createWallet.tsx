// /frontend/src/components/CreateWallet.tsx

import React from "react";
import wallet from "../thirdweb/inAppWallet"; // Adjust path as needed

export const CreateWallet: React.FC = () => {
  const createWallet = async () => {
    try {
      const newWallet = await wallet.createWallet();
      console.log(newWallet);
    } catch (error) {
      console.error("Failed to create wallet:", error);
    }
  };

  return (
    <div>
      <button onClick={createWallet}>Create Wallet</button>
    </div>
  );
};

export default CreateWallet;