import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Modal from '../components/Modal';
import Sidebar from '../components/Sidebar';
import { Toaster, toast } from 'react-hot-toast';
import { FaBuilding, FaUserTie, FaUsers, FaChartLine, FaTrash, FaEdit, FaPlus, FaCalendarAlt, FaFilter, FaArrowLeft, FaCheck, FaFileExport, FaHistory } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import './Dashboard.css';

function Dashboard() {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        total_companies: 0,
        total_supervisors: 0,
        total_workers: 0,
        today_attendance: 0,
        attendance_trend: []
    });
    const [companies, setCompanies] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [attendanceLoading, setAttendanceLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Filtering states
    const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('all');
    const [attendanceCompanyFilter, setAttendanceCompanyFilter] = useState('all');
    const [attendanceDateFilter, setAttendanceDateFilter] = useState(new Date().toISOString().split('T')[0]);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(''); // 'company', 'supervisor', 'worker', 'attendance'
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});
    const [workerHistory, setWorkerHistory] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (activeTab === 'attendance' && attendanceCompanyFilter !== 'all') {
            fetchAttendance();
        }
    }, [activeTab, attendanceDateFilter, attendanceCompanyFilter]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [statsRes, companiesRes, supervisorsRes, workersRes, teamsRes] = await Promise.all([
                api.get('/super-admin/stats'),
                api.get('/super-admin/companies'),
                api.get('/super-admin/supervisors'),
                api.get('/super-admin/workers'),
                api.get('/super-admin/teams')
            ]);
            setStats(statsRes.data);
            setCompanies(companiesRes.data);
            setSupervisors(supervisorsRes.data);
            setWorkers(workersRes.data);
            setTeams(teamsRes.data);
        } catch (error) {
            console.error('Data fetch error:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendance = async () => {
        try {
            setAttendanceLoading(true);
            const params = {
                date: attendanceDateFilter,
                company_id: attendanceCompanyFilter
            };
            const res = await api.get('/super-admin/attendance', { params });
            setAttendanceRecords(res.data);
        } catch (error) {
            toast.error('Failed to load attendance records');
        } finally {
            setAttendanceLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    // Navigation Helper
    const viewCompanyAttendance = (companyId) => {
        setAttendanceCompanyFilter(companyId);
        setActiveTab('attendance');
    };

    // Company Handlers
    const openAddCompany = () => {
        setModalType('company');
        setIsEditMode(false);
        setFormData({ name: '', location: '', phone: '' });
        setIsModalOpen(true);
    };

    const openEditCompany = (company) => {
        setModalType('company');
        setIsEditMode(true);
        setEditingId(company.id);
        setFormData({ name: company.name, location: company.location || '', phone: company.phone || '' });
        setIsModalOpen(true);
    };

    const handleCompanySubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await api.put(`/super-admin/companies/${editingId}`, formData);
                toast.success('Company updated successfully');
            } else {
                await api.post('/super-admin/companies', formData);
                toast.success('Company created successfully');
            }
            setIsModalOpen(false);
            fetchInitialData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error processing request');
        }
    };

    const handleDeleteCompany = async (id) => {
        if (!window.confirm('Delete this company? This will remove all associated data.')) return;
        try {
            await api.delete(`/super-admin/companies/${id}`);
            toast.success('Company deleted');
            fetchInitialData();
        } catch (error) {
            toast.error('Failed to delete company');
        }
    };

    // Supervisor Handlers
    const openAddSupervisor = () => {
        setModalType('supervisor');
        setIsEditMode(false);
        setFormData({ name: '', email: '', password: '', company_id: '' });
        setIsModalOpen(true);
    };

    const openEditSupervisor = (sv) => {
        setModalType('supervisor');
        setIsEditMode(true);
        setEditingId(sv.id);
        setFormData({ name: sv.name, email: sv.email, password: '', company_id: sv.company_id });
        setIsModalOpen(true);
    };

    const handleSupervisorSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await api.put(`/super-admin/supervisors/${editingId}`, formData);
                toast.success('Supervisor updated successfully');
            } else {
                await api.post('/super-admin/supervisors', formData);
                toast.success('Supervisor created successfully');
            }
            setIsModalOpen(false);
            fetchInitialData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error processing request');
        }
    };

    const handleDeleteSupervisor = async (id) => {
        if (!window.confirm('Delete this supervisor access?')) return;
        try {
            await api.delete(`/super-admin/supervisors/${id}`);
            toast.success('Supervisor removed');
            fetchInitialData();
        } catch (error) {
            toast.error('Failed to delete supervisor');
        }
    };

    // Worker Handlers
    const openEditWorker = (worker) => {
        setModalType('worker');
        setIsEditMode(true);
        setEditingId(worker.id);
        setFormData({ name: worker.name, phone: worker.phone || '', company_id: worker.company_id, team_id: worker.team_id });
        setIsModalOpen(true);
    };

    const handleWorkerSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/super-admin/workers/${editingId}`, formData);
            toast.success('Worker updated successfully');
            setIsModalOpen(false);
            fetchInitialData();
        } catch (error) {
            toast.error('Error updating worker');
        }
    };

    const handleDeleteWorker = async (id) => {
        if (!window.confirm('Delete this worker?')) return;
        try {
            await api.delete(`/super-admin/workers/${id}`);
            toast.success('Worker removed');
            fetchInitialData();
        } catch (error) {
            toast.error('Failed to delete worker');
        }
    };

    const fetchWorkerHistory = async (workerId) => {
        try {
            setModalType('worker_history');
            setIsModalOpen(true);
            const res = await api.get(`/super-admin/workers/${workerId}/history`);
            setWorkerHistory(res.data);
        } catch (error) {
            toast.error('Failed to load worker history');
        }
    };

    const [exportDates, setExportDates] = useState({ start: '', end: '' });

    const openExportModal = () => {
        setExportDates({
            start: attendanceDateFilter,
            end: attendanceDateFilter
        });
        setModalType('export_options');
        setIsModalOpen(true);
    };

    const handleExportConfirm = async (e) => {
        e.preventDefault();
        try {
            toast.loading('Preparing export...', { id: 'export-toast' });
            const params = {
                company_id: attendanceCompanyFilter,
                start_date: exportDates.start,
                end_date: exportDates.end
            };
            const response = await api.get('/super-admin/attendance/export', {
                params,
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Attendance_Report_${exportDates.start}_to_${exportDates.end}.csv`);
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('Report downloaded', { id: 'export-toast' });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Export failed. Please try again.', { id: 'export-toast' });
        }
    };

    // Attendance Handlers
    const openEditAttendance = (record) => {
        setModalType('attendance');
        setIsEditMode(true);
        setEditingId(record.id);
        setFormData({ status: record.status, notes: record.notes || '', worker_name: record.worker.name });
        setIsModalOpen(true);
    };

    const handleAttendanceSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/super-admin/attendance/${editingId}`, {
                status: formData.status,
                notes: formData.notes
            });
            toast.success('Attendance record updated');
            setIsModalOpen(false);
            fetchAttendance();
            fetchInitialData(); // Refresh stats
        } catch (error) {
            toast.error('Failed to update attendance');
        }
    };

    const handleDeleteAttendance = async (id) => {
        if (!window.confirm('Delete this attendance record?')) return;
        try {
            await api.delete(`/super-admin/attendance/${id}`);
            toast.success('Record deleted');
            fetchAttendance();
            fetchInitialData();
        } catch (error) {
            toast.error('Failed to delete record');
        }
    };

    if (loading) return <div className="loading-screen">Loading buildPro...</div>;

    return (
        <div className="dashboard-layout">
            <Toaster position="top-right" />
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

            <div className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-left">
                        <h1>buildPro Command Center</h1>
                        <p>Enterprise Management Dashboard</p>
                    </div>
                    <div className="header-right">
                        <div className="date-display">
                            <FaCalendarAlt />
                            <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                </header>

                <div className="dashboard-content">
                    {activeTab === 'overview' && (
                        <div className="overview-container">
                            <div className="welcome-banner">
                                <div className="welcome-text">
                                    <h2>Welcome back, {user?.name}! ✨</h2>
                                    <p>Everything looks great. You have {stats.total_companies} companies and {stats.total_supervisors} supervisors under your management.</p>
                                </div>
                                <div className="welcome-action">
                                    <button onClick={openAddCompany}>
                                        <FaPlus /> Launch New Company
                                    </button>
                                </div>
                            </div>

                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon companies"><FaBuilding /></div>
                                    <div className="stat-info">
                                        <h3>{stats.total_companies}</h3>
                                        <p>Companies</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon supervisors"><FaUserTie /></div>
                                    <div className="stat-info">
                                        <h3>{stats.total_supervisors}</h3>
                                        <p>Supervisors</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon workers"><FaUsers /></div>
                                    <div className="stat-info">
                                        <h3>{stats.total_workers}</h3>
                                        <p>Total Workers</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon attendance"><FaChartLine /></div>
                                    <div className="stat-info">
                                        <h3>{stats.today_attendance}</h3>
                                        <p>Present Today</p>
                                    </div>
                                </div>
                            </div>

                            <div className="analytics-section">
                                <div className="section-card chart-card">
                                    <div className="card-header">
                                        <h3>Attendance Trend (Last 7 Days)</h3>
                                        <p>Total present count across all companies</p>
                                    </div>
                                    <div className="chart-container" style={{ height: '300px', width: '100%' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={stats.attendance_trend}>
                                                <defs>
                                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis
                                                    dataKey="date"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                                    tickFormatter={(str) => new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                                />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                    labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
                                                />
                                                <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            <div className="recent-activity-placeholder">
                                <div className="activity-header">
                                    <h3>Quick Resource Links</h3>
                                </div>
                                <div className="quick-links-grid">
                                    <div className="link-item" onClick={() => setActiveTab('companies')}>
                                        <h4>View Company Directory</h4>
                                        <p>Manage office locations and details</p>
                                    </div>
                                    <div className="link-item" onClick={() => setActiveTab('supervisors')}>
                                        <h4>Supervisor Management</h4>
                                        <p>Register or reassign supervisors</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'companies' && (
                        <div className="section-container">
                            <div className="section-header">
                                <h2>Company Directory</h2>
                                <button className="add-btn" onClick={openAddCompany}>
                                    <FaPlus /> Add Company
                                </button>
                            </div>
                            <div className="data-table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Company Name</th>
                                            <th>Location</th>
                                            <th>Supervisors</th>
                                            <th>Total Workers</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {companies.map(company => (
                                            <tr key={company.id}>
                                                <td><strong>{company.name}</strong></td>
                                                <td>{company.location || 'N/A'}</td>
                                                <td>{company.users_count || 0}</td>
                                                <td>{company.workers_count || 0}</td>
                                                <td><span className="status-badge active">Active</span></td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="icon-btn" title="View Attendance" onClick={() => viewCompanyAttendance(company.id.toString())}><FaChartLine /></button>
                                                        <button className="icon-btn edit" onClick={() => openEditCompany(company)}><FaEdit /></button>
                                                        <button className="icon-btn delete" onClick={() => handleDeleteCompany(company.id)}><FaTrash /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'supervisors' && (
                        <div className="section-container">
                            <div className="section-header">
                                <h2>Registered Supervisors</h2>
                                <button className="add-btn" onClick={openAddSupervisor}>
                                    <FaPlus /> Register Supervisor
                                </button>
                            </div>
                            <div className="data-table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Supervisor Name</th>
                                            <th>Email Address</th>
                                            <th>Assigned Company</th>
                                            <th>Join Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {supervisors.map(sv => (
                                            <tr key={sv.id}>
                                                <td><strong>{sv.name}</strong></td>
                                                <td>{sv.email}</td>
                                                <td><span className="badge">{sv.company?.name || 'Unassigned'}</span></td>
                                                <td>{new Date(sv.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="icon-btn edit" onClick={() => openEditSupervisor(sv)}><FaEdit /></button>
                                                        <button className="icon-btn delete" onClick={() => handleDeleteSupervisor(sv.id)}><FaTrash /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'workers' && (
                        <div className="section-container">
                            <div className="section-header">
                                <h2>Workforce Registry</h2>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div className="filter-group">
                                        <FaFilter style={{ color: '#64748b' }} />
                                        <select
                                            value={selectedCompanyFilter}
                                            onChange={(e) => setSelectedCompanyFilter(e.target.value)}
                                            style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, color: '#1e293b' }}
                                        >
                                            <option value="all">All Companies</option>
                                            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="data-table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Worker Name</th>
                                            <th>Phone</th>
                                            <th>Company</th>
                                            <th>Team</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {workers
                                            .filter(w => selectedCompanyFilter === 'all' || w.company_id === parseInt(selectedCompanyFilter))
                                            .map(worker => (
                                                <tr key={worker.id}>
                                                    <td><strong>{worker.name}</strong></td>
                                                    <td>{worker.phone || 'N/A'}</td>
                                                    <td>{worker.company?.name}</td>
                                                    <td><span className="badge">{worker.team?.name || 'No Team'}</span></td>
                                                    <td>
                                                        <div className="table-actions">
                                                            <button className="icon-btn" title="View History" onClick={() => fetchWorkerHistory(worker.id)}><FaHistory /></button>
                                                            <button className="icon-btn edit" onClick={() => openEditWorker(worker)}><FaEdit /></button>
                                                            <button className="icon-btn delete" onClick={() => handleDeleteWorker(worker.id)}><FaTrash /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'attendance' && (
                        <div className="section-container">
                            <div className="section-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {attendanceCompanyFilter !== 'all' && (
                                        <button className="back-btn" onClick={() => setAttendanceCompanyFilter('all')} style={{ border: 'none', background: '#f1f5f9', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                                            <FaArrowLeft />
                                        </button>
                                    )}
                                    <h2>{attendanceCompanyFilter === 'all' ? 'Select Company' : `${companies.find(c => c.id.toString() === attendanceCompanyFilter)?.name} Attendance`}</h2>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div className="filter-group">
                                        <FaCalendarAlt style={{ color: '#64748b' }} />
                                        <input
                                            type="date"
                                            value={attendanceDateFilter}
                                            onChange={(e) => setAttendanceDateFilter(e.target.value)}
                                            style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: 600 }}
                                        />
                                    </div>
                                    <button className="add-btn" style={{ background: '#10b981' }} onClick={openExportModal}>
                                        <FaFileExport /> Export CSV
                                    </button>
                                </div>
                            </div>

                            {attendanceCompanyFilter === 'all' ? (
                                <div className="company-selection-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                                    {companies.map(company => (
                                        <div
                                            key={company.id}
                                            className="company-select-card"
                                            onClick={() => setAttendanceCompanyFilter(company.id.toString())}
                                            style={{
                                                background: 'white',
                                                padding: '1.5rem',
                                                borderRadius: '12px',
                                                border: '1px solid #e2e8f0',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                                <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '8px', color: '#3b82f6' }}><FaBuilding /></div>
                                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{company.name}</h3>
                                            </div>
                                            <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                                <p style={{ margin: '4px 0' }}>📍 {company.location || 'Universal'}</p>
                                                <p style={{ margin: '4px 0' }}>👷 {company.workers_count || 0} Total Workers</p>
                                            </div>
                                            <div style={{ marginTop: '1rem', color: '#3b82f6', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                View Attendance Records →
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="data-table-wrapper">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Worker Details</th>
                                                <th>Team</th>
                                                <th>Supervisor</th>
                                                <th>Status</th>
                                                <th>Notes</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attendanceLoading ? (
                                                <tr>
                                                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                                        Loading attendance data...
                                                    </td>
                                                </tr>
                                            ) : attendanceRecords.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                                        No personnel found for this company.
                                                    </td>
                                                </tr>
                                            ) : (
                                                attendanceRecords.map(record => (
                                                    <tr key={record.id}>
                                                        <td><strong>{record.worker.name}</strong></td>
                                                        <td><span className="badge">{record.worker.team?.name || 'N/A'}</span></td>
                                                        <td>{record.supervisor?.name || 'Unknown'}</td>
                                                        <td>
                                                            <span className={`status-badge ${record.status}`}>
                                                                {record.status === 'present' ? 'Present' : record.status === 'absent' ? 'Absent' : record.status === 'half_day' ? 'Half Day' : 'Not Marked'}
                                                            </span>
                                                        </td>
                                                        <td style={{ fontSize: '0.85rem', maxWidth: '200px' }}>{record.notes || '-'}</td>
                                                        <td>
                                                            <div className="table-actions">
                                                                <button className="icon-btn edit" onClick={() => openEditAttendance(record)}><FaEdit /></button>
                                                                <button className="icon-btn delete" onClick={() => handleDeleteAttendance(record.id)}><FaTrash /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={
                modalType === 'company' ? (isEditMode ? 'Edit Company' : 'Add New Company') :
                    modalType === 'supervisor' ? (isEditMode ? 'Edit Supervisor' : 'Register Supervisor') :
                        modalType === 'worker' ? 'Edit Worker Details' :
                            modalType === 'export_options' ? 'Export Attendance Report' :
                                'Modify Attendance Record'
            }>
                {modalType === 'company' && (
                    <form onSubmit={handleCompanySubmit} className="modal-form">
                        <div className="form-group">
                            <label>Company Name</label>
                            <input type="text" value={formData.name || ''} placeholder="e.g. BuildPro North" required onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input type="text" value={formData.location || ''} placeholder="e.g. Delhi, Sector 62" onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Contact Phone</label>
                            <input type="text" value={formData.phone || ''} placeholder="Phone number" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                        <button type="submit" className="submit-btn">{isEditMode ? 'Update Company Details' : 'Create Company Instance'}</button>
                    </form>
                )}

                {modalType === 'supervisor' && (
                    <form onSubmit={handleSupervisorSubmit} className="modal-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" value={formData.name || ''} placeholder="Name of supervisor" required onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" value={formData.email || ''} placeholder="email@company.com" required onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Access Password {isEditMode && '(Leave blank to keep current)'}</label>
                            <input type="password" required={!isEditMode} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Assign Company</label>
                            <select required value={formData.company_id || ''} onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}>
                                <option value="">Select Company</option>
                                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <button type="submit" className="submit-btn">{isEditMode ? 'Update Access Details' : 'Register & Grant Access'}</button>
                    </form>
                )}

                {modalType === 'worker' && (
                    <form onSubmit={handleWorkerSubmit} className="modal-form">
                        <div className="form-group">
                            <label>Worker Full Name</label>
                            <input type="text" value={formData.name || ''} required onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="text" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Assigned Company</label>
                            <select required value={formData.company_id || ''} onChange={(e) => setFormData({ ...formData, company_id: e.target.value, team_id: '' })}>
                                <option value="">Select Company</option>
                                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Team Assignment</label>
                            <select required value={formData.team_id || ''} onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}>
                                <option value="">Select Team</option>
                                {teams
                                    .filter(t => t.company_id === parseInt(formData.company_id))
                                    .map(t => <option key={t.id} value={t.id}>{t.name}</option>)
                                }
                            </select>
                        </div>
                        <button type="submit" className="submit-btn">Update Worker Registry</button>
                    </form>
                )}

                {modalType === 'attendance' && (
                    <form onSubmit={handleAttendanceSubmit} className="modal-form">
                        <div className="form-group">
                            <label>Worker</label>
                            <input type="text" value={formData.worker_name || ''} disabled style={{ backgroundColor: '#f8fafc' }} />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select value={formData.status || ''} required onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="half_day">Half Day</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Notes</label>
                            <textarea value={formData.notes || ''} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Add remarks..." />
                        </div>
                        <button type="submit" className="submit-btn">Update Attendance Status</button>
                    </form>
                )}

                {modalType === 'export_options' && (
                    <form onSubmit={handleExportConfirm} className="modal-form">
                        <div className="form-group">
                            <label>Start Date</label>
                            <input
                                type="date"
                                value={exportDates.start}
                                max={exportDates.end}
                                required
                                onChange={(e) => setExportDates({ ...exportDates, start: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>End Date</label>
                            <input
                                type="date"
                                value={exportDates.end}
                                min={exportDates.start}
                                required
                                onChange={(e) => setExportDates({ ...exportDates, end: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                This will generate a comprehensive CSV report for all workers in the selected company ({companies.find(c => c.id.toString() === attendanceCompanyFilter)?.name || 'Unknown'}) for the date range specified.
                            </p>
                        </div>
                        <button type="submit" className="submit-btn">
                            <FaFileExport /> Download Report
                        </button>
                    </form>
                )}

                {modalType === 'worker_history' && (
                    <div className="history-modal-content">
                        {!workerHistory ? <p>Loading history...</p> : (
                            <>
                                <div className="worker-brief" style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                                    <h4 style={{ margin: 0 }}>{workerHistory.worker.name}</h4>
                                    <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#64748b' }}>
                                        {workerHistory.worker.team?.name} | {workerHistory.worker.company?.name}
                                    </p>
                                </div>
                                <div className="history-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {workerHistory.attendance.map(h => (
                                                <tr key={h.id}>
                                                    <td>{new Date(h.date).toLocaleDateString()}</td>
                                                    <td>
                                                        <span className={`status-badge ${h.status}`}>
                                                            {h.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ fontSize: '0.8rem' }}>{h.notes || '-'}</td>
                                                </tr>
                                            ))}
                                            {workerHistory.attendance.length === 0 && (
                                                <tr>
                                                    <td colSpan="3" style={{ textAlign: 'center', padding: '1rem' }}>No history found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default Dashboard;
