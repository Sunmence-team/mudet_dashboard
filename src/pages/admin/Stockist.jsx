import React, { useState, useEffect } from "react";
import { FaSpinner, FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import api from "../../utilities/api";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { formatTransactionType } from "../../utilities/formatterutility";
import PaginationControls from "../../utilities/PaginationControls";
import LazyLoader from "../../components/loaders/LazyLoader";

const Stockist = () => {
    const { token } = useUser();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("requests");
    const [requests, setRequests] = useState([]);
    const [stockists, setStockists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingEnable, setLoadingEnable] = useState({});
    const [loadingUpgrade, setLoadingUpgrade] = useState(null);
    const [upgradeData, setUpgradeData] = useState({ id: null, location: "" });
    const [showProductPopup, setShowProductPopup] = useState(false);
    const [selectedStockistId, setSelectedStockistId] = useState(null);
    const [productTransactions, setProductTransactions] = useState([]);
    const [popupLoading, setPopupLoading] = useState(false);
    const [formData, setFormData] = useState([{ product_name: "", quantity: "" }]);
    const [allProducts, setAllProducts] = useState([]);
    const [stockistUsername, setStockistUsername] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    

    useEffect(() => {
        if (activeTab === "requests") fetchRequests();
        else fetchStockists();
        fetchAllProducts();
    }, [activeTab, token]);

    const fetchRequests = async (url = "/api/get_stockist-requests") => {
        try {
            if (!token) {
                toast.error("No authentication token found. Please log in.");
                return;
            }
            const response = await api.get(url, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            console.log("fetchRequests response:", response);
            const { data, current_page, last_page, per_page } = response.data.data;
            setRequests(data);
            setCurrentPage(current_page);
            setLastPage(last_page);
            setPerPage(per_page);
        } catch (error) {
            console.error("Error fetching requests:", error);
            toast.error(error.response?.data?.message || "Failed to fetch requests.");
        } finally {
            setLoading(false);
        }
    };

    const fetchStockists = async (url = "/api/stockists") => {
        try {
            if (!token) {
                toast.error("No authentication token found. Please log in.");
                return;
            }
            const response = await api.get(url, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });

            console.log("fetchStockists response:", response);
            setStockists(response.data.data || []);
        } catch (error) {
            console.error("Error fetching stockists:", error);
            toast.error(error.response?.data?.message || "Failed to fetch stockists.");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllProducts = async () => {
        try {
            if (!token) {
                toast.error("No authentication token found. Please log in.");
                return;
            }
            const response = await api.get("/api/allproducts", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });
            console.log("fetchAllProducts raw response:", response.data);
            const products = Array.isArray(response.data)
                ? response.data
                : response.data.data || [];
            console.log("Parsed allProducts:", products);
            setAllProducts(products);
        } catch (error) {
            console.error("Error fetching all products:", error);
            toast.error(error.response?.data?.message || "Failed to fetch products.");
        }
    };

    const handleEnableStockist = async (item) => {
        setLoadingEnable(prev => ({ ...prev, [item?.user_id]: true }));
        try {
            if (!token) {
                toast.error("No authentication token found. Please log in.");
                return;
            }
            const payload = { stockist_plan: item?.stockist_plan, stockist_location: item?.stockist_location };
            const response = await api.post(`/api/users/${item?.user_id}/enable-stockist`, payload, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            console.log("handleEnableStockist response:", response);
            if (response.data.message) {
                toast.success(response.data.message);
                fetchRequests();
            }
        } catch (error) {
            console.error("Error enabling stockist:", error);
            toast.error(error.response?.data?.message || "Failed to enable stockist.");
        } finally {
            setLoadingEnable(prev => ({ ...prev, [item?.user_id]: false }));
        }
    };

    const handleUpgrade = async (id) => {
        setLoadingUpgrade(id);
        try {
            if (!token) {
                toast.error("No authentication token found. Please log in.");
                return;
            }
            const payload = { new_plan: "max_owner", stockist_location: upgradeData.location };
            const response = await api.post(`/api/users/${id}/upgrade-stockist`, payload, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            console.log("handleUpgrade response:", JSON.stringify(response.data, null, 2));
            if (response.data.message) {
                toast.success(response.data.message);
                setUpgradeData({ id: null, location: "" });
                fetchStockists();
            }
        } catch (error) {
            console.error("Error upgrading stockist:", error);
            toast.error(error.response?.data?.message || "Failed to upgrade stockist.");
        } finally {
            setLoadingUpgrade(null);
        }
    };

    const handleViewProducts = async (id) => {
        setSelectedStockistId(id);
        setPopupLoading(true);
        setShowProductPopup(true);
        document.body.style.overflow = "hidden"; // Prevent background scroll
        try {
            if (!token) {
                toast.error("No authentication token found. Please log in.");
                return;
            }
            const response = await api.get(`/api/stockists/${id}/products`, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            console.log("handleViewProducts response:", JSON.stringify(response.data, null, 2));
            setProductTransactions(response.data.products || []);
            setStockistUsername(response.data.stockist?.name || "N/A");
        } catch (error) {
            console.error("Error fetching product transactions:", error);
            toast.error(error.response?.data?.message || "Failed to fetch product transactions.");
            setProductTransactions([]);
            setStockistUsername("N/A");
        } finally {
            setPopupLoading(false);
        }
    };

    const handleSubmitProducts = async () => {
        setPopupLoading(true);
        try {
            if (!token) {
                toast.error("No authentication token found. Please log in.");
                return;
            }
            const payload = { products: formData.filter(item => item.product_name && item.quantity) };
            const response = await api.post(`/api/upgrade-stockist-products/${selectedStockistId}`, payload, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            console.log("handleSubmitProducts response:", response.data);
            if (response.data.message) {
                toast.success(response.data.message);
                setShowProductPopup(false);
                setSelectedStockistId(null);
                setProductTransactions([]);
                setFormData([{ product_name: "", quantity: "" }]);
                fetchStockists(); // Refresh stockists table
            }
        } catch (error) {
            console.error("Error updating products:", error);
            toast.error(error.response?.data?.message || "Failed to update products.");
        } finally {
            setPopupLoading(false);
        }
    };

    const addProductField = () => {
        setFormData([...formData, { product_name: "", quantity: "" }]);
    };

    const updateFormData = (index, field, value) => {
        const newFormData = [...formData];
        newFormData[index][field] = value;
        setFormData(newFormData);
    };

    const closePopup = () => {
        setShowProductPopup(false);
        setSelectedStockistId(null);
        setProductTransactions([]);
        setFormData([{ product_name: "", quantity: "" }]);
        setUpgradeData({ id: null, location: "" });
        document.body.style.overflow = "auto"; // Restore background scroll
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "success":
                return "bg-tetiary text-primary border border-primary/50";
            case "failed":
                return "bg-red-100 text-red-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800 border border-black/50";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const renderTable = (data, title) => {
        const isRequests = title === "Stockist Requests";
        return (
            <div className="rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="text-black/70 uppercase">
                                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider">S/N</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider">Username</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold tracking-wider">Name</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold tracking-wider">Location</th>
                                {isRequests && <th className="px-6 py-3 text-center text-xs font-semibold tracking-wider">Payment Status</th>}
                                <th className="px-6 py-3 text-center text-xs font-semibold tracking-wider">Plan</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={isRequests ? 7 : 5} className="text-center py-6">
                                        <LazyLoader 
                                            color={"green"}
                                            size={30}
                                        />
                                    </td>
                                </tr>
                            ) : !Array.isArray(data) || data.length === 0 ? (
                                <tr>
                                    <td colSpan={isRequests ? 7 : 6} className="text-center py-6 text-gray-500">
                                        No data found.
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, idx) => {
                                    const user = isRequests ? item.user : item;
                                    return (
                                        <tr key={idx} className="bg-white rounded-xl text-sm transition-colors">
                                            <td className="px-6 py-4 border-y border-black/10 border-s-1 rounded-s-lg whitespace-nowrap text-sm text-gray-900">{String(idx+1).padStart(3, "0") || "N/A"}</td>
                                            <td className="px-6 py-4 text-center border-y border-black/10 whitespace-nowrap text-sm text-gray-900">{user.username || "N/A"}</td>
                                            <td className="px-6 py-4 capitalize text-center border-y border-black/10 whitespace-nowrap text-sm text-gray-900">
                                                {`${user.first_name || ""} ${user.last_name || ""}`.trim() || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-center border-y border-black/10 whitespace-nowrap text-sm text-gray-900">{item.stockist_location || "N/A"}</td>
                                            {isRequests && (
                                                <td className="px-6 py-4 border-y border-black/10 whitespace-nowrap text-center">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-medium ${getStatusColor(item.status)}`}>
                                                        {item.status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                                                    </span>
                                                </td>
                                            )}
                                            <td className="px-6 py-4 capitalize text-center border-y border-black/10 whitespace-nowrap text-sm text-gray-900">{formatTransactionType(item.stockist_plan) || "N/A"}</td>
                                            <td className="px-6 py-4 border-y border-black/10 border-e-1 rounded-e-lg whitespace-nowrap text-sm">
                                                {isRequests ? (
                                                    <button
                                                        onClick={() => handleEnableStockist(item)}
                                                        disabled={loadingEnable[item.user_id]}
                                                        className={`flex ms-auto items-center space-x-2 px-4 py-2 rounded-full ${loadingEnable[item.user_id] ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-primary text-white hover:bg-primary"}`}
                                                        title="Enable Stockist"
                                                    >
                                                        {loadingEnable[item.user_id] ? <FaSpinner className="animate-spin h-4 w-4" /> : <FaCheck className="h-4 w-4" />}
                                                        <span>Enable</span>
                                                    </button>
                                                ) : (
                                                    <div className="flex justify-end space-x-4">
                                                        <button
                                                            onClick={() => setUpgradeData({ id: item.id, location: item.stockist_location })}
                                                            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-primary text-white hover:bg-primary"
                                                            title="Upgrade"
                                                        >
                                                            <FaEdit className="h-4 w-4" />
                                                            <span>Upgrade</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleViewProducts(item.id)}
                                                            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200"
                                                            title="View Products"
                                                        >
                                                            <span>View Products</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                {!loading && data.length > 0 && (
                    <div className="flex justify-center items-center gap-2 p-4">
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={lastPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-center gap-6 mb-6">
                    <button
                        onClick={() => { setActiveTab("requests"); setLoading(true); }}
                        className={`px-6 py-2 rounded-lg font-medium ${activeTab === "requests" ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    >
                        Requests
                    </button>
                    <button
                        onClick={() => { setActiveTab("stockists"); setLoading(true); }}
                        className={`px-6 py-2 rounded-lg font-medium ${activeTab === "stockists" ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    >
                        Approved Stockists
                    </button>
                </div>
                {activeTab === "requests" ? renderTable(requests, "Stockist Requests") : renderTable(stockists, "Approved Stockists")}
                {upgradeData.id && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={closePopup}>
                        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-6 shadow-2xl overflow-y-auto max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Upgrade Stockist</h3>
                            <button
                                onClick={() => setUpgradeData({ id: null, location: "" })}
                                className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 text-3xl font-bold"
                            >
                                &times;
                            </button>
                            <input
                                type="text"
                                value={upgradeData.location}
                                onChange={(e) => setUpgradeData({ ...upgradeData, location: e.target.value })}
                                placeholder="New Location (e.g., Paara)"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                            />
                            <div className="flex justify-end gap-6 mt-8">
                                <button
                                    onClick={() => setUpgradeData({ id: null, location: "" })}
                                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 text-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleUpgrade(upgradeData.id)}
                                    disabled={loadingUpgrade === upgradeData.id}
                                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary transition duration-200 text-lg disabled:bg-primary"
                                >
                                    {loadingUpgrade === upgradeData.id ? <FaSpinner className="animate-spin h-6 w-6" /> : "Upgrade"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showProductPopup && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={closePopup}>
                        <div className="bg-white rounded-xl p-8 max-w-4xl w-full mx-6 shadow-2xl overflow-y-auto max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Manage Stockist Products - Username: {stockistUsername}</h2>
                            <button
                                onClick={closePopup}
                                className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 text-4xl font-bold"
                            >
                                &times;
                            </button>
                            {popupLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <FaSpinner className="animate-spin h-12 w-12 text-primary" />
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Current Products</h3>
                                        <ul className="list-disc pl-6 text-gray-600 space-y-4">
                                            {productTransactions.length > 0 ? (
                                                productTransactions.map((product, index) => (
                                                    <li key={index} className="text-lg">
                                                        {product.product_name} - In Stock: {product.total_in_stock}, Sold: {product.total_sold}
                                                    </li>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-lg">No products available.</p>
                                            )}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-700 mb-6">Add/Update Products</h3>
                                        <div className="space-y-6">
                                            {formData.map((item, index) => (
                                                <div key={index} className="flex gap-6 items-end">
                                                    <select
                                                        value={item.product_name}
                                                        onChange={(e) => updateFormData(index, "product_name", e.target.value)}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                                                    >
                                                        <option value="">Select a product</option>
                                                        {allProducts.map((product) => (
                                                            <option key={product.id} value={product.product_name}>
                                                                {product.product_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => updateFormData(index, "quantity", e.target.value)}
                                                        placeholder="Quantity"
                                                        className="w-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                                                        min="1"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={addProductField}
                                            className="mt-6 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary transition duration-200 text-lg"
                                        >
                                            Add Another Product
                                        </button>
                                    </div>
                                    <div className="flex justify-end gap-6 mt-8">
                                        <button
                                            onClick={closePopup}
                                            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 text-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSubmitProducts}
                                            disabled={popupLoading || !formData.some(item => item.product_name && item.quantity)}
                                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary transition duration-200 text-lg disabled:bg-primary"
                                        >
                                            {popupLoading ? <FaSpinner className="animate-spin h-6 w-6" /> : "Submit Products"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Stockist;