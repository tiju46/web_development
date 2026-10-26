import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Vehicles from './pages/Vehicles';
import WorkOrders from './pages/WorkOrders';
import Technicians from './pages/Technicians';


const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/vehicles" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;