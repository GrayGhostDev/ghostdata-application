// src/components/LoanDiskForm.tsx
import React, { useState, FormEvent } from "react";
import { useTransactions } from "../context/TransactionContext";
import { Input } from ".";
import { toast } from "react-toastify";
import { useContractRead } from "@thirdweb-dev/react";
import { contractAddress, contractABI } from "../utils/constants";

const LoanDiskForm: React.FC = () => {
    const [formData, setFormData] = useState({
        loanDiskAccountId: "",
    });
    const { fetchSavingTransactions, isLoading, ethTransactions } = useTransactions();

    // Read Transactions from smart contract
    const { data: rawEthTransactions, isLoading: ethTxLoading } = useContractRead(
        contractAddress,
        contractABI,
        "transactions",
        [0] // Assuming you want to fetch the first transaction initially
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await fetchSavingTransactions(formData.loanDiskAccountId); // Fetch transactions
            // (Optional) You can display a success message here or in the parent component
        } catch (error) {
            console.error("Error fetching LoanDisk transactions:", error);
            toast.error("Failed to fetch LoanDisk transactions. Please try again."); // Display error toast
        }
    };

    return (
        <div className="flex flex-col md:p-12 py-12 px-4">
            <h3 className="text-white text-3xl text-center my-2">Latest Ethereum Contract Transactions</h3>
            {ethTxLoading ? (
              <Loader />
            ) : rawEthTransactions?.length > 0 ? (
              <div className="flex flex-wrap justify-center items-center mt-10">
                {(rawEthTransactions as any[]).map((transaction: any) => {
                  return <div>
                              <p className="text-white text-base">Txn ID: {transaction[0].toNumber()}</p>
                              <p className="text-white text-base">Amount: {transaction[1].toNumber()}</p>
                              <p className="text-white text-base">Transaction Type: {transaction[2]}</p>
                          </div>
                })}
              </div>
            ) : (
              <p className="text-white text-center">No transactions to display.</p>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <Input
                    placeholder="LoanDisk Account ID"
                    name="loanDiskAccountId"
                    type="text"
                    value={formData.loanDiskAccountId}
                    handleChange={handleChange}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                >
                    {isLoading ? "Fetching..." : "View LoanDisk Transactions"}
                </button>
            </form>
        </div>
    );
};

export default LoanDiskForm;
