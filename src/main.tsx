// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ACTIVE_CHAIN_ID } from "./utils/constants";
import { ToastContainer } from "react-toastify";
import { TransactionsProvider } from "./context/TransactionContext";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";

// Find the root element to render your React app
const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <ThirdwebProvider activeChain={ACTIVE_CHAIN_ID}>
        <TransactionsProvider>
          <App />
          {/* Toast container for notifications/alerts */}
          <ToastContainer />
        </TransactionsProvider>
      </ThirdwebProvider>
    </React.StrictMode>
  );
} else {
  console.error("Error: Container element with ID 'root' not found.");
}
