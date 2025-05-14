import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import axiosInstance from '../config/axios';
import { jwtDecode } from 'jwt-decode';

function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    phone: '',
    age: '',
    note: ''
  });
  const [registering, setRegistering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 2;

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tournaments?page=${currentPage}&limit=${limit}`);
        setTournaments(res.data.tournaments);
        setTotalItems(res.data.total);
        setTotalPages(Math.ceil(res.data.total / limit));
      } catch (err) {
        setError('Không thể tải danh sách giải đấu.');
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, [currentPage]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Mock data khi không có dữ liệu thật
  const mockTournaments = [
    {
      id: 1,
      name: "Summer Championship",
      date: "July 15-16, 2024",
      categories: "Amateur, Professional",
      location: "Main Arena",
      registrationDeadline: "June 30, 2024"
    },
    {
      id: 2,
      name: "Rookie Tournament",
      date: "August 20, 2024",
      categories: "Beginner",
      location: "Training Center",
      registrationDeadline: "August 5, 2024"
    }
  ];

  const displayTournaments = tournaments.length > 0 ? tournaments : mockTournaments;

  const handleTournamentSelect = (tournament) => {
    setSelectedTournament(tournament);
    setShowRegistrationForm(false);
  };

  const closeDetails = () => {
    setSelectedTournament(null);
    setShowRegistrationForm(false);
  };

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({ ...prev, [name]: value }));
  };

  const handleShowRegistrationForm = () => {
    if (!isLoggedIn) {
      toast.error('Bạn cần đăng nhập để đăng ký giải đấu!');
      return;
    }
    setShowRegistrationForm(true);
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    setRegistering(true);
    try {
      let userId = undefined;
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          userId = decoded.id || decoded._id || decoded.userId;
        } catch (err) { userId = undefined; }
      }
      await axiosInstance.post('/api/tournament-registrations', {
        tournament: selectedTournament._id,
        user: userId,
        name: registrationData.fullName,
        phone: registrationData.phone,
        age: registrationData.age,
        note: registrationData.note
      });
      toast.success(`Successfully registered for tournament ${selectedTournament.name}!`);
      setShowRegistrationForm(false);
      setRegistrationData({ fullName: '', phone: '', age: '', note: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);

  if (loading) return <div>Loading tournament list...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="tournaments-container">
      <h2>Upcoming Tournaments</h2>
      <div className="tournaments-grid">
        {displayTournaments.map((tournament, idx) => (
          <div key={tournament._id || tournament.id || idx} className="tournament-card" onClick={() => handleTournamentSelect(tournament)}>
            <h3>{tournament.name}</h3>
            <div className="tournament-details">
              <p><strong>Date:</strong> {tournament.date ? (new Date(tournament.date).toLocaleDateString() || tournament.date) : tournament.date}</p>
              {tournament.categories && <p><strong>Categories:</strong> {tournament.categories}</p>}
              <p><strong>Location:</strong> {tournament.location}</p>
              {tournament.registrationDeadline && <p><strong>Registration Deadline:</strong> {tournament.registrationDeadline ? (new Date(tournament.registrationDeadline).toLocaleDateString() || tournament.registrationDeadline) : tournament.registrationDeadline}</p>}
            </div>
            <button className="register-button">Register Now</button>
          </div>
        ))}
      </div>
      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="pagination-btn">Trước</button>
          {[...Array(totalPages)].map((_, idx) => (
            <button key={idx+1} onClick={() => handlePageChange(idx+1)} className={`pagination-btn ${currentPage === idx+1 ? 'active' : ''}`}>{idx+1}</button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-btn">Sau</button>
        </div>
      )}
      {/* Modal đăng ký giải đấu */}
      {selectedTournament && (
        <div className="class-details-modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeDetails}>&times;</span>
            <h2>{selectedTournament.name}</h2>
            <div className="detail-row">
              <strong>Date:</strong> {selectedTournament.date ? (new Date(selectedTournament.date).toLocaleDateString() || selectedTournament.date) : selectedTournament.date}
            </div>
            <div className="detail-row">
              <strong>Location:</strong> {selectedTournament.location}
            </div>
            <div className="detail-row">
              <strong>Registration Deadline:</strong> {selectedTournament.registrationDeadline ? (new Date(selectedTournament.registrationDeadline).toLocaleDateString() || selectedTournament.registrationDeadline) : selectedTournament.registrationDeadline}
            </div>
            {!showRegistrationForm && (
              <button className="join-btn" onClick={handleShowRegistrationForm}>
                {isLoggedIn ? 'Register for tournament' : 'Login to register'}
              </button>
            )}
            {showRegistrationForm && isLoggedIn && (
              <div className="registration-form">
                <h2>Đăng ký giải: {selectedTournament.name}</h2>
                <form onSubmit={handleSubmitRegistration}>
                  <div className="form-group">
                    <label htmlFor="fullName">Họ và tên</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={registrationData.fullName}
                      onChange={handleRegistrationChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={registrationData.phone}
                      onChange={handleRegistrationChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="age">Tuổi</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      min="10"
                      max="70"
                      value={registrationData.age}
                      onChange={handleRegistrationChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="note">Ghi chú (tuỳ chọn)</label>
                    <textarea
                      id="note"
                      name="note"
                      value={registrationData.note}
                      onChange={handleRegistrationChange}
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={closeDetails}>Back</button>
                    <button type="submit" className="submit-btn" disabled={registering}>{registering ? 'Registering...' : 'Submit'}</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="tournament-rules">
        <h3>Tournament Rules & Requirements</h3>
        <ul>
          <li>Valid boxing license required</li>
          <li>Medical clearance needed</li>
          <li>Age restrictions apply</li>
          <li>Weight categories will be strictly enforced</li>
        </ul>
      </div>
    </div>
  );
}

export default Tournaments;