import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import ProductModal from "../modals/ProductModal";
import { useCart } from "../../context/CartProvider";

const IMAGE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const ProductCard = ({ product }) => {
  const {
    id,
    product_name,
    product_image,
    product_description,
    product_pv,
    price,
  } = product;
  const { cart, addToCart, decrementFromCart, removeFromCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const existingItem = cart.find((item) => item.id === product.id);
  console.log("existingItem", existingItem)
  const productQuantity = existingItem ? existingItem.quantity : null;

  const handleAdd = (product) => {
    addToCart(product);
    toast.success(`${product.product_name} added to cart`);
  };
  
  const handleDecrement = (product) => {
    decrementFromCart(product.id);
    toast.success(`${product.product_name} quantity decreased`);
  };

  const handleRemove = () => {
    removeFromCart(product.id);
    toast.success(`${product.product_name} removed from cart`);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-center mb-4">
          <img
            src={`${IMAGE_URL}/${product_image}`}
            alt={product_name}
            className="h-48 object-contain rounded-md bg-gray-100 w-full"
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product_name?.slice(0, 25)}...
        </h3>
        <p className="text-sm text-gray-600 mb-4 text-justify leading-relaxed">
          {product_description.length > 80 &&
            `${product_description?.slice(0, 80)}...`}{" "}
          {product_description.length < 80 && product_description}
        </p>

        <div className="flex justify-between mb-4 items-center">
          <div className="text-lg font-bold text-primary">
            Price: ₦{price.toLocaleString()}
          </div>
          <div className="lg:text-base text-sm text-secondary">
            Pv: {product_pv}
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center gap-1 overflow-scroll no-scrollbar">
            <button
              onClick={() => handleAdd(product)}
              disabled={productQuantity ? true : false}
              className={`${
                productQuantity ? "w-2/3" : "w-full"
              } bg-primary cursor-pointer flex items-center justify-center gap-2 text-white font-medium text-sm py-3 px-4 rounded-full transition-colors whitespace-nowrap`}
            >
              <ShoppingCart size={15} />
              Add to cart
            </button>

            {productQuantity ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDecrement(product)}
                  className="border border-gray-400 py-1 px-4 rounded-2xl cursor-pointer text-2xl"
                >
                  -
                </button>
                <span>{productQuantity}</span>
                <button
                  onClick={() => handleAdd(product)}
                  className="border border-gray-400 py-1 px-4 rounded-2xl cursor-pointer text-2xl"
                >
                  +
                </button>
              </div>
            ) : null}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm border py-3 px-4 rounded-full font-medium cursor-pointer"
          >
            More details
          </button>
        </div>
      </div>

      {isModalOpen && (
        <ProductModal
          product={product}
          closeAction={() => setIsModalOpen(false)}
          onAddToCart={() => handleAdd(product)}
          onRemoveFromCart={handleRemove}
          productQuantity={productQuantity}
        />
      )}
    </>
  );
};

export default ProductCard;
