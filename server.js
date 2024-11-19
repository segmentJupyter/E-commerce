require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ecommerce');

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

// Admin middleware
const adminAuth = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).send({ error: 'Admin access required' });
  }
  next();
};

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 8)
    });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.send({ user, token });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Product routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.post('/api/products', auth, adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.delete('/api/products/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).send();
    res.send(product);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Cart routes
app.post('/api/cart', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    req.user.cart.push({ product: productId, quantity });
    await req.user.save();
    res.status(201).send(req.user.cart);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.delete('/api/cart/:productId', auth, async (req, res) => {
  try {
    req.user.cart = req.user.cart.filter(item => 
      item.product.toString() !== req.params.productId
    );
    await req.user.save();
    res.send(req.user.cart);
  } catch (e) {
    res.status(500).send(e);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));