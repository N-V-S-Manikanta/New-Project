const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Company = require('../models/Company');
const Placement = require('../models/Placement');
const Event = require('../models/Event');
const { authMiddleware } = require('../middleware/auth');

// @route  GET /api/reports/dashboard
// @desc   Get dashboard summary statistics
// @access Private
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const [totalStudents, placedStudents, totalCompanies, totalPlacements] = await Promise.all([
      Student.countDocuments({ isActive: true }),
      Student.countDocuments({ placementStatus: { $in: ['Placed', 'Multiple Offers'] } }),
      Company.countDocuments({ isActive: true }),
      Placement.countDocuments()
    ]);

    // Branch-wise placement stats
    const branchStats = await Student.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$branch',
          total: { $sum: 1 },
          placed: {
            $sum: {
              $cond: [
                { $in: ['$placementStatus', ['Placed', 'Multiple Offers']] },
                1, 0
              ]
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Package distribution
    const packageDistribution = await Placement.aggregate([
      {
        $bucket: {
          groupBy: '$package',
          boundaries: [0, 3, 5, 8, 12, 20, 50],
          default: '50+',
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    // Company-wise recruitment count
    const companyStats = await Placement.aggregate([
      {
        $group: {
          _id: '$company',
          studentsPlaced: { $sum: 1 },
          avgPackage: { $avg: '$package' },
          maxPackage: { $max: '$package' }
        }
      },
      {
        $lookup: {
          from: 'companies',
          localField: '_id',
          foreignField: '_id',
          as: 'companyInfo'
        }
      },
      { $unwind: '$companyInfo' },
      {
        $project: {
          companyName: '$companyInfo.name',
          studentsPlaced: 1,
          avgPackage: { $round: ['$avgPackage', 2] },
          maxPackage: 1
        }
      },
      { $sort: { studentsPlaced: -1 } },
      { $limit: 10 }
    ]);

    // Monthly placement trend
    const monthlyTrend = await Placement.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$placementDate' },
            month: { $month: '$placementDate' }
          },
          count: { $sum: 1 },
          avgPackage: { $avg: '$package' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.json({
      summary: {
        totalStudents,
        placedStudents,
        notPlacedStudents: totalStudents - placedStudents,
        placementPercentage: totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(2) : 0,
        totalCompanies,
        totalPlacements
      },
      branchStats,
      packageDistribution,
      companyStats,
      monthlyTrend
    });
  } catch (err) {
    console.error('Dashboard report error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route  GET /api/reports/branch/:branch
// @desc   Get detailed report for a specific branch
// @access Private
router.get('/branch/:branch', authMiddleware, async (req, res) => {
  try {
    const { branch } = req.params;

    const students = await Student.find({ branch, isActive: true }).select('-password');
    const placedStudents = students.filter(s => s.placementStatus !== 'Not Placed');

    const placements = await Placement.find()
      .populate({
        path: 'student',
        match: { branch },
        select: 'usn name branch batch cgpa'
      })
      .populate('company', 'name industry')
      .then(p => p.filter(pl => pl.student));

    res.json({
      branch,
      totalStudents: students.length,
      placedStudents: placedStudents.length,
      placementPercentage: students.length > 0
        ? ((placedStudents.length / students.length) * 100).toFixed(2) : 0,
      students,
      placements
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route  GET /api/reports/events
// @desc   Get event attendance report
// @access Private
router.get('/events', authMiddleware, async (req, res) => {
  try {
    const events = await Event.find()
      .populate('company', 'name')
      .populate('attendees.student', 'usn name branch batch')
      .sort({ date: -1 });

    const report = events.map(event => ({
      eventName: event.eventName,
      date: event.date,
      company: event.company ? event.company.name : 'N/A',
      eventType: event.eventType,
      status: event.status,
      eligibleBranches: event.eligibleBranches,
      totalAttendees: event.attendees.length,
      attended: event.attendees.filter(a => a.attended).length,
      selected: event.attendees.filter(a => a.result === 'Selected').length,
      branchBreakdown: event.attendees.reduce((acc, a) => {
        if (a.student) {
          const br = a.student.branch;
          if (!acc[br]) acc[br] = { total: 0, attended: 0, selected: 0 };
          acc[br].total++;
          if (a.attended) acc[br].attended++;
          if (a.result === 'Selected') acc[br].selected++;
        }
        return acc;
      }, {})
    }));

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route  GET /api/reports/export/placements
// @desc   Export all placement data as JSON (can be converted to CSV in frontend)
// @access Private
router.get('/export/placements', authMiddleware, async (req, res) => {
  try {
    const placements = await Placement.find()
      .populate('student', 'usn name email phone branch batch cgpa')
      .populate('company', 'name industry jobProfile location')
      .sort({ placementDate: -1 });

    const exportData = placements.map(p => ({
      usn: p.student?.usn || '',
      studentName: p.student?.name || '',
      email: p.student?.email || '',
      phone: p.student?.phone || '',
      branch: p.student?.branch || '',
      batch: p.student?.batch || '',
      cgpa: p.student?.cgpa || '',
      company: p.company?.name || '',
      industry: p.company?.industry || '',
      jobProfile: p.jobProfile || p.company?.jobProfile || '',
      location: p.location || p.company?.location || '',
      package: p.package,
      packageCurrency: p.packageCurrency,
      placementDate: p.placementDate,
      status: p.status
    }));

    res.json(exportData);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
