import React, { useState } from "react";
import { FiEye } from "react-icons/fi";

const ProductsHis = () => {
  // Static array of products
  const productsArray = [
    {
      sn: "001",
      productName: "Wireless Headphones",
      productId: "PRD1001",
      price: "₦15,000",
      status: "Available",
      stockist: "tech_hub",
      dateTime: { date: "2025-10-08", time: "10:00 AM" },
    },
    {
      sn: "002",
      productName: "Smart Watch",
      productId: "PRD1002",
      price: "₦25,000",
      status: "Out of Stock",
      stockist: "gadget_zone",
      dateTime: { date: "2025-10-07", time: "12:30 PM" },
    },
    {
      sn: "003",
      productName: "Bluetooth Speaker",
      productId: "PRD1003",
      price: "₦10,000",
      status: "Available",
      stockist: "sound_plus",
      dateTime: { date: "2025-10-06", time: "03:15 PM" },
    },
    {
      sn: "004",
      productName: "Gaming Mouse",
      productId: "PRD1004",
      price: "₦8,500",
      status: "Available",
      stockist: "tech_store",
      dateTime: { date: "2025-10-05", time: "09:45 AM" },
    },
    {
      sn: "005",
      productName: "Laptop Bag",
      productId: "PRD1005",
      price: "₦7,000",
      status: "Out of Stock",
      stockist: "carry_case",
      dateTime: { date: "2025-10-04", time: "02:00 PM" },
    },
    {
      sn: "006",
      productName: "USB-C Charger",
      productId: "PRD1006",
      price: "₦5,000",
      status: "Available",
      stockist: "plug_inn",
      dateTime: { date: "2025-10-03", time: "04:50 PM" },
    },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const lastPage = Math.ceil(productsArray.length / perPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Get current page items
  const currentProducts = productsArray.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // Status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-[#dff7ee]/80 text-[var(--color-primary)]";
      case "out of stock":
        return "bg-[#c51236]/20 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Modal state
  const [selectedRow, setSelectedRow] = useState(null);

  const handleViewClick = (row) => setSelectedRow(row);
  const closeModal = () => setSelectedRow(null);

  return (
    <div className="bg-[var(--color-tetiary)]">
      <div className="overflow-x-auto">
        {/* Header */}
        <div className="flex justify-between py-3 font-semibold text-black/60 bg-[var(--color-tetiary)] min-w-[900px] text-center uppercase text-[17px]">
          <span className="text-start ps-4 w-[8%]">S/N</span>
          <span className="text-start w-[20%]">Product Name</span>
          <span className="w-[15%] text-center">Product ID</span>
          <span className="w-[15%] text-center">Price</span>
          <span className="w-[12%] text-center">Status</span>
          <span className="w-[15%] text-center">Stockist</span>
          <span className="w-[15%] text-center">Date</span>
          <span className="w-[5%] text-center">View</span>
        </div>

        {/* Rows */}
        <div className="space-y-3 min-w-[900px]">
          {currentProducts.map((row, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center py-3 bg-white rounded-md shadow-sm text-black/80 text-[15px] font-medium hover:bg-gray-50 transition"
            >
              <span className="font-semibold text-[var(--color-primary)] text-start ps-4 w-[8%]">
                {row.sn}
              </span>
              <span className="capitalize px-2 break-words text-sm text-start w-[20%]">
                {row.productName}
              </span>
              <span className="text-sm text-center w-[15%] pe-8">
                {row.productId}
              </span>
              <span className="font-medium text-sm w-[15%] text-center pe-15">
                {row.price}
              </span>
              <span
                className={`px-3 py-2 w-[100px] rounded-[10px] text-xs font-medium border border-black/10 mx-auto text-center ${getStatusColor(
                  row.status
                )}`}
              >
                {row.status}
              </span>
              <span className="w-[15%] text-center text-sm font-medium ps-9">
                {row.stockist}
              </span>
              <span className="text-[var(--color-primary)] font-bold flex flex-col text-sm text-center w-[15%] ps-5">
                <span>{row.dateTime.date}</span>
                <span className="text-[var(--color-primary)] font-bold">
                  {row.dateTime.time}
                </span>
              </span>
              <span className="w-[5%] text-center">
                <FiEye
                  className="h-5 w-5 mx-auto text-[var(--color-primary)] cursor-pointer"
                  onClick={() => handleViewClick(row)}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex justify-center items-center gap-2 py-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded transition ${
              currentPage === 1
                ? "bg-gray-200 opacity-50 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            ‹
          </button>

          {Array.from({ length: lastPage }, (_, i) => i + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === lastPage ||
                (page >= currentPage - 2 && page <= currentPage + 2)
            )
            .map((page, i, arr) => (
              <React.Fragment key={page}>
                {i > 0 && arr[i - 1] !== page - 1 && <span>...</span>}
                <button
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded transition ${
                    page === currentPage
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === lastPage}
            className={`px-3 py-1 rounded transition ${
              currentPage === lastPage
                ? "bg-gray-200 opacity-50 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            ›
          </button>
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
                <span className="font-semibold">S/N:</span> {selectedRow.sn}
              </p>
              <p>
                <span className="font-semibold">Product Name:</span>{" "}
                {selectedRow.productName}
              </p>
              <p>
                <span className="font-semibold pe-2">Product ID:</span>{" "}
                {selectedRow.productId}
              </p>
              <p>
                <span className="font-semibold">Price:</span>{" "}
                {selectedRow.price}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {selectedRow.status}
              </p>
              <p>
                <span className="font-semibold ps-3 bore">Stockist:</span>{" "}
                {selectedRow.stockist}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {selectedRow.dateTime.date} ({selectedRow.dateTime.time})
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
