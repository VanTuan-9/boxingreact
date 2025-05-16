import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { toast } from 'react-toastify';
import './AdminStyles.css';

function AdminClassRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReg, setSelectedReg] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('name');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, [currentPage, limit, searchTerm, statusFilter]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/class-registrations', {
        params: {
          page: currentPage,
          limit: limit,
          search: searchTerm,
          status: statusFilter
        }
      });
      setRegistrations(res.data.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load registration list');
    }
    setLoading(false);
  };

  const handleAccept = async (id) => {
    try {
      await axios.put(`/api/class-registrations/${id}/accept`);
      toast.success('Registration accepted!');
      fetchRegistrations();
    } catch (err) {
      toast.error('Accept failed!');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`/api/class-registrations/${id}/reject`);
      toast.success('Registration rejected!');
      fetchRegistrations();
    } catch (err) {
      toast.error('Reject failed!');
    }
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRegistrations();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-classes">
      <h2>Manage Class Registrations</h2>
      
      {/* Thêm phần tìm kiếm - với CSS */}
      <div className="search-filter-container">
        <form onSubmit={handleSearch} className="search-form">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Class</th>
            <th>Full Name</th>
            <th>Phone</th>
            <th>Age</th>
            <th>Experience</th>
            <th>Status</th>
            <th>Registration Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map(reg => (
            <tr key={reg._id}>
              <td>{reg._id}</td>
              <td>{reg.class?.name || '-'}</td>
              <td>{reg.name}</td>
              <td>{reg.phone}</td>
              <td>{reg.age || '-'}</td>
              <td>{reg.experience || '-'}</td>
              <td>
                {reg.status === 'pending' && <span style={{color: 'orange'}}>Pending</span>}
                {reg.status === 'accepted' && <span style={{color: 'green'}}>Accepted</span>}
                {reg.status === 'rejected' && <span style={{color: 'red'}}>Rejected</span>}
              </td>
              <td>{new Date(reg.createdAt).toLocaleString()}</td>
              <td>
                <button className="members-btn" onClick={() => {setSelectedReg(reg); setShowDetailModal(true);}}>Details</button>
                {reg.status === 'pending' && (
                  <>
                    <button className="edit-btn" onClick={() => handleAccept(reg._id)}>Accept</button>
                    <button className="delete-btn" onClick={() => handleReject(reg._id)}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Phân trang - với CSS */}
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

      {/* Modal chi tiết đăng ký */}
      {showDetailModal && selectedReg && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Registration Details</h3>
            <div><b>Class:</b> {selectedReg.class?.name || '-'}</div>
            <div><b>Full Name:</b> {selectedReg.name}</div>
            <div><b>Phone:</b> {selectedReg.phone}</div>
            <div><b>Age:</b> {selectedReg.age || '-'}</div>
            <div><b>Experience:</b> {selectedReg.experience || '-'}</div>
            <div><b>Note:</b> {selectedReg.note || '-'}</div>
            <div><b>Status:</b> {selectedReg.status}</div>
            <div><b>Registration Date:</b> {new Date(selectedReg.createdAt).toLocaleString()}</div>
            <button className="cancel-btn" onClick={() => setShowDetailModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminClassRegistrations; 