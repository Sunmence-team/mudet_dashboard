import React from "react";
import { BsTrashFill } from "react-icons/bs";

const IMAGE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const CartCard = ({ product, onAddToCart, onRemoveFromCart, onDelete }) => {
  const { id, product_name, product_image, quantity, price } = product;

  return (
    <>
      {/* Desktop / Tablet View */}
      <div className="hidden md:flex w-full bg-white border border-gray-200 rounded-2xl p-4 justify-between items-center shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-4 min-w-0">
          <img
            src={`${IMAGE_URL}/${product_image}`}
            alt={product_name}
            className="bg-gray-100 rounded-lg w-20 h-20 object-contain flex-shrink-0"
          />
          <h1 className="text-base font-semibold text-gray-800 truncate max-w-[180px]">
            {product_name}
          </h1>
        </div>

        <div className="flex items-center gap-3 font-medium">
          <button
            onClick={() => onRemoveFromCart(id)}
            className="border border-gray-400 py-1 px-4 rounded-2xl cursor-pointer text-2xl"
            disabled={quantity === 1}
            type="button"
          >
            -
          </button>
          <span className="min-w-[24px] text-center">{quantity}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="border border-gray-400 py-1 px-4 rounded-2xl cursor-pointer text-2xl"
            type="button"
          >
            +
          </button>
        </div>

        <h4 className="font-semibold text-gray-900 whitespace-nowrap">
          ₦{(price * quantity).toLocaleString()}
        </h4>

        <BsTrashFill
          className="text-primary cursor-pointer text-lg hover:text-red-600"
          onClick={() => onDelete(id)}
          title="Remove Product"
        />
      </div>

      {/* Mobile View */}
      <div className="flex md:hidden w-full bg-white border border-gray-200 rounded-2xl p-4 flex-col gap-3 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold text-gray-800 max-w-[70%]">
            {product_name}
          </h1>
          <BsTrashFill
            className="text-primary cursor-pointer text-lg hover:text-red-600"
            onClick={() => onDelete(id)}
          />
        </div>

        <div className="flex items-center gap-3">
          <img
            src={`${IMAGE_URL}/${product_image}`}
            alt={product_name}
            className="bg-gray-100 rounded-lg w-20 h-20 object-contain"
          />

          <div className="flex-1 flex flex-col justify-between gap-2">
            <h4 className="font-semibold text-gray-900">
              ₦{(price * quantity).toLocaleString()}
            </h4>

            <div className="flex items-center gap-3 font-medium">
              <button
                onClick={() => onRemoveFromCart(id)}
                className="border border-gray-400 py-1 px-3 rounded-lg text-lg hover:bg-gray-100 disabled:opacity-50"
                disabled={quantity === 1}
                type="button"
              >
                -
              </button>
              <span className="min-w-[24px] text-center">{quantity}</span>
              <button
                onClick={() => onAddToCart(product)}
                className="border border-gray-400 py-1 px-3 rounded-lg text-lg hover:bg-gray-100"
                type="button"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartCard;
