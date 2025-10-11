import React, { useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import api from "../../../utilities/api";
import LazyLoader from "../../../components/loaders/LazyLoader";
import PaginationControls from "../../../utilities/PaginationControls";
import { formatISODateToCustom } from "../../../utilities/formatterutility";

const Deposit = () => {
  const { user, token } = useUser();
  const [depositsData, setDepositsData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  const userId = user?.id;

  const fetchDeposits = async (page = 1) => {
    setLoading(true);
    try {
      if (!userId || token) {
        console.error("User ID or token is undefined. Please log in.");
        setDepositsData({
          data: [],
          current_page: 1,
          last_page: 1,
          per_page: 15,
          total: 0,
        });
        return;
      }

      const response = await api.get(
        `/api/users/${user?.id}/fund-e-wallets?page=${page}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("response", response);

      if (response.data.ok) {
        setDepositsData({
          data: response.data.data.data || [],
          current_page: page,
          last_page: Math.ceil((response.data.data.total || 0) / 15),
          per_page: 15,
          total: response.data.data.total || 0,
        });
      } else {
        setDepositsData({
          data: [],
          current_page: 1,
          last_page: 1,
          per_page: 15,
          total: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching deposits:", err);
      setDepositsData({
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const { data: deposits, current_page, last_page } = depositsData;

  useEffect(() => {
    fetchDeposits();
  }, [userId, token, current_page]);

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

  return (
    <div className="bg-[var(--color-tetiary)]">
      {/* Table container */}
      <div className="overflow-x-auto">
        {/* Header */}
        <div className="flex justify-between py-3 font-semibold text-black/60 bg-[var(--color-tetiary)] w-full text-center uppercase text-[17px]">
          <span className="text-start ps-4 w-[15%]">SN</span>
          <span className="text-start w-[25%]">Type</span>
          <span className="w-[20%] text-center">Amount</span>
          <span className="w-[20%] text-center">Status</span>
          <span className="text-end pe-8 w-[20%]">Date</span>
        </div>

        {/* Rows */}
        <div className="space-y-3 w-full">
          {loading ? (
            <div className="text-center py-4">
              <LazyLoader />
              <span className="text-black/60">Loading...</span>
            </div>
          ) : deposits.length === 0 ? (
            <div className="text-center py-4">No deposits found.</div>
          ) : (
            deposits.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className="flex justify-between items-center py-3 bg-white rounded-md shadow-sm text-black/80 text-[15px] font-medium hover:bg-gray-50 transition"
                >
                  {/* SN */}
                  <span className="font-semibold text-[var(--color-primary)] text-start ps-4 w-[15%]">
                    {String(idx+1).padStart(3, "0")}
                  </span>

                  {/* Type */}
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
                    <span>{formatISODateToCustom(item.created_at).split(" ")[0]}</span>
                    <span className="text-[var(--color-primary)] font-bold pe-2">
                      {formatISODateToCustom(item.created_at).split(" ")[1]}
                    </span>
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pagination - only show if more than 1 page */}
      {last_page > 1 && (
        <div className="mt-6 flex justify-center">
          <PaginationControls
            currentPage={current_page}
            totalPages={last_page}
            setCurrentPage={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Deposit;
