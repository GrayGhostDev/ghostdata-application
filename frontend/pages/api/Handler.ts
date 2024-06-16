import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import axios from "axios";
import {
  contractABI,
  contractAddress,
  loandiskAPIBaseURL,
  loandiskAuthCode,
} from "../../src/utils/constants";
import { ContractTransaction } from "ethers";

interface TransactionRequest {
  borrowerId: string;
  amount: string;
  transactionType: "deposit" | "withdrawal";
}

interface LoanDiskTransaction {
  transaction_id: string;
  borrower_id: string;
  transaction_date: string;
  transaction_type_id: number;
  transaction_amount: number;
  transaction_description?: string;
  transaction_balance?: number;
}

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

    // Ensure the amount is valid and not zero
    const amountInWei = ethers.utils.parseEther(amount);
    if (amountInWei.isZero()) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Handle deposit or withdrawal
    let tx: ContractTransaction;
    if (transactionType === "deposit") {
      tx = await contract.deposit(amountInWei, { from: borrowerId });
    } else {
      tx = await contract.withdraw(amountInWei, { from: borrowerId });
    }

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
   
    // Update LoanDisk API with transaction details.  
    const loanDiskTransaction: LoanDiskTransaction = {
      transaction_id: receipt.transactionHash,
      borrower_id: borrowerId,
      transaction_date: new Date().toISOString(),
      transaction_type_id: transactionType === "deposit" ? 1 : 2,
      transaction_amount: parseFloat(amount), 
      transaction_description: transactionType === "deposit" ? "Deposit" : "Withdrawal",
      // Optionally, include the transaction balance if the contract provides it
      // transaction_balance: await contract.balanceOf(borrowerId),
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
    if (response.status !== 201) { // Assuming 201 Created for success
      throw new Error("Failed to record transaction on LoanDisk: " + response.statusText);
    }

    return res.status(200).json({ 
        message: "Transaction successful", 
        receipt 
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || "Transaction failed" }); 
  }
};

export default handler;
