import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { toast } from 'react-toastify';
import '../../styles/AdminClasses.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function AdminClasses() {
  const [classes, setClasses] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    coach: '',
    coachName: '',
    schedule: '',
    maxCapacity: 0,
    description: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('name');

  useEffect(() => {
    fetchClasses();
    fetchCoaches();
  }, [currentPage, searchTerm, searchField]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`/api/classes/admin/list?page=${currentPage}&search=${searchTerm}&field=${searchField}`);
      setClasses(response.data.classes);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching classes');
      setLoading(false);
    }
  };

  const fetchCoaches = async () => {
    try {
      const response = await axios.get('/api/coaches');
      setCoaches(response.data.data);
    } catch (error) {
      toast.error('Error fetching coaches');
    }
  };

  const handleEdit = (classItem) => {
    setSelectedClass(classItem);
    setFormData({
      name: classItem.name,
      coach: classItem.coach || '',
      coachName: classItem.coachName || '',
      schedule: classItem.schedule,
      maxCapacity: classItem.maxCapacity,
      description: classItem.description
    });
    setShowEditModal(true);
  };

  const handleDelete = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await axios.delete(`/api/classes/${classId}`);
        toast.success('Class deleted successfully');
        fetchClasses();
      } catch (error) {
        toast.error('Error deleting class');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, value));
      if (imageFile) form.append('image', imageFile);
      const response = await axios.post('/api/classes', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Class added successfully');
      setShowAddModal(false);
      setFormData({ name: '', coach: '', coachName: '', schedule: '', maxCapacity: 0, description: '' });
      setImageFile(null);
      setImagePreview(null);
      fetchClasses();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Error adding class';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleUpdateClass = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, value));
      if (imageFile) form.append('image', imageFile);
      const response = await axios.put(`/api/classes/${selectedClass._id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Class updated successfully');
      setShowEditModal(false);
      setImageFile(null);
      setImagePreview(null);
      fetchClasses();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Error updating class';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'coach') {
      const selectedCoach = coaches.find(c => c._id === value);
      setFormData({
        ...formData,
        coach: value,
        coachName: selectedCoach ? selectedCoach.name : ''
      });
      console.log(`Selected coach: ${selectedCoach ? selectedCoach.name : 'None'} (${value})`);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchClasses();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-classes">
      <div className="admin-classes-header">
        <h2>Manage Classes</h2>
        <div className="search-section">
          <form onSubmit={handleSearch}>
            <select 
              value={searchField} 
              onChange={(e) => setSearchField(e.target.value)}
              className="search-field"
            >
              <option value="name">Tên lớp</option>
              <option value="coach">Huấn luyện viên</option>
              <option value="schedule">Lịch học</option>
            </select>
            <div className="search-input-container">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm..."
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </form>
        </div>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>Add New Class</button>
      </div>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Class Name</th>
            <th>Coach</th>
            <th>Schedule</th>
            <th>Members</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map(classItem => (
            <tr key={classItem._id}>
              <td>{classItem._id}</td>
              <td>{classItem.name}</td>
              <td>{classItem.coachName}</td>
              <td>{classItem.schedule}</td>
              <td>{classItem.currentMembers.length}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(classItem)}>Edit</button>
                <button className="members-btn" onClick={() => {
                  setSelectedClass(classItem);
                  setShowMemberModal(true);
                }}>Manage Members</button>
                <button className="delete-btn" onClick={() => handleDelete(classItem._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Class</h3>
            {errorMessage && (
              <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleAddClass} encType="multipart/form-data">
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Coach</label>
                <select name="coach" value={formData.coach} onChange={handleInputChange} required>
                  <option value="">Select a Coach</option>
                  {coaches.map(coach => (
                    <option key={coach._id} value={coach._id}>
                      {coach.name} - {coach.specialization}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Schedule</label>
                <input type="text" name="schedule" value={formData.schedule} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Max Capacity</label>
                <input type="number" name="maxCapacity" value={formData.maxCapacity} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && <img src={imagePreview} alt="Preview" style={{width: 120, marginTop: 8}} />}
              </div>
              <button type="submit" className="add-btn">Add Class</button>
              <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Class</h3>
            {errorMessage && (
              <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleUpdateClass} encType="multipart/form-data">
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Coach</label>
                <select name="coach" value={formData.coach} onChange={handleInputChange} required>
                  <option value="">Select a Coach</option>
                  {coaches.map(coach => (
                    <option key={coach._id} value={coach._id}>
                      {coach.name} - {coach.specialization}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Schedule</label>
                <input type="text" name="schedule" value={formData.schedule} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Max Capacity</label>
                <input type="number" name="maxCapacity" value={formData.maxCapacity} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && <img src={imagePreview} alt="Preview" style={{width: 120, marginTop: 8}} />}
              </div>
              <button type="submit" className="update-btn">Update Class</button>
              <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Member Management Modal */}
      {showMemberModal && selectedClass && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Manage Members - {selectedClass.name}</h3>
            <div className="member-list">
              <h4>Current Members</h4>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedClass.currentMembers.map(member => (
                    <tr key={member._id}>
                      <td>{member.name}</td>
                      <td>{member.email}</td>
                      <td>
                        <button 
                          className="delete-btn"
                          onClick={async () => {
                            try {
                              await axios.delete(`/api/classes/${selectedClass._id}/members/${member._id}`);
                              toast.success('Member removed successfully');
                              fetchClasses();
                            } catch (error) {
                              toast.error('Error removing member');
                            }
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="close-btn" onClick={() => setShowMemberModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminClasses;