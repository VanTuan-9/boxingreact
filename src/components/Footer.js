import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>311 Boxing Street</p>
          <p>Haiphong, Thuynguyen 12345</p>
          <p>Phone: (+84) 975957084</p>
          <p>Email: duchung@boxingclub.com</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/booking">Book a Class</Link></li>
            <li><Link to="/coaches">Our Coaches</Link></li>
            <li><Link to="/tournaments">Tournaments</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Hours</h4>
          <p>Monday - Friday: 6am - 10pm</p>
          <p>Saturday: 8am - 8pm</p>
          <p>Sunday: 9am - 6pm</p>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Elite Boxing Club. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;