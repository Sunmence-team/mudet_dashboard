import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";
import api from "../../../utilities/api";
import LazyLoader from "../../../components/loaders/LazyLoader";

const InventoryHistory = () => {
  const { user, token } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = user?.id;

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!userId) throw new Error("User ID not found. Please log in.");
      if (!token) throw new Error("No authentication token found. Please log in.");

      const response = await api.get(`/api/stockists/${userId}/products`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Product history response:", JSON.stringify(response.data, null, 2));

      if (response.data.ok && response.data.products) {
        setProducts(response.data.products || []);
      } else {
        throw new Error(response.data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch products";
      setError(errorMessage);
      toast.error(errorMessage);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [userId, token]);

  return (
    <div className="bg-[var(--color-tetiary)] w-full flex items-center justify-center py-12">
      {/* Table container */}
      <div className="overflow-x-auto w-[95%]">
        {/* Header */}
        <div className="flex justify-between py-3 font-semibold text-black/60 bg-[var(--color-tetiary)] w-full text-center uppercase text-[17px]">
          <span className="text-start ps-4 w-[15%]">SN</span>
          <span className="text-start w-[35%]">Product Name</span>
          <span className="w-[25%] text-center">Total In Stock</span>
          <span className="w-[25%] text-center">Total Sold</span>
        </div>

        {/* Rows */}
        <div className="space-y-3 w-full mt-8">
          {loading ? (
            <div className="text-center py-4">
              <LazyLoader color="var(--color-primary)" width="35px" />
              <span className="text-black/60">Loading...</span>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500 text-lg">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-4 text-black/60">No products found.</div>
          ) : (
            products.map((product, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-6 bg-white rounded-md shadow-sm text-black/80 font-medium hover:bg-gray-50 transition"
              >
                {/* SN */}
                <span className="font-semibold text-[var(--color-primary)] text-start ps-4 w-[15%]">
                  {index + 1}
                </span>

                {/* Product Name */}
                <span className="capitalize px-2 break-words text-base text-start w-[35%]">
                  {product.product_name}
                </span>

                {/* Total In Stock */}
                <span className="font-medium text-base w-[25%] text-center">
                  {product.total_in_stock}
                </span>

                {/* Total Sold */}
                <span className="font-medium text-base w-[25%] text-center">
                  {product.total_sold}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryHistory;
