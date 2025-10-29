// Example: NavigationPrev.jsx
import React from "react";
import { Link } from 'react-router-dom';  // Correct import
import './Navigation.css';

function NavigationPrev() {
  return (
    <nav className="nav1">
      <Link to="/login">
      <button className='btnpr'  >Log in</button>
      </Link>
      <Link to="/sign-up">
      <button className='btnpr'>Sign Up</button>  
      </Link>
    </nav>
  );
}

export default NavigationPrev; 
