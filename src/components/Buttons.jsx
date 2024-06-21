import React from 'react';
import './Button.css';
import { Link } from 'react-router-dom';
import { FaHome, FaUser } from 'react-icons/fa'; // Importing home and profile icons from React Icons

function Buttons() {
  return (
    <div className="button-container">
      <div className="button-line"></div>
      <Link to="/" className="button-link">
        <button className="icon-button home-button">
          <FaHome />
        </button>
      </Link>
      <Link to="/profile" className="button-link">
        <button className="icon-button profile-button">
          <FaUser />
        </button>
      </Link>
    </div>
  );
}

export default Buttons;
