import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import AttendanceSummary from './AttendanceSummary';
import ExportButton from './ExportButton';
import './AttendanceManager.css';

function AttendanceManager({ workers, userRole, companies }) {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState({});
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCompanyId, setSelectedCompanyId] = useState('all');

    // Get unique companies from workers if not provided
    const availableCompanies = companies || [];

    // Filter workers based on company selection (for Super Admin) and search query
    const filteredWorkers = workers.filter(worker => {
        // Company filter (only for super admin)
        if (userRole === 'super_admin' && selectedCompanyId !== 'all') {
            if (worker.company_id !== parseInt(selectedCompanyId)) {
                return false;
            }
        }

        // Search filter
        const searchLower = searchQuery.toLowerCase();
        return worker.name.toLowerCase().includes(searchLower) ||
            worker.position?.toLowerCase().includes(searchLower);
    });

    useEffect(() => {
        fetchAttendance();
    }, [date]);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/attendances?date=${date}`);
            // Map response to worker_id -> data
            const mapped = {};
            response.data.forEach(record => {
                mapped[record.worker_id] = record;
            });
            setAttendanceData(mapped);
        } catch (error) {
            console.error('Error fetching attendance:', error);
            toast.error('Could not load attendance data');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (workerId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [workerId]: {
                ...prev[workerId],
                status: status,
                worker_id: workerId,
                date: date,
                is_changed: true // flag to know what to save
            }
        }));
    };

    const handleRemarkChange = (workerId, remark) => {
        setAttendanceData(prev => ({
            ...prev,
            [workerId]: {
                ...prev[workerId],
                remarks: remark,
                worker_id: workerId,
                date: date,
                is_changed: true
            }
        }));
    };

    const saveAttendance = async (workerId) => {
        const record = attendanceData[workerId];
        if (!record) return;

        try {
            await api.post('/attendances', {
                worker_id: workerId,
                date: date,
                status: record.status || 'present',
                remarks: record.remarks
            });
            toast.success('Saved');

            // Clear changed flag
            setAttendanceData(prev => ({
                ...prev,
                [workerId]: {
                    ...prev[workerId],
                    is_changed: false
                }
            }));

        } catch (error) {
            toast.error('Failed to save');
        }
    };

    const markAllPresent = async () => {
        // Implement bulk mark if needed, or just iterate UI state
        const confirm = window.confirm("Mark all visible workers as Present?");
        if (!confirm) return;

        // Implementation detail: separate bulk API or loop?
        // Let's loop for now or improved UX: set state and user must click "Save All"
        // But simpler: just update local state to 'present' for all who don't have record

        const updates = {};
        workers.forEach(w => {
            if (!attendanceData[w.id]) {
                updates[w.id] = {
                    worker_id: w.id,
                    date: date,
                    status: 'present',
                    is_changed: true
                };
            }
        });
        setAttendanceData(prev => ({ ...prev, ...updates }));
        toast.success('Set all to Present. Click Save Changes to persist.');
    };

    const saveAllChanges = async () => {
        const changed = Object.values(attendanceData).filter(r => r.is_changed);
        if (changed.length === 0) {
            toast('No changes to save');
            return;
        }

        try {
            await Promise.all(changed.map(record =>
                api.post('/attendances', {
                    worker_id: record.worker_id,
                    date: date,
                    status: record.status || 'present',
                    remarks: record.remarks
                })
            ));
            toast.success(`Saved ${changed.length} records`);
            fetchAttendance(); // refresh to clear flags
        } catch (error) {
            toast.error('Some updates failed');
        }
    };

    // Prepare data for export
    const prepareExportData = () => {
        return filteredWorkers.map(worker => {
            const record = attendanceData[worker.id] || {};
            return {
                'Worker Name': worker.name,
                'Position': worker.position || 'N/A',
                'Company': worker.company?.name || 'N/A',
                'Date': date,
                'Status': record.status || 'Not Marked',
                'Check In': record.check_in_time || 'N/A',
                'Check Out': record.check_out_time || 'N/A',
                'Remarks': record.remarks || ''
            };
        });
    };

    return (
        <div className="attendance-manager">
            <div className="attendance-header">
                <h2>Attendance Management</h2>
                <div className="controls">
                    {userRole === 'super_admin' && availableCompanies.length > 0 && (
                        <div className="company-filter">
                            <i className="fas fa-building filter-icon"></i>
                            <select
                                value={selectedCompanyId}
                                onChange={(e) => setSelectedCompanyId(e.target.value)}
                                className="company-select"
                            >
                                <option value="all">All Companies</option>
                                {availableCompanies.map(company => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="search-box">
                        <i className="fas fa-search search-icon"></i>
                        <input
                            type="text"
                            placeholder="Search workers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="date-picker"
                    />
                    <div className="bulk-actions">
                        <ExportButton
                            data={prepareExportData()}
                            filename="attendance_report"
                            buttonText="Export"
                        />
                        <button className="btn-bulk" onClick={markAllPresent}>
                            <i className="fas fa-check-double"></i> Mark All Present
                        </button>
                        <button className="btn-primary" onClick={saveAllChanges}>
                            <i className="fas fa-save"></i> Save Changes
                        </button>
                    </div>
                </div>
            </div>

            <AttendanceSummary
                date={date}
                companyId={userRole === 'super_admin' ? selectedCompanyId : null}
            />

            <div className="attendance-table-container">
                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>Worker</th>
                            {userRole === 'super_admin' && <th>Company</th>}
                            <th>Status</th>
                            <th>Remarks</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredWorkers.map(worker => {
                            const record = attendanceData[worker.id] || {};
                            const status = record.status || '';

                            return (
                                <tr key={worker.id} className={record.is_changed ? 'changed-row' : ''}>
                                    <td>
                                        <div className="worker-info">
                                            <span className="worker-name">{worker.name}</span>
                                            <span className="worker-role">{worker.position}</span>
                                        </div>
                                    </td>
                                    {userRole === 'super_admin' && <td>{worker.company?.name}</td>}
                                    <td>
                                        <select
                                            value={status}
                                            onChange={(e) => handleStatusChange(worker.id, e.target.value)}
                                            className={`status-select ${status}`}
                                        >
                                            <option value="">Select Status</option>
                                            <option value="present">Present</option>
                                            <option value="absent">Absent</option>
                                            <option value="half_day">Half Day</option>
                                            <option value="leave">Leave</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={record.remarks || ''}
                                            onChange={(e) => handleRemarkChange(worker.id, e.target.value)}
                                            placeholder="Add remark..."
                                            className="remark-input"
                                        />
                                    </td>
                                    <td>
                                        {record.is_changed && (
                                            <button
                                                className="btn-save-small"
                                                onClick={() => saveAttendance(worker.id)}
                                            >
                                                <i className="fas fa-save"></i>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AttendanceManager;
