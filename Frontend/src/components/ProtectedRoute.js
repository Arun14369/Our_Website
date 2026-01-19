import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, role }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '24px',
                color: '#667eea'
            }}>
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (role && user.role !== role) {
        // Redirect to appropriate dashboard if wrong role
        if (user.role === 'super_admin') {
            return <Navigate to="/dashboard" />;
        } else if (user.role === 'supervisor') {
            return <Navigate to="/supervisor-dashboard" />;
        }
    }

    return children;
}

export default ProtectedRoute;
