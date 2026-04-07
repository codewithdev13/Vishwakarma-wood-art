const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

// @route   POST /api/inquiries
// @desc    Create a custom wood-turning inquiry
router.post('/', async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    const createdInquiry = await inquiry.save();
    res.status(201).json(createdInquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
