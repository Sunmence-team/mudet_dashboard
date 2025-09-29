import React, { useState, useEffect } from "react";
import ProductCard from "../../components/cards/ProductCard";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Products = () => {
  const { token, logout } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/allproducts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Products Response:", response);

      if (response.status === 200) {
        setProducts(response.data.products || response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);

      if (error.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
        logout();
        toast.error("Session expired. Please login again.");
      } else {
        toast.error(error.response?.data?.message || "Error loading Products");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const displayProducts = products;

  // loading state UI
  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-6 justify-center items-center min-h-[400px]">
        <h3 className="text-2xl font-semibold">Loading Products</h3>
        <div className="border-[6px] border-t-transparent border-pryClr animate-spin mx-auto rounded-full w-[80px] h-[80px]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Products</h2>
      <div className="grid lg:grid-cols-4 grid-cols-1 gap-3 sm:grid-cols-2">
        {displayProducts.length > 0 ? (
          displayProducts.map((product, index) => (
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
