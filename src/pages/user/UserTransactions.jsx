import React, { useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";
import api from "../../utilities/api";

const UserTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    const currentUser = JSON.parse(localStorage.getItem("user"));
    try {
      const res = await api.get(`/api/users_transactions/${currentUser.id}`);
      setTransactions(res.data.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  function formatDate(rawDate) {
    const date = new Date(rawDate);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
  }

  function formatText(rawText) {
    return rawText
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function capitalize(word) {
    if (!word) return "";
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  const formatSerialNumber = (num) => {
    return num.toString().padStart(3, "0");
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="bg-[var(--color-tetiary)] min-h-screen p-4 gap-4 flex flex-col">
      <h2 className="text-2xl font-semibold mb-4">Transactions</h2>

      <div className="overflow-x-auto w-full styled-scrollbar">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-8 border-b border-gray-200 text-xs md:text-sm lg:text-base font-semibold text-black/70 bg-[var(--color-tetiary)]">
          <span className="px-2 py-3">S/N</span>
          <span className="px-2 py-3">Transaction Type</span>
          <span className="px-2 py-3">Ref ID</span>
          <span className="px-2 py-3">Order Amount</span>
          <span className="px-2 py-3">Pickup Status</span>
          <span className="px-2 py-3">Stockist Username</span>
          <span className="px-2 py-3">Date</span>
          <span className="px-2 py-3">Action</span>
        </div>

        {/* Transactions */}
        <div className="divide-y divide-gray-100">
          {loading ? (
            <p className="text-center py-6 text-gray-500">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-center py-6 text-gray-500">
              No transactions found.
            </p>
          ) : (
            transactions.map((transaction, idx) => (
              <div
                key={idx}
                className="grid grid-cols-8 min-w-[600px] md:min-w-0 items-center bg-white text-black/80 text-xs md:text-sm lg:text-base font-medium mb-4 rounded-[10px]"
              >
                <span className="px-2 py-3 ">
                  {formatSerialNumber(idx + 1)}
                </span>
                <span className="px-2 py-3 ">
                  {formatText(transaction.transaction_type)}
                </span>
                <span className="px-2 py-3 ">{transaction.ref_no}</span>
                <span className="px-2 py-3 ">
                  ₦{Number(transaction.amount).toLocaleString()}
                </span>

                {/* Status */}
                <span className="px-2 py-3 ">
                  <span
                    className={`${
                      transaction.status === "success"
                        ? "bg-primary"
                        : transaction.status === "pending"
                        ? "bg-secondary"
                        : "bg-red-500"
                    } text-white px-3 py-1 rounded-full text-[10px] md:text-xs`}
                  >
                    {capitalize(transaction.status)}
                  </span>
                </span>

                {/* Stockist username */}
                <span className="px-2 py-3 ">
                  {transaction.stockist_username || "--"}
                </span>

                <span className="px-2 py-3  text-[var(--color-primary)] font-bold">
                  {formatDate(transaction.updated_at)}
                </span>

                {/* Action */}
                <span className="px-2 py-3 ">
                  <button className="text-[var(--color-primary)] cursor-pointer">
                    <FiEye size={18} />
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTransactions;
