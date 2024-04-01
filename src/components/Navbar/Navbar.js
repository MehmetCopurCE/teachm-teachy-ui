import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/login">Login/Signup</Link></li> {/* Add this line */}
      </ul>
    </nav>
  );
}

export default Navbar;
