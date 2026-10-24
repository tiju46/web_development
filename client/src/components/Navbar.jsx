import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Truck, LogOut, Wrench, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <Truck size={18} />
        </div>
        <span>FleetGuard IS</span>
      </div>

      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {user ? (
          <>
            <NavLink to="/vehicles" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <Truck size={15} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
              Vehicles
            </NavLink>
            <NavLink to="/work-orders" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <Wrench size={15} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
              Work Orders
            </NavLink>

            <div className="user-badge">
              <ShieldCheck size={14} color="#38bdf8" />
              <span>{user.name}</span>
              <span style={{ opacity: 0.6 }}>•</span>
              <span style={{ color: user.role === 'Manager' ? '#fbbf24' : '#a3e635' }}>
                {user.role}
              </span>
            </div>

            <button onClick={handleLogout} className="btn btn-ghost" style={{ color: '#ef4444' }} title="Sign Out">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <NavLink 
              to="/login" 
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}
            >
              Login
            </NavLink>
            <NavLink 
              to="/register" 
              className="btn btn-primary"
              style={{ 
                textDecoration: 'none', 
                fontSize: '0.85rem', 
                padding: '0.45rem 1rem', 
                borderRadius: '6px' 
              }}
            >
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;