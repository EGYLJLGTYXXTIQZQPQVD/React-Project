// src/components/Signup.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Fixed import
import { useAuth } from "../contexts/AuthContext";

export default function Signup() {
  const [email, setEmail] = useState<string>(""); // Added type annotation
  const [password, setPassword] = useState<string>(""); // Added type annotation
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // Added type annotation
  const [error, setError] = useState<string>(""); // Added type annotation
  const [loading, setLoading] = useState<boolean>(false); // Added type annotation
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Added type annotation
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    // Optional: Add password complexity validation here if desired
    if (password.length < 6) {
      return setError("Password should be at least 6 characters long");
    }

    try {
      setError(""); // Clear previous errors
      setLoading(true);
      await signup(email, password);
      navigate("/"); // Navigate to home page after successful signup
    } catch (err: any) {
      // Added type annotation for error
      console.error("Signup Error:", err); // Log the error for debugging
      // Provide more specific error messages if possible
      if (err.code === "auth/email-already-in-use") {
        setError("This email address is already in use. Try logging in.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to create an account: " + err.message);
      }
    }
    setLoading(false);
  }

  return (
    <div className="signup-container">
      <div className="form-container">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>{" "}
        {/* Adjusted styling */}
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
          </div>
        )}{" "}
        {/* Added role */}
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
              minLength={6} // Added minLength attribute
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>{" "}
            {/* Added htmlFor */}
            <input
              id="confirmPassword" // Added id
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6} // Added minLength attribute
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="btn-primary mt-2" disabled={loading}>
            {" "}
            {/* Added margin */}
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <div className="login-link mt-4">
          {" "}
          {/* Added margin */}
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-600 hover:underline">
            Log In
          </Link>{" "}
          {/* Styled link */}
        </div>
      </div>
    </div>
  );
}
