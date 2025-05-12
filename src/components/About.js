import React from 'react';

function About() {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>Anh Boxing Club</h1>
        <p>Building champions since 2025</p>
      </div>

      <div className="about-section">
        <div className="about-content">
          <h2>Our Story</h2>
          <p>Founded by professional boxers with a passion for teaching, Elite Boxing Club has grown from a small local gym into one of the city's premier boxing facilities. Our mission is to provide world-class boxing training while building confidence, discipline, and character in our members.</p>
        </div>
        <div className="about-image">
          <img src="/images/gym.jpg" alt="Our Gym" />
        </div>
      </div>

      <div className="values-section">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <h3>Excellence</h3>
            <p>We strive for excellence in everything we do, from training to customer service.</p>
          </div>
          <div className="value-card">
            <h3>Community</h3>
            <p>Building a supportive community of boxers who help each other grow.</p>
          </div>
          <div className="value-card">
            <h3>Discipline</h3>
            <p>Teaching the importance of dedication, hard work, and perseverance.</p>
          </div>
        </div>
      </div>

      <div className="facilities-section">
        <h2>Our Facilities</h2>
        <div className="facilities-grid">
          <div className="facility-item">
            <img src="/images/ring.png" alt="Boxing Ring" />
            <h3>Professional Boxing Ring</h3>
          </div>
          <div className="facility-item">
            <img src="/images/bags.png" alt="Training Area" />
            <h3>Training Area</h3>
          </div>
          <div className="facility-item">
            <img src="/images/weights.png" alt="Weight Room" />
            <h3>Weight Room</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;