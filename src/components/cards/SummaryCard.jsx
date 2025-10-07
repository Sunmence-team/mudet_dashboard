import React, { useState } from "react";
import { toast } from "sonner";
import api from "../../utilities/api";

const SummaryCard = ({ items, subtotal, user, stockistId }) => {
  const [loading, setLoading] = useState(false);

  // 🧮 Calculate total
  const total = subtotal.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  // 🛍️ Handle Purchase
  const handlePurchase = async () => {
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
        stockist_id: stockistId,
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
        // Optional: clear cart or redirect
      } else {
        toast.error(response.data.message || "Failed to place order.");
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
    }
  };

  return (
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
        onClick={handlePurchase}
        disabled={loading}
        className={`${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary/90"
        } text-white py-2 rounded-full w-full font-semibold transition`}
      >
        {loading ? "Processing..." : "Proceed"}
      </button>
    </div>
  );
};

export default SummaryCard;
