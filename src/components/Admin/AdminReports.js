import React, { useState } from 'react';

function AdminReports() {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const reports = [
    {
      id: 1,
      title: 'Monthly Revenue',
      value: '$15,000',
      change: '+12%',
      period: 'vs last month'
    },
    {
      id: 2,
      title: 'Active Members',
      value: '250',
      change: '+5%',
      period: 'vs last month'
    },
    {
      id: 3,
      title: 'Class Attendance',
      value: '85%',
      change: '+3%',
      period: 'vs last month'
    },
    {
      id: 4,
      title: 'New Registrations',
      value: '45',
      change: '+8%',
      period: 'vs last month'
    }
  ];

  return (
    <div className="admin-reports">
      <h2>Reports & Analytics</h2>
      
      <div className="date-filter">
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
        />
        <span>to</span>
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
        />
      </div>

      <div className="reports-grid">
        {reports.map(report => (
          <div key={report.id} className="report-card">
            <h3>{report.title}</h3>
            <div className="report-value">{report.value}</div>
            <div className={`report-change ${report.change.includes('+') ? 'positive' : 'negative'}`}>
              {report.change}
            </div>
            <div className="report-period">{report.period}</div>
          </div>
        ))}
      </div>

      <div className="export-section">
        <button className="export-button">
          <i className="fas fa-file-pdf"></i> Export to PDF
        </button>
        <button className="export-button">
          <i className="fas fa-file-excel"></i> Export to Excel
        </button>
      </div>
    </div>
  );
}

export default AdminReports;