import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";
import api from "../../../utilities/api";
import PaginationControls from "../../../utilities/PaginationControls";
import { FaCheck } from "react-icons/fa";
import LazyLoader from "../../../components/loaders/LazyLoader";
import { formatTransactionType } from "../../../utilities/formatterutility";

const RepurchaseHistory = () => {
  const { user, token, refreshUser } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const userId = user?.id;

  // Format amount as currency (e.g., ₦1,150)
  const formatAmount = (amount) => {
    if (!amount) return "₦0";
    return `₦${parseFloat(amount).toLocaleString("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
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
      if (!userId) throw new Error("User ID not found. Please log in.");
      if (!token) throw new Error("No authentication token found. Please log in.");

      const response = await api.post(
        `/api/stockists/${userId}/user`,
        { transactions_page: page },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Repurchase history response:", JSON.stringify(response.data, null, 2));

      if (response.data.ok && response.data.transactions) {
        // Filter for manual_purchase transactions only
        const filteredTransactions = response.data.transactions.data.filter(
          (transaction) => transaction.transaction_type === "manual_purchase"
        );

        // ✅ Log confirmation states here INSIDE the function
        filteredTransactions.forEach((t, i) => {
          console.log(
            `#${i + 1}: ${t.orders?.products
              ?.map((p) => p.product_name)
              .join(", ") || "N/A"} | Order ID: ${t.orders?.id} | Status: ${t.orders?.status} | Delivery: ${t.orders?.delivery}`
          );
        });

        setTransactions(filteredTransactions || []);
        setCurrentPage(response.data.transactions.current_page || 1);
        setTotalPages(response.data.transactions.last_page || 1);
      } else {
        throw new Error(response.data.message || "Failed to fetch transactions");
      }

    } catch (error) {
      console.error("Error fetching transactions:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch transactions";
      setError(errorMessage);
      toast.error(errorMessage);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Confirm order
  const confirmOrder = async (orderId) => {
    try {
      const response = await api.put(
        `/api/orders/${orderId}/confirm`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.ok) {
        toast.success("Order confirmed successfully");
        fetchTransactions(currentPage); // Refresh the list
        refreshUser();
      } else {
        throw new Error(response.data.message || "Failed to confirm order");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to confirm order";
      toast.error(errorMessage);
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
          <span className="text-start ps-4 w-[10%]">SN</span>
          <span className="text-start w-[35%]">Product Name(s) & Qty</span>
          <span className="text-start w-[15%]">Transaction Type</span>
          <span className="w-[15%] text-center">Amount</span>
          <span className="w-[15%] text-center">Status</span>
          <span className="w-[10%] text-center">Confirm</span>
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
            <div className="text-center py-4 text-black/60">No manual purchase transactions found.</div>
          ) : (
            transactions.map((transaction, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-6 bg-white rounded-md shadow-sm text-black/80 font-medium hover:bg-gray-50 transition"
              >
                {/* SN */}
                <span className="font-semibold text-[var(--color-primary)] text-start ps-4 w-[10%]">
                  {index + 1}
                </span>

                {/* Product Names with Quantities */}
                <span className="capitalize px-2 break-words text-base text-start w-[35%]">
                  {transaction.orders?.products
                    ?.map((product) => `${product.product_name.trim()} (Qty: ${product.product_quantity})`)
                    .join(", ") || "N/A"}
                </span>

                {/* Transaction Type */}
                <span className="capitalize px-2 break-words text-base text-start w-[15%]">
                  {formatTransactionType(transaction.transaction_type)}
                </span>

                {/* Amount */}
                <span className="font-medium text-base w-[15%] text-center">
                  {formatAmount(transaction.amount)}
                </span>

                {/* Status */}
                <span className="w-[15%] text-center">
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

                {/* Confirm Button */}
                <span className="w-[10%] text-center">
                  <button
                    onClick={() => confirmOrder(transaction.orders?.id)}
                    className="p-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-dark)] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Confirm Order"
                    disabled={
                      !transaction.orders?.id ||
                      transaction.orders?.delivery === "picked"
                    }

                  >
                    <FaCheck size={16} />
                  </button>

                </span>
              </div>
            ))
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

export default RepurchaseHistory;