import React, { useState } from 'react';
import { useAuth } from '../App';
import { authService } from '../services/api';
import '../styles/Login.css';

function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ usn: '', password: '' });
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotData, setForgotData] = useState({ usn: '', email: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleForgotChange = (e) => {
    setForgotData({ ...forgotData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.usn.trim() || !formData.password.trim()) {
      setError('Please enter both USN and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await authService.login(formData.usn.trim(), formData.password);
      login(response.data.token, response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotData.usn.trim() || !forgotData.email.trim()) {
      setError('Please enter your USN and email.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await authService.forgotPassword(forgotData.usn, forgotData.email);
      setSuccess(response.data.message);
      setTimeout(() => {
        setForgotMode(false);
        setSuccess('');
        setForgotData({ usn: '', email: '' });
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="college-logo">🎓</div>
          <h1 className="college-title">College Placement Tracker</h1>
          <p className="college-subtitle">Track your placement journey</p>
        </div>

        <div className="login-card">
          {!forgotMode ? (
            <>
              <h2 className="card-title">Welcome Back</h2>
              <p className="card-subtitle">Sign in with your USN and password</p>

              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                  <label htmlFor="usn" className="form-label">College USN</label>
                  <input
                    type="text"
                    id="usn"
                    name="usn"
                    className="form-input"
                    placeholder="e.g. 1NC21CS001"
                    value={formData.usn}
                    onChange={handleChange}
                    autoComplete="username"
                    autoCapitalize="characters"
                    maxLength={10}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      className="form-input"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <p className="form-hint">Default password: Torii@123</p>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? <span className="btn-spinner"></span> : 'Sign In'}
                </button>
              </form>

              <button
                className="forgot-link"
                onClick={() => { setForgotMode(true); setError(''); }}
              >
                Forgot password?
              </button>
            </>
          ) : (
            <>
              <h2 className="card-title">Reset Password</h2>
              <p className="card-subtitle">Enter your USN and registered email</p>

              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleForgotPassword} className="login-form">
                <div className="form-group">
                  <label htmlFor="forgot-usn" className="form-label">College USN</label>
                  <input
                    type="text"
                    id="forgot-usn"
                    name="usn"
                    className="form-input"
                    placeholder="e.g. 1NC21CS001"
                    value={forgotData.usn}
                    onChange={handleForgotChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="forgot-email" className="form-label">Registered Email</label>
                  <input
                    type="email"
                    id="forgot-email"
                    name="email"
                    className="form-input"
                    placeholder="your.email@college.edu"
                    value={forgotData.email}
                    onChange={handleForgotChange}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? <span className="btn-spinner"></span> : 'Reset Password'}
                </button>
              </form>

              <button
                className="forgot-link"
                onClick={() => { setForgotMode(false); setError(''); }}
              >
                ← Back to Login
              </button>
            </>
          )}
        </div>

        <p className="login-footer">
          © {new Date().getFullYear()} College Placement Cell
        </p>
      </div>
    </div>
  );
}

export default Login;
