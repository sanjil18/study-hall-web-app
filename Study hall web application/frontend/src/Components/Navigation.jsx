import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('regNo');
    navigate('/');
  };

  return (
    <div className='nav1'>
      <p className='p12'>
        <Link to="/home">🏠 Home</Link>
      </p>
      <p className='p12'>
        <Link to="/profile">👤 Profile</Link>
      </p>
      <button className='btnpr' onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
}

export default Navigation;
