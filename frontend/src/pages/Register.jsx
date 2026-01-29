import React, { useState } from 'react';
import './Register.css';

// Asset Imports
import authIllustration from '../assets/images/auth-illustration.png';
import googleIcon from '../assets/images/icons/google-icon.svg';
import facebookIcon from '../assets/images/icons/facebook-icon.svg';
import appleIcon from '../assets/images/icons/apple-icon.svg';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [popup, setPopup] = useState({
    show: false,
    message: '',
    type: 'success' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const closePopup = () => setPopup({ ...popup, show: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPopup({ show: true, message: "Passwords do not match!", type: 'error' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setPopup({ show: true, message: `Success! Account created.`, type: 'success' });
        setFormData({ email: '', password: '', confirmPassword: '' });
      } else {
        setPopup({ show: true, message: data.message || "Registration failed", type: 'error' });
      }
    } catch (err) {
      setPopup({ show: true, message: "Server error. Is your backend running?", type: 'error' });
    }
  };

  return (
    <div className="register-page-container">
      {popup.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className={`modal-icon-container ${popup.type}`}>
              {popup.type === 'success' ? '✓' : '!'}
            </div>
            <h2 className="modal-title">{popup.type === 'success' ? 'Successful!' : 'Oops!'}</h2>
            <p className="modal-message">{popup.message}</p>
            <button onClick={closePopup} className="modal-continue-btn">Continue</button>
          </div>
        </div>
      )}

      <div className="register-content-wrapper">
        <div className="form-column">
          <h2 className="register-title">
            <span className="title-blue">Create</span> <span className="title-orange">Account</span>
          </h2>
          
          <form className="register-form" onSubmit={handleSubmit}>
            <input name="email" type="email" placeholder="Email Address" className="auth-input" value={formData.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" className="auth-input" value={formData.password} onChange={handleChange} required />
            <input name="confirmPassword" type="password" placeholder="Confirm Password" className="auth-input" value={formData.confirmPassword} onChange={handleChange} required />
            
            <button type="submit" className="btn-submit-auth">Create Account</button>
            <p className="switch-auth-text">Already Created? <a href="/login">Login Here</a></p>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <div className="social-grid">
            <button className="social-btn google" type="button"><img src={googleIcon} alt="" /> Sign in</button>
            <button className="social-btn facebook" type="button"><img src={facebookIcon} alt="" /> Sign in</button>
            <button className="social-btn apple" type="button"><img src={appleIcon} alt="" /> Sign in</button>
          </div>
        </div>

        <div className="image-column">
          <img src={authIllustration} alt="Registration" className="auth-hero-img" />
        </div>
      </div>
    </div>
  );
};

export default Register;