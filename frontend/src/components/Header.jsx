import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/images/icons/logo.png';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const userRole = localStorage.getItem('userRole');
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('userName') || 'User';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  // ✅ Role-based "My Courses" destination
  const myCoursesPath =
    (userRole === 'admin' || userRole === 'instructor')
      ? '/teacher/dashboard'
      : '/my-courses';

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

                  <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    Edit Profile
                  </Link>

                  <Link
  to={userRole === "admin" || userRole === "instructor" ? "/teacher/dashboard" : "/my-courses"}
  className="dropdown-item"
  onClick={() => setShowDropdown(false)}
>
  My Courses
</Link>



                  <hr className="dropdown-divider" />

                  <button className="dropdown-item logout-link" onClick={handleLogout}>
                    Log Out
                  </button>
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
