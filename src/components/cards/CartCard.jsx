import React from "react";
import { BsTrashFill } from "react-icons/bs";

const CartCard = ({ product, onAddToCart, onRemoveFromCart, onDelete }) => {
  const { id, title, imageSrc, quantity, price } = product;

  return (
    <>
      <div className="lg:flex sm:hidden md:flex hidden w-full bg-white border border-gray-300 rounded-2xl py-3 px-4 justify-between items-center flex-row">
        <div className="flex lg:flex-row flex-col gap-4 lg:items-center">
          <img
            src={imageSrc}
            alt={title}
            className="bg-gray-200 pt-3 px-4 rounded-[8px] h-20 object-contain"
          />
          <h1 className="text-base font-semibold">{title}</h1>
        </div>

        <div className="flex items-center gap-3 font-medium">
          <button
            onClick={() => onRemoveFromCart(id)}
            className="border border-gray-400 py-1 px-2 rounded-2xl cursor-pointer text-2xl"
            disabled={quantity === 1 ? true : false}
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="border border-gray-400 py-1 px-2 rounded-2xl cursor-pointer text-2xl"
          >
            +
          </button>
        </div>

        <div className="font-semibold">
          <h4>₦{price.toLocaleString()}</h4>
        </div>

        <div className="text-primary font-extrabold">
          <BsTrashFill
            className="cursor-pointer"
            onClick={() => onDelete(id)}
          />
        </div>
      </div>

      <div className="sm:flex md:hidden lg:hidden flex bg-white border border-gray-300 rounded-2xl py-3 px-4 justify-between items-start flex-row gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-3 font-medium">
            <button
              onClick={() => onRemoveFromCart(id)}
              className="border border-gray-400 py-1 px-2 rounded-2xl cursor-pointer text-2xl"
              disabled={quantity === 1 ? true : false}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => onAddToCart(product)}
              className="border border-gray-400 py-1 px-2 rounded-2xl cursor-pointer text-2xl"
            >
              +
            </button>
          </div>
          <div className="flex flex-row gap-2 lg:items-center">
            <div className="h-[10%]">
              <img
                src={imageSrc}
                alt={title}
                className="bg-gray-200 pt-3 px-4 rounded-[8px] h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-base font-semibold">{title}</h1>
              <h4>₦{price.toLocaleString()}</h4>
            </div>
          </div>
        </div>
        <div className="text-primary font-extrabold">
          <BsTrashFill
            className="cursor-pointer"
            onClick={() => onDelete(id)}
          />
        </div>
      </div>
    </>
  );
};

export default CartCard;
