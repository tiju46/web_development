import React, { useState } from 'react';
import API from '../api/axios';
import { KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match');
    }

    if (newPassword.length < 6) {
      return setError('New password must be at least 6 characters long');
    }

    try {
      setLoading(true);
      const res = await API.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      setSuccess(res.data.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '2rem' }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ background: '#eff6ff', padding: '0.6rem', borderRadius: '8px', color: '#2563eb' }}>
            <KeyRound size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Change Password</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Update your account access credentials</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              required
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              required
              placeholder="Enter at least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              required
              placeholder="Re-type new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
          >
            {loading ? 'Updating...' : 'Save New Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;