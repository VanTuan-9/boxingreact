import React, { useState, useEffect } from 'react';
import axios from '../config/axios';

function Coaches() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await axios.get('/api/coaches');
        setCoaches(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching coaches:', error);
        setError('Failed to load coaches. Please try again later.');
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  if (loading) {
    return <div className="loading">Loading coaches...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="coaches-container">
      <h2>Our Coaches</h2>
      {coaches.length === 0 ? (
        <p>No coaches available at the moment.</p>
      ) : (
        <div className="coaches-grid">
          {coaches.map(coach => (
            <div key={coach._id} className="coach-card">
              <img 
                src={coach.profileImage ? 
                  (coach.profileImage.startsWith('http') ? 
                    coach.profileImage : 
                    `http://localhost:5000/uploads/${coach.profileImage}`) : 
                  '/images/default-coach.jpg'} 
                alt={coach.name} 
              />
              <h3>{coach.name}</h3>
              <p>Specialization: {coach.specialization}</p>
              <p>Experience: {coach.experience} years</p>
              <p className="coach-bio">{coach.bio}</p>
              {coach.achievements && coach.achievements.length > 0 && (
                <div className="coach-achievements">
                  <h4>Achievements</h4>
                  <ul>
                    {coach.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Coaches;