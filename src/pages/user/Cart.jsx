import React, { useEffect, useState } from "react";
import CartCard from "../../components/cards/CartCard";
import CartNotFound from "../../components/CartNotFound";
import SummaryCard from "../../components/cards/SummaryCard";
import { useUser } from "../../context/UserContext";

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const {user} = useUser()

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("carts")) || [];
    setCartProducts(storedCart);
  }, []);

  const handleAddToCart = (product) => {
    const updatedCart = cartProducts.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    );
    localStorage.setItem("carts", JSON.stringify(updatedCart));
    setCartProducts(updatedCart);
  };

  const handleRemoveFromCart = (id) => {
    const updatedCart = cartProducts
      .map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);
    localStorage.setItem("carts", JSON.stringify(updatedCart));
    setCartProducts(updatedCart);
  };

  const handleDelete = (id) => {
    const updatedCart = cartProducts.filter((item) => item.id !== id);
    localStorage.setItem("carts", JSON.stringify(updatedCart));
    setCartProducts(updatedCart);
  };


  return (
    <>
      {cartProducts.length === 0 ? (
        <div className="w-full mx-auto">
          <CartNotFound />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Cart</h2>
          <div className="flex w-full justify-between lg:items-start gap-6 lg:flex-row flex-col">
            <div className="flex flex-col gap-5 lg:w-2/3 sm:w-full">
              {cartProducts.map((product) => (
                <CartCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            <div className="lg:w-1/3 w-full">
              <SummaryCard items={cartProducts.length} subtotal={cartProducts} user={user}/>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
