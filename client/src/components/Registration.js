import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { studentService } from '../services/api';
import '../styles/Registration.css';

const BRANCHES = ['CSE', 'ISE', 'ECE', 'EEE', 'ME', 'CE', 'AIML', 'AIDS', 'CSD'];
const CURRENT_YEAR = new Date().getFullYear();
const BATCHES = Array.from({ length: 5 }, (_, i) => `${CURRENT_YEAR - i}-${CURRENT_YEAR - i + 4}`);

function Registration() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    batch: '',
    cgpa: '',
    skills: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await studentService.getById(user.id);
        const s = response.data;
        setFormData({
          name: s.name || '',
          email: s.email || '',
          phone: s.phone || '',
          branch: s.branch || '',
          batch: s.batch || '',
          cgpa: s.cgpa || '',
          skills: Array.isArray(s.skills) ? s.skills.join(', ') : ''
        });
      } catch {
        // Profile not complete yet
      } finally {
        setFetchLoading(false);
      }
    };
    fetchProfile();
  }, [user.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        cgpa: parseFloat(formData.cgpa),
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      };
      await studentService.register(payload);
      setSuccess('Profile registered/updated successfully! You are now registered for the placement drive.');
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0]?.msg
        || err.response?.data?.message
        || 'Registration failed. Please try again.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="page-loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="registration-page">
      <div className="page-header">
        <h1>Placement Registration</h1>
        <p>Complete your profile to register for placement drives</p>
        <div className="usn-badge">USN: {user.usn}</div>
      </div>

      <div className="registration-card">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="your.email@college.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                maxLength={10}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Branch *</label>
              <select
                name="branch"
                className="form-input"
                value={formData.branch}
                onChange={handleChange}
                required
              >
                <option value="">Select Branch</option>
                {BRANCHES.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Batch *</label>
              <select
                name="batch"
                className="form-input"
                value={formData.batch}
                onChange={handleChange}
                required
              >
                <option value="">Select Batch</option>
                {BATCHES.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">CGPA *</label>
              <input
                type="number"
                name="cgpa"
                className="form-input"
                placeholder="e.g. 8.5"
                value={formData.cgpa}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label className="form-label">Skills</label>
            <input
              type="text"
              name="skills"
              className="form-input"
              placeholder="e.g. Java, Python, React, SQL (comma separated)"
              value={formData.skills}
              onChange={handleChange}
            />
            <p className="form-hint">Separate skills with commas</p>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="btn-spinner"></span> : 'Register for Placement Drive'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
