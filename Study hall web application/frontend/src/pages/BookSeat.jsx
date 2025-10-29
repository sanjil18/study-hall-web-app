import React, { useState, useEffect } from 'react';
import Header1 from '../Components/Header1';
import Footer from '../Components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';
import './BookSeat.css'; // Make sure this file is updated with the new styles

const SeatBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // If updating, pre-fill with existing details
  const existingSeat = location.state || null;
  
  const [seatNo, setSeatNo] = useState(existingSeat ? existingSeat.seatsNo : '');
  const [time, setTime] = useState(existingSeat ? existingSeat.TimeLimit : '');

  const handleSeatChange = (e) => {
    setSeatNo(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = existingSeat 
      ? `http://localhost:5000/update-seat/${seatNo}` 
      : 'http://localhost:5000/book-seat';

    const method = existingSeat ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: 1, seatNo, timeLimit: time }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(existingSeat ? 'Seat updated successfully!' : 'Seat booked successfully!');
        navigate('/home');
      } else {
        alert(data.error || 'Failed to process request.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <Header1 />
      <div className="login-container"> {/* Use the same container style */}
        <h3 style={{ textAlign: 'center' }}>{existingSeat ? 'Update Seat Booking' : 'Seat Booking'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label>Seat NO (1-150):</label>
            <input 
              type="number" 
              value={seatNo} 
              onChange={handleSeatChange} 
              required 
              disabled={!!existingSeat} 
            />
          </div>
          <br />

          <div>
            <label>Time in hours:</label>
            <input 
              type="time" 
              value={time} 
              onChange={handleTimeChange} 
              required 
            />
          </div>
          <br />

          <div className="btngp">
            <button className="btn" type="submit">{existingSeat ? 'Update' : 'Book'}</button>
            <button className="btn" type="button" onClick={() => navigate('/home')}>Cancel</button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default SeatBooking;
