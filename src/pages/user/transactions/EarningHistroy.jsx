import React, { useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import api from "../../../utilities/api";
import LazyLoader from "../../../components/loaders/LazyLoader";
import PaginationControls from "../../../utilities/PaginationControls";
import { toast } from "sonner";
import { formatISODateToCustom, formatterUtility, formatTransactionType } from "../../../utilities/formatterutility";

const EarningWallet = () => {
  const { user, token } = useUser();
  const [earningData, setEarningData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  const userId = user?.id;

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      if (!userId) {
        // console.error("User ID is undefined. Please log in.");
        return;
      }

      const response = await api.get(
        `/api/users_repurchase/${user?.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
            perPage: perPage
          }
        }
      );

      console.log("response", response);

      if (response.status === 200) {
        const { data, current_page, last_page, per_page } = response.data.data;
        console.log("data",data)
        setEarningData(data);
        setCurrentPage(current_page);
        setLastPage(last_page);
        setPerPage(per_page);
      } else {
        throw new Error(response.data.message || "Failed to fetch Earnings history.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred fetching Earnings history!.");
      // console.error("Error fetching earnings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [token, user?.id, currentPage]);

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

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="font-semibold text-black/60 w-full text-center uppercase text-sm">
              <td className="text-start ps-2 p-5">SN</td>
              <td className="p-5 text-center">Type</td>
              <td className="p-5 text-center">Amount</td>
              <td className="p-5 text-center">Status</td>
              <td className="text-end pe-2 p-5">Date</td>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-8">
                  <LazyLoader color={"green"} />
                </td>
              </tr>
            ) : earningData.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No earning records found.
                </td>
              </tr>
            ) : (
              earningData.map((item, idx) => {
                const serialNumber = (currentPage - 1) * perPage + idx + 1;
                return (
                  <tr
                    key={idx}
                    className="bg-white font-medium capitalize text-center text-sm"
                  >
                    <td className="p-3 text-start rounded-s-lg border-y border-s-1 border-black/10 font-semibold text-[var(--color-primary)]">
                      {String(serialNumber).padStart(3, "0")}
                    </td>
                    <td className="p-4 border-y border-black/10">
                      {formatTransactionType(item.transaction_type, true)}
                    </td>
                    <td className="font-medium text-sm text-center">
                      {formatterUtility(item.amount)}
                    </td>
                    <td className="p-4 border-y border-black/10">
                      <div
                        className={`px-4 py-2 w-max rounded-full text-xs font-medium border-black/10 border mx-auto ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </div>
                    </td>
                    <td className="p-4 text-end text-sm text-primary font-semibold border-e-1 rounded-e-lg border-y border-black/10">
                      <span>{formatISODateToCustom(item.created_at).split(" ")[0]}</span>
                      <span className="text-[var(--color-primary)] font-bold block">
                        {formatISODateToCustom(item.created_at).split(" ")[1]}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && lastPage > 1 && (
        <div className="mt-4">
          <PaginationControls
            currentPage={currentPage}
            totalPages={lastPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default EarningWallet;
