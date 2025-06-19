const express = require('express');
const router = express.Router();
const { generateToken } = require('../utils/jwt');
const verifyToken = require('../middleware/verifyToken');

// Mock login (you can use real DB logic)
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Replace this with your DB logic
  if (email === 'admin@example.com' && password === 'admin123') {
    const user = { id: 1, email };
    const token = generateToken(user);
    return res.json({ token });
  }

  res.status(401).json({ message: 'Invalid credentials' });
});

// Protected route
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'You are authorized', user: req.user });
});

module.exports = router;
