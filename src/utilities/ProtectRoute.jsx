import React, { useEffect } from 'react';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useUser();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      // Redirect to external login page
      // window.location.replace('https://www.mudetrealsolution.com/#/login');
    }
  }, [loading, isLoggedIn]);

  if (loading) {
    return <div>Loading user session...</div>;
  }

  if (!isLoggedIn) {
    // While redirecting, return null (or a spinner)
    return null;
  }

  return children;
};

export default ProtectedRoute;
