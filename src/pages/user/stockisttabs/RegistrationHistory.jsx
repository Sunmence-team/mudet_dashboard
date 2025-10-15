import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";
import api from "../../../utilities/api";
import PaginationControls from "../../../utilities/PaginationControls";
import { FaCheck } from "react-icons/fa";
import LazyLoader from "../../../components/loaders/LazyLoader";
import {
  formatterUtility,
  formatTransactionType,
} from "../../../utilities/formatterutility";
import WarningModal from "../../../components/modals/WarningModal";

const RegistrationHistory = () => {
  const { user, token, refreshUser } = useUser();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const apiItemsPerPage = 5;

  const userId = user?.id;

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

  const fetchRegistration = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!userId) throw new Error("User ID not found. Please log in.");
      if (!token)
        throw new Error("No authentication token found. Please log in.");

      const response = await api.get(`/api/stockists/${userId}/reg`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          perPage: apiItemsPerPage
        }
      });

      // console.log("Registration history response:", response);

      if (response.status === 200 && response.data.success) {
        const { data, current_page, last_page } = response.data.registrations;

        setRegistrations(data || []);
        setCurrentPage(current_page);
        setTotalPages(last_page);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch registrations"
        );
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch registrations";
      setError(errorMessage);
      toast.error(errorMessage);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

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
        fetchRegistration();
        refreshUser();
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

  const handleConfirmClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const handlePositiveAction = async () => {
    setIsConfirming(true);
    await confirmOrder(selectedOrderId);
    setIsConfirming(false);
    setShowModal(false);
  };

  const handleNegativeAction = () => {
    setShowModal(false);
  };

  useEffect(() => {
    fetchRegistration();
  }, [currentPage, userId, token]);

  return (
    <div>
      <div className="overflow-x-auto min-w-full">
        <table className="w-full">
          <thead>
            <tr className="text-black/70 text-[12px] uppercase font-semibold">
              <th className="ps-2 p-5 text-start">SN</th>
              <th className="p-5 text-center">Order id</th>
              <th className="p-5 text-center">Product Name(s) & Qty</th>
              <th className="p-5 text-center">Transaction Type</th>
              <th className="p-5 text-center">Amount</th>
              <th className="p-5 text-center">username</th>
              <th className="p-5 text-center">Status</th>
              <th className="pe-2 p-5 text-end">Action</th>
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
                <td
                  colSpan={6}
                  className="text-center py-4 text-red-500 text-lg"
                >
                  {error}
                </td>
              </tr>
            ) : registrations.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-black/60">
                  No manual purchase registrations found.
                </td>
              </tr>
            ) : (
              registrations.map((transaction, index) => (
                <tr
                  key={index}
                  className="bg-white text-sm text-center capitalize"
                >
                  {/* SN */}
                  <td className="p-3 text-start rounded-s-lg border-y border-s-1 border-black/10 font-semibold text-primary">
                    {String(index + 1).padStart(3, "0")}
                  </td>

                  {/* Order Id */}
                  <td className="p-3 text-center rounded-s-lg border-y border-black/10 font-semibold text-primary">
                    <p className="max-w-[100px] mx-auto text-xs">{transaction?.ref_no}</p>
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
                    {formatTransactionType(transaction.transaction_type)}
                  </td>

                  {/* Amount */}
                  <td className="p-4 border-y border-black/10">
                    {formatterUtility(transaction.amount)}
                  </td>

                  {/* USERNAME */}
                  <td className="p-3 text-center rounded-s-lg border-y border-black/10 font-semibold text-primary">
                    {transaction?.user?.username}
                  </td>

                  {/* Status */}
                  <td className="p-4 border-y border-black/10">
                    <div
                      className={`px-3 py-2 w-[100px] rounded-full text-sm font-medium border border-black/10 mx-auto ${getStatusColor(
                        transaction?.orders?.delivery
                      )}`}
                    >
                      {transaction.orders?.delivery}
                      {/* {transaction.orders?.delivery
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())} */}
                    </div>
                  </td>

                  {/* Confirm Button */}
                  <td className="p-4 text-end text-sm text-pryClr font-semibold border-e-1 rounded-e-lg border-y border-black/10">
                    <button
                      onClick={() => handleConfirmClick(transaction.orders?.id)}
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

      {!loading && registrations.length > 0 && (
        <div className="mt-4">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
      {showModal && (
        <WarningModal
          title="Confirm Order"
          message="Are you sure you want to confirm this order?"
          positiveAction={handlePositiveAction}
          negativeAction={handleNegativeAction}
          isPositive={isConfirming}
        />
      )}
    </div>
  );
};

export default RegistrationHistory;