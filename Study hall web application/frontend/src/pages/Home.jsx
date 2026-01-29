import React, { useState, useEffect } from 'react';
import Header1 from '../Components/Header1';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch booked seats from the backend
  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const response = await fetch('http://localhost:8082/booked-seats');
        if (!response.ok) {
          throw new Error('Failed to fetch booked seats');
        }
        const data = await response.json();
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
    try {
      const response = await fetch(`http://localhost:8082/delete-seat/${seatsNo}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete seat');
      }

      setSeats(seats.filter(seat => seat.seatsNo !== seatsNo));
      alert('Seat successfully deleted.');
    } catch (error) {
      alert('Error deleting seat. Please try again.');
    }
  };

  return (
    <div>
      <Header1 />
      <Navigation />

      <div className="grp2">
        <div className="btngp">
          <Link to="book-seat">
            <button className="btn1" type="button">Book a Seat</button>
          </Link>
        </div>

        <p className="hp1">Booked Seats</p>

        {loading ? (
          <p>Loading booked seats...</p>
        ) : (
          <div className="booked-seats">
            {seats.length > 0 ? (
              <table className="seats-table">
                <thead>
                  <tr>
                    <th>Seat Number</th>
                    <th>Time Limit</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {seats.map((seat) => (
                    <tr key={seat.seatsNo}>
                      <td>{seat.seatsNo}</td>
                      <td>{seat.TimeLimit} hours</td>
                      <td>
                        <button className="delete-btn" onClick={() => handleDelete(seat.seatsNo)}>Delete</button>
                        <button 
                          className="update-btn"
                          onClick={() => navigate(`/book-seat?seatNo=${seat.seatsNo}&timeLimit=${seat.TimeLimit}`)}
                        >
                          Update Seat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className='p222'>No seats booked yet.</p>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
