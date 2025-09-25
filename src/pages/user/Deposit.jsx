import React, { useState } from "react";
import assets from "../../assets/assets";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { IoCopy } from "react-icons/io5";
import { toast, Toaster } from "sonner";


const Deposit = () => {
  const [selectedMethod, setSelectedMethod] = useState("paystack");

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Account number copied!", {
      position: "bottom-center",
      style: {
        background: "var(--color-primary)",
        color: "#fff",
        borderRadius: "8px",
        padding: "10px 16px",
      },
      icon: "✅",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-tetiary)] lg:pr-10 grid grid-cols-1 lg:grid-cols-[75%_25%] lg:gap-6 gap-0">
     
      <div className="block lg:hidden bg-[var(--color-primary)] text-white p-6 mb-7 h-[200px] rounded-2xl shadow">
        <p className="text-sm opacity-80">E-Wallet</p>
        <p className="text-2xl font-bold my-2">₦2,344,000</p>
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
              onClick={() => setSelectedMethod("paystack")}
              className={`flex items-center justify-between rounded-xl p-6 cursor-pointer bg-[var(--color-tetiary)] hover:shadow-md hover:border hover:border-[var(--color-primary)] transition ${
                selectedMethod === "paystack"
                  ? "border border-[var(--color-primary)] shadow-md"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={assets.wallet}
                  alt="Paystack"
                  className="w-10 h-10 object-contain"
                />
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
                checked={selectedMethod === "paystack"}
                readOnly
                className="accent-[var(--color-primary)] w-5 h-5"
              />
            </div>

            {/* Manual Option */}
            <div
              onClick={() => setSelectedMethod("manual")}
              className={`flex items-center justify-between rounded-xl p-6 cursor-pointer bg-[var(--color-tetiary)] hover:shadow-md hover:border hover:border-[var(--color-primary)] transition ${
                selectedMethod === "manual"
                  ? "border border-[var(--color-primary)] shadow-md"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={assets.wallet}
                  alt="Manual"
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <span className="block font-semibold text-[var(--color-primary)]">
                    Manual
                  </span>
                  <p className="text-sm text-gray-600 mr-2">
                    Pay via bank transfer and upload proof
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={selectedMethod === "manual"}
                readOnly
                className="accent-[var(--color-primary)] w-5 h-5"
              />
            </div>
          </div>
        </div>

        {/* Bank Details for sm/md screens */}
        {selectedMethod === "manual" && (
          <div className="block lg:hidden bg-white p-4 rounded-2xl shadow mb-6">
            <h3 className="text-[24px] font-semibold mb-4 text-[var(--color-primary)]">
              Bank Details
            </h3>
            <div className="space-y-3 text-black">
              <p className="flex items-center justify-between">
                <span className="font-medium text-black/50">BANK NAME:</span>
                <span className="ml-2 text-black/70">Access Bank</span>
              </p>

              <p className="flex items-center justify-between">
                <span className="font-medium text-black/50">
                  ACCOUNT NUMBER:
                </span>
                <span className="ml-2 flex gap-2 items-center text-black/70">
                  1234123456
                  <button
                    type="button"
                    onClick={() => copyToClipboard("1234123456")}
                    className="text-[var(--color-primary)] hover:text-[var(--color-secondary)]"
                  >
                    <IoCopy size={18} />
                  </button>
                </span>
              </p>

              <p className="flex items-center justify-between">
                <span className="font-medium text-black/50">ACCOUNT NAME:</span>
                <span className="ml-2 text-black/70">
                  Mudet Real Solution Limited
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Step 2 + Step 3 */}
        <div
          className={`transition-all duration-300 ${
            selectedMethod === "manual" ? "mb-10" : "mb-4"
          }`}
        >
          {(selectedMethod === "paystack" || selectedMethod === "manual") && (
            <div className="mb-6">
              <h2 className="font-semibold mb-2 text-black text-[20px]">
                2. Fill Deposit Details
              </h2>
              <p className="text-black/50 mb-1">Amount</p>
              <input
                type="number"
                placeholder="₦14,000"
                className="w-full rounded-xl px-4 border-1 border-black/40 py-3 focus:ring-1 focus:ring-black/40 outline-0"
              />
            </div>
          )}

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
                  <input type="file" id="proof" className="hidden" />
                  <label
                    htmlFor="proof"
                    className="cursor-pointer px-4 py-2 border-black/20 border rounded-md text-gray-600 hover:text-[var(--color-secondary)] hover:border-[var(--color-secondary)] transition"
                  >
                    Choose File
                  </label>
                  <span className="text-sm text-gray-500">No file chosen</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <button className="bg-[var(--color-primary)] text-white w-full py-3 rounded-xl hover:opacity-90 transition my-6">
          Confirm Deposit
        </button>
      </div>

      {/* Right Section (lg only) */}
      <div className="hidden lg:flex flex-col gap-6 transition-all duration-300">
        {/* Wallet Card */}
        <div className="bg-[var(--color-primary)] text-white p-6 rounded-2xl shadow">
          <p className="text-sm opacity-80">E-Wallet</p>
          <p className="text-2xl font-bold my-2">₦2,344,000</p>
          <div className="border-1 border-white/50 mb-5 mt-4"></div>
          <div className="flex items-center gap-2 justify-end">
            <p className="text-sm font-normal">Fund Wallet</p>
            <button className="bg-white text-[var(--color-primary)] rounded-full px-2 py-2 hover:bg-gray-100 transition">
              <HiOutlineArrowUpRight className="w-[20px] h-[20px]" />
            </button>
          </div>
        </div>

        {/* Bank Details (lg only) */}
        {selectedMethod === "manual" && (
          <div className="bg-white p-6 rounded-2xl shadow transition-all duration-300">
            <h3 className="text-[24px] font-semibold mb-4 text-[var(--color-primary)]">
              Bank Details
            </h3>
            <div className="space-y-3 text-black">
              <p className="flex items-center justify-between">
                <span className="font-medium text-black/50">BANK NAME:</span>
                <span className="ml-2 text-black/70">Access Bank</span>
              </p>

              <p className="flex items-center justify-between">
                <span className="font-medium text-black/50">
                  ACCOUNT NUMBER:
                </span>
                <span className="ml-2 flex gap-2 items-center text-black/70">
                  1234123456
                  <button
                    type="button"
                    onClick={() => copyToClipboard("1234123456")}
                    className="text-[var(--color-primary)] hover:text-[var(--color-secondary)]"
                  >
                    <IoCopy size={18} />
                  </button>
                </span>
              </p>

              <p className="flex items-center justify-between">
                <span className="font-medium text-black/50">ACCOUNT NAME:</span>
                <span className="ml-2 text-black/70">
                  Mudet Real Solution Limited
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      <Toaster />
    </div>
  );
};

export default Deposit;
