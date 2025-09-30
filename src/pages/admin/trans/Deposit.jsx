import React, { useState, useEffect } from "react";
import api from "../../../utilities/api";

const Deposit = () => {
  const [depositsData, setDepositsData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    links: [],
    per_page: 15,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.id || 2; // Fallback to 2 if not found

  const fetchDeposits = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/users/${userId}/fund-e-wallets?page=${page}`);
      if (response.data.ok) {
        setDepositsData(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching deposits:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handlePageChange = (url) => {
    if (url) {
      const page = new URL(url).searchParams.get("page");
      if (page) {
        fetchDeposits(page);
      }
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

  const { data: deposits, links } = depositsData;

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
            <div className="text-center py-4">Loading...</div>
          ) : deposits.length === 0 ? (
            <div className="text-center py-4">No deposits found.</div>
          ) : (
            deposits.map((item, idx) => {
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
        {links.map((link, idx) => (
          <button
            key={idx}
            onClick={() => handlePageChange(link.url)}
            disabled={!link.url}
            className={`px-3 py-1 rounded ${link.active ? "bg-[var(--color-primary)] text-white" : "bg-gray-200"} ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {link.label.replace("&laquo;", "‹").replace("&raquo;", "›")}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Deposit;