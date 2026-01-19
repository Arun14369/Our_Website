import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes with Navbar and Footer */}
            <Route path="/" element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            } />
            <Route path="/about" element={
              <>
                <Navbar />
                <About />
                <Footer />
              </>
            } />
            <Route path="/services" element={
              <>
                <Navbar />
                <Services />
                <Footer />
              </>
            } />
            <Route path="/projects" element={
              <>
                <Navbar />
                <Projects />
                <Footer />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Navbar />
                <Contact />
                <Footer />
              </>
            } />
            
            {/* Login route without Navbar/Footer */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes without Navbar/Footer */}
            <Route path="/dashboard" element={
              <ProtectedRoute role="super_admin">
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/supervisor-dashboard" element={
              <ProtectedRoute role="supervisor">
                <SupervisorDashboard />
              </ProtectedRoute>
            } />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
