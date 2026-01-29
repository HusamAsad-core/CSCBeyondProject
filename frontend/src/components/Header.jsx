import React from 'react';
import './Header.css';
import logo from '../assets/images/icons/logo.png';

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo-section">
          <img src={logo} alt="EZY SKILLS" className="logo-img" />
        </div>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/selector" className="active">Course Selector</a>
          <a href="/courses">Courses</a>
          <a href="/faq">FAQ</a>
          <a href="/contact">Contact</a>
          <a href="/about">About Us</a>
        </nav>
        <div className="header-buttons">
          <button className="btn-login-outline">Log in</button>
          <button className="btn-orange">Create Account</button>
        </div>
      </div>
    </header>
  );
};

export default Header;