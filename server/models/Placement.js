const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student reference is required']
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company reference is required']
  },
  package: {
    type: Number,
    required: [true, 'Package is required'],
    min: 0
  },
  packageCurrency: {
    type: String,
    default: 'LPA'
  },
  placementDate: {
    type: Date,
    default: Date.now
  },
  jobProfile: {
    type: String,
    trim: true
  },
  offerLetterUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['Offer Letter Received', 'Joining Confirmed', 'Offer Withdrawn', 'Pending'],
    default: 'Offer Letter Received'
  },
  joiningDate: {
    type: Date
  },
  location: {
    type: String,
    trim: true
  },
  remarks: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Ensure a student can have multiple offers but update status accordingly
placementSchema.index({ student: 1, company: 1 }, { unique: true });

module.exports = mongoose.model('Placement', placementSchema);
