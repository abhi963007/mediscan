import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import Registration from './pages/dashboard/Registration';
import Scanner from './pages/dashboard/Scanner';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './contexts/AuthContext';

import Features from './pages/Features';
import Modules from './pages/Modules';
import Support from './pages/Support';

// Placeholder Pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center py-40 gap-5 text-center px-10">
    <div className="w-24 h-24 rounded-[32px] flex items-center justify-center animate-pulse"
      style={{ background: 'rgba(15,110,86,0.1)', color: 'var(--color-primary)' }}>
      <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 900, fontStyle: 'italic' }}>!</div>
    </div>
    <div style={{ fontSize: '2.25rem', fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--color-primary-dark)', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.04em' }}>
      {title} <span style={{ color: '#D1D5DB', fontWeight: 300 }}>Module</span>
    </div>
    <p style={{ color: '#9CA3AF', fontWeight: 500, maxWidth: '24rem' }}>
      This module is part of the integrated MediScan suite and is currently under active deployment.
    </p>
  </div>
);

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<Features />} />
      <Route path="/modules" element={<Modules />} />
      <Route path="/support" element={<Support />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main App Dashboard — all sub-pages have /dashboard/* paths */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Overview />} />
        
        {/* Only Receptionists or Admins can register patients manually */}
        <Route path="register" element={
          <ProtectedRoute allowedRoles={['receptionist', 'admin']}>
            <Registration />
          </ProtectedRoute>
        } />
        
        {/* Only Doctors, Receptionists, and Admins need the scanner */}
        <Route path="scan" element={
          <ProtectedRoute allowedRoles={['doctor', 'receptionist', 'admin']}>
            <Scanner />
          </ProtectedRoute>
        } />
        
        <Route path="patients" element={<Placeholder title="Patients Directory" />} />
        <Route path="appointments" element={<Placeholder title="Schedules" />} />
        <Route path="billing" element={<Placeholder title="Billing Desk" />} />
        <Route path="reports" element={<Placeholder title="Analytics" />} />
        <Route path="settings" element={<Placeholder title="Branch Settings" />} />
        <Route path="consultation/:id" element={<Placeholder title="EMR Consultation" />} />
        <Route path="patients/:id" element={<Placeholder title="Patient Profile" />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
