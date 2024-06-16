// /frontend/thirdweb/inAppWallet.js
import { inAppWallet as thirdwebInAppWallet } from "thirdweb/wallets";
import { Sepolia } from "thirdweb/chains";

const wallet = thirdwebInAppWallet({
  smartAccount: {
    chain: Sepolia,
    sponsorGas: false,
  },
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

wallet.createWallet = async () => {
  const newWallet = await thirdwebInAppWallet.createWallet();
  return newWallet;
};

export default wallet;
