import React, { useState, useEffect }, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";
import api from "../../../utilities/api";
import LazyLoader from "../../../components/loaders/LazyLoader";
import { toast } from "sonner";
import { useUser } from "../../../context/UserContext";
import api from "../../../utilities/api";
import LazyLoader from "../../../components/LazyLoader";

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
    <div className="overflow-x-auto min-w-full">
      <table className="w-full">
        <thead>
          <tr className="text-black/70 text-xs font-semibold uppercase">
            <th className="ps-2 p-5 text-start">SN</th>
            <th className="p-5 text-center">Product Name</th>
            <th className="p-5 text-center">Total In Stock</th>
            <th className="ps-2 p-5 text-end">Total Sold</th>
          </tr>
        </thead>

        <tbody className="space-y-3 w-full mt-8">
          {loading ? (
            <tr className="text-center py-4">
              <td colSpan={4}>
                <LazyLoader color="var(--color-primary)" width="35px" />
              </td>
            </tr>
          ) : error ? (
            <tr className="text-center text-red-500 text-lg py-4">
              <td colSpan={4}>{error}</td>
            </tr>
          ) : products.length === 0 ? (
            <tr className="text-center text-black/60 text-lg py-4">
              <td colSpan={4}>No products found.</td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr
                key={index}
                className="bg-white text-sm font-medium text-center capitalize"
              >
                {/* SN */}
                <td className="p-3 text-primary text-start rounded-s-lg border-y border-s-1 border-black/10">
                  {String(index + 1).padStart(3, "000")}
                </td>

                {/* Product Name */}
                <td className="p-4 border-y border-black/10">
                  {product.product_name}
                </td>

                {/* Total In Stock */}
                <td className="p-4 border-y border-black/10">
                  {product.total_in_stock}
                </td>

                {/* Total Sold */}
                <td className="p-4 text-end text-sm text-pryClr font-semibold border-e-1 rounded-e-lg border-y border-black/10">
                  {product.total_sold}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryHistory;
