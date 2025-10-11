import React, { useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";
import { useUser } from "../../../context/UserContext";
import api from "../../../utilities/api";
import LazyLoader from "../../../components/loaders/LazyLoader";
import PaginationControls from "../../../utilities/PaginationControls";
import {
  formatISODateToCustom,
  formatterUtility,
  formatTransactionType,
} from "../../../utilities/formatterutility";

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
        `/api/users/${user?.id}/manual-purchases?page=${page}`,
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

      console.log("response", response);

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "success":
      case "picked":
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
  const filteredProducts =
    activeTab === "all"
      ? products
      : products.filter(
          (row) =>
            row.orders?.delivery?.toLowerCase() === activeTab.toLowerCase()
        );

  return (
    <div className="">
      {/* <div className="mb-4 w-full max-w-xs">
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
      </div> */}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          {/* Header */}
          <thead>
            <tr className="font-semibold text-black/60 text-center uppercase text-xs">
              <td className="text-start ps-4">S/N</td>
              <td className="text-center">Product Name</td>
              <td className="text-center">Order ID</td>
              <td className="text-center">Price</td>
              <td className="text-center">Delivery Status</td>
              <td className="text-center">Stockist</td>
              <td className="text-center">Date</td>
              <td className="text-center">Action</td>
            </tr>
          </thead>

          {/* Rows */}
          <tbody className="space-y-4">
            {loading ? (
              <tr className="text-center py-4">
                <td colSpan={8}>
                  <LazyLoader />
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr className="text-center py-4">
                <td colSpan={8} className="">
                  No purchase records found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((row, idx) => {
                const product = row.orders?.products?.[0] || {};
                const stockist = row.orders?.stockist || {};
                const serialNumber = (current_page - 1) * per_page + idx + 1;
                return (
                  <tr
                    key={idx}
                    className="bg-white rounded-xl text-sm text-center text-black/80 font-medium transition"
                  >
                    <td className="p-4 text-start text-sm text-pryClr font-semibold border-s-1 rounded-s-lg border-y border-black/10">
                      {serialNumber.toString().padStart(3, "0")}
                    </td>
                    <td className="p-4 border-y border-black/10">
                      {formatTransactionType(row.transaction_type, true) ||
                        "N/A"}
                    </td>
                    <td className="p-4 border-y border-black/10">
                      {row.ref_no || "N/A"}
                    </td>
                    <td className="p-4 border-y border-black/10">
                      {product.price
                        ? formatterUtility(Number(product.price))
                        : "N/A"}
                    </td>
                    <td className={"p-4 border-y border-black/10"}>
                      <span
                        className={`px-3 py-2 w-[100px] rounded-full text-xs font-medium border border-black/10 mx-auto text-center ${getStatusColor(
                          row.orders?.delivery || "N/A"
                        )}`}
                      >
                        {(row.orders?.delivery || "N/A")
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </td>
                    <td className="p-4 border-y border-black/10">
                      {stockist.username || "N/A"}
                    </td>
                    <td className="p-4 border-y border-black/10">
                      <div className="flex flex-col text-primary font-semibold">
                        <span>
                          {formatISODateToCustom(row.created_at).split(" ")[0]}
                        </span>
                        <span>
                          {formatISODateToCustom(row.created_at).split(" ")[1]}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-end text-sm text-pryClr font-semibold border-e-1 rounded-e-lg border-y border-black/10">
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
                            dateTime: formatISODateToCustom(row.created_at),
                            serialNumber,
                          })
                        }
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
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
            <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-4">
              Product Details
            </h2>
            <div className="space-y-2 text-[15px]">
              <p>
                <span className="font-semibold">S/N:</span>{" "}
                {selectedRow.serialNumber.toString().padStart(3, "0")}
              </p>
              <p>
                <span className="font-semibold">Product Name:</span>{" "}
                {selectedRow.product_name || "N/A"}
              </p>
              <p>
                <span className="font-semibold pe-2">Order ID:</span>{" "}
                {selectedRow.order_id || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Price:</span>{" "}
                {selectedRow.price
                  ? `₦${parseFloat(selectedRow.price).toLocaleString()}`
                  : "N/A"}
              </p>
              <p>
                <span className="font-semibold">Delivery Status:</span>{" "}
                {(selectedRow.status || "N/A")
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </p>
              <p>
                <span className="font-semibold ps-3 bore">Stockist:</span>{" "}
                {selectedRow.stockist || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {selectedRow.dateTime}
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
