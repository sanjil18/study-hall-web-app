import React, { useState } from 'react';
import Header1 from '../Components/Header1';
import Footer from '../Components/Footer';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const response = await fetch('http://localhost:8080/students/login', {
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
        alert('Login successful!');
        navigate('/home');
      } else {
        setErrorMessage('Invalid credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-page">
     
      
      <div className="login-container">
        <h3 className="login-title">Login Page</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="regNo">Registration Number:</label>
            <input
              type="text"
              id="regNo"
              name="regNo"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder="Enter your registration number"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button className="btn login-btn" type="submit">Log in</button>
        </form>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <p className="signup-link">
          Don't have an account?   
          <Link to="/sign-up">Sign Up</Link> 
        </p>
      </div>
      
    
    </div>
  );
};

export default Login;