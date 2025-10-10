import React, { useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import api from "../../../utilities/api";
import LazyLoader from "../../../components/loaders/LazyLoader";
import PaginationControls from "../../../utilities/PaginationControls";

const EarningWallet = () => {
  const { user } = useUser();
  const [earningData, setEarningData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  const userId = user?.id;

  const fetchEarnings = async (page = 1) => {
    setLoading(true);
    try {
      if (!userId) {
        console.error("User ID is undefined. Please log in.");
        setEarningData({
          data: [],
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0,
        });
        return;
      }

      // Note: Endpoint uses hardcoded user ID '2'. Consider using `userId` for dynamic user data: `/api/users_repurchase/${userId}`
      const response = await api.get(
        `/api/users_repurchase/${user?.id}?page=${page}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              user?.token ||
              JSON.parse(localStorage.getItem("user") || "{}").token
            }`,
          },
        }
      );

      console.log("response", response);

      if (response.status === 200) {
        setEarningData({
          data: response?.data?.data?.data || [],
          current_page: page,
          last_page: Math.ceil((response?.data?.data?.total || 0) / 10),
          per_page: 10,
          total: response?.data?.data?.total || 0,
        });
      } else {
        setEarningData({
          data: [],
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching earnings:", err);
      setEarningData({
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
    fetchEarnings();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= earningData.last_page) {
      fetchEarnings(page);
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
    switch (status) {
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

  const { data: earnings, current_page, last_page } = earningData;

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
          ) : earnings.length === 0 ? (
            <div className="text-center py-4">No earning records found.</div>
          ) : (
            earnings.map((item, idx) => {
              const { date, time } = formatDateTime(item.created_at);
              return (
                <div
                  key={idx}
                  className="flex justify-between items-center py-3 bg-white rounded-md shadow-sm text-black/80 text-[15px] font-medium hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-[var(--color-primary)] text-start ps-4 w-[15%]">
                    00{idx + 1}
                  </span>
                  <span className="capitalize px-2 break-words text-sm text-start w-[25%]">
                    {item.transaction_type.replace(/_/g, " ")}
                  </span>
                  <span className="font-medium text-sm w-[20%] text-center">
                    ₦{parseFloat(item.amount).toLocaleString()}
                  </span>
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
                  <span className="text-[var(--color-primary)] font-bold flex flex-col text-sm text-end pe-5 ps-2 w-[20%]">
                    <span>{date}</span>
                    <span className="text-[var(--color-primary)] font-bold pe-2">
                      {time}
                    </span>
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pagination */}
      {last_page > 1 && (
        <div className="mt-4">
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

export default EarningWallet;
