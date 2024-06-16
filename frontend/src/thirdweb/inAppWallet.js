// /frontend/thirdweb/inAppWallet.js
import { createWallet as thirdwebCreateWallet } from "thirdweb";  // Adjust the import based on the actual API provided
import { Sepolia } from "thirdweb/chains";

const createWallet = async () => {
  const wallet = await thirdwebCreateWallet({
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
  return wallet;
};

export default createWallet;
