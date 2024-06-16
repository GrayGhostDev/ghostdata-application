// /frontend/src/components/CreateWallet.tsx

import React from "react";
import createWallet from "../thirdweb/inAppWallet"; // Adjust path as needed

export const CreateWallet: React.FC = () => {
  const handleCreateWallet = async () => {
    try {
      const newWallet = await createWallet();
      console.log(newWallet);
    } catch (error) {
      console.error("Failed to create wallet:", error);
    }
  };

  return (
    <div>
      <button onClick={handleCreateWallet}>Create Wallet</button>
    </div>
  );
};

export default CreateWallet;
