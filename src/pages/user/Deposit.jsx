import React, { useState } from "react";
import assets from "../../assets/assets";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { toast, Toaster } from "sonner";
import { BsFillWalletFill } from "react-icons/bs";
import api from "../../utilities/api";

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
    <div className="min-h-screen bg-[var(--color-tetiary)] lg:pr-10 grid grid-cols-1 lg:grid-cols-[75%_25%] lg:gap-6 gap-0">
      <div className="block lg:hidden bg-[var(--color-primary)] text-white p-6 mb-7 h-[200px] rounded-2xl shadow">
        <p className="text-sm opacity-80">E-Wallet</p>
        <p className="text-2xl font-bold my-2">{formatBalance(eWallet)}</p>
        <div className="border-1 border-white/50 mb-5 mt-4"></div>
        <div className="flex items-center gap-2 justify-end">
          <p className="text-sm font-normal">Fund Wallet</p>
          <button className="bg-white text-[var(--color-primary)] rounded-full px-2 py-2 hover:bg-gray-100 transition">
            <HiOutlineArrowUpRight className="w-[20px] h-[20px]" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white p-6 rounded-2xl shadow transition-all duration-300">
        <h1 className="text-2xl font-bold mb-1 text-black">Deposit Funds</h1>
        <p className="text-black/50 mb-6">
          Select a deposit method and fill in the details
        </p>

        {/* Step 1 */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-black text-[20px]">
            1. Choose a Method to pay
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Paystack Option */}
            <div
              className={`flex items-center justify-between rounded-xl p-6 cursor-pointer bg-[var(--color-tetiary)] border border-[var(--color-primary)] shadow-md`}
            >
              <div className="flex items-center gap-4">
                <BsFillWalletFill size={34} className="text-[var(--color-primary)]"/>

                <div>
                  <span className="block font-semibold text-[var(--color-primary)]">
                    Paystack
                  </span>
                  <p className="text-sm text-gray-600">
                    Pay securely with your card or bank details
                  </p>
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

        {/* Step 2 */}
        <div className="mb-4">
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
          </div>
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

      {/* Right Section (lg only) */}
      <div className="hidden lg:flex flex-col gap-6 transition-all duration-300">
        {/* Wallet Card */}
        <div className="bg-[var(--color-primary)] text-white p-6 rounded-2xl shadow">
          <p className="text-sm opacity-80">E-Wallet</p>
          <p className="text-2xl font-bold my-2">{formatBalance(eWallet)}</p>
          <div className="border-1 border-white/50 mb-5 mt-4"></div>
          <div className="flex items-center gap-2 justify-end">
            <p className="text-sm font-normal">Fund Wallet</p>
            <button className="bg-white text-[var(--color-primary)] rounded-full px-2 py-2 hover:bg-gray-100 transition">
              <HiOutlineArrowUpRight className="w-[20px] h-[20px]" />
            </button>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default Deposit;