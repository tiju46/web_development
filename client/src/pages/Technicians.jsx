import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Users, Shield, Wrench, Mail, AlertCircle, Trash2, Search, UserCheck } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Technicians = () => {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  if (user?.role !== 'Manager') {
    return <Navigate to="/vehicles" replace />;
  }

  const currentUserId = user?.id || user?._id;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/auth/users');
      setUsersList(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch team list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id, targetName) => {
    if (!window.confirm(`Are you sure you want to remove "${targetName}" from the team?`)) {
      return;
    }

    setError('');
    setActionMessage('');

    try {
      const res = await API.delete(`/auth/users/${id}`);
      setActionMessage(res.data?.message || 'User deleted successfully');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };
  const totalStaff = usersList.length;
  const managerCount = usersList.filter((m) => m.role === 'Manager').length;
  const technicianCount = usersList.filter((m) => m.role === 'Technician').length;
  const filteredUsers = usersList.filter((member) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      member.name?.toLowerCase().includes(term) ||
      member.email?.toLowerCase().includes(term) ||
      member._id?.toLowerCase().includes(term);

    const matchesRole = roleFilter === 'ALL' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="container">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>Staff & Personnel Directory</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Registered managers, technicians, and account management
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {actionMessage && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <UserCheck size={16} />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Staff Dashboard */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500, margin: 0 }}>Total Registered Staff</p>
            <Users size={18} style={{ color: '#2563eb' }} />
          </div>
          <h3 style={{ fontSize: '1.85rem', fontWeight: 700, margin: '0.35rem 0 0', color: '#0f172a' }}>
            {totalStaff}
          </h3>
        </div>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #f97316' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500, margin: 0 }}>Fleet Managers</p>
            <Shield size={18} style={{ color: '#f97316' }} />
          </div>
          <h3 style={{ fontSize: '1.85rem', fontWeight: 700, margin: '0.35rem 0 0', color: '#f97316' }}>
            {managerCount}
          </h3>
        </div>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500, margin: 0 }}>Workshop Technicians</p>
            <Wrench size={18} style={{ color: '#10b981' }} />
          </div>
          <h3 style={{ fontSize: '1.85rem', fontWeight: 700, margin: '0.35rem 0 0', color: '#10b981' }}>
            {technicianCount}
          </h3>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', maxWidth: '360px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by name, email, or UserID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.25rem', width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Filter by Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ width: 'auto', padding: '0.45rem 0.8rem', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Roles ({usersList.length})</option>
            <option value="Technician">Technicians ({technicianCount})</option>
            <option value="Manager">Managers ({managerCount})</option>
          </select>
        </div>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            <p>Loading directory...</p>
          </div>
        ) : usersList.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <Users size={40} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
            <p>No registered accounts found.</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
            <p>No team members match "{searchTerm}".</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Personnel Name</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>User ID</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((member) => (
                <tr key={member._id}>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {member.role === 'Manager' ? (
                        <Shield size={16} color="#2563eb" />
                      ) : (
                        <Wrench size={16} color="#10b981" />
                      )}
                      {member.name}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                      <Mail size={14} />
                      {member.email}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        member.role === 'Manager' ? 'badge-orange' : 'badge-green'
                      }`}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                    {member._id}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {String(member._id) !== String(currentUserId) ? (
                      <button
                        onClick={() => handleDeleteUser(member._id, member.name)}
                        className="btn btn-ghost"
                        style={{ padding: '0.35rem 0.6rem', color: '#ef4444', cursor: 'pointer' }}
                        title="Remove user account"
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                        (You)
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

export default Technicians;