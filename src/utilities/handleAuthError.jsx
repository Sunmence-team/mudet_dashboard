// src/utils/handleAuthError.js
export const handleAuthError = (error, logout) => {
  if (error?.response?.data?.message?.toLowerCase?.().includes("unauthenticated")) {
    logout?.();
  }
};
