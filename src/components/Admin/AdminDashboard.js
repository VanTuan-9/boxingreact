import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import AdminUsers from './AdminUsers';
import AdminClasses from './AdminClasses';
import AdminTournaments from './AdminTournaments';
import AdminSettings from './AdminSettings';
import AdminReports from './AdminReports';
import AdminNotifications from './AdminNotifications';
import AdminCoaches from './AdminCoaches';
import AdminClassRegistrations from './AdminClassRegistrations';
import AdminTournamentRegistrations from './AdminTournamentRegistrations';
import axios from '../../config/axios';

function AdminDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [notiCount, setNotiCount] = useState(0);

  const fetchNotiCount = async () => {
    try {
      const res = await axios.get('/api/admin/notifications');
      setNotiCount(res.data?.count || 0);
    } catch (err) {
      setNotiCount(0);
    }
  };

  useEffect(() => {
    fetchNotiCount();
    
    // Thêm event listener để cập nhật số lượng thông báo
    const handleNotificationsCleared = () => {
      setNotiCount(0);
    };
    
    window.addEventListener('notificationsCleared', handleNotificationsCleared);
    
    return () => {
      window.removeEventListener('notificationsCleared', handleNotificationsCleared);
    };
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleBellClick = () => {
    navigate('/admin/notifications');
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-profile">
          <div className="admin-avatar">
            <img src="/images/admin-avatar.png" alt="Admin" />
          </div>
          <h3>Welcome, Admin</h3>
          <p>Manage your boxing club</p>
        </div>
        
        <nav className="admin-nav">
          <Link to="/admin" className="nav-link">
            <i className="fas fa-home"></i>
            Dashboard
          </Link>
          <Link to="/admin/users" className="nav-link">
            <i className="fas fa-users"></i>
            Users
          </Link>
          <Link to="/admin/classes" className="nav-link">
            <i className="fas fa-dumbbell"></i>
            Classes
          </Link>
          <Link to="/admin/class-registrations" className="nav-link">
            <i className="fas fa-clipboard-list"></i>
            Class Registrations
          </Link>
          <Link to="/admin/tournament-registrations" className="nav-link">
            <i className="fas fa-clipboard-list"></i>
            Tournament Registrations
          </Link>
          <Link to="/admin/coaches" className="nav-link">
            <i className="fas fa-user-tie"></i>
            Coaches
          </Link>
          <Link to="/admin/tournaments" className="nav-link">
            <i className="fas fa-trophy"></i>
            Tournaments
          </Link>
          {/* <Link to="/admin/reports" className="nav-link">
            <i className="fas fa-chart-bar"></i>
            Reports
          </Link> */}
          <Link to="/admin/notifications" className="nav-link">
            <i className="fas fa-bell"></i>
            Notifications
          </Link>
          <Link to="/admin/settings" className="nav-link">
            <i className="fas fa-cog"></i>
            Settings
          </Link>
        </nav>

        <button onClick={handleLogout} className="logout-button">
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>

      <div className="admin-content">
        <div className="admin-header">
          <h2>Admin Dashboard </h2>
          <div className="admin-actions">
            <button className="notification-bell" onClick={handleBellClick}>
              <i className="fas fa-bell"></i>
              {notiCount > 0 && <span className="notification-badge">{notiCount}</span>}
            </button>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/classes" element={<AdminClasses />} />
          <Route path="/class-registrations" element={<AdminClassRegistrations />} />
          <Route path="/tournament-registrations" element={<AdminTournamentRegistrations />} />
          <Route path="/coaches" element={<AdminCoaches />} />
          <Route path="/tournaments" element={<AdminTournaments />} />
          <Route path="/reports" element={<AdminReports />} />
          <Route path="/notifications" element={<AdminNotifications />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      </div>
    </div>
  );
}

// Dashboard Overview Component
function DashboardOverview() {
  const [stats, setStats] = useState({
    users: 0,
    classes: 0,
    coaches: 0,
    tournaments: 0,
    revenue: '--'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashRes = await axios.get('/api/admin/dashboard');
        const coachRes = await axios.get('/api/coaches');
        setStats({
          users: dashRes.data?.data?.counts?.users || 0,
          classes: dashRes.data?.data?.counts?.classes || 0,
          tournaments: dashRes.data?.data?.counts?.tournaments || 0,
          coaches: coachRes.data?.data?.length || 0,
          revenue: '--'
        });
      } catch (err) {
        setStats({ users: 0, classes: 0, coaches: 0, tournaments: 0, revenue: '--' });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statList = [
    { title: 'Total Users', value: stats.users, icon: 'fas fa-users' },
    { title: 'Active Classes', value: stats.classes, icon: 'fas fa-dumbbell' },
    { title: 'Coaches', value: stats.coaches, icon: 'fas fa-user-tie' },
    { title: 'Tournaments', value: stats.tournaments, icon: 'fas fa-trophy' }
  ];

  return (
    <div className="dashboard-overview">
      <div className="stats-grid">
        {loading ? (
          <div>Loading data...</div>
        ) : (
          statList.map((stat, index) => (
            <div key={index} className="stat-card">
              <i className={stat.icon}></i>
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;