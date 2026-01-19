import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Modal from '../components/Modal';
import { Toaster, toast } from 'react-hot-toast';
import { FaUsers, FaClipboardCheck, FaUsersCog, FaSignOutAlt, FaCalendarDay, FaUserCircle, FaArrowRight, FaPlus, FaEdit, FaTrash, FaFileExport, FaHistory } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './SupervisorDashboard.css';

function SupervisorDashboard() {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        total_teams: 0,
        total_workers: 0,
        today_attendance: 0,
        team_stats: []
    });
    const [workers, setWorkers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('attendance');
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState({});
    const [selectedTeam, setSelectedTeam] = useState('all');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // CRUD States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
    const [editingWorker, setEditingWorker] = useState(null);
    const [formData, setFormData] = useState({ name: '', phone: '', team_id: '' });
    const [workerHistory, setWorkerHistory] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (activeTab === 'attendance') {
            fetchAttendanceHistory();
        }
    }, [attendanceDate, activeTab]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, workersRes, teamsRes] = await Promise.all([
                api.get('/supervisor/stats'),
                api.get('/supervisor/workers'),
                api.get('/supervisor/teams')
            ]);
            setStats(statsRes.data);
            setWorkers(workersRes.data);
            setTeams(teamsRes.data);
        } catch (error) {
            toast.error('Failed to load company data');
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendanceHistory = async () => {
        try {
            const response = await api.get(`/supervisor/attendance-history?date=${attendanceDate}`);
            const mapped = {};
            response.data.forEach(record => {
                mapped[record.worker_id] = { status: record.status, notes: record.notes };
            });
            setAttendanceData(mapped);
        } catch (error) {
            console.error('Attendance fetch error');
        }
    };

    const handleStatusChange = (workerId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [workerId]: { ...prev[workerId], status }
        }));
    };

    const handleNotesChange = (workerId, notes) => {
        setAttendanceData(prev => ({
            ...prev,
            [workerId]: { ...prev[workerId], notes }
        }));
    };

    const markAllPresent = () => {
        const filteredWorkers = selectedTeam === 'all'
            ? workers
            : workers.filter(w => w.team_id === parseInt(selectedTeam));

        const newData = { ...attendanceData };
        filteredWorkers.forEach(w => {
            newData[w.id] = { ...newData[w.id], status: 'present' };
        });
        setAttendanceData(newData);
        toast.success(`Marked ${filteredWorkers.length} workers as Present`);
    };

    const submitAttendance = async () => {
        const filteredWorkers = selectedTeam === 'all'
            ? workers
            : workers.filter(w => w.team_id === parseInt(selectedTeam));

        const attendancesToSync = filteredWorkers
            .filter(w => attendanceData[w.id]?.status)
            .map(w => ({
                worker_id: w.id,
                status: attendanceData[w.id].status,
                notes: attendanceData[w.id].notes || ''
            }));

        if (attendancesToSync.length === 0) {
            toast.error('Please mark attendance for at least one worker');
            return;
        }

        try {
            setIsSubmitting(true);
            const payload = {
                date: attendanceDate,
                attendances: attendancesToSync
            };

            await api.post('/supervisor/attendance', payload);
            toast.success('Attendance records synced!');
            fetchDashboardData();
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Sync failed. Please try again.';
            toast.error(errorMsg);
            console.error('Attendance Sync Error Details:', error.response?.data);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Worker CRUD Handlers
    const openAddModal = () => {
        setModalType('add');
        setFormData({ name: '', phone: '', team_id: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (worker) => {
        setModalType('edit');
        setEditingWorker(worker);
        setFormData({ name: worker.name, phone: worker.phone || '', team_id: worker.team_id });
        setIsModalOpen(true);
    };

    const handleWorkerSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalType === 'add') {
                await api.post('/supervisor/workers', formData);
                toast.success('Worker added successfully');
            } else {
                await api.put(`/supervisor/workers/${editingWorker.id}`, formData);
                toast.success('Worker details updated');
            }
            setIsModalOpen(false);
            fetchDashboardData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error processing request');
        }
    };

    const handleDeleteWorker = async (id) => {
        if (!window.confirm('Are you sure you want to delete this worker? This action cannot be undone.')) return;
        try {
            await api.delete(`/supervisor/workers/${id}`);
            toast.success('Worker removed from registry');
            fetchDashboardData();
        } catch (error) {
            toast.error('Failed to delete worker');
        }
    };

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    const fetchWorkerHistory = async (workerId) => {
        try {
            setModalType('worker_history');
            setIsModalOpen(true);
            const res = await api.get(`/supervisor/workers/${workerId}/history`);
            setWorkerHistory(res.data);
        } catch (error) {
            toast.error('Failed to load worker history');
        }
    };

    const handleExportAttendance = async () => {
        try {
            toast.loading('Preparing export...', { id: 'export-toast' });
            const params = {
                start_date: attendanceDate,
                end_date: attendanceDate
            };
            const response = await api.get('/supervisor/attendance/export', {
                params,
                responseType: 'blob'
            });

            // Create a blob URL and trigger download
            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Company_Attendance_${attendanceDate}.csv`);
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('Report downloaded', { id: 'export-toast' });
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Export failed. Please try again.', { id: 'export-toast' });
        }
    };

    if (loading) return <div className="loading-screen">buildPro: Synchronizing Data...</div>;

    return (
        <div className="supervisor-layout">
            <Toaster position="top-right" />

            <aside className="supervisor-sidebar">
                <div className="sidebar-brand">
                    <h2>buildPro</h2>
                    <span>{user?.company?.name || 'Operations Unit'}</span>
                </div>
                <nav className="sidebar-nav">
                    <button className={activeTab === 'attendance' ? 'active' : ''} onClick={() => { setActiveTab('attendance'); setSelectedTeam('all'); }}>
                        <FaClipboardCheck /> Attendance Hub
                    </button>
                    <button className={activeTab === 'workers' ? 'active' : ''} onClick={() => setActiveTab('workers')}>
                        <FaUsers /> Workforce List
                    </button>
                    <button className={activeTab === 'teams' ? 'active' : ''} onClick={() => setActiveTab('teams')}>
                        <FaUsersCog /> Teams Overview
                    </button>
                </nav>
                <button className="logout-button" onClick={handleLogout}>
                    <FaSignOutAlt /> Terminate Session
                </button>
            </aside>

            <main className="supervisor-main">
                <header className="main-header">
                    <div className="header-info">
                        <h1>Supervisor Console</h1>
                        <p>Managing {user?.company?.name}</p>
                    </div>
                    <div className="header-date">
                        <FaCalendarDay />
                        <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                </header>

                <div className="stats-container">
                    <div className="mini-stat">
                        <h3>{stats.total_workers}</h3>
                        <p>Total Personnel</p>
                    </div>
                    <div className="mini-stat">
                        <h3>{stats.total_teams}</h3>
                        <p>Active Teams</p>
                    </div>
                    <div className="mini-stat highlight">
                        <h3>{stats.today_attendance}</h3>
                        <p>Confirmed Present Today</p>
                    </div>
                </div>

                <div className="analytics-section" style={{ marginBottom: '2rem' }}>
                    <div className="content-card chart-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>Team Attendance Overview (Today)</h3>
                        <div style={{ height: '250px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.team_stats}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="workers_count" name="Total Workers" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="present_today_count" name="Present Today" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    {activeTab === 'attendance' && (
                        <div className="attendance-section">
                            <div className="section-toolbar">
                                <h2>Personnel Attendance Logging</h2>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <button
                                        className="action-btn-sm"
                                        onClick={markAllPresent}
                                        style={{ padding: '0.625rem 1rem', fontSize: '0.75rem', background: '#ecfdf5', color: '#059669', border: '1px solid #10b981', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        Mark All Present
                                    </button>
                                    <select
                                        className="date-input"
                                        value={selectedTeam}
                                        onChange={(e) => setSelectedTeam(e.target.value)}
                                        style={{ minWidth: '160px' }}
                                    >
                                        <option value="all">All Teams</option>
                                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                    <input
                                        type="date"
                                        className="date-input"
                                        value={attendanceDate}
                                        onChange={(e) => setAttendanceDate(e.target.value)}
                                    />
                                    <button
                                        className="action-btn-sm"
                                        onClick={handleExportAttendance}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #e2e8f0', background: 'white', color: '#64748b' }}
                                    >
                                        <FaFileExport /> Export
                                    </button>
                                    <button
                                        className="save-btn"
                                        onClick={submitAttendance}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Syncing...' : 'Sync All Records'}
                                    </button>
                                </div>
                            </div>

                            <div className="attendance-table-wrapper">
                                <table className="attendance-table">
                                    <thead>
                                        <tr>
                                            <th>Full Name</th>
                                            <th>Log Status</th>
                                            <th>Official Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(selectedTeam === 'all' ? teams : teams.filter(t => t.id === parseInt(selectedTeam))).map(team => {
                                            const teamWorkers = workers.filter(w => w.team_id === team.id);
                                            if (teamWorkers.length === 0) return null;

                                            return (
                                                <React.Fragment key={team.id}>
                                                    <tr className="team-separator">
                                                        <td colSpan="3">
                                                            <div className="team-header-row">
                                                                <FaUsersCog /> {team.name} <span>({teamWorkers.length} Workers)</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {teamWorkers.map(worker => (
                                                        <tr key={worker.id}>
                                                            <td>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                                    <FaUserCircle style={{ color: '#94a3b8' }} />
                                                                    <strong>{worker.name}</strong>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="status-options">
                                                                    <label className={`status-opt present ${attendanceData[worker.id]?.status === 'present' ? 'active' : ''}`}>
                                                                        <input type="radio" name={`status-${worker.id}`} value="present"
                                                                            checked={attendanceData[worker.id]?.status === 'present'}
                                                                            onChange={() => handleStatusChange(worker.id, 'present')} /> P
                                                                    </label>
                                                                    <label className={`status-opt absent ${attendanceData[worker.id]?.status === 'absent' ? 'active' : ''}`}>
                                                                        <input type="radio" name={`status-${worker.id}`} value="absent"
                                                                            checked={attendanceData[worker.id]?.status === 'absent'}
                                                                            onChange={() => handleStatusChange(worker.id, 'absent')} /> A
                                                                    </label>
                                                                    <label className={`status-opt half ${attendanceData[worker.id]?.status === 'half_day' ? 'active' : ''}`}>
                                                                        <input type="radio" name={`status-${worker.id}`} value="half_day"
                                                                            checked={attendanceData[worker.id]?.status === 'half_day'}
                                                                            onChange={() => handleStatusChange(worker.id, 'half_day')} /> H
                                                                    </label>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <input type="text" className="note-input" placeholder="Enter notes..."
                                                                    value={attendanceData[worker.id]?.notes || ''}
                                                                    onChange={(e) => handleNotesChange(worker.id, e.target.value)}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'workers' && (
                        <div className="workers-section">
                            <div className="section-toolbar">
                                <div>
                                    <h2>Workforce Registry</h2>
                                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                                        {selectedTeam === 'all' ? 'Displaying all personnel.' : `Displaying personnel for: ${teams.find(t => t.id === parseInt(selectedTeam))?.name}`}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <select
                                        className="date-input"
                                        value={selectedTeam}
                                        onChange={(e) => setSelectedTeam(e.target.value)}
                                        style={{ minWidth: '180px' }}
                                    >
                                        <option value="all">All Teams</option>
                                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                    <button className="save-btn" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FaPlus /> Add Worker
                                    </button>
                                </div>
                            </div>
                            <div className="workers-grid">
                                {workers
                                    .filter(w => selectedTeam === 'all' || w.team_id === parseInt(selectedTeam))
                                    .map(worker => (
                                        <div className="worker-mini-card" key={worker.id}>
                                            <div className="worker-avatar">{worker.name.charAt(0)}</div>
                                            <div className="worker-info" style={{ flex: 1 }}>
                                                <h4>{worker.name}</h4>
                                                <p><span className="team-tag">{worker.team?.name}</span></p>
                                                <p style={{ marginTop: '0.25rem' }}>{worker.phone || 'No Contact Info'}</p>
                                            </div>
                                            <div className="card-actions-overlay" style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="icon-btn" title="History" onClick={() => fetchWorkerHistory(worker.id)}><FaHistory /></button>
                                                <button className="icon-btn" onClick={() => openEditModal(worker)}><FaEdit /></button>
                                                <button className="icon-btn delete" onClick={() => handleDeleteWorker(worker.id)}><FaTrash /></button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            {workers.filter(w => selectedTeam === 'all' || w.team_id === parseInt(selectedTeam)).length === 0 && (
                                <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                                    <p style={{ color: '#94a3b8' }}>No personnel found in this category.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'teams' && (
                        <div className="teams-section">
                            <div className="section-toolbar">
                                <h2>Organizational Units</h2>
                                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Select a team to view its workforce.</p>
                            </div>
                            <div className="teams-grid">
                                {teams.map(team => (
                                    <div
                                        className="team-mini-card clickable"
                                        key={team.id}
                                        onClick={() => {
                                            setSelectedTeam(team.id.toString());
                                            setActiveTab('workers');
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="worker-avatar" style={{ background: '#f5f3ff', color: '#7c3aed' }}><FaUsersCog /></div>
                                        <div className="worker-info">
                                            <h4>{team.name}</h4>
                                            <p>{team.workers_count} Personnel Registered</p>
                                            <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                View Workforce <FaArrowRight size={10} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Worker Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalType === 'add' ? 'Register New Worker' : 'Update Worker Details'}>
                <form onSubmit={handleWorkerSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Rahul Sharma"
                            value={formData.name}
                            required
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone Number (Optional)</label>
                        <input
                            type="text"
                            placeholder="10-digit mobile"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Assign to Team</label>
                        <select
                            required
                            value={formData.team_id}
                            onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                        >
                            <option value="">Select Team</option>
                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="submit-btn">
                        {modalType === 'add' ? 'Add Worker to Registry' : 'Save Updated Details'}
                    </button>
                </form>
            </Modal>

            <Modal isOpen={isModalOpen && modalType === 'worker_history'} onClose={() => setIsModalOpen(false)} title="Worker Attendance History">
                <div className="history-modal-content">
                    {!workerHistory ? <p>Loading history...</p> : (
                        <>
                            <div className="worker-brief" style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                                <h4 style={{ margin: 0 }}>{workerHistory.worker.name}</h4>
                                <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#64748b' }}>
                                    {workerHistory.worker.team?.name}
                                </p>
                            </div>
                            <div className="history-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                <table className="attendance-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Status</th>
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
                                            </tr>
                                        ))}
                                        {workerHistory.attendance.length === 0 && (
                                            <tr>
                                                <td colSpan="2" style={{ textAlign: 'center', padding: '1rem' }}>No history found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
}

export default SupervisorDashboard;
