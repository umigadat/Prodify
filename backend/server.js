require('dotenv').config();

const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Product = require('./models/Product');
const User = require("./models/User");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("API working");
});

// Signup
app.post("/api/users/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).send({ message: "User created", userId: user._id });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Login
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send({ message: "Invalid password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.send({ message: "Login successful", token });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create product
app.post('/api/products', authMiddleware, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      user: req.userId
    });
    await product.save();
    res.send(product);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete product
app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send({ message: "Product not found" });

    if (product.user.toString() !== req.userId) {
      return res.status(403).send({ message: "Not authorized" });
    }

    await product.deleteOne();
    res.send({ message: "Product deleted" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update product
app.put('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send({ message: "Product not found" });

    if (product.user.toString() !== req.userId) {
      return res.status(403).send({ message: "Not authorized" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.send(updatedProduct);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});