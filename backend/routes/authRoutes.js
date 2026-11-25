const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// @route   POST /api/auth/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const cleanUsername = username ? String(username).trim().toLowerCase() : '';
    const cleanPassword = password ? String(password).trim() : '';

    if (!cleanUsername || !cleanPassword) {
      return res.status(400).json({ message: 'Please provide both username and password' });
    }

    const admin = await Admin.findOne({ 
      username: { $regex: new RegExp(`^${cleanUsername}$`, 'i') } 
    });

    if (admin && (await admin.matchPassword(cleanPassword))) {
      // Create token with resilient fallback secret
      const jwtSecret = process.env.JWT_SECRET || 'vishwakarma_wood_art_secure_jwt_token_2026';
      const token = jwt.sign(
        { id: admin._id, username: admin.username },
        jwtSecret,
        { expiresIn: '30d' }
      );

      return res.json({
        _id: admin._id,
        username: admin.username,
        token,
      });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
});

module.exports = router;
