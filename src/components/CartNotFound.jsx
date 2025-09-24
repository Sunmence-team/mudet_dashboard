import React from "react";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const CartNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-gray-600 h-[70vh]">
      <div className="bg-gray-100 p-6 rounded-full mb-4">
        <ShoppingCart size={50} className="text-gray-400" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
      <p className="text-sm text-gray-500 mb-6">
        Looks like you haven't added anything to your cart yet.
      </p>
      <Link
        to={"/user/products"}
        className="bg-primary text-white font-medium py-2 px-6 rounded-full hover:bg-primary/90 transition-colors"
      >
        Browse Products
      </Link>
    </div>
  );
};

export default CartNotFound;
