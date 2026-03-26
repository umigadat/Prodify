// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProductList from "./ProductList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />            {/* Default route */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<ProductList />} />
      </Routes>
    </Router>
  );
}

export default App;