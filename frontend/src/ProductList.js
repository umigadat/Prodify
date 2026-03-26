// src/components/ProductList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
      setMessage("Error fetching products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Optional: Delete product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`);
      setProducts(products.filter((p) => p._id !== id)); // remove from list
      setMessage("Product deleted");
    } catch (err) {
      console.log(err);
      setMessage("Error deleting product");
    }
  };

  return (
    <div>
      <h2>Products</h2>
      {message && <p>{message}</p>}
      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <h3>{product.name}</h3>
              <p>Price: R{product.price}</p>
              <img src={product.image} alt={product.name} width={150} />
              <p>{product.description}</p>
              {/* Optional delete button */}
              <button onClick={() => deleteProduct(product._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}