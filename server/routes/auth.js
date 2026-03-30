const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const { authMiddleware } = require('../middleware/auth');

const DEFAULT_PASSWORD = 'Torii@123';
const JWT_SECRET = process.env.JWT_SECRET || 'placement_tracker_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// @route  POST /api/auth/login
// @desc   Login with USN and password
// @access Public
router.post('/login', [
  body('usn').notEmpty().withMessage('USN is required').trim().toUpperCase(),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { usn, password } = req.body;

    // Find student by USN
    let student = await Student.findOne({ usn: usn.toUpperCase() });

    // Auto-create student if logging in for first time with default password
    if (!student) {
      if (password === DEFAULT_PASSWORD) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);
        student = new Student({
          usn: usn.toUpperCase(),
          name: usn.toUpperCase(),
          email: `${usn.toLowerCase()}@college.edu`,
          phone: '0000000000',
          branch: 'CSE',
          batch: new Date().getFullYear().toString(),
          password: hashedPassword
        });
        await student.save();
      } else {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
    }

    // Check password
    let isMatch;
    if (student.password) {
      isMatch = await bcrypt.compare(password, student.password);
    } else {
      // No password set — compare against default
      isMatch = password === DEFAULT_PASSWORD;
      if (isMatch) {
        // Set the default password
        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(DEFAULT_PASSWORD, salt);
        await student.save({ validateBeforeSave: false });
      }
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: student._id, usn: student.usn, role: student.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: student._id,
        usn: student.usn,
        name: student.name,
        email: student.email,
        branch: student.branch,
        role: student.role,
        placementStatus: student.placementStatus
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// @route  POST /api/auth/forgot-password
// @desc   Request password reset
// @access Public
router.post('/forgot-password', [
  body('usn').notEmpty().withMessage('USN is required').trim().toUpperCase(),
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { usn, email } = req.body;
    const student = await Student.findOne({ usn: usn.toUpperCase(), email: email.toLowerCase() });

    if (!student) {
      return res.status(404).json({ message: 'No account found with this USN and email.' });
    }

    // In production, send email with reset link. For demo, reset to default password.
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(DEFAULT_PASSWORD, salt);
    await student.save({ validateBeforeSave: false });

    res.json({ message: `Password has been reset to the default password: ${DEFAULT_PASSWORD}` });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route  POST /api/auth/change-password
// @desc   Change password
// @access Private
router.post('/change-password', authMiddleware, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { currentPassword, newPassword } = req.body;
    const student = await Student.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(newPassword, salt);
    await student.save({ validateBeforeSave: false });

    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route  GET /api/auth/me
// @desc   Get current user
// @access Private
router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;
