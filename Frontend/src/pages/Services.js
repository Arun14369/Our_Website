import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaFileContract, 
  FaIndustry, 
  FaHardHat,
  FaCogs,
  FaClipboardCheck,
  FaUsers,
  FaShieldAlt,
  FaTrophy
} from 'react-icons/fa';
import './Services.css';

const Services = () => {
  const services = [
    {
      icon: <FaFileContract />,
      title: 'Government Tenders',
      description: 'Complete tender management from documentation to execution',
      features: [
        'Tender identification and analysis',
        'Bid preparation and submission',
        'Documentation and compliance',
        'Project execution and delivery',
        'Post-tender support'
      ]
    },
    {
      icon: <FaIndustry />,
      title: 'AAC Blocks Manpower',
      description: 'Specialized workforce for AAC manufacturing plants',
      features: [
        'Plant operators and supervisors',
        'Quality control personnel',
        'Maintenance technicians',
        'Production line workers',
        'Safety and compliance staff'
      ]
    },
    {
      icon: <FaHardHat />,
      title: 'Construction Management',
      description: 'End-to-end construction project management services',
      features: [
        'Project planning and scheduling',
        'Resource allocation',
        'Site supervision',
        'Budget management',
        'Progress monitoring'
      ]
    },
    {
      icon: <FaCogs />,
      title: 'Plant Operations',
      description: 'Complete operational support for manufacturing facilities',
      features: [
        'Equipment operation',
        'Process optimization',
        'Preventive maintenance',
        'Production planning',
        'Efficiency improvement'
      ]
    },
    {
      icon: <FaClipboardCheck />,
      title: 'Quality Assurance',
      description: 'Comprehensive quality control and testing services',
      features: [
        'Material testing',
        'Process audits',
        'ISO compliance',
        'Quality documentation',
        'Continuous improvement'
      ]
    },
    {
      icon: <FaUsers />,
      title: 'Workforce Training',
      description: 'Professional training programs for construction workforce',
      features: [
        'Safety training',
        'Technical skill development',
        'Equipment operation training',
        'Quality standards education',
        'Certification programs'
      ]
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
            <h1>Our Services</h1>
            <p>Comprehensive construction and manpower solutions for your business</p>
          </motion.div>
        </div>
      </section>

      <section className="section services-detail">
        <div className="container">
          <div className="services-detail-grid">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="service-detail-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="service-detail-icon">
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <ul className="service-detail-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>
                      <span className="check-icon">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section service-benefits">
        <div className="container">
          <div className="section-title">
            <h2>Why Choose Our Services</h2>
            <p>Delivering excellence through expertise and dedication</p>
          </div>
          <div className="benefits-grid">
            <motion.div
              className="benefit-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <FaShieldAlt className="benefit-icon" />
              <h3>Certified & Compliant</h3>
              <p>All our processes are ISO certified and comply with government regulations</p>
            </motion.div>
            <motion.div
              className="benefit-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <FaTrophy className="benefit-icon" />
              <h3>Industry Experts</h3>
              <p>15+ years of experience with proven track record in construction sector</p>
            </motion.div>
            <motion.div
              className="benefit-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FaUsers className="benefit-icon" />
              <h3>Skilled Workforce</h3>
              <p>2000+ trained professionals ready to deliver quality results</p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
