import React from "react";

const SummaryCard = ({ items, subtotal }) => {
  const total = subtotal.reduce((acc, product) => {
    return acc + product.price * product.quantity;
  }, 0);
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
        <span>Subtotal</span>
        <span>₦{total.toLocaleString()}</span>
      </div>
      <hr className="border-gray-300" />
      <button className="bg-primary text-white py-2 rounded-full w-full transition">
        Proceed
      </button>
    </div>
  );
};

export default SummaryCard;
