import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaPhone, FaEnvelope, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    closeMenu();
  };

  const handleDashboard = () => {
    if (user?.role === 'super_admin') {
      navigate('/dashboard');
    } else if (user?.role === 'supervisor') {
      navigate('/supervisor-dashboard');
    }
    closeMenu();
  };

  return (
    <>


      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="nav-wrapper">
            <Link to="/" className="logo" onClick={closeMenu}>
              <span className="logo-icon">🏗️</span>
              <span className="logo-text">BuildPro</span>
            </Link>

            <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
              <li><Link to="/" onClick={closeMenu}>Home</Link></li>
              <li><Link to="/about" onClick={closeMenu}>About Us</Link></li>
              <li><Link to="/services" onClick={closeMenu}>Services</Link></li>
              <li><Link to="/projects" onClick={closeMenu}>Projects</Link></li>
              <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
            </ul>

            <div className="nav-actions">
              {user ? (
                <>
                  <button onClick={handleDashboard} className="btn btn-secondary nav-btn">
                    <FaUser /> Dashboard
                  </button>
                  <button onClick={handleLogout} className="btn btn-danger nav-btn">
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn btn-primary nav-btn" onClick={closeMenu}>
                  <FaUser /> Login
                </Link>
              )}
            </div>

            <div className="hamburger" onClick={toggleMenu}>
              {isOpen ? <FaTimes /> : <FaBars />}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
