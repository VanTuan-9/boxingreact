import React, { useState } from 'react';
import axios from '../../config/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      return toast.error('Please fill in all fields');
    }

    setLoading(true);

    try {
      // Send login request to backend
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      // Save token to localStorage
      if (response.data.user && response.data.user.token) {
        localStorage.setItem('token', response.data.user.token);
        localStorage.setItem('userRole', response.data.user.role);
        toast.success('Login successful!');
        
        // Redirect based on role
        if (response.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      const errorMessage = 
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Login failed. Please check your credentials.';
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Login to Your Account</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-footer">
          Don't have an account?{' '}
          <a onClick={() => navigate('/register')} className="auth-link">
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login; 