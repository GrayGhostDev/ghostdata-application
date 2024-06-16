// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ZMainnet, Rinkeby } from "@thirdweb-dev/chains";
import App from "./App";
import { TransactionsProvider } from "./hooks/useTransactions";
import ToastConfig from "./ToastConfig";
import "./styles/tailwind.css";
import "./styles/index.css";

const supportedChains = [ZMainnet, Rinkeby];

const ACTIVE_CHAIN = ZMainnet;

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ThirdwebProvider supportedChains={supportedChains} activeChain={ACTIVE_CHAIN}>
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
