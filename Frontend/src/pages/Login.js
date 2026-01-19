import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password);

            // Redirect based on role
            if (user.role === 'super_admin') {
                navigate('/dashboard');
            } else if (user.role === 'supervisor') {
                navigate('/supervisor-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <button className="back-to-home" onClick={() => navigate('/')}>
                ← Back to Home
            </button>

            <div className="login-wrapper">
                <div className="login-left">
                    <div className="login-branding">
                        <div className="brand-icon">📊</div>
                        <h1>Business Management System</h1>
                        <p>Manage your companies, supervisors, workers, and reports all in one place.</p>
                        <div className="features-list">
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span>Multi-company Management</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span>Role-based Access Control</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span>Real-time Reporting</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span>Worker Team Management</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="login-right">
                    <div className="login-card">
                        <h2>Welcome Back!</h2>
                        <p className="login-subtitle">Please login to your account</p>

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            <button type="submit" className="login-btn" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        <div className="test-credentials">
                            <p><strong>Test Credentials:</strong></p>
                            <p>Super Admin: admin@admin.com / admin123</p>
                            <p>Supervisor: buildpro.north@company.com / password</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
