/* eslint-disable react/prop-types */
// PrivateRoute.js

import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Get the token from localStorage
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
