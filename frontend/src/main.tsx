// src/main.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { ACTIVE_CHAIN_ID } from './utils/constants';
import { TransactionsProvider } from './context/TransactionsContext';
import App from './App';
import ToastConfig from './ToastConfig';
import './styles/tailwind.css';

import 'react-toastify/dist/ReactToastify.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ThirdwebProvider activeChain={ACTIVE_CHAIN_ID}>
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
