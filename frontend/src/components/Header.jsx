import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/images/icons/logo.png';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  
  // Roles from your DB: 'admin', 'instructor'
  const userRole = localStorage.getItem('userRole'); 
  const token = localStorage.getItem('token');
  // Dynamic greeting: pulls the actual username stored during login
  const username = localStorage.getItem('username');
  console.log("Current Username in Storage:", username); // Check your browser console
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload(); 
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo-section">
          <Link to="/"><img src={logo} alt="EZY SKILLS" className="logo-img" /></Link>
        </div>
        
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/faq">FAQ</Link>
        </nav>

        <div className="header-buttons">
          {!token ? (
            <>
              <button className="btn-login-outline" onClick={() => navigate('/login')}>Log in</button>
              <button className="btn-orange" onClick={() => navigate('/register')}>Create Account</button>
            </>
          ) : (
            <div className="user-menu-container" style={{ position: 'relative' }}>
              <button className="user-dropdown-toggle" onClick={() => setShowDropdown(!showDropdown)}>
                Hey, {username} <span className="arrow">▾</span>
              </button>

              {showDropdown && (
                <div className="profile-dropdown">
                  {userRole === 'admin' && (
                    <Link to="/admin" className="dropdown-admin-link" onClick={() => setShowDropdown(false)}>
                      ⚙️ ADMIN PANEL
                    </Link>
                  )}
                  
                  <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>Edit Profile</Link>
                  
                  {(userRole === 'instructor' || userRole === 'admin') && (
                    <Link to="/teacher/dashboard" className="dropdown-item" onClick={() => setShowDropdown(false)}>My Courses</Link>
                  )}
                  
                  <hr className="dropdown-divider" />
                  
                  <button className="dropdown-item logout-link" onClick={handleLogout}>Log Out</button>

                  {(userRole === 'instructor' || userRole === 'admin') && (
                    <button 
                      className="btn-create-shortcut" 
                      onClick={() => {
                        // Redirects to the specific create page
                        navigate('/teacher/create-course');
                        setShowDropdown(false);
                      }}
                    >
                      + Create Course
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;