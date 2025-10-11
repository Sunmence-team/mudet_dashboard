import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";
import api from "../../../utilities/api";
import LazyLoader from "../../../components/loaders/LazyLoader";
import PaginationControls from "../../../utilities/PaginationControls";
import { FaCheck } from "react-icons/fa";

const UpgradeHistory = () => {
  const { user, token } = useUser();
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
      if (!token)
        throw new Error("No authentication token found. Please log in.");

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

      console.log(
        "Upgrade history response:",
        response
      );

      if (response.data.ok && response.data.transactions) {
        // Filter for upgrade_debit transactions only
        const filteredTransactions = response.data.transactions.data.filter(
          (transaction) => transaction.transaction_type === "upgrade_debit"
        );

        // ✅ Log transaction details for confirmation tracking
        filteredTransactions.forEach((t, i) => {
          console.log(
            `#${i + 1}: ${
              t.orders?.products?.map((p) => p.product_name).join(", ") || "N/A"
            } | Order ID: ${t.orders?.id} | Status: ${
              t.orders?.status
            } | Delivery: ${t.orders?.delivery}`
          );
        });

        setTransactions(filteredTransactions || []);
        setCurrentPage(response.data.transactions.current_page || 1);
        setTotalPages(response.data.transactions.last_page || 1);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch transactions"
        );
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch transactions";
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
      } else {
        throw new Error(response.data.message || "Failed to confirm order");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to confirm order";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage, userId, token]);

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full">
        <thead>
          <tr className="text-black/70 uppercase">
            <th className="ps-2 p-5 text-xs text-start">SN</th>
            <th className="p-5 text-xs text-center">Product Name(s) & Qty</th>
            <th className="p-5 text-xs text-center">Transaction Type</th>
            <th className="p-5 text-xs text-center">Amount</th>
            <th className="p-5 text-xs text-center">Status</th>
            <th className="pe-2 p-5 text-xs text-end">Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                <LazyLoader color="var(--color-primary)" width="35px" />
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={6} className="text-center py-4 text-red-500 text-lg">
                {error}
              </td>
            </tr>
          ) : transactions.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4 text-lg">
                No upgrade debit transactions found.
              </td>
            </tr>
          ) : (
            transactions.map((transaction, index) => (
              <tr
                key={index}
                className="bg-white text-sm text-center capitalize"
              >
                {/* SN */}
                <td className="p-3 text-start rounded-s-lg border-y border-s-1 border-black/10 text-primary">
                  {String(index + 1).padStart(3, "000")}
                </td>

                {/* Product Names with Quantities */}
                <td className="p-4 border-y border-black/10 whitespace-pre">
                  {transaction.orders?.products
                    ?.map(
                      (product) =>
                        `${product.product_name.trim()} (Qty: ${
                          product.product_quantity
                        })`
                    )
                    .join(", \n") || "N/A"}
                </td>

                {/* Transaction Type */}
                <td className="p-4 border-y border-black/10">
                  {transaction.transaction_type.replace(/_/g, " ")}
                </td>

                {/* Amount */}
                <td className="p-4 border-y border-black/10">
                  {formatAmount(transaction.amount)}
                </td>

                {/* Status */}
                <td className="p-4 border-y border-black/10">
                  <div
                    className={`px-3 py-2 w-[100px] rounded-full text-sm font-medium border border-black/10 mx-auto ${getStatusColor(
                      transaction.status
                    )}`}
                  >
                    {transaction.status
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </div>
                </td>

                {/* Confirm Button */}
                <td className="p-3 text-start rounded-e-xl border-y border-e-1 border-black/10">
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => confirmOrder(transaction.orders?.id)}
                      className="p-2 bg-[var(--color-primary)] text-white rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Confirm Order"
                      disabled={
                        !transaction.orders?.id ||
                        transaction.orders?.delivery === "picked"
                      }
                    >
                      <FaCheck size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Rows */}
      {loading && transactions.length > 0 && (
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

export default UpgradeHistory;
