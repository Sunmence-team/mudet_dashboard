import React, { useState } from "react";
import Deposit from "./trans/Deposit";
import Withdraw from "./trans/Withdraw";

const Transactions = () => {
  const [activeTab, setActiveTab] = useState("deposit");

  return (
    <div className="">
      {/* Dropdown aligned to the right */}
      <div className="flex justify-end mb-6">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="border border-[var(--color-primary)] text-[var(--color-primary)] font-medium px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
        </select>
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
