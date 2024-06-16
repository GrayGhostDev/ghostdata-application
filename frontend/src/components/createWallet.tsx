// /frontend/src/components/CreateWallet.tsx

import React from "react";
import { createWallet } from "../thirdweb/inAppWallet"; // Adjust path as needed
import { Sepolia } from "@thirdweb-dev/chains";

const CreateWallet: React.FC = () => {
  const handleCreateWallet = async () => {
    try {
      const newWallet = await createWallet({
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
      });
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
