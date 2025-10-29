import React from 'react';
import './Header.css';

const Header1 = () => {
  return (
    <header className="header-container">
      <div className="header-content">
        <img src="/FOE.jpeg" className='img1' alt='Faculty of Engineering' />
        <div className="header-text">
          <h1 className='he1'>Faculty of Engineering</h1>
          <h2 className='he2'>University Of Ruhuna</h2>
          <h3 className='he3'>Study Hall Management System</h3>
        </div>
      </div>
    </header>
  );
};

export default Header1;
