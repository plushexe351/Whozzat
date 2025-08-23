import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../Context/AuthContext";
import { useToast } from "../Context/ToastContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { addToast } = useToast();
  // Todo: replace with a loader
  if (loading) return null;
  return user ? children : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
