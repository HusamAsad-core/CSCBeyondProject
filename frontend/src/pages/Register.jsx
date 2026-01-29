import React, { useState } from 'react';
import './Register.css';

// Asset Imports
import authIllustration from '../assets/images/auth-illustration.png';
import googleIcon from '../assets/images/icons/google-icon.svg';
import facebookIcon from '../assets/images/icons/facebook-icon.svg';
import appleIcon from '../assets/images/icons/apple-icon.svg';

const Register = () => {
  // State for form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Connect to Email/Password Registration Service
 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    // Make sure the port matches your backend server (e.g., 5001)
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword // 👈 MUST include this for your validation.js
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      alert(`Success! Account created for ${data.user.name}`); // Should show email prefix
      // Redirect or clear form
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (err) {
    console.error("Connection error:", err);
    alert("Server error. Is your backend running?");
  }
};

  // 2. Connect to Social Authentication Services
  const handleSocialLogin = (platform) => {
    // Redirects to your Passport.js backend routes
    window.location.href = `http://localhost:5001/api/auth/${platform}`;
  };

  return (
    <div className="register-page-container">
      <div className="register-content-wrapper">
        
        {/* Left Side: The Clean Shadow Box */}
        <div className="outer-border-box">
          <div className="inner-form-box">
            
            {/* Figma Typography: Poppins 45px Split Color */}
            <h2 className="register-title">
              <span className="title-blue">Create</span> <span className="title-orange">Account</span>
            </h2>
            
            <form className="actual-form" onSubmit={handleSubmit}>
              <input 
                name="email"
                type="email" 
                placeholder="Email Address" 
                className="figma-input" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
              <input 
                name="password"
                type="password" 
                placeholder="Password" 
                className="figma-input" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
              <input 
                name="confirmPassword"
                type="password" 
                placeholder="Confirm Password" 
                className="figma-input" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
              />
              
              <div className="remember-row">
                <input type="checkbox" id="rem" />
                <label htmlFor="rem" className="remember-label">Remember me</label>
              </div>

              <button type="submit" className="btn-create-account">Create Account</button>
              
              <p className="login-link-text">
                Already Created? <a href="/login">Login Here</a>
              </p>
            </form>

            <div className="divider-text">
              <span className="divider-word">or</span>
            </div>

            {/* Social Icons matching Figma styling */}
            <div className="social-login-row">
              <button className="soc-btn google-white" onClick={() => handleSocialLogin('google')}>
                <img src={googleIcon} alt="Google" className="icon-img" /> 
                <span>Sign in</span>
              </button>
              
              <button className="soc-btn fb-blue" onClick={() => handleSocialLogin('facebook')}>
                <img src={facebookIcon} alt="Facebook" className="icon-img" /> 
                <span>Sign in</span>
              </button>
              
              <button className="soc-btn apple-black" onClick={() => handleSocialLogin('apple')}>
                <img src={appleIcon} alt="Apple" className="icon-img" /> 
                <span>Sign in</span>
              </button>
            </div>
            
            <p className="terms-text">
              By continuing, you agree to the <span className="highlight">Terms of Service</span> and <span className="highlight">Privacy Policy</span>
            </p>
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="illustration-container">
          <img src={authIllustration} alt="Registration illustration" className="figma-img" />
        </div>

      </div>
    </div>
  );
};

export default Register;