const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  requestedDimensions: {
    L: { type: Number },
    W: { type: Number },
    H: { type: Number }
  },
  woodPreference: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Reviewed', 'Completed']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Inquiry', inquirySchema);
