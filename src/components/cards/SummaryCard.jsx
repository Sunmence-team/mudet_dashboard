import React, { useState } from "react";
import { toast } from "sonner";
import api from "../../utilities/api";
import PinModal from "../modals/PinModal";

const SummaryCard = ({ items, subtotal, user, stockistId }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedStockist, setSelectedStockist] = useState("");
  const [fetchingStokist, setFetchingStokist] = useState(false);
  const [stockists, setStockists] = useState([]);

  // 🧮 Calculate total
  const total = subtotal.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  const fetchStokists = async () => {
    setFetchingStokist(true);
    try {
      const response = await api.get("/api/stockists");
      setStockists(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setFetchingStokist(false);
    }
  };

  const handleConfirmModal = () => {
    setShowModal(true);
    fetchStokists();
  };

  const handleRequestPin = async () => {
    if (selectedStockist) {
      setShowModal(false);
      setShowPinModal(true);
    }
  };

  const onDecline = () => {
    const transactionPin = localStorage.getItem("currentAuth");
    if (transactionPin) {
      localStorage.removeItem("currentAuth");
      setPinModal(false);
    } else {
      setPinModal(false);
    }
  };

  // 🛍️ Handle Purchase
  const handlePurchase = async () => {
    const transactionPin = localStorage.getItem("currentAuth");

    if (!user?.id) {
      toast.error("User not found. Please log in first.");
      return;
    }

    if (!subtotal || subtotal.length === 0) {
      toast.error("No products to purchase.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        user_id: user.id,
        stockist_id: selectedStockist,
        pin: transactionPin,
        products: subtotal.map((p) => ({
          product_id: p.id,
          quantity: p.quantity,
        })),
        method: "manual",
      };

      const response = await api.post("/api/buy-product", payload);
      console.log("Purchase response:", response.data);

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message || "Order placed successfully!");
        localStorage.removeItem("currentAuth");

        // Optional: clear cart or redirect
      } else {
        toast.error(response.data.message || "Failed to place order.");
        localStorage.removeItem("currentAuth");
      }
    } catch (error) {
      console.error("Error purchasing:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An error occurred during checkout.";

      if (
        error.response?.status === 401 ||
        message.toLowerCase().includes("unauthenticated")
      ) {
        toast.error("Session expired. Please log in again.");
        // logout(); // uncomment if you have logout handler
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
      localStorage.removeItem("currentAuth");
    }
  };

  return (
    <>
      <div className="w-full bg-white border border-gray-300 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>

        <div className="flex justify-between text-gray-700 font-medium">
          <span>Items</span>
          <span>{items}</span>
        </div>

        <div className="flex justify-between text-gray-700 font-medium">
          <span>Subtotal</span>
          <span>₦{total.toLocaleString()}</span>
        </div>

        <hr className="border-gray-200" />

        <div className="flex justify-between font-semibold text-primary">
          <span>Total</span>
          <span>₦{total.toLocaleString()}</span>
        </div>

        <hr className="border-gray-200" />

        <button
          onClick={handleConfirmModal}
          disabled={loading}
          className={`${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90"
          } text-white py-2 rounded-full w-full font-semibold transition`}
        >
          Proceed
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[90%] max-w-md p-6 flex flex-col gap-4">
            <h2 className="text-xl font-semibold mb-2">Confirm Stockist</h2>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium mt-2">
                Select Stockist
              </label>

              <select
                value={selectedStockist}
                onChange={(e) => setSelectedStockist(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
              >
                <option value="">
                  {fetchingStokist
                    ? "Fetching Stockists..."
                    : "-- Select Stockist --"}
                </option>
                {stockists.map((stk) => (
                  <option key={stk.id} value={stk.id}>
                    {stk.first_name} ({stk.stockist_location})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
                disabled={!selectedStockist || loading}
                onClick={handleRequestPin}
              >
                <span>Confirm</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {showPinModal ? (
        <PinModal onClose={onDecline} onConfirm={handlePurchase} user={user} />
      ) : null}
    </>
  );
};

export default SummaryCard;
