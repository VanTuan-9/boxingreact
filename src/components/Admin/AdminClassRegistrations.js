import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

function AdminClassRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReg, setSelectedReg] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/class-registrations');
      setRegistrations(res.data.data);
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-classes">
      <h2>Manage Class Registrations</h2>
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