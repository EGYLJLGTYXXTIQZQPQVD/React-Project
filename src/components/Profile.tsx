import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Fixed import
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const [error, setError] = useState<string>(""); // Added type annotation
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Ensure currentUser exists before trying to access email
  // Though PrivateRoute should handle this, it's good practice
  if (!currentUser) {
    // This should theoretically not be reached if PrivateRoute works correctly
    navigate("/login");
    return null; // Return null or a loading indicator while redirecting
  }

  async function handleLogout() {
    setError(""); // Clear previous errors

    try {
      await logout();
      // Redirect to login page after successful logout
      navigate("/login");
    } catch (err: any) {
      // Added type annotation for error
      console.error("Logout Error:", err); // Log error for debugging
      setError("Failed to log out. Please try again.");
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="text-2xl font-bold text-center mb-6">Profile</h2>{" "}
        {/* Adjusted styling */}
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
          </div>
        )}{" "}
        {/* Added role */}
        <div className="profile-info mb-6">
          {" "}
          {/* Added margin bottom */}
          <strong className="text-gray-700">Email:</strong>
          <span className="ml-2 text-gray-900 break-all">
            {currentUser.email}
          </span>{" "}
          {/* Added break-all for long emails */}
        </div>
        <div className="profile-links flex flex-col sm:flex-row gap-3">
          {" "}
          {/* Adjusted layout for responsiveness */}
          {/* Changed Back to Shop button style and navigation target */}
          <button
            className="btn-outline w-full sm:w-auto flex-1"
            onClick={() => navigate("/")}
          >
            Back to Shop
          </button>
          {/* Changed Logout button style */}
          <button
            className="btn-primary w-full sm:w-auto flex-1 bg-red-500 hover:bg-red-600"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
        {/* Optionally add a link to update profile if functionality exists */}
        {/* <div className="mt-4 text-center">
          <Link to="/update-profile" className="text-cyan-600 hover:underline text-sm">Update Profile</Link>
        </div> */}
      </div>
    </div>
  );
}
