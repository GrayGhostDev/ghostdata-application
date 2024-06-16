import { InAppWallet as thirdwebInAppWallet } from "thirdweb/wallets";
import { Sepolia } from "thirdweb/chains";

const wallet = new thirdwebInAppWallet({
  smartAccount: {
    chain: Sepolia,
    sponsorGas: false,
  },
  metadata: {
    image: {
      src: "../../Image/logo/GGDataMan.svg", // Ensure this path is correct
      alt: "My logo",
      width: 100,
      height: 100,
    },
    hidePrivateKeyExport: true,
  },
});

wallet.createWallet = async function () {
  const newWallet = await this.createWallet();
  return newWallet;
};

export default wallet;
