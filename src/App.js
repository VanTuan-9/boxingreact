import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import BookingSystem from './components/BookingSystems';
import Coaches from './components/Coaches';
import Tournaments from './components/Tournaments';
import Blog from './components/Blog';
import Classes from './components/Classes';
import Footer from './components/Footer';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Account/Profile';
import './styles/styles.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  // State for managing authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (token) {
      setIsLoggedIn(true);
      setIsAdminLoggedIn(userRole === 'admin');
      setUser({ role: userRole });
    }
  }, []);

  // Handle user login
  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setIsAdminLoggedIn(userData.role === 'admin');
    setUser(userData);
  };

  // Handle admin login
  const handleAdminLogin = (adminData) => {
    setIsLoggedIn(true);
    setIsAdminLoggedIn(true);
    setUser({ ...adminData, role: 'admin' });
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setIsAdminLoggedIn(false);
    setUser(null);
  };

  return (
    <Router>
      <ToastContainer />
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdminLoggedIn} onLogout={handleLogout} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/booking" element={<BookingSystem />} />
          <Route path="/coaches" element={<Coaches />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/account" element={<Profile />} />
          
          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={
              isLoggedIn ? 
              <Navigate to="/" /> : 
              <Login />
            } 
          />
          <Route 
            path="/register" 
            element={
              isLoggedIn ? 
              <Navigate to="/" /> : 
              <Register />
            } 
          />
          <Route 
            path="/admin-login" 
            element={
              isAdminLoggedIn ? 
              <Navigate to="/admin/dashboard" /> : 
              <AdminLogin onLogin={handleAdminLogin} />
            } 
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              isAdminLoggedIn ? (
                <AdminDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/admin-login" />
              )
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;