// import { useUser } from '../context/UserContext';

// const ProtectedRoute = ({ element: Component, ...rest }) => {
//   const { token, logout } = useUser()
//   const isAuthenticated = !!token

//   return isAuthenticated ? <Component {...rest} /> : logout()
// };

// export default ProtectedRoute;


import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';


const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useUser();
  console.log("isLoggedIn")
    
  if (loading) {
    return <div>Loading user session...</div>;
  }

  const isAuthenticated = !!isLoggedIn;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;