import React, { useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import api from "../../../utilities/api";
import LazyLoader from "../../../components/LazyLoader";
import PaginationControls from "../../../utilities/PaginationControls";

const WithdrawHistory = () => {
  const { user } = useUser();
  const [withdrawalsData, setWithdrawalsData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = user?.id;

  const fetchWithdrawals = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      if (!userId) {
        console.error("User ID is undefined. Please log in.");
        setWithdrawalsData({
          data: [],
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0,
        });
        setError("User not logged in. Please log in to view withdrawals.");
        return;
      }

      const response = await api.get(`/api/user/${userId}/withdraw?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            user?.token || JSON.parse(localStorage.getItem("user") || "{}").token
          }`,
        },
      });

      console.log("API Response:", response); // Debug: Inspect full response
      console.log("Extracted Data:", response.data.data?.data); // Debug: Check extracted data

      if (response.data.ok) {
        const responseData = response.data.data?.data || [];
        setWithdrawalsData({
          data: Array.isArray(responseData) ? responseData : [],
          current_page: page,
          last_page: Math.ceil((response.data.data?.total || 0) / 10),
          per_page: 10,
          total: response.data.data?.total || 0,
        });
      } else {
        console.warn("Non-successful response:", response.data);
        setWithdrawalsData({
          data: [],
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0,
        });
        setError("Failed to fetch withdrawal data. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
      setWithdrawalsData({
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
      });
      setError(
        err.response?.status === 404
          ? "Withdrawal endpoint not found. Please verify the API URL."
          : "An error occurred while fetching withdrawals. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= withdrawalsData.last_page) {
      fetchWithdrawals(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "successful":
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

  const formatId = (index) => String(index + 1).padStart(3, "0");

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

  const { data: withdrawals, current_page, per_page } = withdrawalsData;

  console.log("Withdrawals before render:", withdrawals); // Debug: Check withdrawals value

  return (
    <div className="bg-[var(--color-tetiary)]">
      <div className="overflow-x-auto">
        {/* Header */}
        <div className="flex justify-between py-3 font-semibold text-black/60 bg-[var(--color-tetiary)] w-full text-center uppercase text-[17px]">
          <span className="text-start ps-4 w-[15%]">SN</span>
          <span className="text-start w-[25%]">Bonus Type</span>
          <span className="w-[20%] text-center">Amount</span>
          <span className="w-[20%] text-center">Status</span>
          <span className="text-end pe-8 w-[20%]">Date</span>
        </div>

        {/* Table Body */}
        <div className="space-y-3 min-w-[700px]">
          {loading ? (
            <div className="text-center py-4">
              <LazyLoader />
              <span className="text-black/60">Loading...</span>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-600">{error}</div>
          ) : !Array.isArray(withdrawals) || withdrawals.length === 0 ? (
            <div className="text-center py-4">No withdrawal records found.</div>
          ) : (
            withdrawals.map((row, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center py-3 bg-white rounded-md shadow-sm text-black/80 text-[15px] font-medium hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-[var(--color-primary)] text-start ps-4 w-[15%]">
                  {formatId(idx + (current_page - 1) * per_page)}
                </span>
                <span className="capitalize text-sm text-start w-[25%]">
                  {(row.transaction_type || "Withdrawal").replace(/_/g, " ")}
                </span>
                <span className="font-medium text-sm w-[20%] text-center">
                  ₦{row.amount ? parseFloat(row.amount).toLocaleString() : "N/A"}
                </span>
                <span
                  className={`px-3 py-2 w-[100px] rounded-[10px] text-xs font-medium border border-black/10 mx-auto text-center ${getStatusColor(
                    row.status
                  )}`}
                >
                  {(row.status || "N/A")
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
                <span className="text-[var(--color-primary)] font-bold flex flex-col text-sm text-center w-[20%] items-center lg:ps-43 ps-6">
                  <span>{formatDateTime(row.created_at).date}</span>
                  <span>{formatDateTime(row.created_at).time}</span>
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {withdrawalsData.last_page > 1 && (
        <div className="mt-6 flex justify-center">
          <PaginationControls
            currentPage={current_page}
            totalPages={withdrawalsData.last_page}
            setCurrentPage={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default WithdrawHistory;