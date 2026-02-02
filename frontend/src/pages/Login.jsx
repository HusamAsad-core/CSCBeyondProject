import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css'; 

// Asset Imports
import authIllustration from '../assets/images/auth-illustration.png';
import googleIcon from '../assets/images/icons/google-icon.svg';
import facebookIcon from '../assets/images/icons/facebook-icon.svg';
import appleIcon from '../assets/images/icons/apple-icon.svg';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [popup, setPopup] = useState({
    show: false,
    message: '',
    type: 'error'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save auth data
        localStorage.setItem('token', data.token);
        // We use data.user.role and data.user.username based on your backend controller
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem('userRole', data.user.role); 
        localStorage.setItem('userName', data.user.username || data.user.name || formData.email.split('@')[0]);
        
        // Conditional Redirect
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        window.location.reload(); 
      } else {
        setPopup({ show: true, message: data.message || "Invalid credentials", type: 'error' });
      }
    } catch (err) {
      setPopup({ show: true, message: "Server error. Check your connection.", type: 'error' });
    }
  };

  return (
    <div className="register-page-container">
      {popup.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon-container error">!</div>
            <h2 className="modal-title">Oops!</h2>
            <p className="modal-message">{popup.message}</p>
            <button onClick={() => setPopup({ ...popup, show: false })} className="modal-continue-btn">
              Try Again
            </button>
          </div>
        </div>
      )}

      <div className="register-content-wrapper">
        <div className="form-column">
          <h2 className="register-title">
            <span className="title-blue">Log</span> <span className="title-orange">In</span>
          </h2>
          
          <form className="register-form" onSubmit={handleLogin}>
            <input 
              name="email"
              type="email" 
              placeholder="Email Address" 
              className="auth-input" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
            <input 
              name="password"
              type="password" 
              placeholder="Password" 
              className="auth-input" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
            
            <button type="submit" className="btn-submit-auth">Log In</button>
            
            <p className="switch-auth-text">
              Need an account? <Link to="/register">Register Here</Link>
            </p>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <div className="social-grid">
            <button className="social-btn google" type="button">
              <img src={googleIcon} alt="" /> <span>Sign in</span>
            </button>
            <button className="social-btn facebook" type="button">
              <img src={facebookIcon} alt="" /> <span>Sign in</span>
            </button>
            <button className="social-btn apple" type="button">
              <img src={appleIcon} alt="" /> <span>Sign in</span>
            </button>
          </div>
        </div>

        <div className="image-column">
          <img src={authIllustration} alt="Login illustration" className="auth-hero-img" />
        </div>
      </div>
    </div>
  );
};

export default Login;