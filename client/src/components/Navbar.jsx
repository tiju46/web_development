import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#38bdf8' }}>FleetGuard IS</h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/vehicles">Vehicles</Link>
            <Link to="/work-orders">Work Orders</Link>
            <span style={{ margin: '0 1rem', fontSize: '0.85rem', color: '#94a3b8' }}>
              {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-danger"
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.85rem' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;