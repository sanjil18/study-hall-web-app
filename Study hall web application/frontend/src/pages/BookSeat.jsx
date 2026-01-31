import React, { useState, useEffect } from 'react';
import Header1 from '../Components/Header1';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import { useNavigate, useLocation } from 'react-router-dom';
import './BookSeat.css';
import API_BASE_URL from '../api/config';

const SeatBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // If updating, pre-fill with existing details
  const existingSeat = location.state || null;

  const [seatNo, setSeatNo] = useState(existingSeat ? existingSeat.seatNo : '');
  const [startTime, setStartTime] = useState(existingSeat ? existingSeat.startTime : '');
  const [endTime, setEndTime] = useState(existingSeat ? existingSeat.endTime : '');
  const [loading, setLoading] = useState(false);

  const handleSeatChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 150)) {
      setSeatNo(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!seatNo || !startTime || !endTime) {
      alert('❌ Please fill in all required fields.');
      setLoading(false);
      return;
    }

    // Validate end time is after start time
    if (new Date(endTime) <= new Date(startTime)) {
      alert('❌ End time must be after start time.');
      setLoading(false);
      return;
    }

    const url = existingSeat
      ? `${API_BASE_URL}/bookings/update-seat/${seatNo}`
      : `${API_BASE_URL}/bookings/bookSeat`;

    const method = existingSeat ? 'PUT' : 'POST';

    // Get regNo from localStorage (saved during login)
    const regNo = localStorage.getItem('regNo');

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regNo,
          seatNo: parseInt(seatNo),
          startTime: startTime.length === 16 ? startTime + ":00" : startTime,
          endTime: endTime.length === 16 ? endTime + ":00" : endTime,
          timeLimit: `${startTime} to ${endTime}` // Keep for backward compatibility
        }),
      });

      // Always try to parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // If JSON parsing fails, create generic error object
        data = { error: 'Server error. Please try again.' };
      }

      if (response.ok) {
        alert(existingSeat ? '✅ Seat updated successfully!' : '✅ Seat booked successfully!');
        navigate('/home');
      } else {
        // Show specific error message from backend
        alert('❌ ' + (data.error || 'Failed to process request.'));
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('❌ An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header1 />
      <Navigation />

      <div className="BAS">
        <h3>{existingSeat ? '✏️ Update Your Seat Booking' : '📅 Book a Study Hall Seat'}</h3>

        <form onSubmit={handleSubmit} className="login-container">
          <div className="form-group">
            <label htmlFor="seatNo">🔢 Seat Number (1-150):</label>
            <input
              type="number"
              id="seatNo"
              min="1"
              max="150"
              value={seatNo}
              onChange={handleSeatChange}
              placeholder="Enter seat number"
              required
              disabled={!!existingSeat}
            />
            {existingSeat && <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.25rem 0' }}>Seat number cannot be changed for existing bookings</p>}
          </div>

          <div className="form-group">
            <label htmlFor="startTime">🕐 Start Time:</label>
            <input
              type="datetime-local"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endTime">🕓 End Time:</label>
            <input
              type="datetime-local"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <div className="btngp">
            <button
              className="btn1"
              type="submit"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? '⏳ Processing...' : (existingSeat ? '💾 Update Booking' : '📌 Book Seat')}
            </button>
            <button
              className="btn1"
              type="button"
              onClick={() => navigate('/home')}
              style={{ background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)' }}
            >
              ❌ Cancel
            </button>
          </div>
        </form>

        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f1f5f9', borderRadius: '0.75rem', fontSize: '0.9rem', color: '#64748b' }}>
          <p><strong>💡 Tips:</strong></p>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li>Available seats: 1-150</li>
            <li>Select your booking start and end times</li>
            <li>You can update your booking anytime from the home page</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SeatBooking;
