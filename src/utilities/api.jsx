// api.js
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setupInterceptors = (logout) => {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      // const token = "299|DjwCPLWXGsVUT4k1J3iresKm3LQtB8AOWw75FB220532ee86"; 
     if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log("AXIOS ERROR CAUGHT BY INTERCEPTOR:", error.response);

      const msg = error.response?.data?.message || error.response?.data?.error;

      if (
        error.response?.status === 401 ||
        (typeof msg === "string" &&
          msg.toLowerCase().includes("unauthenticated"))
      ) {
        toast.error("Session expired. Please log in again.");
        logout();
      }

      return Promise.reject(error);
    }
  );
};

export default api;
