import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logoImg from "../assets/images/icons/logo.png";


const Navbar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState(""); // admin | instructor | student
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedRole = localStorage.getItem("userRole");

    if (token) {
      setUserName(storedName || "User");
      setUserRole(storedRole || "");
    } else {
      setUserName("");
      setUserRole("");
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    setUserName("");
    setUserRole("");
    navigate("/login");
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
        <Link to="/" className="nav-link-item">
          Home
        </Link>
        <Link to="/courses" className="nav-link-item">
          Courses
        </Link>
        <Link to="/pricing" className="nav-link-item">
          Pricing
        </Link>
        <Link to="/faq" className="nav-link-item">
          FAQ
        </Link>
      </div>

      <div className="navbar-auth-section">
        {!token ? (
          <div className="auth-buttons">
            <Link to="/login" className="btn-login-outline">
              Log In
            </Link>
            <Link to="/register" className="btn-register-solid">
              Create Account
            </Link>
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

  {/* Inbox button */}
  <Link to="/messages" className="nav-inbox-btn">
    Inbox
  </Link>

  <i className={`arrow-icon ${isDropdownOpen ? "open" : ""}`}></i>
</div>




            {isDropdownOpen && (
              <div className="nav-dropdown-menu">
                {/* Admin Only Link */}
                {userRole === "admin" && (
                  <Link to="/admin" className="dropdown-link admin-link">
                    Admin Panel
                  </Link>
                )}

                <Link to="/profile" className="dropdown-link">
                  Edit Profile
                </Link>

                {/* You used /dashboard before, but your App route is /my-courses */}
                <Link to="/my-courses" className="dropdown-link">
                  My Courses
                </Link>

                <div className="dropdown-divider" />

                <button onClick={handleLogout} className="dropdown-logout-btn" type="button">
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
