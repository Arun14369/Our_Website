import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const savedUser = sessionStorage.getItem('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            const { user, access_token } = response.data;

            sessionStorage.setItem('token', access_token);
            sessionStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            return user;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            setUser(null);
        }
    };

    const isSuperAdmin = () => user?.role === 'super_admin';
    const isSupervisor = () => user?.role === 'supervisor';

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            loading,
            isSuperAdmin,
            isSupervisor
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
