import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function AdminLogin({ onLogin }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin-auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      const { token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', 'admin');
      onLogin({ token });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email hoặc Username:</label>
          <input
            type="text"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;