// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("https://prodify-2e1h.onrender.com/api/users/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token); // save JWT token
      setMessage(res.data.message);
      navigate("/products"); // Redirect to products page
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed. Check backend and try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to continue to Prodify.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <button
          type="button"
          className="auth-link-btn"
          onClick={() => navigate("/signup")}
        >
          Create an account
        </button>
        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}