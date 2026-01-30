import React, { useState, useEffect } from 'react';
import Header1 from '../Components/Header1';
import Footer from '../Components/Footer';
import NavigationPrev from '../Components/NavigationPrev';
import { Link } from 'react-router-dom';
import './Preview.css';

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
        <div>
            <Header1 />
            <NavigationPrev />
            <div className="background" style={{ backgroundImage: `url(${images[currentImage]})` }}>
                <p className="h1style">
                    Welcome to Study Hall
                    <br />
                    <span style={{ fontSize: '0.7em', opacity: 0.9 }}>Management System</span>
                </p>
                <div className="notice-container">
                    <p className="notice">
                        🔔 Important: From 01/01/2025 We are Open 24x7 | Book your seat now and enjoy uninterrupted study time! 📚
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="preview-cta">
                    <Link to="/login" style={{ marginRight: '1rem', textDecoration: 'none' }}>
                        <button className="preview-btn" style={{ 
                            background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' 
                        }}>
                            🚀 Login Now
                        </button>
                    </Link>
                    <Link to="/sign-up" style={{ textDecoration: 'none' }}>
                        <button className="preview-btn" style={{ 
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
                        }}>
                            ✨ Sign Up
                        </button>
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <section style={{ padding: '4rem 2rem', background: '#f1f5f9' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ 
                        textAlign: 'center', 
                        fontSize: '2rem', 
                        color: '#2563eb', 
                        marginBottom: '3rem',
                        fontWeight: 700 
                    }}>
                        Why Choose Our Study Hall? ✨
                    </h2>
                    
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem'
                    }}>
                        {[
                            { icon: '📍', title: '150 Comfortable Seats', desc: 'Choose from our spacious seating arrangement' },
                            { icon: '⏰', title: '24/7 Access', desc: 'Study whenever you want, anytime of the day' },
                            { icon: '💻', title: 'Easy Booking', desc: 'Simple and fast online seat booking system' },
                            { icon: '🔄', title: 'Flexible Hours', desc: 'Book for any duration that suits your schedule' },
                            { icon: '🎯', title: 'Real-time Availability', desc: 'Instant seat availability updates' },
                            { icon: '📊', title: 'Manage Bookings', desc: 'Update or cancel your bookings anytime' }
                        ].map((feature, idx) => (
                            <div key={idx} style={{
                                background: 'white',
                                padding: '2rem',
                                borderRadius: '1rem',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                textAlign: 'center',
                                border: '1px solid #e2e8f0',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(37,99,235,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                            }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
                                <h3 style={{ fontSize: '1.25rem', color: '#2563eb', marginBottom: '0.5rem', fontWeight: 600 }}>
                                    {feature.title}
                                </h3>
                                <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)',
                padding: '4rem 2rem',
                textAlign: 'center',
                color: 'white'
            }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 700 }}>
                    Ready to Book Your Study Seat?
                </h2>
                <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.95 }}>
                    Join thousands of students already using our platform. Sign up now and get access to the best study hall!
                </p>
                <Link to="/sign-up" style={{ textDecoration: 'none' }}>
                    <button style={{
                        background: 'white',
                        color: '#2563eb',
                        border: 'none',
                        padding: '1rem 2.5rem',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                    }}>
                        Get Started Now 🎯
                    </button>
                </Link>
            </section>

            <Footer />
        </div>
    );
}

export default Preview;

