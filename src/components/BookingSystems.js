import React, { useState } from 'react';

function BookingSystem() {
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    date: '',
    classType: 'beginner',
    coach: ''  // Add coach field
  });

  // Add coaches data
  const coaches = [
    {
      id: 1,
      name: "Ryan Garcia",
      speciality: "Professional Boxer"
    },
    {
      id: 2,
      name: "Mike Tyson",
      speciality: "Boxing Trainer"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking submitted:', bookingData);
  };

  return (
    <div className="booking-container">
      <h2>Book a Class</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={bookingData.name}
            onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={bookingData.email}
            onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={bookingData.date}
            onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Class Type:</label>
          <select
            value={bookingData.classType}
            onChange={(e) => setBookingData({...bookingData, classType: e.target.value})}
          >
            <option value="beginner">Beginner Class</option>
            <option value="intermediate">Intermediate Class</option>
            <option value="advanced">Advanced Class</option>
            <option value="private">Private Session</option>
          </select>
        </div>
        <div className="form-group">
          <label>Select Coach:</label>
          <select
            value={bookingData.coach}
            onChange={(e) => setBookingData({...bookingData, coach: e.target.value})}
            required
          >
            <option value="">Choose a coach</option>
            {coaches.map(coach => (
              <option key={coach.id} value={coach.name}>
                {coach.name} - {coach.speciality}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Book Now</button>
      </form>
    </div>
  );
}

export default BookingSystem;