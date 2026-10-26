import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Users, Shield, Wrench, Mail, Calendar, AlertCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Technicians = () => {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  if (user?.role !== 'Manager') {
    return <Navigate to="/vehicles" replace />;
  }

  useEffect(() => {
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

    fetchUsers();
  }, []);

  return (
    <div className="container">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>Staff & Personnel Directory</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Registered managers, technicians, and account access levels
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

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
        ) : (
          <table>
            <thead>
              <tr>
                <th>Personnel Name</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>User ID</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((member) => (
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