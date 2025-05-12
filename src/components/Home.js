import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Anh Boxing Club</h1>
        <p>Train with champions, become a champion</p>
        <Link to="/classes" className="cta-button">Start Training Today</Link>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <h3>Professional Training</h3>
          <p>Learn from experienced coaches with proven track records</p>
        </div>
        <div className="feature-card">
          <h3>All Skill Levels</h3>
          <p>From beginners to advanced fighters, we have classes for everyone</p>
        </div>
        <div className="feature-card">
          <h3>Modern Facilities</h3>
          <p>State-of-the-art equipment and training areas</p>
        </div>
      </div>

      <div className="schedule-preview">
        <h2>Upcoming Classes</h2>
        <div className="class-grid">
          <div className="class-item">
            <h4>Beginner Boxing</h4>
            <p>Monday & Wednesday</p>
            <p>6:00 PM - 7:30 PM</p>
          </div>
          <div className="class-item">
            <h4>Advanced Training</h4>
            <p>Tuesday & Thursday</p>
            <p>7:00 PM - 8:30 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;