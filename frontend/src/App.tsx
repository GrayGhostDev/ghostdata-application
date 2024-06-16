// /frontend/src/App.tsx

import React from "react";
import "./styles/tailwind.css";
import { TransactionsProvider } from "./context/TransactionsContext";
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import Services from "./components/Services";
import Transactions from "./components/Transactions";
import Footer from "./components/Footer";
import WalletConnect from "./components/WalletConnect";
import CreateWallet from "./components/createWallet"; // Import the CreateWallet component

const App: React.FC = () => (
  <TransactionsProvider>
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
        <WalletConnect />
        <CreateWallet /> {/* Add the CreateWallet component */}
      </div>
      <Services />
      <Transactions />
      <Footer />
    </div>
  </TransactionsProvider>
);

export default App;
