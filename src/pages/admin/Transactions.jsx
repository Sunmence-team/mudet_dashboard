import React, { useState } from "react";
import Deposit from "./trans/Deposit";
import Withdraw from "./trans/Withdraw";

const Transactions = () => {
  const [activeTab, setActiveTab] = useState("deposit");

  return (
    <div className="">
      {/* Toggle buttons */}
      <div className="grid grid-cols-2 border border-[var(--color-primary)] rounded-[10px] overflow-hidden mb-6">
        <button
          onClick={() => setActiveTab("deposit")}
          className={`py-2 font-medium transition-all ${
            activeTab === "deposit"
              ? "bg-[var(--color-primary)] text-white rounded-e-[10px]"
              : "bg-transparent text-[var(--color-primary)]"
          }`}
        >
          Deposit
        </button>
        <button
          onClick={() => setActiveTab("withdraw")}
          className={`py-2 font-medium transition-all ${
            activeTab === "withdraw"
              ? "bg-[var(--color-primary)] text-white rounded-s-[10px]"
              : "bg-transparent text-[var(--color-primary)]"
          }`}
        >
          Withdraw
        </button>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "deposit" && <Deposit />}
        {activeTab === "withdraw" && <Withdraw />}
      </div>
    </div>
  );
};

export default Transactions;
