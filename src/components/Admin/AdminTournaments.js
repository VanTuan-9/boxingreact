import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

function AdminTournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    maxParticipants: 0,
    registrationDeadline: '',
    description: '',
    rules: [''],
    prizes: [{ position: 1, prize: '' }]
  });

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await axios.get('/api/tournaments/admin/list');
      setTournaments(response.data.tournaments);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching tournaments');
      setLoading(false);
    }
  };

  const handleEdit = (tournament) => {
    setSelectedTournament(tournament);
    setFormData({
      name: tournament.name,
      date: new Date(tournament.date).toISOString().split('T')[0],
      location: tournament.location,
      maxParticipants: tournament.maxParticipants,
      registrationDeadline: new Date(tournament.registrationDeadline).toISOString().split('T')[0],
      description: tournament.description,
      rules: tournament.rules,
      prizes: tournament.prizes
    });
    setShowEditModal(true);
  };

  const handleDelete = async (tournamentId) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      try {
        await axios.delete(`/api/tournaments/${tournamentId}`);
        toast.success('Tournament deleted successfully');
        fetchTournaments();
      } catch (error) {
        toast.error('Error deleting tournament');
      }
    }
  };

  const handleAddTournament = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tournaments', formData);
      toast.success('Tournament added successfully');
      setShowAddModal(false);
      fetchTournaments();
    } catch (error) {
      toast.error('Error adding tournament');
    }
  };

  const handleUpdateTournament = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/tournaments/${selectedTournament._id}`, formData);
      toast.success('Tournament updated successfully');
      setShowEditModal(false);
      fetchTournaments();
    } catch (error) {
      toast.error('Error updating tournament');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRuleChange = (index, value) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData({ ...formData, rules: newRules });
  };

  const handlePrizeChange = (index, field, value) => {
    const newPrizes = [...formData.prizes];
    newPrizes[index] = { ...newPrizes[index], [field]: value };
    setFormData({ ...formData, prizes: newPrizes });
  };

  const addRule = () => {
    setFormData({
      ...formData,
      rules: [...formData.rules, '']
    });
  };

  const addPrize = () => {
    setFormData({
      ...formData,
      prizes: [...formData.prizes, { position: formData.prizes.length + 1, prize: '' }]
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-tournaments">
      <h2>Manage Tournaments</h2>
      <button className="add-btn" onClick={() => setShowAddModal(true)}>Add New Tournament</button>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tournament Name</th>
            <th>Date</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tournaments.map(tournament => (
            <tr key={tournament._id}>
              <td>{tournament._id}</td>
              <td>{tournament.name}</td>
              <td>{new Date(tournament.date).toLocaleDateString()}</td>
              <td>{tournament.location}</td>
              <td>{tournament.status}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(tournament)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(tournament._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Tournament Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Tournament</h3>
            <form onSubmit={handleAddTournament}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Max Participants</label>
                <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Registration Deadline</label>
                <input type="date" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Rules</label>
                {formData.rules.map((rule, index) => (
                  <input
                    key={index}
                    type="text"
                    value={rule}
                    onChange={(e) => handleRuleChange(index, e.target.value)}
                    placeholder={`Rule ${index + 1}`}
                  />
                ))}
                <button type="button" onClick={addRule}>Add Rule</button>
              </div>
              <div className="form-group">
                <label>Prizes</label>
                {formData.prizes.map((prize, index) => (
                  <div key={index}>
                    <input
                      type="number"
                      value={prize.position}
                      onChange={(e) => handlePrizeChange(index, 'position', e.target.value)}
                      placeholder="Position"
                    />
                    <input
                      type="text"
                      value={prize.prize}
                      onChange={(e) => handlePrizeChange(index, 'prize', e.target.value)}
                      placeholder="Prize"
                    />
                  </div>
                ))}
                <button type="button" onClick={addPrize}>Add Prize</button>
              </div>
              <button type="submit" className="add-btn">Add Tournament</button>
              <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Tournament Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Tournament</h3>
            <form onSubmit={handleUpdateTournament}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Max Participants</label>
                <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Registration Deadline</label>
                <input type="date" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Rules</label>
                {formData.rules.map((rule, index) => (
                  <input
                    key={index}
                    type="text"
                    value={rule}
                    onChange={(e) => handleRuleChange(index, e.target.value)}
                    placeholder={`Rule ${index + 1}`}
                  />
                ))}
                <button type="button" onClick={addRule}>Add Rule</button>
              </div>
              <div className="form-group">
                <label>Prizes</label>
                {formData.prizes.map((prize, index) => (
                  <div key={index}>
                    <input
                      type="number"
                      value={prize.position}
                      onChange={(e) => handlePrizeChange(index, 'position', e.target.value)}
                      placeholder="Position"
                    />
                    <input
                      type="text"
                      value={prize.prize}
                      onChange={(e) => handlePrizeChange(index, 'prize', e.target.value)}
                      placeholder="Prize"
                    />
                  </div>
                ))}
                <button type="button" onClick={addPrize}>Add Prize</button>
              </div>
              <button type="submit" className="update-btn">Update Tournament</button>
              <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTournaments;