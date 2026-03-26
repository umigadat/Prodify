const express = require("express");
const mongoose = require('mongoose');
const Product = require('./models/Product');
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());



mongoose.connect('mongodb+srv://prodify:Prodify786@prodify.ocpmvcq.mongodb.net/?appName=Prodify')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("API working");
});



//signup route
app.post("/api/users/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send({ message: "User already exists" });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
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

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send({ message: "Invalid password" });

    // create JWT token
    const token = jwt.sign({ userId: user._id }, "secretkey", { expiresIn: "1h" });

    res.send({ message: "Login successful", token });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.send(product);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.send({ message: "Product deleted", product: deletedProduct });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a product by ID
app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,    // ID from URL
      req.body,         // new data sent
      { new: true }     // return the updated product
    );

    if (!updatedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.send(updatedProduct);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
