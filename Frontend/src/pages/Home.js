import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaHardHat, 
  FaUsers, 
  FaFileContract, 
  FaIndustry,
  FaCheckCircle,
  FaAward,
  FaChartLine
} from 'react-icons/fa';
import './Home.css';

const Home = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="hero-overlay"></div>
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Building Excellence in Construction & Manpower</h1>
            <p>
              Leading provider of Government Tender solutions and AAC Blocks 
              manufacturing manpower services across India
            </p>
            <div className="hero-buttons">
              <Link to="/services" className="btn btn-primary">
                Our Services
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <motion.div 
              className="stat-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <FaFileContract className="stat-icon" />
              <h3>500+</h3>
              <p>Government Tenders Completed</p>
            </motion.div>
            <motion.div 
              className="stat-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <FaUsers className="stat-icon" />
              <h3>2000+</h3>
              <p>Skilled Workers Deployed</p>
            </motion.div>
            <motion.div 
              className="stat-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FaIndustry className="stat-icon" />
              <h3>50+</h3>
              <p>AAC Plants Serviced</p>
            </motion.div>
            <motion.div 
              className="stat-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <FaAward className="stat-icon" />
              <h3>15+</h3>
              <p>Years of Excellence</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section services-preview">
        <div className="container">
          <div className="section-title">
            <h2>Our Core Services</h2>
            <p>Comprehensive construction and manpower solutions tailored to your needs</p>
          </div>
          <div className="services-grid">
            <motion.div 
              className="service-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="service-icon">
                <FaFileContract />
              </div>
              <h3>Government Tenders</h3>
              <p>
                Specialized in bidding and executing government construction projects 
                with complete documentation and compliance support.
              </p>
              <ul className="service-features">
                <li><FaCheckCircle /> Tender Documentation</li>
                <li><FaCheckCircle /> Project Execution</li>
                <li><FaCheckCircle /> Compliance Management</li>
              </ul>
              <Link to="/services" className="service-link">Learn More →</Link>
            </motion.div>

            <motion.div 
              className="service-card featured"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="featured-badge">Most Popular</div>
              <div className="service-icon">
                <FaIndustry />
              </div>
              <h3>AAC Blocks Manpower</h3>
              <p>
                Expert workforce solutions for AAC blocks manufacturing plants 
                with trained personnel and operational excellence.
              </p>
              <ul className="service-features">
                <li><FaCheckCircle /> Skilled Operators</li>
                <li><FaCheckCircle /> Plant Maintenance</li>
                <li><FaCheckCircle /> Quality Control</li>
              </ul>
              <Link to="/services" className="service-link">Learn More →</Link>
            </motion.div>

            <motion.div 
              className="service-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="service-icon">
                <FaHardHat />
              </div>
              <h3>Construction Management</h3>
              <p>
                End-to-end construction project management from planning to 
                execution with dedicated project managers.
              </p>
              <ul className="service-features">
                <li><FaCheckCircle /> Project Planning</li>
                <li><FaCheckCircle /> Resource Management</li>
                <li><FaCheckCircle /> Quality Assurance</li>
              </ul>
              <Link to="/services" className="service-link">Learn More →</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section why-choose-us">
        <div className="container">
          <div className="why-choose-content">
            <motion.div 
              className="why-choose-text"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2>Why Choose BuildPro?</h2>
              <p className="lead">
                With over 15 years of industry experience, we deliver unmatched 
                expertise in construction and manpower services.
              </p>
              <div className="features-list">
                <div className="feature-item">
                  <FaCheckCircle className="feature-icon" />
                  <div>
                    <h4>Proven Track Record</h4>
                    <p>Successfully completed 500+ government projects</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaCheckCircle className="feature-icon" />
                  <div>
                    <h4>Expert Workforce</h4>
                    <p>2000+ trained and certified professionals</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaCheckCircle className="feature-icon" />
                  <div>
                    <h4>Quality Assurance</h4>
                    <p>ISO certified processes and standards</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaCheckCircle className="feature-icon" />
                  <div>
                    <h4>Timely Delivery</h4>
                    <p>98% on-time project completion rate</p>
                  </div>
                </div>
              </div>
              <Link to="/about" className="btn btn-primary">
                Learn More About Us
              </Link>
            </motion.div>
            <motion.div 
              className="why-choose-image"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="image-placeholder">
                <FaChartLine className="placeholder-icon" />
                <p>Excellence in Every Project</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Start Your Next Project?</h2>
            <p>Get in touch with our experts for a free consultation and quote</p>
            <Link to="/contact" className="btn btn-primary btn-lg">
              Contact Us Today
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Home;
