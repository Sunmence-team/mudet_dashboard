import React from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";

const Deposit = () => {
  const deposits = [
    {
      id: "001",
      email: "longemail@example.com",
      type: "E-wallet deposit",
      amount: "$200",
      status: "Successful",
      date: "2025-09-20",
      time: "12:30 PM",
    },
    {
      id: "002",
      email: "marysmith@example.com",
      type: "Manual withdraw",
      amount: "$120",
      status: "Failed",
      date: "2025-09-22",
      time: "3:15 PM",
    },
    {
      id: "003",
      email: "alexk@example.com",
      type: "E-wallet deposit",
      amount: "$75",
      status: "Pending",
      date: "2025-09-25",
      time: "9:45 AM",
    },
  ];

  return (
    <div className="bg-[var(--color-tetiary)]">
      {/* Table container with horizontal scroll on md & sm */}
      <div className="overflow-x-auto">
        {/* Header */}
        <div className="grid grid-cols-6 gap-4 py-3 font-semibold text-black/60 bg-[var(--color-tetiary)] min-w-[700px] text-center uppercase text-xs">
          <span>Email</span>
          <span>Type</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Date</span>
          <span>Action</span>
        </div>

        {/* Rows */}
        <div className="space-y-3 min-w-[700px]">
          {deposits.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-6 gap-4 items-center py-3 bg-white rounded-md shadow-sm text-center text-black/80 text-[15px] font-medium hover:bg-gray-50 transition"
            >
              {/* Email with wrapping */}
              <span className="break-words text-sm px-2">{item.email}</span>

              <span className="capitalize px-2 break-words">{item.type}</span>
              <span>{item.amount}</span>

              {/* Status with fixed width pill */}
              <span>
                <div
                  className={`px-2 py-1 w-[100px] rounded-full text-xs font-medium border mx-auto ${
                    item.status === "Successful"
                      ? "bg-[#dff7ee]/80 text-[var(--color-primary)]"
                      : item.status === "Failed"
                      ? "bg-[#c51236]/20 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {item.status}
                </div>
              </span>

              {/* Date + Time stacked */}
              <span className="text-[var(--color-primary)] font-bold flex flex-col">
                <span>{item.date}</span>
                <span className="text-[var(--color-primary)] font-bold">
                  {item.time}
                </span>
              </span>

              {/* Actions */}
              <span className="flex justify-center gap-2">
                <button
                  type="button"
                  title="View deposit details"
                  className="text-[var(--color-primary)] text-lg cursor-pointer w-8 h-8 flex justify-center items-center hover:bg-[var(--color-primary)]/10 transition-all duration-300 rounded-lg"
                >
                  <FiEye />
                </button>
                <button
                  type="button"
                  title="Delete deposit"
                  className="text-red-600 text-lg cursor-pointer w-8 h-8 flex justify-center items-center hover:bg-red-600/10 transition-all duration-300 rounded-lg"
                >
                  <FiTrash2 />
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deposit;
