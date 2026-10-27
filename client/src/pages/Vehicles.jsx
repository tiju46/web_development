import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Truck, Plus, Trash2, Edit2, AlertCircle, RefreshCw, X, Check } from 'lucide-react';

const Vehicles = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    regNumber: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: '',
    status: 'Roadworthy',
  };
  const [formData, setFormData] = useState(initialForm);

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

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialForm);
    setShowForm(true);
  };

  const handleOpenEdit = (vehicle) => {
    setEditingId(vehicle._id);
    setFormData({
      regNumber: vehicle.regNumber,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      mileage: vehicle.mileage,
      status: vehicle.status,
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/vehicles/${editingId}`, formData);
      } else {
        await API.post('/vehicles', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData(initialForm);
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save vehicle details');
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to remove this vehicle from the fleet?')) return;
    try {
      await API.delete(`/vehicles/${id}`);
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete vehicle');
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
            Live roadworthiness monitoring, mileage logging, and vehicle records
          </p>
        </div>

        {user?.role === 'Manager' && (
          <button onClick={handleOpenCreate} className="btn btn-primary">
            <Plus size={16} />
            <span>Add Vehicle</span>
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      
      {showForm && (
        <div className="card" style={{ borderLeft: `4px solid ${editingId ? '#10b981' : '#2563eb'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>{editingId ? 'Edit Vehicle Details' : 'Register New Vehicle'}</h3>
            <button
              onClick={() => { setShowForm(false); setEditingId(null); }}
              className="btn btn-ghost"
              style={{ padding: '0.25rem' }}
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
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
                placeholder="e.g. Ford / Toyota"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Model</label>
              <input
                type="text"
                required
                placeholder="e.g. Transit / Innova"
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
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Roadworthy">Roadworthy</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Grounded">Grounded</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => { setShowForm(false); setEditingId(null); }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Check size={16} />
                <span>{editingId ? 'Update Vehicle' : 'Save to Fleet'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Fleet Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw size={20} className="spin" style={{ marginBottom: '0.5rem' }} />
            <p>Loading fleet inventory...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <Truck size={40} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
            <p>No vehicles registered in the fleet yet.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Registration</th>
                <th>Make & Model</th>
                <th>Year</th>
                <th>Mileage</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v._id}>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{v.regNumber}</td>
                  <td>{v.make} {v.model}</td>
                  <td>{v.year}</td>
                  <td>{Number(v.mileage).toLocaleString()} km</td>
                  <td>{getStatusBadge(v.status)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleOpenEdit(v)}
                        className="btn btn-ghost"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', color: '#2563eb' }}
                        title="Edit Vehicle Details"
                      >
                        <Edit2 size={15} />
                      </button>

                      {user?.role === 'Manager' && (
                        <button
                          onClick={() => handleDeleteVehicle(v._id)}
                          className="btn btn-ghost"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', color: '#ef4444' }}
                          title="Remove vehicle"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Vehicles;