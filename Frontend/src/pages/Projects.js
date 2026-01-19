import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import './Projects.css';

const Projects = () => {
  const projects = [
    {
      title: 'National Highway Construction - Phase 2',
      category: 'Government Tender',
      location: 'New Delhi',
      year: '2025',
      description: 'Successfully completed 50km highway construction project under government tender',
      value: '₹45 Crores',
      status: 'Completed'
    },
    {
      title: 'AAC Blocks Plant - Maharashtra',
      category: 'Manpower Services',
      location: 'Pune, Maharashtra',
      year: '2024-2025',
      description: 'Providing skilled workforce for 24/7 AAC blocks manufacturing operations',
      value: 'Ongoing Contract',
      status: 'Active'
    },
    {
      title: 'Smart City Infrastructure',
      category: 'Government Tender',
      location: 'Indore, MP',
      year: '2024',
      description: 'Urban infrastructure development including roads, drainage, and utilities',
      value: '₹32 Crores',
      status: 'Completed'
    },
    {
      title: 'Industrial Complex Construction',
      category: 'Private Sector',
      location: 'Gujarat',
      year: '2024',
      description: 'Complete construction of 100,000 sq ft industrial facility',
      value: '₹28 Crores',
      status: 'Completed'
    },
    {
      title: 'AAC Plant Operations - North India',
      category: 'Manpower Services',
      location: 'Haryana',
      year: '2023-2025',
      description: 'Long-term manpower contract for AAC blocks manufacturing plant',
      value: 'Multi-year Contract',
      status: 'Active'
    },
    {
      title: 'Government School Building',
      category: 'Government Tender',
      location: 'Rajasthan',
      year: '2023',
      description: 'Construction of modern school building with all facilities',
      value: '₹18 Crores',
      status: 'Completed'
    }
  ];

  return (
    <main>
      <section className="page-header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Our Projects</h1>
            <p>Showcasing our excellence in construction and manpower services</p>
          </motion.div>
        </div>
      </section>

      <section className="section projects-section">
        <div className="container">
          <div className="section-title">
            <h2>Featured Projects</h2>
            <p>A portfolio of successfully completed and ongoing projects</p>
          </div>

          <div className="projects-grid">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                className="project-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="project-header">
                  <span className={`project-status ${project.status.toLowerCase()}`}>
                    {project.status}
                  </span>
                  <span className="project-year">{project.year}</span>
                </div>
                <h3>{project.title}</h3>
                <div className="project-meta">
                  <span className="project-category">{project.category}</span>
                  <span className="project-location">📍 {project.location}</span>
                </div>
                <p>{project.description}</p>
                <div className="project-footer">
                  <div className="project-value">
                    <strong>Project Value:</strong> {project.value}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section project-stats">
        <div className="container">
          <div className="stats-wrapper">
            <motion.div
              className="stat-item"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3>500+</h3>
              <p>Projects Completed</p>
            </motion.div>
            <motion.div
              className="stat-item"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3>₹200+ Cr</h3>
              <p>Total Project Value</p>
            </motion.div>
            <motion.div
              className="stat-item"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3>98%</h3>
              <p>On-time Delivery</p>
            </motion.div>
            <motion.div
              className="stat-item"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3>50+</h3>
              <p>Active Contracts</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section client-benefits">
        <div className="container">
          <div className="section-title">
            <h2>Why Clients Choose Us</h2>
            <p>Delivering exceptional results through proven methodologies</p>
          </div>
          <div className="benefits-grid">
            <motion.div
              className="benefit-item"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <FaCheckCircle className="check-icon" />
              <div>
                <h4>Timely Completion</h4>
                <p>98% of our projects are completed on or before schedule</p>
              </div>
            </motion.div>
            <motion.div
              className="benefit-item"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <FaCheckCircle className="check-icon" />
              <div>
                <h4>Budget Adherence</h4>
                <p>Strong cost management ensuring projects stay within budget</p>
              </div>
            </motion.div>
            <motion.div
              className="benefit-item"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FaCheckCircle className="check-icon" />
              <div>
                <h4>Quality Standards</h4>
                <p>ISO certified processes ensuring highest quality outcomes</p>
              </div>
            </motion.div>
            <motion.div
              className="benefit-item"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <FaCheckCircle className="check-icon" />
              <div>
                <h4>Safety First</h4>
                <p>Zero-accident policy with comprehensive safety protocols</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Projects;
