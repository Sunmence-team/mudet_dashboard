import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { setupInterceptors } from "../utilities/api";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [miscellaneousDetails, setMiscellaneousDetails] = useState(null);

  // 🔒 Safe JSON parse helper
  const safeJSONParse = (value, key) => {
    if (!value || value === "undefined") return null;
    try {
      return JSON.parse(value);
    } catch (err) {
      console.warn(`Invalid JSON in localStorage for key "${key}", clearing it.`);
      localStorage.removeItem(key);
      return null;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = safeJSONParse(localStorage.getItem("user"), "user");
    const storedMiscellaneousDetails = safeJSONParse(
      localStorage.getItem("miscellaneousDetails"),
      "miscellaneousDetails"
    );

    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(storedUser);
    if (storedMiscellaneousDetails) setMiscellaneousDetails(storedMiscellaneousDetails);
  }, []);

  const login = async (authToken) => {
    localStorage.setItem("token", authToken);
    setToken(authToken);
    await refreshUser(authToken);
  };

  const refreshUser = async (authToken = token) => {
    if (!authToken) {
      console.log("No token found");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = response.data.data;
      const updatedUser = data.user;

      const updatedMiscellaneousDetails = {
        planDetails: data.plan_details,
        stockistDetails: data.stockist_details,
        totalPVLeft: data.total_pv_left,
        totalPVRight: data.total_pv_right,
      };

      setUser(updatedUser);
      setMiscellaneousDetails(updatedMiscellaneousDetails);

      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem(
        "miscellaneousDetails",
        JSON.stringify(updatedMiscellaneousDetails)
      );
    } catch (err) {
      console.error("Failed to refresh user:", err);
      // Optional: logout();
    }
  };

  const isLoggedIn = !!token;
  const role = user?.role || null;

  const logout = async () => {
    const toastId = toast.loading("Logging Out...");
    // try {
    //   await axios.put(
    //     `${API_URL}/api/logout`,
    //     {},
    //     { headers: { Authorization: `Bearer ${token}` } }
    //   );
    //   toast.success("Logged out successfully", { id: toastId });
    // } catch (err) {
    //   console.error("API Logout failed, clearing local state anyway:", err);
    //   toast.error("Logout failed. Please try again.", { id: toastId });
    // } finally {
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("user");
    //   localStorage.removeItem("miscellaneousDetails");

    //   setToken(null);
    //   setUser(null);
    //   setMiscellaneousDetails(null);

    //   setTimeout(() => {
    //     // window.location.href = "/login";
    //   }, 100);
    // }
  };

  useEffect(() => {
    setupInterceptors(logout);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        role,
        miscellaneousDetails,
        login,
        logout,
        isLoggedIn,
        refreshUser,
        setUser,
        setToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within an UserProvider");
  }
  return context;
};
