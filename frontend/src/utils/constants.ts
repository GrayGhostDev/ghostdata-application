import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import axios from "axios";

// Configuring environment and network parameters
const isProduction = process.env.NODE_ENV === "production";

// Smart Contract Details
export const contractAddress = isProduction
  ? (process.env.VITE_MAINNET_CONTRACT_ADDRESS as string) // Mainnet contract address
  : (process.env.VITE_TESTNET_CONTRACT_ADDRESS as string); // Testnet contract address

export const contractABI = [
  {
    constant: false,
    inputs: [{ name: "_amount", type: "uint256" }],
    name: "withdrawETH",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
];

// LoanDisk API Details
export const loandiskAPIBaseURL = "https://api-main.loandisk.com";
export const loandiskPublicKey = process.env.VITE_LOANDISK_PUBLIC_KEY as string;
export const loandiskBranchId = process.env.VITE_LOANDISK_BRANCH_ID as string;
export const loandiskAuthCode = process.env.VITE_LOANDISK_AUTH_CODE as string;

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
    Authorization: `Basic ${Buffer.from(loandiskAuthCode).toString("base64")}`,
  },
});

// Global error handling for Axios instance
loandiskAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data ?? error.message;
    console.error("LoanDisk API Error:", errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

// Ethereum's transaction status
export enum TransactionStatus {
  Pending = "pending",
  Success = "success",
  Error = "error",
}
