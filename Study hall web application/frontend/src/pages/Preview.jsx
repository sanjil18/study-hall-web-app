import React, { useState, useEffect } from 'react';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Monitor, Clock, Calendar, Users, Star, School } from 'lucide-react';

const images = [
    "DSC02886.jpg",
    "Eng_5.jpg",
    "Eng_7.jpg"
];

function Preview() {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage(prev => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            {/* Navigation / Header */}
            <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <School className="h-8 w-8 text-indigo-600" />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                StudyHall
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm">
                                Log in
                            </Link>
                            <Link to="/sign-up" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md text-sm font-medium">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Carousel */}
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
                        style={{ backgroundImage: `url(${img})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
                    </div>
                ))}

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-100 text-sm font-semibold mb-6 backdrop-blur-sm">
                        👋 Welcome to the Future of Studying
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                        Faculty of Engineering <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            Study Hall Management
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Book your perfect study spot instantly. Open 24x7 for all your academic needs.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/login">
                            <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
                                Book a Seat Now <ArrowRight size={20} />
                            </button>
                        </Link>
                        <Link to="/sign-up">
                            <button className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-lg transition-all">
                                Create Account
                            </button>
                        </Link>
                    </div>

                    <div className="mt-12 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 inline-flex items-center gap-3">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <p className="text-gray-200 text-sm font-medium">
                            Status: <span className="text-white font-bold">Open 24/7</span> • 150 Seats Available
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Why Choose Our Study Hall?</h2>
                        <p className="mt-4 text-xl text-gray-600">Premium facilities designed for your academic success</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: <Monitor className="w-6 h-6 text-blue-600" />, title: '150 Comfortable Seats', desc: 'Ergonomic seating arrangement designed for long study sessions.' },
                            { icon: <Clock className="w-6 h-6 text-green-600" />, title: '24/7 Access', desc: 'Study whenever inspiration strikes, day or night.' },
                            { icon: <CheckCircle2 className="w-6 h-6 text-purple-600" />, title: 'Easy Booking', desc: 'Book your preferred seat in seconds from any device.' },
                            { icon: <Calendar className="w-6 h-6 text-orange-600" />, title: 'Flexible Scheduling', desc: 'Reserve seats for exactly the duration you need.' },
                            { icon: <Star className="w-6 h-6 text-yellow-600" />, title: 'Premium Environment', desc: 'Quiet, air-conditioned atmosphere perfect for concentration.' },
                            { icon: <Users className="w-6 h-6 text-teal-600" />, title: 'Managing made easy', desc: 'View, update, or cancel your bookings with ease.' }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-blue-900" />
                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Boost Your Productivity?</h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Join thousands of students who trust our facility for their study sessions.
                    </p>
                    <Link to="/sign-up">
                        <button className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                            Get Started Now
                        </button>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Preview;

