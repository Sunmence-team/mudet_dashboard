import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("carts")) || [];
        setCart(savedCart);
    }, []);

    // Save to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem("carts", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        console.log("Adding", product);
        setCart((prevCart) => {
            const updated = [...prevCart];
            const index = updated.findIndex((item) => item.id === product.id);

            if (index !== -1) {
                updated[index].quantity += 1;
            } else {
                updated.push({ ...product, quantity: 1 });
            }

            return updated;
        });
    };


    const decrementFromCart = (productId) => {
        setCart((prevCart) => {
            const updated = prevCart
                .map((item) =>
                item.id === productId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
                )
                .filter((item) => item.quantity > 0);

            return updated;
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                decrementFromCart,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
