import React, { useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import api from "../../../utilities/api";

const EarningWallet = () => {
  const { user } = useUser();
  const [earningData, setEarningData] = useState({
    data: [
      {
        id: 1,
        transaction_type: "referral_bonus",
        amount: "5000",
        status: "successful",
        created_at: "2025-10-07T14:20:00Z",
      },
      {
        id: 2,
        transaction_type: "team_bonus",
        amount: "2500",
        status: "pending",
        created_at: "2025-10-06T10:45:00Z",
      },
      {
        id: 3,
        transaction_type: "milestone_bonus",
        amount: "8000",
        status: "successful",
        created_at: "2025-10-05T09:30:00Z",
      },
    ],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 3,
  });

  const [loading, setLoading] = useState(false);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-CA"),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-[#dff7ee]/80 text-[var(--color-primary)]";
      case "failed":
        return "bg-[#c51236]/20 text-red-600";
      case "pending":
      case "pending_manual":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const { data: earnings } = earningData;

  return (
    <div className="bg-[var(--color-tetiary)]">
      {/* Table container */}
      <div className="overflow-x-auto">
        {/* Header */}
        <div className="flex justify-between py-3 font-semibold text-black/60 bg-[var(--color-tetiary)] w-full text-center uppercase text-[17px]">
          <span className="text-start ps-4 w-[15%]">SN</span>
          <span className="text-start w-[25%]">Bonus Type</span>
          <span className="w-[20%] text-center">Amount</span>
          <span className="w-[20%] text-center">Status</span>
          <span className="text-end pe-8 w-[20%]">Date</span>
        </div>

        {/* Rows */}
        <div className="space-y-3 w-full">
          {loading ? (
            <div className="text-center py-4">
              <svg
                className="animate-spin h-8 w-8 mx-auto text-[var(--color-primary)]"
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
              <span className="text-black/60">Loading...</span>
            </div>
          ) : earnings.length === 0 ? (
            <div className="text-center py-4">No earning records found.</div>
          ) : (
            earnings.map((item, idx) => {
              const { date, time } = formatDateTime(item.created_at);
              return (
                <div
                  key={idx}
                  className="flex justify-between items-center py-3 bg-white rounded-md shadow-sm text-black/80 text-[15px] font-medium hover:bg-gray-50 transition"
                >
                  {/* SN */}
                  <span className="font-semibold text-[var(--color-primary)] text-start ps-4 w-[15%]">
                    00{idx + 1}
                  </span>

                  {/* Bonus Type */}
                  <span className="capitalize px-2 break-words text-sm text-start w-[25%]">
                    {item.transaction_type.replace(/_/g, " ")}
                  </span>

                  {/* Amount */}
                  <span className="font-medium text-sm w-[20%] text-center">
                    ₦{parseFloat(item.amount).toLocaleString()}
                  </span>

                  {/* Status */}
                  <span className="w-[20%] text-center">
                    <div
                      className={`px-3 py-2 w-[100px] rounded-[10px] text-xs font-medium border-black/10 border mx-auto ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </div>
                  </span>

                  {/* Date & Time */}
                  <span className="text-[var(--color-primary)] font-bold flex flex-col text-sm text-end pe-5 ps-2 w-[20%]">
                    <span>{date}</span>
                    <span className="text-[var(--color-primary)] font-bold pe-2">
                      {time}
                    </span>
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default EarningWallet;
