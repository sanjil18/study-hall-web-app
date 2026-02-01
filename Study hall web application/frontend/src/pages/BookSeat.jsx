import React, { useState } from 'react';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import { useNavigate, useLocation } from 'react-router-dom';
import API_BASE_URL from '../api/config';
import { Calendar, Clock, MapPin, Save, X, Info } from 'lucide-react';

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

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        data = { error: 'Server error. Please try again.' };
      }

      if (response.ok) {
        alert(existingSeat ? '✅ Seat updated successfully!' : '✅ Seat booked successfully!');
        navigate('/home');
      } else {
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {existingSeat ? <div className="flex items-center gap-2"><div className="p-1 bg-white/20 rounded"><Clock size={20} /></div> Update Booking</div> : <div className="flex items-center gap-2"><div className="p-1 bg-white/20 rounded"><Calendar size={20} /></div> Book a Seat</div>}
              </h3>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="seatNo" className="block text-sm font-medium text-gray-700 mb-1">
                    Seat Number (1-150)
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="seatNo"
                      min="1"
                      max="150"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3 bg-gray-50 border"
                      value={seatNo}
                      onChange={handleSeatChange}
                      placeholder="Enter seat number"
                      required
                      disabled={!!existingSeat}
                    />
                  </div>
                  {existingSeat && <p className="mt-1 text-xs text-indigo-500 flex items-center gap-1"><Info size={12} /> Seat number cannot be changed for existing bookings</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="datetime-local"
                        id="startTime"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg p-3 bg-gray-50 border"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="datetime-local"
                        id="endTime"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg p-3 bg-gray-50 border"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/home')}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Processing...' : (existingSeat ? <><Save size={18} /> Update Booking</> : <><Calendar size={18} /> Book Seat</>)}
                  </button>
                </div>
              </form>

              <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-blue-800 mb-3">
                  <Info size={16} />
                  Booking Tips
                </h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                    Available seats range from 1 to 150.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                    Please adhere to your booked time slots to ensure fair usage.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                    You can modify or cancel your booking from the dashboard.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SeatBooking;
