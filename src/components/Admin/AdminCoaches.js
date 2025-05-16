import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

function AdminCoaches() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    specialization: 'Boxing',
    experience: 0,
    bio: '',
    achievements: [],
    certifications: [],
    contactEmail: '',
    phone: '',
    status: 'active',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: ''
    }
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // For handling achievements and certifications as arrays
  const [newAchievement, setNewAchievement] = useState('');
  const [newCertification, setNewCertification] = useState('');

  // Thêm state cho phân trang và tìm kiếm
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('name'); // name, specialization, status

  useEffect(() => {
    fetchCoaches();
  }, [currentPage, searchTerm, searchField]);

  const fetchCoaches = async () => {
    try {
      const response = await axios.get('/api/coaches', {
        params: {
          page: currentPage,
          limit: 2,
          search: searchTerm,
          field: searchField
        }
      });
      setCoaches(response.data.coaches || response.data.data);
      setTotalPages(response.data.totalPages || 1);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coaches:', error);
      toast.error('Error fetching coaches');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCoaches();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (coach) => {
    setSelectedCoach(coach);
    setFormData({
      name: coach.name,
      specialization: coach.specialization,
      experience: coach.experience,
      bio: coach.bio,
      achievements: [...coach.achievements],
      certifications: [...coach.certifications],
      contactEmail: coach.contactEmail || '',
      phone: coach.phone || '',
      status: coach.status,
      socialMedia: {
        facebook: coach.socialMedia?.facebook || '',
        instagram: coach.socialMedia?.instagram || '',
        twitter: coach.socialMedia?.twitter || ''
      }
    });
    setShowEditModal(true);
  };

  const handleView = (coach) => {
    setSelectedCoach(coach);
    setShowViewModal(true);
  };

  const handleDelete = async (coachId) => {
    if (window.confirm('Are you sure you want to delete this coach? This cannot be undone.')) {
      try {
        await axios.delete(`/api/coaches/${coachId}`);
        toast.success('Coach deleted successfully');
        fetchCoaches();
      } catch (error) {
        console.error('Error deleting coach:', error.response?.data || error.message);
        toast.error(error.response?.data?.message || 'Error deleting coach');
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

  const handleAddCoach = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'socialMedia') {
          form.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          value.forEach((item) => form.append(key, item));
        } else {
          form.append(key, value);
        }
      });
      if (imageFile) form.append('profileImage', imageFile);
      const response = await axios.post('/api/coaches', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Coach added successfully');
      setShowAddModal(false);
      resetForm();
      setImageFile(null);
      setImagePreview(null);
      fetchCoaches();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Error adding coach';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleUpdateCoach = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'socialMedia') {
          form.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          value.forEach((item) => form.append(key, item));
        } else {
          form.append(key, value);
        }
      });
      if (imageFile) form.append('profileImage', imageFile);
      const response = await axios.put(`/api/coaches/${selectedCoach._id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Coach updated successfully');
      setShowEditModal(false);
      setImageFile(null);
      setImagePreview(null);
      fetchCoaches();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Error updating coach';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialMedia.')) {
      const socialField = name.split('.')[1];
      setFormData({
        ...formData,
        socialMedia: {
          ...formData.socialMedia,
          [socialField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setFormData({
        ...formData,
        achievements: [...formData.achievements, newAchievement.trim()]
      });
      setNewAchievement('');
    }
  };

  const handleRemoveAchievement = (index) => {
    const updatedAchievements = [...formData.achievements];
    updatedAchievements.splice(index, 1);
    setFormData({
      ...formData,
      achievements: updatedAchievements
    });
  };

  const handleAddCertification = () => {
    if (newCertification.trim()) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, newCertification.trim()]
      });
      setNewCertification('');
    }
  };

  const handleRemoveCertification = (index) => {
    const updatedCertifications = [...formData.certifications];
    updatedCertifications.splice(index, 1);
    setFormData({
      ...formData,
      certifications: updatedCertifications
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specialization: 'Boxing',
      experience: 0,
      bio: '',
      achievements: [],
      certifications: [],
      contactEmail: '',
      phone: '',
      status: 'active',
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: ''
      }
    });
    setNewAchievement('');
    setNewCertification('');
    setImageFile(null);
    setImagePreview(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-coaches">
      <div className="admin-coaches-header">
        <h2>Manage Coaches</h2>
        <div className="search-section">
          <form onSubmit={handleSearch}>
            <select 
              value={searchField} 
              onChange={(e) => setSearchField(e.target.value)}
              className="search-field"
            >
              <option value="name">Tên</option>
              <option value="specialization">Chuyên môn</option>
              <option value="status">Trạng thái</option>
            </select>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm..."
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <i className="fas fa-search"></i> Tìm
            </button>
          </form>
        </div>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>Add New Coach</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Specialization</th>
            <th>Experience</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coaches.map(coach => (
            <tr key={coach._id}>
              <td>{coach._id}</td>
              <td>{coach.name}</td>
              <td>{coach.specialization}</td>
              <td>{coach.experience} years</td>
              <td>{coach.status}</td>
              <td>
                <button className="view-btn" onClick={() => handleView(coach)}>View</button>
                <button className="edit-btn" onClick={() => handleEdit(coach)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(coach._id)}>Delete</button>
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

      {/* Add Coach Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Coach</h3>
            {errorMessage && (
              <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleAddCoach} encType="multipart/form-data">
              <div className="form-group">
                <label>Profile Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && <img src={imagePreview} alt="Preview" style={{width: 120, marginTop: 8}} />}
              </div>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              
              <div className="form-group">
                <label>Specialization</label>
                <select name="specialization" value={formData.specialization} onChange={handleInputChange} required>
                  <option value="Boxing">Boxing</option>
                  <option value="Kickboxing">Kickboxing</option>
                  <option value="MMA">MMA</option>
                  <option value="Muay Thai">Muay Thai</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Experience (years)</label>
                <input type="number" name="experience" value={formData.experience} onChange={handleInputChange} required min="0" />
              </div>
              
              <div className="form-group">
                <label>Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleInputChange} required maxLength="500" />
              </div>
              
              <div className="form-group">
                <label>Achievements</label>
                <div className="array-input">
                  <input 
                    type="text" 
                    value={newAchievement} 
                    onChange={(e) => setNewAchievement(e.target.value)} 
                    placeholder="Enter achievement" 
                  />
                  <button type="button" onClick={handleAddAchievement}>Add</button>
                </div>
                <ul className="array-list">
                  {formData.achievements.map((achievement, index) => (
                    <li key={index}>
                      {achievement}
                      <button type="button" onClick={() => handleRemoveAchievement(index)}>Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="form-group">
                <label>Certifications</label>
                <div className="array-input">
                  <input 
                    type="text" 
                    value={newCertification} 
                    onChange={(e) => setNewCertification(e.target.value)} 
                    placeholder="Enter certification" 
                  />
                  <button type="button" onClick={handleAddCertification}>Add</button>
                </div>
                <ul className="array-list">
                  {formData.certifications.map((certification, index) => (
                    <li key={index}>
                      {certification}
                      <button type="button" onClick={() => handleRemoveCertification(index)}>Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="form-group">
                <label>Contact Email</label>
                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} />
              </div>
              
              <div className="form-group">
                <label>Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on leave">On Leave</option>
                </select>
              </div>
              
              <h4>Social Media</h4>
              <div className="form-group">
                <label>Facebook</label>
                <input type="text" name="socialMedia.facebook" value={formData.socialMedia.facebook} onChange={handleInputChange} />
              </div>
              
              <div className="form-group">
                <label>Instagram</label>
                <input type="text" name="socialMedia.instagram" value={formData.socialMedia.instagram} onChange={handleInputChange} />
              </div>
              
              <div className="form-group">
                <label>Twitter</label>
                <input type="text" name="socialMedia.twitter" value={formData.socialMedia.twitter} onChange={handleInputChange} />
              </div>
              
              <button type="submit" className="add-btn">Add Coach</button>
              <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Coach Modal */}
      {showEditModal && selectedCoach && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Coach</h3>
            {errorMessage && (
              <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleUpdateCoach} encType="multipart/form-data">
              <div className="form-group">
                <label>Profile Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && <img src={imagePreview} alt="Preview" style={{width: 120, marginTop: 8}} />}
                {!imagePreview && selectedCoach.profileImage && (
                  <img 
                    src={selectedCoach.profileImage.startsWith('http') ? selectedCoach.profileImage : `http://localhost:5000/uploads/${selectedCoach.profileImage}`} 
                    alt="Current" 
                    style={{width: 120, marginTop: 8}} 
                  />
                )}
              </div>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              
              <div className="form-group">
                <label>Specialization</label>
                <select name="specialization" value={formData.specialization} onChange={handleInputChange} required>
                  <option value="Boxing">Boxing</option>
                  <option value="Kickboxing">Kickboxing</option>
                  <option value="MMA">MMA</option>
                  <option value="Muay Thai">Muay Thai</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Experience (years)</label>
                <input type="number" name="experience" value={formData.experience} onChange={handleInputChange} required min="0" />
              </div>
              
              <div className="form-group">
                <label>Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleInputChange} required maxLength="500" />
              </div>
              
              <div className="form-group">
                <label>Achievements</label>
                <div className="array-input">
                  <input 
                    type="text" 
                    value={newAchievement} 
                    onChange={(e) => setNewAchievement(e.target.value)} 
                    placeholder="Enter achievement" 
                  />
                  <button type="button" onClick={handleAddAchievement}>Add</button>
                </div>
                <ul className="array-list">
                  {formData.achievements.map((achievement, index) => (
                    <li key={index}>
                      {achievement}
                      <button type="button" onClick={() => handleRemoveAchievement(index)}>Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="form-group">
                <label>Certifications</label>
                <div className="array-input">
                  <input 
                    type="text" 
                    value={newCertification} 
                    onChange={(e) => setNewCertification(e.target.value)} 
                    placeholder="Enter certification" 
                  />
                  <button type="button" onClick={handleAddCertification}>Add</button>
                </div>
                <ul className="array-list">
                  {formData.certifications.map((certification, index) => (
                    <li key={index}>
                      {certification}
                      <button type="button" onClick={() => handleRemoveCertification(index)}>Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="form-group">
                <label>Contact Email</label>
                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} />
              </div>
              
              <div className="form-group">
                <label>Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on leave">On Leave</option>
                </select>
              </div>
              
              <h4>Social Media</h4>
              <div className="form-group">
                <label>Facebook</label>
                <input type="text" name="socialMedia.facebook" value={formData.socialMedia.facebook} onChange={handleInputChange} />
              </div>
              
              <div className="form-group">
                <label>Instagram</label>
                <input type="text" name="socialMedia.instagram" value={formData.socialMedia.instagram} onChange={handleInputChange} />
              </div>
              
              <div className="form-group">
                <label>Twitter</label>
                <input type="text" name="socialMedia.twitter" value={formData.socialMedia.twitter} onChange={handleInputChange} />
              </div>
              
              <button type="submit" className="update-btn">Update Coach</button>
              <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* View Coach Modal */}
      {showViewModal && selectedCoach && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Coach Details</h3>
            <div className="coach-details">
              <p><strong>Name:</strong> {selectedCoach.name}</p>
              <p><strong>Specialization:</strong> {selectedCoach.specialization}</p>
              <p><strong>Experience:</strong> {selectedCoach.experience} years</p>
              <p><strong>Bio:</strong> {selectedCoach.bio}</p>
              
              {selectedCoach.achievements && selectedCoach.achievements.length > 0 && (
                <div>
                  <p><strong>Achievements:</strong></p>
                  <ul>
                    {selectedCoach.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedCoach.certifications && selectedCoach.certifications.length > 0 && (
                <div>
                  <p><strong>Certifications:</strong></p>
                  <ul>
                    {selectedCoach.certifications.map((certification, index) => (
                      <li key={index}>{certification}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <p><strong>Contact Email:</strong> {selectedCoach.contactEmail || 'Not provided'}</p>
              <p><strong>Phone:</strong> {selectedCoach.phone || 'Not provided'}</p>
              <p><strong>Status:</strong> {selectedCoach.status}</p>
              
              <h4>Social Media</h4>
              <p><strong>Facebook:</strong> {selectedCoach.socialMedia?.facebook || 'Not provided'}</p>
              <p><strong>Instagram:</strong> {selectedCoach.socialMedia?.instagram || 'Not provided'}</p>
              <p><strong>Twitter:</strong> {selectedCoach.socialMedia?.twitter || 'Not provided'}</p>
            </div>
            <button className="close-btn" onClick={() => setShowViewModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCoaches; 