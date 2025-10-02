import { ShoppingCart } from "lucide-react";
import React from "react";

const ProductModal = ({ product, closeAction, onAddToCart,onRemoveFromCart, productQuantity }) => {
  const { product_name, imageSrc, product_description, product_pv, price } = product;

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeAction}
          className="absolute top-4 right-4 text-black cursor-pointer text-3xl lg:text-2xl"
        >
          &times;
        </button>
        <div className="p-6 flex lg:flex-row items-center flex-col gap-6">
          <div className="w-full lg:w-1/3 lg:h-1/2 h-[200px]">
            <img
              src={imageSrc}
              alt={product_name}
              className="w-full h-full object-contain bg-gray-100 rounded-md"
            />
          </div>
          <div className="flex flex-col gap-1 w-full lg:w-[70%]">
            <h2 className="text-xl font-bold text-black flex flex-col gap-2">
              {product_name}{" "}
              <span className="text-xl font-semibold text-green-600 ml-2">
                ₦{price.toLocaleString()}
              </span>
            </h2>
            <p className="text-[16px] font-medium text-black lg:text-justify leading-relaxed mb-4">
              {product_description}
            </p>
            <div className="text-sm font-bold text-black mb-6">
              Product Point Value: <span className="text-primary">{product_pv}PV</span>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
