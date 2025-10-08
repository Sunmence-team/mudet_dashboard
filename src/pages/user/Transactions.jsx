import React, { useState } from "react";
import Deposit from "./transactions/Deposit";
import Withdraw from "./transactions/Withdraw";
import EHistory from "./transactions/EHistory";

const Transactions = () => {
  const [activeTab, setActiveTab] = useState("deposit");

  const tabs = [
    { value: "deposit", label: "Deposit" },
    { value: "withdraw", label: "Withdraw" },
    { value: "ewallet", label: "E-Wallet History" },
  ];

  return (
    <div className="w-full max-w-full mx-auto px-4 py-4">
      <h3 className='font-semibold md:text-2xl text-xl'>Transactions</h3>
      {/* Dropdown aligned to the right with modern styling */}
      <div className="flex justify-end mb-8">
        <div className="relative inline-block w-full sm:w-64">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="appearance-none w-full bg-white border border-[var(--color-primary)] text-[var(--color-primary)] font-medium px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition duration-200 cursor-pointer"
            aria-label="Select transaction type"
          >
            {tabs.map((tab) => (
              <option key={tab.value} value={tab.value}>
                {tab.label}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-[var(--color-primary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="transition-opacity duration-300">
        {activeTab === "deposit" && <Deposit />}
        {activeTab === "withdraw" && <Withdraw />}
        {activeTab === "ewallet" && <EHistory />}
      </div>
    </div>
  );
};

export default Transactions;