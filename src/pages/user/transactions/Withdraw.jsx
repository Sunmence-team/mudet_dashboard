import React, { useState } from "react";
import PaginationControls from "../../../utilities/PaginationControls";

const WithdrawHistory = () => {
  // Static array of withdrawals
  const transactionsArray = [
    {
      transactionType: "Withdrawal",
      amount: "₦50,000",
      status: "Success",
      dateTime: { date: "2025-10-08", time: "10:00 AM" },
    },
    {
      transactionType: "Withdrawal",
      amount: "₦25,000",
      status: "Pending",
      dateTime: { date: "2025-10-07", time: "01:30 PM" },
    },
    {
      transactionType: "Withdrawal",
      amount: "₦70,000",
      status: "Failed",
      dateTime: { date: "2025-10-06", time: "09:15 AM" },
    },
  ];

  // Pagination setup
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const lastPage = Math.ceil(transactionsArray.length / perPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Slice data per page
  const currentTransactions = transactionsArray.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // Status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-[#dff7ee]/80 text-[var(--color-primary)]";
      case "failed":
        return "bg-[#c51236]/20 text-red-600";
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Format ID (001, 002...)
  const formatId = (index) =>
    index + 1 < 10 ? `00${index + 1}` : `${index + 1}`;

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
          {currentTransactions.map((row, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center py-3 bg-white rounded-md shadow-sm text-black/80 text-[15px] font-medium hover:bg-gray-50 transition"
            >
              <span className="font-semibold text-[var(--color-primary)] text-start ps-4 w-[15%]">
                {formatId(idx + (currentPage - 1) * perPage)}
              </span>

              <span className="capitalize text-sm text-start w-[25%]">
                {row.transactionType}
              </span>

              <span className="font-medium text-sm w-[20%] text-center">
                {row.amount}
              </span>

              <span
                className={`px-3 py-2 w-[100px] rounded-[10px] text-xs font-medium border border-black/10 mx-auto text-center ${getStatusColor(
                  row.status
                )}`}
              >
                {row.status}
              </span>

              {/* Date & Time */}
              <span className="text-[var(--color-primary)] font-bold flex flex-col text-sm text-center w-[20%] items-center lg:ps-43 ps-6">
                <span>{row.dateTime.date}</span>
                <span>{row.dateTime.time}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {/* Pagination */}
      {lastPage > 1 && (
        <div className="mt-6 flex justify-center">
          <PaginationControls
            currentPage={currentPage}
            totalPages={lastPage}
            setCurrentPage={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default WithdrawHistory;
