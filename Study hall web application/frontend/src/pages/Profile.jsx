import React, { useState, useEffect } from 'react';
import Footer from '../Components/Footer';
import Navigation from '../Components/Navigation';
import { User, BookOpen, Clock, Armchair, Building2, Mail, Info, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      const response = await fetch(`${API_BASE_URL}/bookings/booked-seats`);
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Header Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="h-24 w-24 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl shadow-lg border-4 border-white">
              <User size={48} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
              <p className="text-gray-500 mt-1 flex items-center justify-center md:justify-start gap-2">
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-mono">{regNo || 'Not logged in'}</span>
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <BookOpen size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{bookingCount}</div>
                <div className="text-sm text-gray-500">Active Bookings</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <Clock size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-500">Hall Access</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <Armchair size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">150</div>
                <div className="text-sm text-gray-500">Total Seats</div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
              <Info size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">User Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <Building2 className="text-gray-400 mt-1" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Institution</h3>
                  <p className="text-gray-600">Faculty of Engineering, University of Ruhuna</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="text-gray-400 mt-1" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Facility</h3>
                  <p className="text-gray-600">Study Hall Management System</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mt-4 border border-gray-100">
                <p className="text-gray-600 italic text-sm">
                  "Welcome to our modern Study Hall Management System. Book your preferred seat, manage your schedule, and enjoy a productive study environment."
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-4">
              <Link to="/home" className="flex-1">
                <button className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 py-2.5 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-colors font-medium text-sm shadow-sm">
                  <Calendar size={18} />
                  View Bookings
                </button>
              </Link>
              <Link to="/home/book-seat" className="flex-1">
                <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm shadow-md">
                  <Armchair size={18} />
                  Book New Seat
                </button>
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;