const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Placement = require('../models/Placement');
const Student = require('../models/Student');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// @route  GET /api/placements
// @desc   Get all placements (admin) or own placements (student)
// @access Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { student: req.user._id };
    const placements = await Placement.find(query)
      .populate('student', 'usn name branch batch cgpa')
      .populate('company', 'name industry salaryPackage logoUrl jobProfile location')
      .sort({ placementDate: -1 });
    res.json(placements);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route  GET /api/placements/:id
// @desc   Get placement by ID
// @access Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id)
      .populate('student', 'usn name branch batch cgpa')
      .populate('company', 'name industry salaryPackage logoUrl jobProfile location');

    if (!placement) {
      return res.status(404).json({ message: 'Placement not found.' });
    }

    if (req.user.role !== 'admin' && placement.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.json(placement);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route  POST /api/placements
// @desc   Record a placement (admin only)
// @access Private/Admin
router.post('/', authMiddleware, adminMiddleware, [
  body('student').notEmpty().withMessage('Student ID is required'),
  body('company').notEmpty().withMessage('Company ID is required'),
  body('package').isNumeric().withMessage('Package must be a number')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const placement = new Placement(req.body);
    await placement.save();

    // Update student placement status
    const existingPlacements = await Placement.countDocuments({ student: req.body.student });
    const status = existingPlacements > 1 ? 'Multiple Offers' : 'Placed';
    await Student.findByIdAndUpdate(req.body.student, { placementStatus: status });

    const populated = await Placement.findById(placement._id)
      .populate('student', 'usn name branch batch')
      .populate('company', 'name industry');

    res.status(201).json({ message: 'Placement recorded successfully.', placement: populated });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Placement record already exists for this student-company pair.' });
    }
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route  PUT /api/placements/:id
// @desc   Update placement (admin only)
// @access Private/Admin
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const placement = await Placement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('student', 'usn name branch batch')
      .populate('company', 'name industry');

    if (!placement) {
      return res.status(404).json({ message: 'Placement not found.' });
    }

    res.json({ message: 'Placement updated successfully.', placement });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
