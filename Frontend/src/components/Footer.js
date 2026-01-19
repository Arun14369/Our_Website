import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-col">
            <h3>
              <span className="logo-icon">🏗️</span> BuildPro
            </h3>
            <p>
              Leading construction and manpower services provider specializing in 
              government tenders and AAC blocks manufacturing plants.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Our Services</h4>
            <ul>
              <li><Link to="/services">Government Tenders</Link></li>
              <li><Link to="/services">AAC Blocks Manpower</Link></li>
              <li><Link to="/services">Construction Management</Link></li>
              <li><Link to="/services">Plant Operations</Link></li>
              <li><Link to="/services">Project Consulting</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Info</h4>
            <ul className="contact-list">
              <li>
                <FaMapMarkerAlt />
                <span>123 Construction Avenue, New Delhi, India</span>
              </li>
              <li>
                <FaPhone />
                <span>+91 98765 43210</span>
              </li>
              <li>
                <FaEnvelope />
                <span>info@buildpro.com</span>
              </li>
              <li>
                <FaClock />
                <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 BuildPro Construction. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
