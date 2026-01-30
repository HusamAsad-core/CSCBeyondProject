import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; 
import logoImg from '../assets/images/icons/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState(""); // Track role for admin button
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedRole = localStorage.getItem('userRole'); // Retrieve role
    if (token) {
      setUserName(storedName || "User");
      setUserRole(storedRole || "");
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    setUserName("");
    setUserRole("");
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-logo">
        <Link to="/">
           <img src={logoImg} alt="EzySkills Logo" className="nav-logo-img" />
        </Link>
      </div>

      <div className="navbar-links-center">
        <Link to="/" className="nav-link-item">Home</Link>
        <Link to="/courses" className="nav-link-item">Courses</Link>
        <Link to="/pricing" className="nav-link-item">Pricing</Link>
        <Link to="/faq" className="nav-link-item">FAQ</Link>
      </div>

      <div className="navbar-auth-section">
        {!token ? (
          <div className="auth-buttons">
            <Link to="/login" className="btn-login-outline">Log In</Link>
            <Link to="/register" className="btn-register-solid">Create Account</Link>
          </div>
        ) : (
          <div 
            className="user-profile-wrapper"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div className="user-info-trigger">
              <span className="user-greeting-text">
                Hey, <span className="user-name-bold">{userName}</span>
              </span>
              <i className={`arrow-icon ${isDropdownOpen ? 'open' : ''}`}></i>
            </div>

            {isDropdownOpen && (
              <div className="nav-dropdown-menu">
                {/* Admin Only Link */}
                {userRole === 'admin' && (
                  <Link to="/admin" className="dropdown-link" style={{ color: '#f39c12', fontWeight: 'bold' }}>
                    🛠 Admin Panel
                  </Link>
                )}
                
                <Link to="/profile" className="dropdown-link">Edit Profile</Link>
                <Link to="/dashboard" className="dropdown-link">My Courses</Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-logout-btn">
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;