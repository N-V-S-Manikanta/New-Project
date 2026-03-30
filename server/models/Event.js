const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  eventType: {
    type: String,
    enum: ['Pre-Placement Talk', 'Aptitude Test', 'Technical Interview', 'HR Interview', 'Group Discussion', 'Campus Drive', 'Other'],
    default: 'Campus Drive'
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  venue: {
    type: String,
    trim: true
  },
  eligibleBranches: [{
    type: String,
    enum: ['CSE', 'ISE', 'ECE', 'EEE', 'ME', 'CE', 'AIML', 'AIDS', 'CSD', 'ALL']
  }],
  attendees: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    attended: {
      type: Boolean,
      default: false
    },
    result: {
      type: String,
      enum: ['Selected', 'Not Selected', 'Pending', 'Absent'],
      default: 'Pending'
    }
  }],
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
