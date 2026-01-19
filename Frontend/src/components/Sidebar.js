import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FaBuilding,
    FaUsers,
    FaUserTie,
    FaFileAlt,
    FaChartBar,
    FaSignOutAlt,
    FaCog,
    FaCalendarCheck
} from 'react-icons/fa';
import './Sidebar.css';

function Sidebar({ activeTab, setActiveTab, onLogout }) {
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: <FaChartBar /> },
        { id: 'companies', label: 'Companies', icon: <FaBuilding /> },
        { id: 'supervisors', label: 'Supervisors', icon: <FaUserTie /> },
        { id: 'workers', label: 'Workers', icon: <FaUsers /> },
        { id: 'reports', label: 'Reports', icon: <FaFileAlt /> },
        { id: 'attendance', label: 'Attendance', icon: <FaCalendarCheck /> },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>Super Admin</h2>
                <p>Control Panel</p>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="sidebar-item" onClick={onLogout}>
                    <span className="sidebar-icon"><FaSignOutAlt /></span>
                    <span className="sidebar-label">Logout</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
