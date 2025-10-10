import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";
import api from "../../../utilities/api";
import PaginationControls from "../../../utilities/PaginationControls";
import LazyLoader from "../../../components/LazyLoader";

const TransactionHistory = () => {
  const { user, token } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const userId = user?.id;

  // Format amount as currency (e.g., ₦4,200)
  const formatAmount = (amount) => {
    if (!amount) return "₦0";
    return `₦${parseFloat(amount).toLocaleString("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  // Format date and time (e.g., { date: "2025-10-06", time: "4:01 PM" })
  const formatDateTime = (dateString) => {
    if (!dateString) return { date: "N/A", time: "N/A" };
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

  // Get status color classes
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

  // Fetch transactions
  const fetchTransactions = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      if (!userId) {
        throw new Error("User ID not found. Please log in.");
      }
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await api.get(`/api/stockists/bonus/${userId}?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Transaction history response:", JSON.stringify(response.data, null, 2));

      if (response.data.ok && response.data.data) {
        setTransactions(response.data.data.data || []);
        setCurrentPage(response.data.data.current_page || 1);
        setTotalPages(response.data.data.last_page || 1);
      } else {
        throw new Error(response.data.message || "Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch transactions";
      setError(errorMessage);
      toast.error(errorMessage);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage, userId, token]);

  return (
    <div className="bg-[var(--color-tetiary)] w-full flex items-center justify-center py-12">
      {/* Table container */}
      <div className="overflow-x-auto w-[95%]">
        {/* Header */}
        <div className="flex justify-between py-3 font-semibold text-black/60 bg-[var(--color-tetiary)] w-full text-center uppercase text-[17px]">
          <span className="text-start ps-4 w-[15%]">SN</span>
          <span className="text-start w-[25%]">Type</span>
          <span className="w-[20%] text-center">Amount</span>
          <span className="w-[20%] text-center">Status</span>
          <span className="text-end pe-8 w-[20%]">Date</span>
        </div>

        {/* Rows */}
        <div className="space-y-3 w-full mt-8">
          {loading ? (
            <div className="text-center py-4">
              <LazyLoader color="var(--color-primary)" width="35px" />
              <span className="text-black/60">Loading...</span>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500 text-lg">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-4 text-black/60">No transactions found.</div>
          ) : (
            transactions.map((transaction) => {
              const { date, time } = formatDateTime(transaction.created_at);
              return (
                <div
                  key={transaction.id}
                  className="flex justify-between items-center py-6 bg-white rounded-md shadow-sm text-black/80  font-medium hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-[var(--color-primary)] text-start ps-4 w-[15%]">
                    {transaction.id}
                  </span>
                  <span className="capitalize px-2 break-words text-base text-start w-[25%]">
                    {transaction.transaction_type.replace(/_/g, " ")}
                  </span>
                  <span className="font-medium text-base w-[20%] text-center">
                    {formatAmount(transaction.amount)}
                  </span>
                  <span className="w-[20%] text-center">
                    <div
                      className={`px-3 py-2 w-[100px] rounded-[10px] text-sm font-medium border border-black/10 mx-auto ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {transaction.status
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </div>
                  </span>
                  <span className="text-[var(--color-primary)] font-bold flex flex-col text-base text-end pe-5 ps-2 w-[20%]">
                    <span>{date}</span>
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pagination Component */}
      {totalPages > 1 && (
        <div className="mt-4">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;