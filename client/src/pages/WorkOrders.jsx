import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Wrench, Plus, CheckCircle, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

const WorkOrders = () => {
  const { user } = useAuth();
  const [workOrders, setWorkOrders] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    vehicleId: '',
    title: '',
    description: '',
    cost: '',
    currency: 'EUR',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [ordersRes, vehiclesRes] = await Promise.all([
        API.get('/work-orders'),
        API.get('/vehicles'),
      ]);
      setWorkOrders(ordersRes.data);
      setVehicles(vehiclesRes.data);
      if (vehiclesRes.data.length > 0 && !formData.vehicleId) {
        setFormData((prev) => ({ ...prev, vehicleId: vehiclesRes.data[0]._id }));
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load maintenance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      await API.post('/work-orders', formData);
      setFormData({
        vehicleId: vehicles[0]?._id || '',
        title: '',
        description: '',
        cost: '',
        currency: 'EUR',
      });
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to file work order');
    }
  };

  const handleStatusUpdate = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Pending' ? 'In Progress' : 'Completed';
    try {
      await API.put(`/work-orders/${id}`, { status: nextStatus });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to advance ticket status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="badge badge-green">Completed</span>;
      case 'In Progress':
        return <span className="badge badge-orange">In Progress</span>;
      default:
        return <span className="badge badge-red">Pending</span>;
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>Maintenance & Work Orders</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Service requests, repair logs, and FX normalized maintenance costs
          </p>
        </div>

        {user?.role === 'Manager' && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>{showAddForm ? 'Close Form' : 'New Work Order'}</span>
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}


      {showAddForm && user?.role === 'Manager' && (
        <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.15rem' }}>Create Maintenance Ticket</h3>
          <form onSubmit={handleCreateOrder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>Target Vehicle</label>
              <select
                required
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
              >
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.regNumber} ({v.make} {v.model})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Issue Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Brake pad replacement"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Estimated Cost</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="e.g. 250"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Detailed Description</label>
              <textarea
                rows="3"
                required
                placeholder="Provide maintenance details, parts required, or diagnostic notes..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.925rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary">
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            <p>Loading work orders...</p>
          </div>
        ) : workOrders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <Wrench size={40} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
            <p>No active maintenance tickets logged.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Issue / Details</th>
                <th>Original Cost</th>
                <th>Normalized (EUR)</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Update</th>
              </tr>
            </thead>
            <tbody>
              {workOrders.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontWeight: 600 }}>
                    {order.vehicle?.regNumber || 'Unknown Vehicle'}
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400 }}>
                      {order.vehicle?.make} {order.vehicle?.model}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{order.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{order.description}</div>
                  </td>
                  <td>
                    {order.cost} {order.currency}
                  </td>
                  <td style={{ fontWeight: 600, color: '#0284c7' }}>
                    €{Number(order.costInEUR || order.cost).toFixed(2)}
                  </td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td style={{ textAlign: 'right' }}>
                    {order.status !== 'Completed' ? (
                      <button
                        onClick={() => handleStatusUpdate(order._id, order.status)}
                        className="btn btn-ghost"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                        title="Advance progress"
                      >
                        <span>{order.status === 'Pending' ? 'Start' : 'Complete'}</span>
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={14} /> Closed
                      </span>
                    )}
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

export default WorkOrders;