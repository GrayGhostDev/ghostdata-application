// src/App.tsx

import React from 'react';
import './tailwind.css';
import { TransactionsProvider } from "./context/TransactionsContext.tsx";
import { Navbar, Welcome, Services, Transactions, Footer } from './components';

const App: React.FC = () => (
  <TransactionsProvider>
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      <Services />
      <Transactions />
      <Footer />
    </div>
  </TransactionsProvider>
);

export default App;
