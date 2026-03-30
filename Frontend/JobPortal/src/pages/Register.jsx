import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserAPI } from '../services/api';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError('Please fill in all fields');
      return;
    }

    const hasUppercase = /[A-Z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(formData.password);

    if (formData.password.length < 8 || !hasUppercase || !hasNumber || !hasSpecialChar) {
      setError('Password must be at least 8 characters long, and contain at least one uppercase letter, one number, and one special character.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.post('/users/register', formData);
      console.log("Register Response:", res.data);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.response?.data || err.message || 'Failed to register. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div>Join Job Portal</div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Create Account</h2>
          <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '20px' }}>
            Sign up to get started.
          </p>

          {error && (
            <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '14px', marginBottom: '15px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <div className="role-container">
              <div className="role-title">I am a...</div>
              <div className="role-options">
                <div
                  className={`role-card ${formData.role === 'USER' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('USER')}
                >
                  Job Seeker
                </div>
                <div
                  className={`role-card ${formData.role === 'RECRUITER' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('RECRUITER')}
                >
                  Recruiter
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
            Already have an account?{' '}
            <Link to="/login" className="link">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
