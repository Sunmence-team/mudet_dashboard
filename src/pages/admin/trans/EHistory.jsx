import React, { useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import api from "../../../utilities/api";

const EHistory = () => {
  const { user } = useUser();
  const [historyData, setHistoryData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  const userId = user?.id;

  const fetchHistory = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/user/p2p/${userId}?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token || JSON.parse(localStorage.getItem("user") || "{}").token}`,
        },
      });

      if (response.data.ok) {
        setHistoryData({
          data: response.data.transactions,
          current_page: page,
          last_page: Math.ceil(response.data.total / 15), // Calculate last_page based on total and per_page
          per_page: 15,
          total: response.data.total,
        });
      }
    } catch (err) {
      console.error("Error fetching transaction history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= historyData.last_page) {
      fetchHistory(page);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-CA"), // YYYY-MM-DD
      time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
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

  const { data: transactions, current_page, last_page } = historyData;

  return (
    <div className="bg-[var(--color-tetiary)]">
      {/* Table container with horizontal scroll on md & sm */}
      <div className="overflow-x-auto">
        {/* Header */}
        <div className="grid grid-cols-4 gap-4 py-3 font-semibold text-black/60 bg-[var(--color-tetiary)] min-w-[600px] text-center uppercase text-xs">
          <span>Type</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Date</span>
        </div>

        {/* Rows */}
        <div className="space-y-3 min-w-[600px]">
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
          ) : transactions.length === 0 ? (
            <div className="text-center py-4">No transactions found.</div>
          ) : (
            transactions.map((item, idx) => {
              const { date, time } = formatDateTime(item.created_at);
              return (
                <div
                  key={idx}
                  className="grid grid-cols-4 gap-4 items-center py-3 bg-white rounded-md shadow-sm text-center text-black/80 text-[15px] font-medium hover:bg-gray-50 transition"
                >
                  <span className="capitalize px-2 break-words">{item.transaction_type.replace(/_/g, " ")}</span>
                  <span>₦{parseFloat(item.amount).toLocaleString()}</span>
                  {/* Status with fixed width pill */}
                  <span>
                    <div
                      className={`px-2 py-1 w-[100px] rounded-full text-xs font-medium border mx-auto ${getStatusColor(item.status)}`}
                    >
                      {item.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </div>
                  </span>
                  {/* Date + Time stacked */}
                  <span className="text-[var(--color-primary)] font-bold flex flex-col">
                    <span>{date}</span>
                    <span className="text-[var(--color-primary)] font-bold">{time}</span>
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => handlePageChange(current_page - 1)}
          disabled={current_page === 1}
          className={`px-3 py-1 rounded ${current_page === 1 ? "bg-gray-200 opacity-50 cursor-not-allowed" : "bg-gray-200"}`}
        >
          ‹
        </button>
        {Array.from({ length: last_page }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded ${page === current_page ? "bg-[var(--color-primary)] text-white" : "bg-gray-200"}`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(current_page + 1)}
          disabled={current_page === last_page}
          className={`px-3 py-1 rounded ${current_page === last_page ? "bg-gray-200 opacity-50 cursor-not-allowed" : "bg-gray-200"}`}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default EHistory;