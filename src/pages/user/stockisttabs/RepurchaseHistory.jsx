import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";
import api from "../../../utilities/api";
import PaginationControls from "../../../utilities/PaginationControls";
import { FaCheck } from "react-icons/fa";
import LazyLoader from "../../../components/loaders/LazyLoader";
import { formatterUtility, formatTransactionType } from "../../../utilities/formatterutility";


const RepurchaseHistory = () => {
  const { user, token, refreshUser } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const userId = user?.id;

  // Get status color classes
  const getStatusColor = (status) => {
    switch (status) {
      case "success":
      case "picked":
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

      console.log("Repurchase history response:", response);

      if (response.data.ok && response.data.transactions) {
        // Filter for manual_purchase transactions only
        const filteredTransactions = response.data.transactions.data.filter(
          (transaction) => transaction.transaction_type === "manual_purchase"
        );

        console.log("filteredTransactions", filteredTransactions)

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
    <div>
      <div className="overflow-x-auto min-w-full">
        <table className="w-full">
          <thead>
            <tr className="text-black/70 text-[12px] uppercase font-semibold">
              <td className="ps-2 p-5 text-start">SN</td>
              <td className="p-5 text-center">Product Name(s) & Qty</td>
              <td className="p-5 text-center">Transaction Type</td>
              <td className="p-5 text-center">Amount</td>
              <td className="p-5 text-center">Status</td>
              <td className="pe-2 p-5 text-end">Action</td>
            </tr>
          </thead>

          <tbody className="">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-8">
                  <LazyLoader color={"green"} />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-red-500 text-lg">{error}</td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-black/60">No manual purchase transactions found.</td>
              </tr>
            ) : (
              transactions.map((transaction, index) => (
                <tr
                  key={index}
                  className="bg-white text-sm text-center capitalize"
                >
                  {/* SN */}
                  <td className="p-3 text-start rounded-s-lg border-y border-s-1 border-black/10 font-semibold text-primary">
                    {String(index + 1).padStart(3, "0")}
                  </td>

                  {/* Product Names with Quantities */}
                  <td className="p-4 border-y border-black/10 whitespace-pre">
                    {transaction.orders?.products
                      ?.map((product) => `${product.product_name.trim()} (Qty: ${product.product_quantity})`)
                      .join(", \n") || "N/A"}
                  </td>

                  {/* Transaction Type */}
                  <td className="p-4 border-y border-black/10">
                    {formatTransactionType(transaction.transaction_type)}
                  </td>

                  {/* Amount */}
                  <td className="p-4 border-y border-black/10">
                    {formatterUtility(transaction.amount)}
                  </td>

                  {/* Status */}
                  <td className="p-4 border-y border-black/10">
                    <div
                      className={`px-3 py-2 w-[100px] rounded-full text-sm font-medium border border-black/10 mx-auto ${getStatusColor(
                        transaction.orders?.delivery
                      )}`}
                    >
                      {transaction.orders?.delivery
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </div>
                  </td>

                  {/* Confirm Button */}
                  <td className="p-4 text-end text-sm text-pryClr font-semibold border-e-1 rounded-e-lg border-y border-black/10">
                    <button
                      onClick={() => confirmOrder(transaction.orders?.id)}
                      className="p-2 bg-[var(--color-primary)] text-white rounded-md cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Confirm Order"
                      disabled={
                        !transaction.orders?.id ||
                        transaction.orders?.delivery === "picked"
                      }

                    >
                      <FaCheck size={16} />
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && transactions.length > 0 && (
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