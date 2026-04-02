// src/components/Signup.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./auth.css";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("https://prodify-2e1h.onrender.com/api/users/signup", {
        name,
        email,
        password,
      });
      setMessage(res.data.message);
      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed. Check backend and try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Sign up to start using Prodify.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <button type="submit">Signup</button>
        </form>
        <button
          type="button"
          className="auth-link-btn"
          onClick={() => navigate("/")}
        >
          Back to login
        </button>
        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}