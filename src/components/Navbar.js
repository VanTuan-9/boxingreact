import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ isLoggedIn, isAdmin, onLogout }) => {
  console.log('Navbar props:', { isLoggedIn, isAdmin });
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">BoxingClub</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/coaches">Coaches</Link></li>
        <li><Link to="/classes">Classes</Link></li>
        <li><Link to="/tournaments">Tournaments</Link></li>
        {/* {isAdmin && <li><Link to="/blog">Blog</Link></li>} */}
      </ul>
      <div className="auth-buttons">
        {isLoggedIn ? (
          <>
            {!isAdmin && (
              <Link to="/account" className="account-btn" style={{marginRight: 8, color: 'white', display: 'flex', alignItems: 'center', fontSize: '1.5rem'}}>
                <i className="fas fa-user-circle" style={{color: 'white'}}></i>
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin/dashboard" className="admin-btn">Admin Panel</Link>
            )}
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="register-btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;