import React, { useState } from 'react';
import Header1 from '../Components/Header1';
import Footer from '../Components/Footer';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api/config';

const SignUp = () => {
  const [regNo, setRegNo] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regNo || !password1 || !password2) {
      setErrorMessage('❌ Please fill in all fields.');
      return;
    }

    if (password1 !== password2) {
      setErrorMessage('❌ Passwords do not match. Please try again.');
      return;
    }

    if (password1.length < 6) {
      setErrorMessage('❌ Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/students/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNo, password: password1 }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Account created successfully! Please login now.');
        navigate('/login');
      } else {
        setErrorMessage('❌ ' + (data.error || 'Registration failed. Please try again.'));
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('❌ An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎓</div>
          <h3 className="signup-title">Create Account</h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Join our study hall community</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="regNo">
              <span style={{ marginRight: '0.5rem' }}>🆔</span>
              Registration Number:
            </label>
            <input
              type="text"
              id="regNo"
              name="regNo"
              placeholder="e.g., REG123456"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password1">
              <span style={{ marginRight: '0.5rem' }}>🔑</span>
              Create Password:
            </label>
            <input
              type="password"
              id="password1"
              name="password1"
              placeholder="Minimum 6 characters"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password2">
              <span style={{ marginRight: '0.5rem' }}>✔️</span>
              Confirm Password:
            </label>
            <input
              type="password"
              id="password2"
              name="password2"
              placeholder="Re-enter password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button 
            className="btn" 
            type="submit"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '⏳ Creating Account...' : '✨ Create Account'}
          </button>
        </form>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 0.5rem 0' }}>
            Already have an account?
          </p>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button 
              type="button"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.3s ease',
                fontSize: '1rem'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              🔓 Go to Login
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignUp;
