const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const Placement = require('../models/Placement');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// @route  GET /api/students
// @desc   Get all students (admin) or own profile (student)
// @access Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const students = await Student.find({ isActive: true }).select('-password').sort({ name: 1 });
      return res.json(students);
    }
    const student = await Student.findById(req.user._id).select('-password');
    res.json([student]);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route  GET /api/students/:id
// @desc   Get student by ID
// @access Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route  POST /api/students/register
// @desc   Register for placement drive
// @access Private
router.post('/register', authMiddleware, [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').matches(/^\d{10}$/).withMessage('Valid 10-digit phone number is required'),
  body('branch').isIn(['CSE', 'ISE', 'ECE', 'EEE', 'ME', 'CE', 'AIML', 'AIDS', 'CSD']).withMessage('Valid branch is required'),
  body('batch').notEmpty().withMessage('Batch is required'),
  body('cgpa').isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0 and 10')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, phone, branch, batch, cgpa, skills } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.user._id,
      { name, email, phone, branch, batch, cgpa, skills },
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.json({ message: 'Profile registered/updated successfully.', student });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already in use.' });
    }
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route  PUT /api/students/:id
// @desc   Update student profile
// @access Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const allowedUpdates = ['name', 'email', 'phone', 'branch', 'batch', 'cgpa', 'skills', 'resumeUrl'];
    if (req.user.role === 'admin') {
      allowedUpdates.push('placementStatus', 'isActive', 'role');
    }

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.json({ message: 'Student updated successfully.', student });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route  GET /api/students/:id/placements
// @desc   Get placements for a student
// @access Private
router.get('/:id/placements', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const placements = await Placement.find({ student: req.params.id })
      .populate('company', 'name industry salaryPackage logoUrl jobProfile location')
      .sort({ placementDate: -1 });

    res.json(placements);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
