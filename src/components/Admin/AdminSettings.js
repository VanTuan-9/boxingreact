import React, { useState } from 'react';
import axios from '../../config/axios';

function AdminSettings() {
  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState({
    // Account Settings
    username: 'admin',
    email: 'admin@anhboxing.com',
    password: '',
    confirmPassword: '',

    // System Settings
    siteName: 'Anh Boxing Club',
    contactEmail: 'info@anhboxing.com',
    phoneNumber: '(123) 456-7890',
    address: '123 Boxing Street',
    timezone: 'UTC+7',
    language: 'English',

    // Appearance Settings
    theme: 'light',
    primaryColor: '#ff416c',
    fontSize: 'medium',
    sidebarCollapsed: false,

    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    bookingAlerts: true,
    marketingEmails: false,
    newsletterSubscription: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === 'account') {
      if (settings.password && settings.password !== settings.confirmPassword) {
        alert('Password confirmation does not match!');
        return;
      }
      try {
        const payload = {
          name: settings.username,
          email: settings.email,
        };
        if (settings.password) payload.password = settings.password;
        const res = await axios.put('/api/admin-auth/me', payload);
        alert('Update successful!');
        setSettings({ ...settings, password: '', confirmPassword: '' });
      } catch (err) {
        alert(
          err.response?.data?.message || err.response?.data?.error || 'Update failed!'
        );
      }
    } else {
      // Xử lý các tab khác nếu cần
      console.log('Settings updated:', settings);
    }
  };

  return (
    <div className="admin-settings">
      <h2>Settings</h2>
      
      <div className="settings-tabs">
        <button 
          className={`tab-button ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          <i className="fas fa-user"></i> Account
        </button>
        <button 
          className={`tab-button ${activeTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveTab('system')}
        >
          <i className="fas fa-cog"></i> System
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'account' && (
          <form className="settings-form" onSubmit={handleSubmit}>
            <h3>Account Settings</h3>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={settings.username}
                onChange={(e) => setSettings({...settings, username: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({...settings, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={settings.password}
                onChange={(e) => setSettings({...settings, password: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={settings.confirmPassword}
                onChange={(e) => setSettings({...settings, confirmPassword: e.target.value})}
              />
            </div>
          </form>
        )}

        {activeTab === 'system' && (
          <form className="settings-form" onSubmit={handleSubmit}>
            <h3>System Settings</h3>
            <div className="form-group">
              <label>Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={settings.phoneNumber}
                onChange={(e) => setSettings({...settings, phoneNumber: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({...settings, address: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({...settings, timezone: e.target.value})}
              >
                <option value="UTC+7">UTC+7</option>
                <option value="UTC+8">UTC+8</option>
                <option value="UTC+9">UTC+9</option>
              </select>
            </div>
          </form>
        )}

        {activeTab === 'appearance' && false}
        {activeTab === 'notifications' && false}

        <button type="submit" className="save-button" onClick={handleSubmit}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default AdminSettings;