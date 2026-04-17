import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaChevronUp } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="temple-footer">
      <div className="footer-top">
        {/* Column 1: Temple Identity */}
        <div className="footer-col about">
          <h2 className="footer-logo">🛕Temple</h2>
          <p>Spreading peace, devotion, and divine grace since 1890. Join us in our daily prayers and sevas.</p>
          <div className="social-links">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/history">About Temple</a></li>
            <li><a href="/sevas">Book Seva</a></li>
            <li><a href="/events">Upcoming Events</a></li>

          </ul>
        </div>

        {/* Column 3: Temple Timings */}
        <div className="footer-col timings">
          <h3>Temple Timings</h3>
          <p><strong>Morning:</strong> 6:00 AM – 1:30 PM</p>
          <p><strong>Evening:</strong> 4:30 PM – 9:30 PM</p>
          <p className="special-note">* Timings may change during festivals.</p>
        </div>

        {/* Column 4: Contact Info */}
        <div className="footer-col contact">
          <h3>Contact Us</h3>
          <p><FaMapMarkerAlt /> Address</p>
          <p><FaPhoneAlt /> +91 98765 43210</p>
          <p><FaEnvelope /> info@templewebsite.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026  Temple. All Rights Reserved.</p>
        <button className="back-to-top" onClick={scrollToTop} title="Go to Top">
          <FaChevronUp />
        </button>
      </div>
    </footer>
  );
};

export default Footer;