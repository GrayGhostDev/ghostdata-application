import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import axios from "axios";
import abi from "./Transactions.json";
import Transactions from "./Transactions.json";

// Configuring environment and network parameters
const isProduction = process.env.NODE_ENV === "development";

// Smart Contract Details
export const contractAddress = isProduction
  ? (process.env.VITE_MAINNET_CONTRACT_ADDRESS) // Mainnet contract address
  : (process.env.VITE_TESTNET_CONTRACT_ADDRESS); // Testnet contract address

export const contractABI = Transactions.abi;

// LoanDisk API Details
export const loandiskAPIBaseURL = "https://api-main.loandisk.com";
export const loandiskPublicKey = process.env.VITE_LOANDISK_PUBLIC_KEY;
export const loandiskBranchId = process.env.VITE_LOANDISK_BRANCH_ID;
export const loandiskAuthCode = process.env.VITE_LOANDISK_AUTH_CODE;

// Setting up Ethereum Network Details dynamically
export const NETWORKS = () => {
  switch (process.env.NODE_ENV) {
    case "production":
      return { network: "Mainnet", chainId: 1 };
    case "development":
      return { network: "Sepolia", chainId: 11155111 }; // Sepolia testnet for development
    default:
      return { network: "rinkeby", chainId: 4 }; // Default to Rinkeby if not production or specific development setup
  }
};

const { network, chainId } = NETWORKS();
const rpcURL = process.env[`VITE_ALCHEMY_API_URL_${network.toUpperCase()}`] as string;

// Initialize Thirdweb SDK with an appropriate Ethereum provider
export const sdk = new ThirdwebSDK(
  new ethers.providers.JsonRpcProvider(rpcURL, chainId)
);

export const contract = new ethers.Contract(
  contractAddress,
  contractABI,
  sdk.getSigner()
);

export const ACTIVE_CHAIN_ID = isProduction ? 1 : 4; // Mainnet chain ID or Rinkeby chain ID

// Configure Axios instance for LoanDisk API
export const loandiskAPI = axios.create({
  baseURL: `${loandiskAPIBaseURL}/${loandiskPublicKey}/${loandiskBranchId}`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${Buffer.from(`${loandiskAuthCode}`).toString("base64")}`,
  },
});

// Global error handling for Axios instance
loandiskAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "LoanDisk API Error:",
      error.response ? error.response.data : error.message
    );
    return Promise.reject(error);
  }
);

// Ethereum's transaction status
export enum TransactionStatus {
  Pending = "pending",
  Success = "success",
  Error = "error",
}
