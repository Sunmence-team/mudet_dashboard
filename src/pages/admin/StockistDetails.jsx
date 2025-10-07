import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import api from "../../utilities/api";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";
import { useParams, useNavigate } from "react-router-dom";

const StockistDetails = () => {
  const { stockistId } = useParams();
  const { token } = useUser();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [stockistId]);

  const fetchDetails = async () => {
    try {
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }
      const response = await api.get(`/api/stockists/${stockistId}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      console.log("Fetched stockist details:", JSON.stringify(response.data, null, 2));
      setDetails(response.data.data || {});
    } catch (error) {
      console.error("Error fetching stockist details:", error);
      toast.error(error.response?.data?.message || "Failed to fetch stockist details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <FaSpinner className="animate-spin h-8 w-8 text-[var(--color-primary)]" />
      </div>
    );
  }

  if (!details) {
    return <p className="text-center text-gray-500 py-8">No details available.</p>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-tetiary)] p-4">
      <h2 className="text-2xl font-semibold text-center text-black/80 mb-4">Stockist Details - ID: {stockistId}</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl mx-auto">
        <div className="flex flex-col gap-3 text-sm text-gray-700">
          <p><strong>Username:</strong> {details.user?.username || "N/A"}</p>
          <p><strong>Name:</strong> {`${details.user?.first_name || ""} ${details.user?.last_name || ""}`.trim() || "N/A"}</p>
          <p><strong>Location:</strong> {details.stockist_location || "N/A"}</p>
          <p><strong>Plan:</strong> {details.stockist_plan || "N/A"}</p>
          <p><strong>Created At:</strong> {details.created_at ? new Date(details.created_at).toLocaleString() : "N/A"}</p>
          <p><strong>Updated At:</strong> {details.updated_at ? new Date(details.updated_at).toLocaleString() : "N/A"}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 w-full bg-[var(--color-primary)] text-white py-2 rounded-lg hover:bg-[var(--color-primary)]/90 transition-all"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default StockistDetails;