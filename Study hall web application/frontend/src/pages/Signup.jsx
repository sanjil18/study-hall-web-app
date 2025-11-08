import React, { useState } from 'react';
import Header1 from '../Components/Header1';
import Footer from '../Components/Footer'; // Correct path for Footer component
import './Login.css'; // Correct path for Login.css
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  // State to store the form values
  const [regNo, setRegNo] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  
  // useNavigate for redirection after successful signup
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password1 !== password2) {
      alert('Both passwords do not match. Please try again.');
      return;
    }

    try {
      // Sending the signup request to the backend API
      const response = await fetch('http://localhost:8082/students/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNo, password: password1 }),
      });

      const data = await response.json();

      // Handle the response from the backend
      if (response.ok) {
        alert('Account created successfully!');
        navigate('/login'); // Redirect to login page after successful signup
      } else {
        alert(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="signup-page">
      

      <div className="signup-container">
        <h3 className="signup-title">Sign Up Page</h3>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Your Reg No:</label>
            <input
              type="text"
              name="Userid"
              placeholder="Enter the Reg No"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              required
            />
          </div>
          <br />

          <div>
            <label>Input Password:</label>
            <input
              type="password"
              id="password1"
              name="Password1"
              placeholder="Enter the password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              required
            />
          </div>
          <br />

          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              id="password2"
              name="Password2"
              placeholder="Enter the password again"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </div>
          <br />

          <button className="btn" type="submit">
            Sign Up
          </button>
        </form>
      </div>

      <br />
      <br />
      <br />

     
    </div>
  );
};

export default SignUp;
