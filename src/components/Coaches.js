import React, { useState, useEffect } from 'react';
import axios from '../config/axios';

function Coaches() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Lưu trữ từ khóa tìm kiếm thực tế
  const [searching, setSearching] = useState(false);
  const limit = 3;

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        let url = `/api/coaches?page=${currentPage}&limit=${limit}`;
        
        // Thêm từ khóa tìm kiếm vào URL nếu có
        if (searchQuery.trim()) {
          url += `&search=${searchQuery.trim()}`;
        }
        
        const response = await axios.get(url);
        setCoaches(response.data.data);
        setTotalItems(response.data.total);
        setTotalPages(Math.ceil(response.data.total / limit));
      } catch (error) {
        console.error('Error fetching coaches:', error);
        setError('Failed to load coaches. Please try again later.');
      } finally {
        setLoading(false);
        setSearching(false);
      }
    };

    fetchCoaches();
  }, [currentPage, searchQuery]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearching(true);
    setSearchQuery(searchTerm); // Cập nhật từ khóa tìm kiếm thực tế
    // Reset về trang 1 khi tìm kiếm
    setCurrentPage(1);
  };

  if (loading && !searching) {
    return <div className="loading">Loading coaches...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="coaches-container">
      <h2>Our Coaches</h2>
      
      {/* Search Box */}
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm theo tên, chuyên môn, tiểu sử..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            {searching ? 'Đang tìm...' : 'Tìm kiếm'}
          </button>
        </form>
      </div>
      
      {coaches.length === 0 ? (
        <p className="no-results">No coaches available at the moment.</p>
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
    </div>
  );
}

export default Coaches;