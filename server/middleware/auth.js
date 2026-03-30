const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided. Access denied.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'placement_tracker_secret');

    const student = await Student.findById(decoded.id).select('-password');
    if (!student) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    if (!student.isActive) {
      return res.status(403).json({ message: 'Account is deactivated.' });
    }

    req.user = student;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Admin only.' });
};

module.exports = { authMiddleware, adminMiddleware };
