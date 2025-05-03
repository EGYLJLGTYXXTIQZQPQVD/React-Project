import React from "react";
import { Navigate } from "react-router-dom"; // Fixed import
import { useAuth } from "../contexts/AuthContext";

// Define props type for better type safety
interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  // Added type annotation
  const { currentUser } = useAuth();

  // If currentUser exists, render the children components, otherwise redirect to login
  return currentUser ? <>{children}</> : <Navigate to="/login" replace />; // Added replace prop
}
