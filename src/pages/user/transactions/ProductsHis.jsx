import React, { useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";
import { useUser } from "../../../context/UserContext";
import api from "../../../utilities/api";
import LazyLoader from "../../../components/LazyLoader";
import PaginationControls from "../../../utilities/PaginationControls";

const ProductsHis = () => {
  const { user } = useUser();
  const [productsData, setProductsData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "delivered", label: "Delivered" },
  ];

  const userId = user?.id;

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      if (!userId) {
        console.error("User ID is undefined. Please log in.");
        setProductsData({
          data: [],
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0,
        });
        return;
      }

      // Note: Endpoint uses hardcoded user ID '2'. Consider using `userId` for dynamic user data: `/api/users/${userId}/manual-purchases`
      const response = await api.get(
        `/api/users/2/manual-purchases?page=${page}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              user?.token ||
              JSON.parse(localStorage.getItem("user") || "{}").token
            }`,
          },
        }
      );

      if (response.status === 200) {
        setProductsData({
          data: response.data.data || [],
          current_page: page,
          last_page: Math.ceil((response.data.total || 0) / 10),
          per_page: 10,
          total: response.data.total || 0,
        });
      } else {
        setProductsData({
          data: [],
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProductsData({
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= productsData.last_page) {
      fetchProducts(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-CA"),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
      case "success":
      case "successful":
      case "available":
        return "bg-[#dff7ee]/80 text-[var(--color-primary)]";
      case "out of stock":
      case "failed":
        return "bg-[#c51236]/20 text-red-600";
      case "pending":
      case "pending_manual":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const closeModal = () => setSelectedRow(null);

  const { data: products, current_page, per_page } = productsData;

  // Filter products based on activeTab
  const filteredProducts = activeTab === "all"
    ? products
    : products.filter((row) => row.orders?.delivery?.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="bg-[var(--color-tetiary)]">
      {/* Select Dropdown */}
      <div className="mb-4 w-full max-w-xs">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="appearance-none w-full bg-white border border-black/20 text-[var(--color-primary)] font-medium px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-black/20 focus:border-black/20 outline-0 transition duration-200 cursor-pointer"
          aria-label="Select delivery status"
        >
          {tabs.map((tab) => (
            <option key={tab.value} value={tab.value}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        {/* Header */}
        <div className="flex justify-between py-3 font-semibold text-black/60 bg-[var(--color-tetiary)] min-w-[900px] text-center uppercase text-[17px]">
          <span className="text-start ps-4 w-[8%]">S/N</span>
          <span className="text-start w-[20%]">Product Name</span>
          <span className="w-[15%] text-center">Order ID</span>
          <span className="w-[15%] text-center">Price</span>
          <span className="w-[12%] text-center">Delivery Status</span>
          <span className="w-[15%] text-center">Stockist</span>
          <span className="w-[15%] text-center">Date</span>
          <span className="w-[5%] text-center">View</span>
        </div>

        {/* Rows */}
        <div className="space-y-3 min-w-[900px]">
          {loading ? (
            <div className="text-center py-4">
              <LazyLoader />
              <span className="text-black/60">Loading...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-4">No purchase records found.</div>
          ) : (
            filteredProducts.map((row, idx) => {
              const { date, time } = formatDateTime(row.created_at);
              const product = row.orders?.products?.[0] || {};
              const stockist = row.orders?.stockist || {};
              const serialNumber = (current_page - 1) * per_page + idx + 1;
              return (
                <div
                  key={idx}
                  className="flex justify-between items-center py-3 bg-white rounded-md shadow-sm text-black/80 text-[15px] font-medium hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-[var(--color-primary)] text-start ps-4 w-[8%]">
                    {serialNumber.toString().padStart(3, "0")}
                  </span>
                  <span className="capitalize px-2 break-words text-sm text-start w-[20%]">
                    {product.product_name || "N/A"}
                  </span>
                  <span className="text-sm text-center w-[15%] pe-8">{row.ref_no || "N/A"}</span>
                  <span className="font-medium text-sm w-[15%] text-center pe-15">
                    ₦{product.price ? parseFloat(product.price).toLocaleString() : "N/A"}
                  </span>
                  <span
                    className={`px-3 py-2 w-[100px] rounded-[10px] text-xs font-medium border border-black/10 mx-auto text-center ${getStatusColor(
                      row.orders?.delivery || "N/A"
                    )}`}
                  >
                    {(row.orders?.delivery || "N/A").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                  <span className="w-[15%] text-center text-sm font-medium ps-9">
                    {stockist.username || "N/A"}
                  </span>
                  <span className="text-[var(--color-primary)] font-bold flex flex-col text-sm text-center w-[15%] ps-5">
                    <span>{date}</span>
                    <span className="text-[var(--color-primary)] font-bold">{time}</span>
                  </span>
                  <span className="w-[5%] text-center">
                    <FiEye
                      className="h-5 w-5 mx-auto text-[var(--color-primary)] cursor-pointer"
                      onClick={() =>
                        setSelectedRow({
                          ...row,
                          product_name: product.product_name,
                          order_id: row.ref_no,
                          price: product.price,
                          status: row.orders?.delivery,
                          stockist: stockist.username,
                          dateTime: { date, time },
                          serialNumber,
                        })
                      }
                    />
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pagination */}
      {productsData.last_page > 1 && (
        <div className="mt-4">
          <PaginationControls
            currentPage={current_page}
            totalPages={productsData.last_page}
            setCurrentPage={handlePageChange}
          />
        </div>
      )}

      {/* Modal */}
      {selectedRow && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-lg p-6 relative">
            <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Product Details</h2>
            <div className="space-y-2 text-[15px]">
              <p><span className="font-semibold">S/N:</span> {selectedRow.serialNumber.toString().padStart(3, "0")}</p>
              <p><span className="font-semibold">Product Name:</span> {selectedRow.product_name || "N/A"}</p>
              <p><span className="font-semibold pe-2">Order ID:</span> {selectedRow.order_id || "N/A"}</p>
              <p>
                <span className="font-semibold">Price:</span>{" "}
                {selectedRow.price ? `₦${parseFloat(selectedRow.price).toLocaleString()}` : "N/A"}
              </p>
              <p>
                <span className="font-semibold">Delivery Status:</span>{" "}
                {(selectedRow.status || "N/A").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </p>
              <p><span className="font-semibold ps-3 bore">Stockist:</span> {selectedRow.stockist || "N/A"}</p>
              <p>
                <span className="font-semibold">Date:</span> {selectedRow.dateTime.date} ({selectedRow.dateTime.time})
              </p>
            </div>
            <button
              onClick={closeModal}
              className="mt-5 w-full py-2 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:bg-opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsHis;