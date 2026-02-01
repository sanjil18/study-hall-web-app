import React, { useState, useEffect } from 'react';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api/config';
import { Clock, Trash2, Edit2, Plus, Calendar, AlertCircle } from 'lucide-react';

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
        const regNo = localStorage.getItem('regNo');
        const response = await fetch(`${API_BASE_URL}/bookings/delete/${seatsNo}?regNo=${regNo}`, {
          method: 'DELETE',
        });

        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          data = { error: 'Server error' };
        }

        if (!response.ok) {
          alert('❌ ' + (data.error || 'Failed to delete seat'));
          return;
        }

        setSeats(seats.filter(seat => seat.seatNo !== seatsNo));
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="flex-grow pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-12">
        {/* Hero / Welcome Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Faculty of Engineering</h1>
              <h2 className="text-xl text-indigo-600 font-medium mt-1">Study Hall Management System</h2>
              <p className="text-gray-500 mt-2">Manage your study sessions efficiently.</p>
            </div>
            <Link to="book-seat">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg font-medium">
                <Plus size={20} />
                Book New Seat
              </button>
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Calendar size={20} className="text-gray-500" />
            Your Bookings
            {seats.length > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {seats.length}
              </span>
            )}
          </h3>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-48 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : seats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seats.map((seat) => (
              <div key={seat.seatNo} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden group">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-lg text-sm">
                      Seat #{seat.seatNo}
                    </div>
                    {/* Status indicator (optional logic) */}
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3 text-gray-600">
                      <Clock size={18} className="mt-0.5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Start Time</p>
                        <p className="text-sm font-medium">{new Date(seat.startTime).toLocaleString(undefined, {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-gray-600">
                      <Clock size={18} className="mt-0.5 text-transparent" /> {/* Spacer */}
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">End Time</p>
                        <p className="text-sm font-medium">{new Date(seat.endTime).toLocaleTimeString(undefined, {
                          hour: '2-digit', minute: '2-digit'
                        })}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                    <button
                      onClick={() => handleUpdate(seat)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 size={16} />
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(seat.seatNo)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <AlertCircle size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
              Get started by booking your first study seat. It takes less than a minute.
            </p>
            <div className="mt-6">
              <Link to="book-seat">
                <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
