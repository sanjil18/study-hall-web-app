import React, { useState } from 'react';
import Header1 from '../Components/Header1';
import Footer from '../Components/Footer';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:8082/students/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          regNo: regNo, 
          password: password 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data) {
        // Save regNo to localStorage for later use in booking
        localStorage.setItem('regNo', regNo);
        alert('✅ Login successful! Welcome back!');
        navigate('/home');
      } else {
        setErrorMessage('❌ Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('❌ An error occurred. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔐</div>
          <h3 className="login-title">Student Login</h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Access your study hall bookings</p>
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
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder="e.g., REG123456"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              <span style={{ marginRight: '0.5rem' }}>🔑</span>
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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
            {loading ? '⏳ Logging in...' : '🚀 Log In'}
          </button>
        </form>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 0.5rem 0' }}>
            Don't have an account?
          </p>
          <Link to="/sign-up" style={{ textDecoration: 'none' }}>
            <button 
              type="button"
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
                e.target.style.boxShadow = '0 8px 20px rgba(245, 158, 11, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              📝 Create New Account
            </button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
