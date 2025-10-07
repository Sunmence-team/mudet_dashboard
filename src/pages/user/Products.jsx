import React, { useState, useEffect } from "react";
import ProductCard from "../../components/cards/ProductCard";
import { toast } from "sonner";
import api, { setupInterceptors } from "../../utilities/api"; // ensure this is imported

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // optional logout handler (you can define what happens on logout)
  const logout = () => {
    localStorage.removeItem("token");
    toast.error("Session expired. Please log in again.");
    window.location.href = "/login";
  };

  useEffect(() => {
    setupInterceptors(logout);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // since baseURL is already set in api.js, just call the endpoint directly
      const response = await api.get("/api/allproducts");

      console.log("API response:", response.data);

      // handle different response shapes safely
      const productsData = response.data?.data || response.data || [];

      if (Array.isArray(productsData) && productsData.length > 0) {
        setProducts(productsData);
      } else {
        toast.info("No products found.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error loading products";

      // don’t auto logout unless token is invalid
      if (
        error.response?.status === 401 ||
        message.toLowerCase().includes("unauthenticated")
      ) {
        logout();
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Loading State
  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-6 justify-center items-center min-h-[400px]">
        <h3 className="text-2xl font-semibold">Loading Products...</h3>
        <div className="border-[6px] border-t-transparent border-pryClr animate-spin mx-auto rounded-full w-[80px] h-[80px]"></div>
      </div>
    );
  }

  // 🧩 Product List
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Products</h2>
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3">
        {products.length > 0 ? (
          products.map((product, index) => (
            <ProductCard product={product} key={product.id || index} />
          ))
        ) : (
          <div className="lg:col-span-4 sm:col-span-2 text-center py-8">
            <p className="text-gray-500">No products available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
