import React, { useState, useEffect } from 'react';
import Header1 from '../Components/Header1';
import Footer from '../Components/Footer';
import NavigationPrev from '../Components/NavigationPrev';
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
        }, 4000); // Change image every 4 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    return (
        <div>
            <Header1 />
            <NavigationPrev />
            <div className="background" style={{ backgroundImage: `url(${images[currentImage]})` }}>
                <p className="h1style">Welcome to Study Hall Management System</p>
                <div className="notice-container">
    <p className="notice">🔔 Important Notice: From 01/01/2025 We are Open 24x7 . Stay tuned for updates! 📢</p>
</div>

            </div>
            <br />
            <Footer />
        </div>
    );
}

export default Preview;
