// src/components/Login.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Fixed import
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState<string>(""); // Added type annotation
  const [password, setPassword] = useState<string>(""); // Added type annotation
  const [error, setError] = useState<string>(""); // Added type annotation
  const [loading, setLoading] = useState<boolean>(false); // Added type annotation
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Added type annotation
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/"); // Navigate to home on successful login
    } catch (err: any) {
      // Added type annotation for error
      setError("Failed to log in: " + err.message);
    }
    setLoading(false);
  }

  async function handlePasswordReset() {
    if (!email) {
      return setError("Please enter your email address to reset the password");
    }

    try {
      setError(""); // Clear previous errors
      setLoading(true);
      await resetPassword(email);
      // Provide more user-friendly feedback
      setError(
        "Password reset email sent. Check your inbox (and spam folder)."
      );
    } catch (err: any) {
      // Added type annotation for error
      setError("Failed to send password reset email: " + err.message);
    }
    setLoading(false);
  }

  return (
    <div className="login-container">
      <div className="form-container">
        <h2 className="text-2xl font-bold text-center mb-6">Log In</h2>{" "}
        {/* Adjusted styling */}
        {error && (
          <div
            className={`alert ${
              error.includes("sent") ? "alert-success" : "alert-danger"
            } mb-4`} // Conditional styling for success message
            role="alert"
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label> {/* Added htmlFor */}
            <input
              id="email" // Added id
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label> {/* Added htmlFor */}
            <input
              id="password" // Added id
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn-primary mt-2" disabled={loading}>
            {" "}
            {/* Added margin top */}
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>
        <div className="forgot-password mt-3">
          {" "}
          {/* Added margin top */}
          <button
            type="button" // Changed type to button
            className="btn-link"
            onClick={handlePasswordReset}
            disabled={loading}
          >
            Forgot Password?
          </button>
        </div>
        <div className="signup-link mt-4">
          {" "}
          {/* Added margin top */}
          Need an account?{" "}
          <Link to="/signup" className="text-cyan-600 hover:underline">
            Sign Up
          </Link>{" "}
          {/* Styled link */}
        </div>
      </div>
    </div>
  );
}
