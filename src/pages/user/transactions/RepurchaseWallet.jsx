import React, { useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";
import { useUser } from "../../../context/UserContext";
import api from "../../../utilities/api";
import LazyLoader from "../../../components/LazyLoader";
import PaginationControls from "../../../utilities/PaginationControls";

const RepurchaseWallet = () => {
  const { user } = useUser();
  const [repurchaseData, setRepurchaseData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);

  const userId = user?.id;

  const fetchRepurchase = async (page = 1) => {
    setLoading(true);
    try {
      if (!userId) {
        console.error("User ID is undefined. Please log in.");
        setRepurchaseData({
          data: [],
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0,
        });
        return;
      }

      const response = await api.get(`/api/users/${userId}/fund-purchased-wallets?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            user?.token || JSON.parse(localStorage.getItem("user") || "{}").token
          }`,
        },
      });

      if (response.status === 200) {
        setRepurchaseData({
          data: response?.data?.data?.data || [],
          current_page: page,
          last_page: Math.ceil((response.data.total || 0) / 10),
          per_page: 10,
          total: response.data.total || 0,
        });
      } else {
        setRepurchaseData({
          data: [],
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching repurchase data:", err);
      setRepurchaseData({
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepurchase();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= repurchaseData.last_page) {
      fetchRepurchase(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
    switch (status?.toLowerCase()) {
      case "success":
      case "successful":
      case "delivered":
        return "bg-[#dff7ee]/80 text-[var(--color-primary)]";
      case "failed":
      case "out of stock":
        return "bg-[#c51236]/20 text-red-600";
      case "pending":
      case "pending_manual":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const closeModal = () => setSelectedRow(null);

  const { data: repurchases, current_page, per_page } = repurchaseData;

  return (
    <div className="bg-[var(--color-tetiary)]">
      <div className="overflow-x-auto">
        {/* Header */}
        <div className="flex justify-between py-3 font-semibold text-black/60 bg-[var(--color-tetiary)] min-w-[900px] text-center uppercase text-[17px]">
          <span className="text-start ps-4 w-[8%]">S/N</span>
          <span className="text-start w-[20%]">Transaction ID</span>
          <span className="w-[15%] text-center">Amount</span>
          <span className="w-[12%] text-center">Status</span>
          <span className="w-[15%] text-center">Type</span>
          <span className="w-[15%] text-center">Date</span>
        </div>

        {/* Rows */}
        <div className="space-y-3 min-w-[900px]">
          {loading ? (
            <div className="text-center py-4">
              <LazyLoader />
              <span className="text-black/60">Loading...</span>
            </div>
          ) : repurchases.length === 0 ? (
            <div className="text-center py-4">No repurchase records found.</div>
          ) : (
            repurchases.map((row, idx) => {
              const { date, time } = formatDateTime(row.created_at);
              const serialNumber = (current_page - 1) * per_page + idx + 1;
              return (
                <div
                  key={idx}
                  className="flex justify-between items-center py-3 bg-white rounded-md shadow-sm text-black/80 text-[15px] font-medium hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-[var(--color-primary)] text-start ps-4 w-[8%]">
                    {serialNumber.toString().padStart(3, "0")}
                  </span>
                  <span className="capitalize px-2 break-words text-sm text-start w-[20%] lg:ps-10 ps-7">
                    {row.ref_no || "N/A"}
                  </span>
                  <span className="font-medium text-sm w-[15%] text-center lg:ps-43 ps-22">
                    ₦{row.amount ? parseFloat(row.amount).toLocaleString() : "N/A"}
                  </span>
                  <span
                    className={`px-3 py-2 w-[100px] rounded-[10px] text-xs font-medium border border-black/20 mx-auto text-center lg:me-30 me-13 ${getStatusColor(
                      row.status || "N/A"
                    )}`}
                  >
                    {(row.status || "N/A").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                  <span className="w-[15%] text-sm font-medium lg:ps-9 ps-4 pe-9">
                    {(row.transaction_type || "N/A").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                  <span className="text-[var(--color-primary)] font-bold flex flex-col text-sm text-center w-[15%] ps-5">
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
      {repurchaseData.last_page > 1 && (
        <div className="mt-4">
          <PaginationControls
            currentPage={current_page}
            totalPages={repurchaseData.last_page}
            setCurrentPage={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default RepurchaseWallet;