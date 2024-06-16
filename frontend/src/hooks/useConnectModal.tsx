import { useState } from "react";
import { useMetamask } from "@thirdweb-dev/react";

const useConnectModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const connectWithMetamask = useMetamask();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const connectWallet = async () => {
    try {
      await connectWithMetamask();
      closeModal();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return {
    isOpen,
    openModal,
    closeModal,
    connectWallet,
  };
};

export default useConnectModal;
