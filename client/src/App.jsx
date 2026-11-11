import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Vehicles from './pages/Vehicles';
import WorkOrders from './pages/WorkOrders';
import Technicians from './pages/Technicians';
import ChangePassword from './pages/ChangePassword';
import { useIdleTimer } from './hooks/useIdleTimer';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const PublicOnlyRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/vehicles" replace /> : children;
};

const AppLayout = () => {
  useIdleTimer(15); // Set idle timeout to 15 minutes
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/vehicles" replace />} />
        
        {/* Login and Register */}
        <Route 
          path="/login" 
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          } 
        />

        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <Vehicles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/work-orders"
          element={
            <ProtectedRoute>
              <WorkOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technicians"
          element={
            <ProtectedRoute>
              <Technicians />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/vehicles" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;