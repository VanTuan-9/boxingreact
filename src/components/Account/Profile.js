import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';

function Profile() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Lấy thông tin user hiện tại
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        setUser({ name: res.data?.user?.name || '', email: res.data?.user?.email || '' });
      } catch (err) {
        setMessage('Unable to load user information!');
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setMessage('Password confirmation does not match!');
      return;
    }
    try {
      const payload = { name: user.name, email: user.email };
      if (password) payload.password = password;
      await axios.put('/api/auth/me', payload);
      setMessage('Update successful!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed!');
    }
  };

  return (
    <div className="profile-page" style={{ maxWidth: 500, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px #eee' }}>
      <h2>Profile Information</h2>
      {message && <div style={{ color: message.includes('successful') ? 'green' : 'red', marginBottom: 16 }}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Leave blank if not changing" />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Leave blank if not changing" />
        </div>
        <button type="submit" className="save-button">Save Changes</button>
      </form>
    </div>
  );
}

export default Profile; 