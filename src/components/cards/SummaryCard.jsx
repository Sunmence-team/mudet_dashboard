import React from "react";
import { toast } from "sonner";
import api from "../../utilities/api";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const SummaryCard = ({ items, subtotal, user, stockistId }) => {
  const total = subtotal.reduce((acc, product) => {
    return acc + product.price * product.quantity;
  }, 0);

  const handlePurchase = async () => {
    try {
      const payload = {
        user_id: user?.id, // get from context or props
        stockist_id: stockistId, // pass dynamically
        products: subtotal.map((p) => ({
          product_id: p.id,
          quantity: p.quantity,
        })),
        method: "manual",
      };

      const response = await api.post(`${API_URL}/api/buy-product`, payload);

      console.log("Purchase response:", response.data);

      if (response.status === 200) {
        toast.success(response.data.message || "Order placed successfully!");
        // you can also clear cart here if needed
      } else {
        toast.error(response.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error purchasing:", error);

      if (
        error.response?.data?.message?.toLowerCase().includes("unauthenticated")
      ) {
        toast.error("Session expired. Please login again.");
        // logout(); // if you have logout available
      } else {
        toast.error(
          error.response?.data?.message || "An error occurred during checkout"
        );
      }
    }
  };

  return (
    <div className="w-full bg-white border border-gray-300 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
      <h2 className="text-lg font-semibold">Order Summary</h2>
      <div className="flex justify-between text-black font-semibold">
        <span>Items</span>
        <span>{items}</span>
      </div>
      <div className="flex justify-between text-black font-semibold">
        <span>Subtotal</span>
        <span>₦{total.toLocaleString()}</span>
      </div>
      <hr className="border-gray-300" />
      <div className="flex justify-between font-semibold text-primary">
        <span>Total</span>
        <span>₦{total.toLocaleString()}</span>
      </div>
      <hr className="border-gray-300" />
      <button
        className="bg-primary text-white py-2 rounded-full w-full transition"
        onClick={handlePurchase}
      >
        Proceed
      </button>
    </div>
  );
};

export default SummaryCard;
