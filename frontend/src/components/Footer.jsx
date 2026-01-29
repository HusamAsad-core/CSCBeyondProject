import React from 'react';
import './Footer.css';
import logoWhite from '../assets/images/icons/footer-logo.png'; 

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-top">
        <div className="footer-info">
          <img src={logoWhite} alt="EZY SKILLS" className="footer-logo" />
          <p>Let us build your career together. Be the first person to transform yourself with our unique & world class corporate level trainings.</p>
          <div className="newsletter">
            <h4>Subscribe Our Newsletter</h4>
            <div className="subscribe-box">
              <input type="email" placeholder="Your Email address" />
              <button>→</button>
            </div>
          </div>
        </div>
        
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>Home</li>
            <li>Our Story</li>
            <li>Best Courses</li>
            <li>FAQ's</li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>📍 Nayakathan Complex, 6th Floor, Hyderabad, Telangana</p>
          <p>📧 info@ezyskills.in</p>
          <p>📞 +91 8428448903</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Terms & Conditions | Privacy Policy</p>
        <div className="social-icons">
          {/* Add icons here */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;