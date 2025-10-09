import React from "react";
import CartCard from "../../components/cards/CartCard";
import CartNotFound from "../../components/CartNotFound";
import SummaryCard from "../../components/cards/SummaryCard";
import { useUser } from "../../context/UserContext";
import { useCart } from "../../context/CartProvider";
import { toast } from "sonner";

const Cart = () => {
  const {user} = useUser()
  const { cart, addToCart, decrementFromCart, removeFromCart } = useCart();

  console.log("cart", cart)

  const handleAdd = (product) => {
    addToCart(product);
    toast.success(`${product.product_name} added to cart`);
  };

  const handleDecrement = (product) => {
    decrementFromCart(product.id);
    toast.success(`${product.product_name} quantity decreased`);
  };

  const handleRemove = (product) => {
    removeFromCart(product?.id);
    toast.success(`${product.product_name} removed from cart`);
  };


  return (
    <>
      {cart.length === 0 ? (
        <div className="w-full mx-auto">
          <CartNotFound />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Cart</h2>
          <div className="flex w-full justify-between lg:items-start gap-6 lg:flex-row flex-col">
            <div className="flex flex-col gap-5 lg:w-2/3 sm:w-full">
              {cart.map((product) => (
                <CartCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAdd(product)}
                  onRemoveFromCart={() => handleDecrement(product)}
                  onDelete={() => handleRemove(product)}
                />
              ))}
            </div>
            <div className="lg:w-1/3 w-full">
              <SummaryCard items={cart.length} subtotal={cart} user={user}/>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
