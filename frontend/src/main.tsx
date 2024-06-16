// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import App from "./App";
import { TransactionsProvider } from "./hooks/useTransactions";
import ToastConfig from "./ToastConfig";
import "./styles/tailwind.css";
import "./styles/index.css";

const supportedChains = [
  {
    chainId: ChainId.Mainnet,
    rpc: ["https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"],
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    explorers: [{ name: "Etherscan", url: "https://etherscan.io" }],
  },
  {
    chainId: ChainId.Rinkeby,
    rpc: ["https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID"],
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    explorers: [{ name: "Etherscan", url: "https://rinkeby.etherscan.io" }],
  },
  // You can add other supported chains here.
];

const ACTIVE_CHAIN_ID = ChainId.Mainnet;

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ThirdwebProvider supportedChains={supportedChains} activeChain={ACTIVE_CHAIN_ID}>
        <TransactionsProvider>
          <App />
          <ToastConfig />
        </TransactionsProvider>
      </ThirdwebProvider>
    </React.StrictMode>
  );
} else {
  console.error("Error: Container element with ID 'root' not found.");
}
