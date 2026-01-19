import React from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaBullseye, FaHandshake, FaCertificate } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <main>
      <section className="page-header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>About BuildPro</h1>
            <p>Building trust through excellence in construction and manpower services</p>
          </motion.div>
        </div>
      </section>

      <section className="section about-intro">
        <div className="container">
          <div className="about-content">
            <motion.div
              className="about-text"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2>Who We Are</h2>
              <p>
                BuildPro is a leading construction and manpower services company with over 15 years 
                of experience in the industry. We specialize in government tender projects and 
                providing skilled workforce for AAC Blocks manufacturing plants across India.
              </p>
              <p>
                Our commitment to quality, safety, and timely delivery has made us a trusted partner 
                for numerous government projects and private enterprises. With a team of 2000+ 
                skilled professionals, we deliver excellence in every project we undertake.
              </p>
              <p>
                We pride ourselves on maintaining the highest standards of compliance, safety, and 
                quality assurance. Our ISO-certified processes ensure that every project meets and 
                exceeds client expectations.
              </p>
            </motion.div>
            <motion.div
              className="about-stats"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="stat-box">
                <h3>15+</h3>
                <p>Years Experience</p>
              </div>
              <div className="stat-box">
                <h3>500+</h3>
                <p>Projects Completed</p>
              </div>
              <div className="stat-box">
                <h3>2000+</h3>
                <p>Skilled Workers</p>
              </div>
              <div className="stat-box">
                <h3>98%</h3>
                <p>Client Satisfaction</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section vision-mission">
        <div className="container">
          <div className="vm-grid">
            <motion.div
              className="vm-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <FaEye className="vm-icon" />
              <h3>Our Vision</h3>
              <p>
                To be India's most trusted and innovative construction and manpower services 
                provider, setting new benchmarks in quality, safety, and client satisfaction.
              </p>
            </motion.div>
            <motion.div
              className="vm-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <FaBullseye className="vm-icon" />
              <h3>Our Mission</h3>
              <p>
                To deliver exceptional construction and manpower solutions through skilled 
                professionals, innovative practices, and unwavering commitment to excellence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section core-values">
        <div className="container">
          <div className="section-title">
            <h2>Our Core Values</h2>
            <p>The principles that guide everything we do</p>
          </div>
          <div className="values-grid">
            <motion.div
              className="value-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="value-number">01</div>
              <h4>Quality First</h4>
              <p>We never compromise on quality and maintain highest standards in all our projects</p>
            </motion.div>
            <motion.div
              className="value-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="value-number">02</div>
              <h4>Integrity</h4>
              <p>Honesty and transparency in all our business dealings and relationships</p>
            </motion.div>
            <motion.div
              className="value-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="value-number">03</div>
              <h4>Safety</h4>
              <p>Ensuring the safety of our workers and maintaining accident-free workplaces</p>
            </motion.div>
            <motion.div
              className="value-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="value-number">04</div>
              <h4>Innovation</h4>
              <p>Embracing new technologies and methods to improve efficiency and outcomes</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section certifications">
        <div className="container">
          <div className="cert-content">
            <motion.div
              className="cert-text"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <FaCertificate className="cert-icon" />
              <h2>Certifications & Compliance</h2>
              <p>
                We are proud to be ISO certified and maintain strict compliance with all 
                government regulations and safety standards. Our certifications include:
              </p>
              <ul className="cert-list">
                <li>ISO 9001:2015 - Quality Management</li>
                <li>ISO 14001:2015 - Environmental Management</li>
                <li>ISO 45001:2018 - Occupational Health & Safety</li>
                <li>Government Tender Registration</li>
                <li>MSME Certified</li>
                <li>All Safety Compliance Certifications</li>
              </ul>
            </motion.div>
            <motion.div
              className="cert-badge"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <FaHandshake className="badge-icon" />
              <p>Trusted by 100+ Government & Private Organizations</p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
