import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import axios from "axios";
import {
  contractABI,
  contractAddress,
  loandiskAPIBaseURL,
  loandiskAuthCode,
} from "../../src/utils/constants";

type TransactionRequest = {
  borrowerId: string;
  amount: string;
  transactionType: "deposit" | "withdrawal";
};

type LoanDiskTransaction = {
  transaction_id: string;
  borrower_id: string;
  transaction_date: string;
  transaction_type_id: number;
  transaction_amount: number;
  transaction_description?: string;
  transaction_balance?: number;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { borrowerId, amount, transactionType }: TransactionRequest = req.body;

  if (!borrowerId || !amount || !transactionType) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL
    );
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    let transactionResponse;
    if (transactionType === "deposit") {
      transactionResponse = await contract.deposit(
        ethers.utils.parseEther(amount),
        { from: borrowerId }
      );
    } else {
      transactionResponse = await contract.withdraw(
        ethers.utils.parseEther(amount),
        { from: borrowerId }
      );
    }

    const receipt = await transactionResponse.wait();

    const loanDiskTransaction: LoanDiskTransaction = {
      transaction_id: receipt.transactionHash,
      borrower_id: borrowerId,
      transaction_date: new Date().toISOString(),
      transaction_type_id: transactionType === "deposit" ? 1 : 2,
      transaction_amount: parseFloat(amount),
    };

    const response = await axios.post(
      `${loandiskAPIBaseURL}/transactions`,
      loanDiskTransaction,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loandiskAuthCode}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to record transaction on LoanDisk");
    }

    return res.status(200).json({ message: "Transaction successful", receipt });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Transaction failed" });
  }
};

export default handler;
