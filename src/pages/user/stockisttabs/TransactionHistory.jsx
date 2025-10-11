import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";
import api from "../../../utilities/api";
import PaginationControls from "../../../utilities/PaginationControls";
import LazyLoader from "../../../components/loaders/LazyLoader";
import { formatISODateToCustom, formatterUtility, formatTransactionType } from "../../../utilities/formatterutility";

const TransactionHistory = () => {
  const { user, token } = useUser();
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

      console.log("Transaction history response:", response);

      if (response.data.ok && response.data.data) {
        setTransactions(response.data.data.data || []);
        setCurrentPage(response.data.data.current_page || 1);
        setTotalPages(response.data.data.last_page || 1);
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

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage, userId, token]);

  return (
    <div>
      <div className="overflow-x-auto min-w-full">
        <table className="w-full">
          <thead>
            <tr className="text-black/70 text-xs uppercase">
              <th className="ps-2 p-5 text-start">SN</th>
              <th className="p-5 text-center">Type</th>
              <th className="p-5 text-center">Amount</th>
              <th className="p-5 text-center">Status</th>
              <th className="pe-2 p-5 text-end">Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-8">
                  <LazyLoader color={"green"} />
                </td>
              </tr>
            ) : error ? (
              <tr className="text-center text-red-500 text-lg py-4">
                <td colSpan={5}>{error}</td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr className="text-center text-black/60 text-lg py-4">
                <td colSpan={5}>No transactions found.</td>
              </tr>
            ) : (
              transactions.map((transaction, index) => {
                return (
                  <tr
                    key={transaction.id}
                    className="bg-white font-medium text-center capitalize"
                  >
                    <td className="font-semibold text-primary p-3 text-start rounded-s-lg border-y border-s-1 border-black/10">
                      {String(index + 1).padStart(3, "0")}
                    </td>
                    <td className="px-4 py-3 border-y border-black/10">
                      {formatTransactionType(transaction.transaction_type, true)}
                    </td>
                    <td className="px-4 py-3 border-y border-black/10">
                      {formatterUtility(transaction.amount)}
                    </td>
                    <td className="px-4 py-3 border-y border-black/10">
                      <div
                        className={`px-3 py-2 w-max rounded-full text-xs font-medium border border-black/10 mx-auto ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </div>
                    </td>
                    <td className="text-primary px-4 py-3 text-end text-sm text-pryClr font-semibold border-e-1 rounded-e-lg border-y border-black/10">
                      <span className="block">{formatISODateToCustom(transaction?.created_at).split(" ")[0]}</span>
                      <span className="block">{formatISODateToCustom(transaction?.created_at).split(" ")[1]}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
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
