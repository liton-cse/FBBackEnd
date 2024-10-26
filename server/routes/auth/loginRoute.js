const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
require('dotenv').config();
const connectToDatabase = require('..//..//DatabaseConfig/database');
const createUserModel = require('..//..//models/User');
const { setUser } = require('../../services/authentication');
const { restricToLoginUserOnly } = require('..//..//middleware/authorization');
const cookieParser = require('cookie-parser');
router.use(cookieParser());

// Database connection and User model
const db1 = connectToDatabase('admin', process.env.MONGODB_URI);
const User = createUserModel(db1);

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = setUser(user);
    res.set("Access-token", token);
    res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true });

    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "An error occurred during registration" });
  }
});

module.exports = router;
