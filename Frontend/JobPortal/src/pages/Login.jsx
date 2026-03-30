import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserAPI } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const payload = { email, password };
      const response = await UserAPI.login(payload);

      // Assume response is { id, name, email, role } based on instructions
      if (typeof response === 'object' && response !== null && response.id) {
        localStorage.setItem('user', JSON.stringify(response));
        if (response.role === 'RECRUITER') {
          navigate('/recruiter-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        setError('Invalid email or password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div>Job Portal</div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Welcome back</h2>
          <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '20px' }}>
            Please enter your details to sign in.
          </p>

          {error && (
            <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '14px', marginBottom: '15px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
            Don't have an account?{' '}
            <Link to="/register" className="link">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
