import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';

function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/api/admin/notifications');
        if (res.data && Array.isArray(res.data.notifications)) {
          setNotifications(res.data.notifications);
        } else {
          setNotifications([]);
        }
      } catch (err) {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const clearAll = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      const response = await axios.delete('/api/admin/clear-notifications');
      console.log('Response:', response);
      setNotifications([]);
      // Thông báo cho AdminDashboard cập nhật số lượng thông báo
      window.dispatchEvent(new Event('notificationsCleared'));
    } catch (err) {
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers
      });
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi xóa thông báo');
    }
  };

  // Hàm chuyển type sang tiếng Anh
  const getTypeLabel = (type) => {
    switch (type) {
      case 'info': return 'Notification';
      case 'success': return 'Success';
      case 'warning': return 'Warning';
      case 'error': return 'Error';
      case 'member': return 'New member';
      case 'class': return 'Class registration';
      case 'tournament': return 'Tournament registration';
      default: return type;
    }
  };

  return (
    <div className="admin-notifications">
      <div className="notifications-header">
        <h2>Notifications</h2>
        <button onClick={clearAll} className="clear-all">Clear All</button>
      </div>

      {error && (
        <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
          {error}
        </div>
      )}

      <div className="notifications-list">
        {loading ? (
          <div>Đang tải thông báo...</div>
        ) : notifications.length > 0 ? (
          notifications.map(notification => (
            <div 
              key={notification._id}
              className={`notification-item unread`}
              data-type={notification.type}
            >
              <div className="notification-content">
                <div className="notification-type">{getTypeLabel(notification.type)}</div>
                <div className="notification-message">{notification.message || notification.title}</div>
                <div className="notification-time">{new Date(notification.createdAt).toLocaleString()}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-notifications">
            No new notifications
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminNotifications;