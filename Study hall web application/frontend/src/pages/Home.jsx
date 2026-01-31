import React, { useState, useEffect } from 'react';
import Header1 from '../Components/Header1';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import API_BASE_URL from '../api/config';

const Home = () => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch booked seats from the backend
  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/bookings/booked-seats`);
        if (!response.ok) {
          throw new Error('Failed to fetch booked seats');
        }
        const data = await response.json();
        console.log("--------------- DEBUG START ---------------");
        console.log("Raw API Response:", data);
        if (data.length > 0) {
          console.log("First Booking Item Keys:", Object.keys(data[0]));
          console.log("First Booking seatNo:", data[0].seatNo);
          console.log("First Booking startTime:", data[0].startTime);
        }
        console.log("--------------- DEBUG END ---------------");
        setSeats(data);
      } catch (error) {
        console.error('Error fetching booked seats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedSeats();
  }, []);

  // Handle seat deletion
  const handleDelete = async (seatsNo) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        // Get regNo from localStorage for ownership verification
        const regNo = localStorage.getItem('regNo');

        const response = await fetch(`${API_BASE_URL}/bookings/delete/${seatsNo}?regNo=${regNo}`, {
          method: 'DELETE',
        });

        // Parse JSON response
        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          data = { error: 'Server error' };
        }

        if (!response.ok) {
          // Show specific error message from backend
          alert('❌ ' + (data.error || 'Failed to delete seat'));
          return;
        }

        setSeats(seats.filter(seat => seat.seatNo !== seatsNo));
        alert('✅ Seat successfully deleted.');
      } catch (error) {
        console.error('Delete error:', error);
        alert('❌ Error deleting seat. Please try again.');
      }
    }
  };

  const handleUpdate = (seat) => {
    navigate('/home/book-seat', { state: seat });
  };

  return (
    <div>
      <Header1 />
      <Navigation />

      <div className="grp2">
        <h1 className="hp1">📚 My Study Hall Bookings</h1>

        <div className="btngp">
          <Link to="book-seat">
            <button className="btn1" type="button">➕ Book a New Seat</button>
          </Link>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading your bookings...</p>
          </div>
        ) : seats.length > 0 ? (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                You have <strong>{seats.length}</strong> active booking{seats.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="seats-table-wrapper">
              <table className="seats-table">
                <thead>
                  <tr>
                    <th>🔢 Seat Number</th>
                    <th>⏱️ Time Duration</th>
                    <th>⚙️ Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {seats.map((seat) => (
                    <tr key={seat.seatNo}>
                      <td>
                        <strong>Seat #{seat.seatNo}</strong>
                      </td>
                      <td>
                        {new Date(seat.startTime).toLocaleString()} - <br />
                        {new Date(seat.endTime).toLocaleTimeString()}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="update-btn"
                            onClick={() => handleUpdate(seat)}
                            title="Update booking"
                          >
                            ✏️ Update
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(seat.seatNo)}
                            title="Delete booking"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h3>No Bookings Yet</h3>
            <p>You haven't booked any seats yet. Click the button above to book your first seat!</p>
            <Link to="book-seat">
              <button className="btn1" style={{ marginTop: '1rem', maxWidth: '200px' }}>
                Book Now
              </button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
