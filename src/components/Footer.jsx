// src/components/Footer/Footer.js
import React from 'react';
import '../Css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-logo-section">
          <div className="logo-icon">🔵</div>
          <div>
            <h3>Premier Properties</h3>
            <p>
               Premier Properties is a leading real estate platform dedicated to helping you find your dream home or ideal investment. With a commitment to excellence, we offer top-tier listings, expert guidance, and a seamless experience from search to sale. Whether you're buying, selling, or renting, trust us to deliver results.
            </p>
          </div>
        </div>

        <div className="footer-links-section">
          <div className="footer-column">
            <h4>Explore</h4>
            <ul>
              <li>Featured Listings</li>
              <li>Neighborhoods</li>
              <li>Wide Property Portfolio</li>
              <li>Global Reach, Local Expertise</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Services</h4>
            <ul>
              <li>Property Buying & Selling </li>
              <li>Rental Management</li>
              <li>Home Valuation</li>
              <li>Legal & Documentation Support</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Contact</h4>
            <ul>
              <li>Address – 123 Skyline Avenue, Downtown City, USA – 10001</li>
              <li>Phone – +1 (800) 555-6789</li>
              <li>Email – support@premierproperties.com</li>
              <li>Support Hours – Mon–Fri: 9AM – 6PM (EST)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© Lorem Ipsum - All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
