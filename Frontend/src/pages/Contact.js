import React, { useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from 'emailjs-com';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaPaperPlane
} from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');

    setTimeout(() => {
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setTimeout(() => setStatus(''), 5000);
    }, 1500);
  };

  const contactItems = [
    {
      icon: <FaMapMarkerAlt />,
      title: "Our Address",
      details: ["123 Construction Avenue", "New Delhi, India - 110001"],
      delay: 0.1
    },
    {
      icon: <FaPhone />,
      title: "Phone Number",
      details: ["+91 98765 43210", "+91 98765 43211"],
      delay: 0.2
    },
    {
      icon: <FaEnvelope />,
      title: "Email Address",
      details: ["info@buildpro.com", "support@buildpro.com"],
      delay: 0.3
    },
    {
      icon: <FaClock />,
      title: "Working Hours",
      details: ["Monday - Saturday", "9:00 AM - 6:00 PM"],
      delay: 0.4
    }
  ];

  return (
    <main className="contact-page">
      <section className="page-header contact-header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="header-content"
          >
            <span className="subtitle">Get In Touch</span>
            <h1>Let's Build Something Great Together</h1>
            <p>Whether you need assistance with government tenders or manpower services, we're here to help.</p>
          </motion.div>
        </div>
      </section>

      <section className="contact-cards-section">
        <div className="container">
          <div className="contact-cards-grid">
            {contactItems.map((item, index) => (
              <motion.div
                key={index}
                className="info-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: item.delay }}
                viewport={{ once: true }}
              >
                <div className="card-icon">
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
                {item.details.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section contact-main-section">
        <div className="container">
          <div className="contact-content-wrapper">
            <motion.div
              className="contact-form-card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="form-header">
                <h2>Send Us a Message</h2>
                <p>Fill out the form below and we'll get back to you within 24 hours.</p>
              </div>

              <form className="modern-contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group floating-label">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group floating-label">
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email *"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group floating-label">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number *"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group floating-label">
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject *"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group floating-label">
                  <textarea
                    name="message"
                    rows="6"
                    placeholder="Your Message *"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn btn-primary btn-modern-submit"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? (
                    'Sending...'
                  ) : (
                    <>
                      <FaPaperPlane /> Send Message
                    </>
                  )}
                </motion.button>

                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="form-message success"
                  >
                    ✓ Thank you! Your message has been sent successfully.
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="form-message error"
                  >
                    ✕ Oops! Something went wrong. Please try again.
                  </motion.div>
                )}
              </form>
            </motion.div>

            <motion.div
              className="contact-map-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0266994314854!2d77.2090212!3d28.6139391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Office Location"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="faq-section section">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">Common Questions</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-grid">
            {[
              {
                q: "What services do you provide?",
                a: "We specialize in government tender consultancy, AAC blocks plant manpower services, and comprehensive construction project management."
              },
              {
                q: "How can I get a project quote?",
                a: "You can fill out the contact form above or reach out to us via phone or email for a detailed discussion and a free consultation."
              },
              {
                q: "Where do you operate?",
                a: "While our main office is in New Delhi, we provide services and consultancy for projects across India."
              },
              {
                q: "What are your business hours?",
                a: "Our office is open Monday through Saturday, from 9:00 AM to 6:00 PM."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="faq-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h4>{faq.q}</h4>
                <p>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
