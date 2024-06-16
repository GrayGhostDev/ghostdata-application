// src/components/LoanDiskForm.tsx
import React, { useState, FormEvent } from "react";
import { useTransactions } from "../hooks/useTransactions";
import Input from "./Input";
import { toast } from "react-toastify";
import useLoanDiskApi from "../hooks/useLoanDiskApi";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

const LoanDiskForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "email@email.com",
    borrowerId: "1234567",
    amount: "23,2333.23",
  });
  const { fetchSavingTransactions, isLoading } = useTransactions();
  const { borrowerData, isLoading: borrowerLoading, fetchBorrowerData } = useLoanDiskApi();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetchBorrowerData(formData.email || "");
  };

  const handleEthWithdrawal = async () => {
    if (!formData.amount) {
      toast.error("Please enter an amount to withdraw.");
      return;
    }

    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const transaction = await contract.withdrawETH(ethers.utils.parseEther(formData.amount));
      await transaction.wait();

      toast.success("Withdrawal successful!");
    } catch (error) {
      console.error("Error initiating ETH withdrawal:", error);
      toast.error("Failed to initiate ETH withdrawal. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:p-12 py-12 px-4">
      <h3 className="text-white text-3xl text-center my-2">LoanDisk Transactions</h3>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <Input
          placeholder="Email"
          name="email"
          type="email"
          value={formData.email}
          handleChange={handleChange}
        />
        <button
          type="submit"
          disabled={borrowerLoading}
          className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
        >
          {borrowerLoading ? "Fetching..." : "Fetch Borrower Data"}
        </button>
      </form>
      {borrowerData && (
        <div className="text-white">
          <p>Borrower ID: {borrowerData.borrower_id}</p>
          <p>Business Name: {borrowerData.borrower_business_name}</p>
          <form className="flex flex-col items-center">
            <Input
              placeholder="Amount to Withdraw"
              name="amount"
              type="number"
              value={formData.amount}
              handleChange={handleChange}
            />
            <button
              type="button"
              onClick={handleEthWithdrawal}
              className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
            >
              Initiate ETH Withdrawal
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoanDiskForm;
