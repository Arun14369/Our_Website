import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './AttendanceSummary.css';

function AttendanceSummary({ date, companyId = null }) {
    const [summary, setSummary] = useState({
        present: 0,
        absent: 0,
        halfDay: 0,
        leave: 0,
        total: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSummary();
    }, [date, companyId]);

    const fetchSummary = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ date });
            if (companyId && companyId !== 'all') {
                params.append('company_id', companyId);
            }

            const response = await api.get(`/attendances?${params}`);
            const attendances = response.data;

            const stats = {
                present: attendances.filter(a => a.status === 'present').length,
                absent: attendances.filter(a => a.status === 'absent').length,
                halfDay: attendances.filter(a => a.status === 'half_day').length,
                leave: attendances.filter(a => a.status === 'leave').length,
                total: attendances.length
            };

            setSummary(stats);
        } catch (error) {
            console.error('Error fetching attendance summary:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="attendance-summary loading">Loading summary...</div>;
    }

    const percentage = summary.total > 0
        ? Math.round((summary.present / summary.total) * 100)
        : 0;

    return (
        <div className="attendance-summary">
            <h3><i className="fas fa-chart-pie"></i> Today's Summary</h3>
            <div className="summary-grid">
                <div className="summary-card present">
                    <div className="summary-icon">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="summary-info">
                        <span className="summary-number">{summary.present}</span>
                        <span className="summary-label">Present</span>
                    </div>
                </div>

                <div className="summary-card absent">
                    <div className="summary-icon">
                        <i className="fas fa-times-circle"></i>
                    </div>
                    <div className="summary-info">
                        <span className="summary-number">{summary.absent}</span>
                        <span className="summary-label">Absent</span>
                    </div>
                </div>

                <div className="summary-card half-day">
                    <div className="summary-icon">
                        <i className="fas fa-adjust"></i>
                    </div>
                    <div className="summary-info">
                        <span className="summary-number">{summary.halfDay}</span>
                        <span className="summary-label">Half Day</span>
                    </div>
                </div>

                <div className="summary-card leave">
                    <div className="summary-icon">
                        <i className="fas fa-calendar-times"></i>
                    </div>
                    <div className="summary-info">
                        <span className="summary-number">{summary.leave}</span>
                        <span className="summary-label">Leave</span>
                    </div>
                </div>
            </div>

            <div className="attendance-percentage">
                <div className="percentage-bar">
                    <div
                        className="percentage-fill"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <div className="percentage-text">
                    <span className="percentage-value">{percentage}%</span>
                    <span className="percentage-label">Attendance Rate</span>
                </div>
            </div>
        </div>
    );
}

export default AttendanceSummary;
