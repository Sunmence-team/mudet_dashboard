import React, { useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";
import api from "../../../utilities/api";
import LazyLoader from "../../../components/LazyLoader";
import PaginationControls from "../../../utilities/PaginationControls";

const EarningWallet = () => {
  const { user } = useUser();
  const [earningData, setEarningData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  const userId = user?.id;

  const fetchEarnings = async (page = 1) => {
    setLoading(true);
    try {
      if (!userId) {
        console.error("User ID is undefined. Please log in.");
        setEarningData({
          data: [],
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0,
        });
        return;
      }

      // Note: Endpoint uses hardcoded user ID '2'. Consider using `userId` for dynamic user data: `/api/users_repurchase/${userId}`
      const response = await api.get(
        `/api/users_repurchase/2?page=${page}`,
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

      console.log("response", response)
      
      if (response.status === 200) {
        console.log("response here", response)
        setEarningData({
          data: response.data.data || [],
          current_page: page,
          last_page: Math.ceil((response.data.data.total || 0) / 10),
          per_page: 10,
          total: response.data.data.total || 0,
        });
      } else {
        setEarningData({
          data: [],
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching earnings:", err);
      setEarningData({
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
    fetchEarnings();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= earningData.last_page) {
      fetchEarnings(page);
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
    switch (status) {
      case "success":
      case "successful":
        return "bg-[#dff7ee]/80 text-[var(--color-primary)]";
      case "failed":
        return "bg-[#c51236]/20 text-red-600";
      case "pending":
      case "pending_manual":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const { data: earnings, current_page, last_page } = earningData;

  return (
    <div>
      
    </div>
  );
};

export default EarningHistroy
