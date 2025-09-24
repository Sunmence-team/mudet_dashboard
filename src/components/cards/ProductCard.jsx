import { ShoppingCart } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import ProductModal from "../modals/ProductModal";

const ProductCard = ({ product }) => {
  const { id, title, imageSrc, description, pv, price } = product;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productQuantity, setProductQuantity] = useState(null);

  // Load quantity for this product when component mounts
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("carts")) || [];
    const existingItem = cart.find((item) => item.id === id);
    setProductQuantity(existingItem ? existingItem.quantity : null);
  }, [id]);

  const onAddToCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("carts")) || [];
      const existingIndex = cart.findIndex((item) => item.id === id);

      if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("carts", JSON.stringify(cart));
      setProductQuantity(cart.find((item) => item.id === id)?.quantity || null);

      toast.success(`${title} added to cart`);
    } catch (error) {
      console.error(error);
      toast.error(`Unable to add ${title} to cart`);
    }
  };

  const onRemoveFromCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("carts")) || [];
      const existingIndex = cart.findIndex((item) => item.id === id);

      if (existingIndex !== -1) {
        if (cart[existingIndex].quantity > 1) {
          cart[existingIndex].quantity -= 1;
        } else {
          cart.splice(existingIndex, 1);
        }
      }

      localStorage.setItem("carts", JSON.stringify(cart));
      const updatedItem = cart.find((item) => item.id === id);
      setProductQuantity(updatedItem ? updatedItem.quantity : null);

      toast.success(`${title} removed from cart`);
    } catch (error) {
      console.error(error);
      toast.error(`Unable to remove ${title} from cart`);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-center mb-4">
          <img
            src={imageSrc}
            alt={title}
            className="h-48 object-contain rounded-md bg-gray-100 w-full"
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 text-justify">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 text-justify leading-relaxed">
          {description.slice(0, 80)}...
        </p>

        <div className="flex justify-between mb-4 items-center">
          <div className="text-lg font-bold text-primary">
            Price: ₦{price.toLocaleString()}
          </div>
          <div className="text-xs text-secondary">Pv: {pv}</div>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center gap-1">
            <button
              onClick={onAddToCart}
              disabled={productQuantity ? true : false}
              className={`${
                productQuantity ? "w-2/3" : "w-full"
              } bg-primary cursor-pointer flex items-center justify-center gap-2 text-white font-medium text-sm py-3 px-4 rounded-full transition-colors`}
            >
              <ShoppingCart size={15} />
              Add to cart
            </button>

            {productQuantity ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={onRemoveFromCart}
                  className="border border-gray-400 py-1 px-4 rounded-2xl cursor-pointer text-2xl"
                >
                  -
                </button>
                <span>{productQuantity}</span>
                <button
                  onClick={onAddToCart}
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
          onAddToCart={onAddToCart}
          onRemoveFromCart={onRemoveFromCart}
          productQuantity={productQuantity}
        />
      )}
    </>
  );
};

export default ProductCard;
