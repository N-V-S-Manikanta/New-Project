const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Company = require('../models/Company');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// @route  GET /api/companies
// @desc   Get all active companies
// @access Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const companies = await Company.find({ isActive: true }).sort({ name: 1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route  GET /api/companies/:id
// @desc   Get company by ID
// @access Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found.' });
    }
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route  POST /api/companies
// @desc   Add a new company (admin only)
// @access Private/Admin
router.post('/', authMiddleware, adminMiddleware, [
  body('name').notEmpty().withMessage('Company name is required').trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).json({ message: 'Company added successfully.', company });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Company with this name already exists.' });
    }
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route  PUT /api/companies/:id
// @desc   Update company (admin only)
// @access Private/Admin
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!company) {
      return res.status(404).json({ message: 'Company not found.' });
    }
    res.json({ message: 'Company updated successfully.', company });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route  DELETE /api/companies/:id
// @desc   Deactivate company (admin only)
// @access Private/Admin
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!company) {
      return res.status(404).json({ message: 'Company not found.' });
    }
    res.json({ message: 'Company deactivated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
