const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  logoUrl: {
    type: String
  },
  salaryPackage: {
    minimum: {
      type: Number,
      default: 0
    },
    maximum: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'LPA'
    }
  },
  recruitmentPeriod: {
    start: {
      type: Date
    },
    end: {
      type: Date
    }
  },
  eligibleBranches: [{
    type: String,
    enum: ['CSE', 'ISE', 'ECE', 'EEE', 'ME', 'CE', 'AIML', 'AIDS', 'CSD', 'ALL']
  }],
  minimumCGPA: {
    type: Number,
    default: 6.0
  },
  jobProfile: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', companySchema);
