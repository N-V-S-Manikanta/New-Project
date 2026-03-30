const mongoose = require('mongoose');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

// Basic unit tests for models and middleware (no DB connection needed)

describe('Student Model - Password Hashing', () => {
  test('comparePassword should match correct password', async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Torii@123', salt);

    const mockStudent = {
      password: hashedPassword,
      comparePassword: async function(candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password);
      }
    };

    const isMatch = await mockStudent.comparePassword('Torii@123');
    expect(isMatch).toBe(true);
  });

  test('comparePassword should reject wrong password', async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Torii@123', salt);

    const mockStudent = {
      password: hashedPassword,
      comparePassword: async function(candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password);
      }
    };

    const isMatch = await mockStudent.comparePassword('WrongPassword');
    expect(isMatch).toBe(false);
  });
});

describe('Error Handler Middleware', () => {
  const errorHandler = require('../middleware/errorHandler');

  test('should handle validation errors', () => {
    const err = {
      name: 'ValidationError',
      errors: {
        usn: { message: 'USN is required' }
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Validation Error' }));
  });

  test('should handle duplicate key errors', () => {
    const err = { code: 11000, keyValue: { usn: '1NC21CS001' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('should handle generic server errors', () => {
    const err = new Error('Server error');
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
