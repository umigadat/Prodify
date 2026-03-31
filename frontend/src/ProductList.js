import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProductList.css";

const API_BASE = "http://localhost:3000";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
  });
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setMessage("Please login first.");
      navigate("/");
      return;
    }
    fetchProducts();
  }, [token]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/products`);
      setProducts(res.data);
    } catch (err) {
      setMessage("Error fetching products.");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/products`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => [res.data, ...prev]);
      setForm({ name: "", price: "", image: "", description: "" });
      setShowForm(false);
      setMessage("Product added successfully.");
    } catch (err) {
      if (err.response?.status === 401) {
        setMessage("Session expired. Please login again.");
        navigate("/");
        return;
      }
      setMessage(err.response?.data?.message || "Failed to add product.");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setMessage("Product deleted.");
    } catch (err) {
      if (err.response?.status === 401) {
        setMessage("Session expired. Please login again.");
        navigate("/");
        return;
      }
      setMessage(err.response?.data?.message || "Failed to delete product.");
    }
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h2>Products</h2>
        <div className="products-actions">
          <button onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "Cancel" : "Add Product"}
          </button>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {message && <p className="products-message">{message}</p>}

      {showForm && (
        <form className="product-form" onSubmit={handleAddProduct}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            required
          />
          <button type="submit">Save Product</button>
        </form>
      )}

      {products.length === 0 ? (
        <p className="products-empty">No products found.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <article key={product._id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="price">R {product.price}</p>
              <p className="description">{product.description}</p>
              <button
                className="delete-btn"
                onClick={() => deleteProduct(product._id)}
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}