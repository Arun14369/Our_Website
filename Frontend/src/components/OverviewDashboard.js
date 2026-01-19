import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './OverviewDashboard.css';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];

function OverviewDashboard({ companies, workers, reports, supervisors }) {
    // Calculate statistics
    const activeCompanies = companies.filter(c => c.is_active).length;
    const activeWorkers = workers.filter(w => w.is_active).length;
    const companiesWithoutSupervisor = companies.filter(c => !c.supervisor).length;

    // Team distribution
    const teamData = [
        { name: 'Operators', value: workers.filter(w => w.team === 'operators').length },
        { name: 'Plumbers', value: workers.filter(w => w.team === 'plumbers').length },
        { name: 'Electricians', value: workers.filter(w => w.team === 'electricians').length },
        { name: 'Carpenters', value: workers.filter(w => w.team === 'carpenters').length },
    ].filter(item => item.value > 0);

    // Workers per company
    const companyWorkerData = companies.map(company => ({
        name: company.name.substring(0, 15) + (company.name.length > 15 ? '...' : ''),
        workers: workers.filter(w => w.company_id === company.id).length,
        reports: reports.filter(r => r.company_id === company.id).length,
    }));

    // Recent activity (last 7 days)
    const getRecentReports = () => {
        const last7Days = [...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split('T')[0];
        });

        return last7Days.map(date => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            reports: reports.filter(r => r.date === date).length,
        }));
    };

    return (
        <div className="overview-dashboard">
            {/* Stats Cards */}
            <div className="overview-stats">
                <div className="overview-stat-card purple">
                    <div className="stat-icon">🏢</div>
                    <div className="stat-content">
                        <h3>{companies.length}</h3>
                        <p>Total Companies</p>
                        <span className="stat-detail">{activeCompanies} Active</span>
                    </div>
                </div>
                <div className="overview-stat-card blue">
                    <div className="stat-icon">👔</div>
                    <div className="stat-content">
                        <h3>{supervisors.length}</h3>
                        <p>Supervisors</p>
                        <span className="stat-detail">{companiesWithoutSupervisor} Unassigned</span>
                    </div>
                </div>
                <div className="overview-stat-card green">
                    <div className="stat-icon">👷</div>
                    <div className="stat-content">
                        <h3>{workers.length}</h3>
                        <p>Total Workers</p>
                        <span className="stat-detail">{activeWorkers} Active</span>
                    </div>
                </div>
                <div className="overview-stat-card orange">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <h3>{reports.length}</h3>
                        <p>Total Reports</p>
                        <span className="stat-detail">This Month</span>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-grid">
                {/* Team Distribution */}
                <div className="chart-card">
                    <h3>Worker Team Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={teamData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {teamData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Company Workers */}
                <div className="chart-card">
                    <h3>Workers & Reports per Company</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={companyWorkerData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="workers" fill="#667eea" name="Workers" />
                            <Bar dataKey="reports" fill="#764ba2" name="Reports" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Activity */}
                <div className="chart-card full-width">
                    <h3>Reports Activity (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={getRecentReports()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="reports" stroke="#667eea" strokeWidth={2} name="Reports" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
                <div className="quick-stat-item">
                    <h4>Average Workers per Company</h4>
                    <p className="stat-value">
                        {companies.length > 0 ? (workers.length / companies.length).toFixed(1) : 0}
                    </p>
                </div>
                <div className="quick-stat-item">
                    <h4>Companies Without Supervisor</h4>
                    <p className="stat-value">{companiesWithoutSupervisor}</p>
                </div>
                <div className="quick-stat-item">
                    <h4>Active Workers Ratio</h4>
                    <p className="stat-value">
                        {workers.length > 0 ? ((activeWorkers / workers.length) * 100).toFixed(1) : 0}%
                    </p>
                </div>
                <div className="quick-stat-item">
                    <h4>Average Reports per Company</h4>
                    <p className="stat-value">
                        {companies.length > 0 ? (reports.length / companies.length).toFixed(1) : 0}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default OverviewDashboard;
