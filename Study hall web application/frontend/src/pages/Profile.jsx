import React, { useState, useEffect } from 'react';
import Header1 from '../Components/Header1';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import './Profile.css';
import API_BASE_URL from '../api/config';

const Profile = () => {
  const [regNo, setRegNo] = useState('');
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    const savedRegNo = localStorage.getItem('regNo');
    if (savedRegNo) {
      setRegNo(savedRegNo);
      // Fetch user's booking count
      fetchBookingCount(savedRegNo);
    }
  }, []);

  const fetchBookingCount = async (regNo) => {
    try {
      const response = await fetch(`${API_BASE_URL}/booked-seats`);
      if (response.ok) {
        const data = await response.json();
        const userBookings = data.filter(booking => booking.regNo === regNo);
        setBookingCount(userBookings.length);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  return (
    <div>
      <Header1 />
      <Navigation />

      <div className='d1'>
        <div className='profile-header'>
          <div className='profile-avatar'>👨‍🎓</div>
          <div className='profile-info'>
            <h1>Student Profile</h1>
            <p>Registration: <strong>{regNo || 'Not logged in'}</strong></p>
          </div>
        </div>
      </div>

      <div className='divgrp1'>
        <h2>📊 Your Study Hall Activity</h2>
        
        <div className='profile-stats'>
          <div className='stat-card'>
            <div className='stat-value'>{bookingCount}</div>
            <div className='stat-label'>Active Bookings</div>
          </div>
          <div className='stat-card'>
            <div className='stat-value'>24/7</div>
            <div className='stat-label'>Hall Access Hours</div>
          </div>
          <div className='stat-card'>
            <div className='stat-value'>150</div>
            <div className='stat-label'>Available Seats</div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'left', paddingTop: '1.5rem', borderTop: '2px solid #e2e8f0' }}>
          <h3 style={{ color: '#2563eb', marginBottom: '1rem' }}>📝 Quick Info</h3>
          <p><strong>Institution:</strong> Faculty of Engineering, University of Ruhuna</p>
          <p><strong>Facility:</strong> Study Hall Management System</p>
          <p><strong>Status:</strong> ✅ Active Member</p>
          <p style={{ marginTop: '1rem', color: '#64748b', fontStyle: 'italic' }}>
            Welcome to our modern Study Hall Management System. Book your preferred seat, manage your schedule, and enjoy a productive study environment.
          </p>
        </div>

        <div className='profile-actions'>
          <a href='/home' style={{ textDecoration: 'none' }}>
            <button className='profile-btn'>📅 Go to Bookings</button>
          </a>
          <a href='/home/book-seat' style={{ textDecoration: 'none' }}>
            <button className='profile-btn'>➕ Book a Seat</button>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;