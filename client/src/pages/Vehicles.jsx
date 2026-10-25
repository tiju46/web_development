import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Truck, Plus, Trash2, Edit3, AlertCircle, RefreshCw } from 'lucide-react';

const Vehicles = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // New vehicle form state (Manager only)
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    regNumber: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: '',
    status: 'Roadworthy',
  });

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/vehicles');
      setVehicles(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load fleet vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleCreateVehicle = async (e) => {
    e.preventDefault();
    try {
      await API.post('/vehicles', formData);
      setFormData({
        regNumber: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        mileage: '',
        status: 'Roadworthy',
      });
      setShowAddForm(false);
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register vehicle');
    }
  };

  const handleStatusUpdate = async (id, currentStatus) => {
    const nextStatus =
      currentStatus === 'Roadworthy'
        ? 'Under Maintenance'
        : currentStatus === 'Under Maintenance'
        ? 'Grounded'
        : 'Roadworthy';

    try {
      await API.put(`/vehicles/${id}`, { status: nextStatus });
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update vehicle status');
    }
  };

 

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Roadworthy':
        return <span className="badge badge-green">Roadworthy</span>;
      case 'Under Maintenance':
        return <span className="badge badge-orange">Under Maintenance</span>;
      case 'Grounded':
        return <span className="badge badge-red">Grounded</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>Fleet Inventory</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Live roadworthiness monitoring and vehicle records
          </p>
        </div>

        {user?.role === 'Manager' && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>{showAddForm ? 'Close Form' : 'Add Vehicle'}</span>
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Manager Form to Add New Vehicle */}
      {showAddForm && user?.role === 'Manager' && (
        <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.15rem' }}>Register New Vehicle</h3>
          <form onSubmit={handleCreateVehicle} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>Registration Number</label>
              <input
                type="text"
                required
                placeholder="e.g. 181-D-12345"
                value={formData.regNumber}
                onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Make</label>
              <input
                type="text"
                required
                placeholder="e.g. Ford / Scania"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Model</label>
              <input
                type="text"
                required
                placeholder="e.g. Transit"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Year</label>
              <input
                type="number"
                required
                min="1990"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Mileage (km)</label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 45000"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Initial Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Roadworthy">Roadworthy</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Grounded">Grounded</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">
                Save to Fleet
              </button>
            </div>
          </form>
        </div>
      )}


export default Vehicles;