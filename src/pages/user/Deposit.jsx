import React, { useState } from "react";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { toast, Toaster } from "sonner";
import { BsFillWalletFill } from "react-icons/bs";
import api from "../../utilities/api";
import { Link } from "react-router-dom";

const Deposit = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.id;
  const email = user?.email;
  const eWallet = user?.e_wallet || "0.00";

  const handleConfirm = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/wallets/fund/initiate", {
        user_id,
        amount,
        email,
        payment_method: "paystack",
      });

      if (response.data.ok) {
        toast.success("Payment initialized.");
        window.open(response.data.authorization_url, "_blank");
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to initialize payment.");
    } finally {
      setLoading(false);
    }
  };

  const formatBalance = (balance) => {
    return parseFloat(balance).toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <div className=" bg-[var(--color-tetiary)] px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-[70%_30%] lg:gap-6 gap-4">
      {/* Wallet Card (Mobile) */}
      <div className="block lg:hidden bg-[var(--color-primary)] text-white p-4 sm:p-6 rounded-2xl shadow flex flex-col space-y-4">
        <div>
          <p className="text-sm opacity-80">E-Wallet</p>
          <p className="text-2xl font-bold mt-2">{formatBalance(eWallet)}</p>
          <div className="border-t border-white/30 mt-4"></div>
        </div>
        <div className="flex items-center justify-end">
          <Link
            to="/user/transactions"
            className="flex items-center gap-2 text-sm font-medium text-white hover:text-gray-200 transition"
          >
            <span>History</span>
            <button className="bg-white text-[var(--color-primary)] rounded-full p-2 hover:bg-gray-100 transition">
              <HiOutlineArrowUpRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow flex flex-col space-y-6 transition-all duration-300">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-black">Deposit Funds</h1>
          <p className="text-black/50 text-sm sm:text-base mt-1">Select a deposit method and fill in the details</p>
        </div>

        {/* Step 1: Choose Payment Method */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg sm:text-xl text-black">1. Choose a Method to Pay</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-xl p-4 sm:p-6 bg-[var(--color-tetiary)] border border-[var(--color-primary)] shadow-md">
              <div className="flex items-center gap-4">
                <BsFillWalletFill size={34} className="text-[var(--color-primary)]" />
                <div>
                  <span className="block font-semibold text-[var(--color-primary)]">Paystack</span>
                  <p className="text-sm text-gray-600">Pay securely with your card or bank details</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="accent-[var(--color-primary)] w-5 h-5"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Fill Deposit Details */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg sm:text-xl text-black">2. Fill Deposit Details</h2>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              placeholder="₦14,000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl px-4 py-3 border border-black/40 focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="bg-[var(--color-primary)] text-white w-full py-3 rounded-xl hover:opacity-90 transition my-6 disabled:opacity-50"
        >
<<<<<<<<< Temporary merge branch 1
          {(selectedMethod === "paystack" || selectedMethod === "manual") && (
            <div className="mb-6">
              <h2 className="font-semibold mb-2 text-black text-[20px]">
                2. Fill Deposit Details
              </h2>
              <p className="text-black/50 mb-1">Amount</p>
              <input
                type="number"
                placeholder="₦14,000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl px-4 border-1 border-black/40 py-3 focus:ring-1 focus:ring-black/40 outline-0"
              />
=========
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
>>>>>>>>> Temporary merge branch 2
            </div>
          ) : (
            "Confirm Deposit"
          )}
<<<<<<<<< Temporary merge branch 1

          {selectedMethod === "manual" && (
            <div>
              <h2 className="font-semibold mb-2 text-black text-[20px]">
                3. Upload Proof of Payment
              </h2>
              <p className="text-black/50 mb-1">Image</p>
              <div className="border-2 border-dashed border-black/20 rounded-xl p-6 text-center flex flex-col items-center justify-center gap-4">
                <div className="p-3 rounded-md bg-[var(--color-tetiary)]">
                  <img
                    src={assets.imageicon}
                    alt="Upload Icon"
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    type="file"
                    id="proof"
                    className="hidden"
                    onChange={(e) => setProofFile(e.target.files[0])}
                  />
                  <label
                    htmlFor="proof"
                    className="cursor-pointer px-4 py-2 border-black/20 border rounded-md text-gray-600 hover:text-[var(--color-secondary)] hover:border-[var(--color-secondary)] transition"
                  >
                    Choose File
                  </label>
                  <span className="text-sm text-gray-500">
                    {proofFile ? proofFile.name : "No file chosen"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="bg-[var(--color-primary)] text-white w-full py-3 rounded-xl hover:opacity-90 transition my-6 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </div>
          ) : (
            "Confirm Deposit"
          )}
        </button>
      </div>

      {/* Right Section (Desktop) */}
      <div className="hidden lg:flex flex-col gap-6">
        <div className="bg-[var(--color-primary)] text-white p-6 rounded-2xl shadow flex flex-col space-y-4">
          <div>
            <p className="text-sm opacity-80">E-Wallet</p>
            <p className="text-2xl font-bold mt-2">{formatBalance(eWallet)}</p>
            <div className="border-t border-white/50 mt-4"></div>
          </div>
          <div className="flex items-center justify-end">
            <Link
              to="/user/transactions"
              className="flex items-center gap-2 text-sm font-normal text-white hover:text-gray-200 transition"
            >
              <span>History</span>
              <button className="bg-white text-[var(--color-primary)] rounded-full p-2 hover:bg-gray-100 transition">
                <HiOutlineArrowUpRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default Deposit;