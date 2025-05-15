import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Classes.css';
import axiosInstance from '../config/axios';
import { jwtDecode } from 'jwt-decode';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Lưu trữ từ khóa tìm kiếm thực tế
  const [searching, setSearching] = useState(false);
  const limit = 3; // số item trên mỗi trang
  const [selectedClass, setSelectedClass] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    phone: '',
    age: '',
    experience: 'beginner',
    additionalInfo: ''
  });
  const [registering, setRegistering] = useState(false);
  const [coachNameModal, setCoachNameModal] = useState('');
  const prevClassIdRef = useRef(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms sau khi ngừng gõ
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch danh sách lớp học khi trang hoặc searchQuery thay đổi
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        let url = `http://localhost:5000/api/classes?page=${currentPage}&limit=${limit}`;
        
        // Thêm từ khóa tìm kiếm vào URL nếu có
        if (searchQuery.trim()) {
          url += `&search=${searchQuery.trim()}`;
        }
        
        const res = await axios.get(url);
        console.log('API response:', res.data);
        
        if (res.data && Array.isArray(res.data.classes)) {
          setClasses(res.data.classes);
          setTotalItems(res.data.total);
          setTotalPages(Math.ceil(res.data.total / limit));
        } else {
          setClasses([]);
          setError('Invalid data format.');
          console.error('Data is not an array:', res.data);
        }
      } catch (err) {
        setError('Unable to load class list.');
        console.error('Error fetching classes:', err);
      } finally {
        setLoading(false);
        setSearching(false);
      }
    };

    fetchClasses();
  }, [currentPage, searchQuery]);

  const handleClassSelect = async (cls) => {
    setSelectedClass(cls);
    setShowRegistrationForm(false);
    if (cls.coachName) {
      setCoachNameModal(cls.coachName);
    } else if (cls.coach) {
      if (prevClassIdRef.current !== cls._id) {
        try {
          const res = await axiosInstance.get(`/api/coaches/${cls.coach}`);
          setCoachNameModal(res.data.data?.name || cls.coach);
          prevClassIdRef.current = cls._id;
        } catch (err) {
          setCoachNameModal(cls.coach);
        }
      }
    } else {
      setCoachNameModal('Updating');
    }
  };

  const closeDetails = () => {
    setSelectedClass(null);
    setShowRegistrationForm(false);
  };

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShowRegistrationForm = () => {
    if (!isLoggedIn) {
      toast.error('You need to login to register for a class!');
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
      await axiosInstance.post('/api/class-registrations', {
        class: selectedClass._id,
        user: userId,
        name: registrationData.fullName,
        phone: registrationData.phone,
        age: registrationData.age,
        experience: registrationData.experience,
        note: registrationData.additionalInfo
      });
      toast.success(`Successfully registered for class ${selectedClass.name}!`);
      setShowRegistrationForm(false);
      setRegistrationData({
        fullName: '',
        phone: '',
        age: '',
        experience: 'beginner',
        additionalInfo: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setSearching(true);
    setSearchQuery(searchTerm); // Cập nhật từ khóa tìm kiếm thực tế
    // Reset về trang 1 khi tìm kiếm
    setCurrentPage(1);
  };

  if (loading && !searching) return <div className="loading">Loading class list...</div>;
  if (error) return <div className="error-message">{error}</div>;

  // Mock data khi chưa có dữ liệu thật
  const mockClasses = [
    {
      id: 1,
      name: 'Boxing Cơ Bản',
      coach: 'Nguyễn Văn A',
      schedule: 'Thứ 2, 4, 6 (18:00 - 19:30)',
      image: 'https://via.placeholder.com/300x200?text=Boxing+Basic',
      description: 'Lớp học dành cho người mới bắt đầu, tập trung vào các kỹ thuật cơ bản.',
      level: 'Cơ bản',
      capacity: 20,
      members: []
    },
    {
      id: 2,
      name: 'Boxing Nâng Cao',
      coach: 'Trần Văn B',
      schedule: 'Thứ 3, 5, 7 (19:00 - 20:30)',
      image: 'https://via.placeholder.com/300x200?text=Boxing+Advanced',
      description: 'Lớp học cho người đã có kinh nghiệm, tập trung vào kỹ thuật nâng cao và chiến thuật.',
      level: 'Nâng cao',
      capacity: 15,
      members: []
    },
    {
      id: 3,
      name: 'Sparring',
      coach: 'Lê Văn C',
      schedule: 'Thứ 7, Chủ Nhật (9:00 - 11:00)',
      image: 'https://via.placeholder.com/300x200?text=Sparring',
      description: 'Lớp tập đấu thực hành, chỉ dành cho học viên có kinh nghiệm.',
      level: 'Chuyên nghiệp',
      capacity: 10,
      members: []
    }
  ];

  // Sử dụng dữ liệu thật hoặc dữ liệu mẫu nếu chưa có
  const displayClasses = classes.length > 0 ? classes : mockClasses;

  return (
    <div className="classes-container">
      <div className="page-header">
        <h1>Boxing Classes</h1>
        <p>Discover classes designed for all levels</p>
      </div>

      {/* Search Box */}
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm theo tên, huấn luyện viên, mô tả, lịch học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            {searching ? 'Đang tìm...' : 'Tìm kiếm'}
          </button>
        </form>
      </div>

      <div className="classes-grid">
        {displayClasses.map((cls) => (
          <div key={cls._id || cls.id} className="class-card" onClick={() => handleClassSelect(cls)}>
            <div className="class-image">
              <img 
                src={cls.image ? 
                  (cls.image.startsWith('http') ? cls.image : `http://localhost:5000/uploads/${cls.image}`) 
                  : 'https://via.placeholder.com/300x200?text=Boxing+Class'} 
                alt={cls.name} 
              />
            </div>
            <div className="class-info">
              <h3>{cls.name}</h3>
              <p className="instructor">Coach: {cls.coachName || coachNameModal}</p>
              <p className="schedule">{cls.schedule || 'Contact for schedule'}</p>
              <button className="details-btn">View details</button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {!loading && classes.length === 0 && (
        <div className="no-results">
          <p>No classes found. Please try another search term.</p>
        </div>
      )}

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Trước
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Sau
          </button>
        </div>
      )}

      {/* Modal chi tiết lớp học */}
      {selectedClass && (
        <div className="class-details-modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeDetails}>&times;</span>
            
            {!showRegistrationForm && (
              <>
                <h2>{selectedClass.name}</h2>
                <div className="detail-row">
                  <strong>Coach:</strong> {coachNameModal}
                </div>
                <div className="detail-row">
                  <strong>Schedule:</strong> {selectedClass.schedule || 'Contact for schedule'}
                </div>
                <div className="detail-row">
                  <strong>Description:</strong> {selectedClass.description || 'No detailed description.'}
                </div>
                <div className="detail-row">
                  <strong>Members:</strong> {selectedClass.currentMembers?.length || 0} / {selectedClass.maxCapacity || 'Unlimited'}
                </div>
                <div className="detail-row">
                  <strong>Level:</strong> {selectedClass.level || 'All levels'}
                </div>
                {(selectedClass.currentMembers?.length >= selectedClass.maxCapacity) ? (
                  <div style={{color: 'red', marginTop: '1rem', fontWeight: 600}}>Class is full</div>
                ) : (
                  <button className="join-btn" onClick={handleShowRegistrationForm}>
                    {isLoggedIn ? 'Register' : 'Login to register'}
                  </button>
                )}
              </>
            )}

            {/* Form đăng ký */}
            {showRegistrationForm && isLoggedIn && (
              <div className="registration-form">
                <h2>Register for class: {selectedClass.name}</h2>
                <form onSubmit={handleSubmitRegistration}>
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
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
                    <label htmlFor="phone">Phone Number</label>
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
                    <label htmlFor="age">Age</label>
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
                  <label htmlFor="experience">Experience</label>
                  <select 
                    id="experience" 
                    name="experience" 
                    value={registrationData.experience} 
                    onChange={handleRegistrationChange}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="additionalInfo">Additional Info (optional)</label>
                    <textarea 
                      id="additionalInfo" 
                      name="additionalInfo" 
                      value={registrationData.additionalInfo} 
                      onChange={handleRegistrationChange} 
                      rows="3"
                    ></textarea>
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="cancel-btn" 
                      onClick={() => setShowRegistrationForm(false)}
                    >
                      Back
                    </button>
                    <button 
                      type="submit" 
                      className="submit-btn" 
                      disabled={registering}
                    >
                      {registering ? 'Registering...' : 'Submit'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes; 