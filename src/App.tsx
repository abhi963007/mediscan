import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './contexts/AuthContext';

import Features from './pages/Features';
import Modules from './pages/Modules';
import Support from './pages/Support';

// Global Admin Pages
import AdminOverview from './pages/dashboard/global_admin/AdminOverview';
import Hospitals from './pages/dashboard/global_admin/Hospitals';
import Medicines from './pages/dashboard/global_admin/Medicines';

// Hospital Admin Pages
import HospitalOverview from './pages/dashboard/hospital_admin/HospitalOverview';
import StaffManagement from './pages/dashboard/hospital_admin/StaffManagement';
import HospitalSettings from './pages/dashboard/hospital_admin/HospitalSettings';

// Receptionist Pages
import ReceptionistOverview from './pages/dashboard/receptionist/ReceptionistOverview';
import RegisterPatient from './pages/dashboard/receptionist/RegisterPatient';
import ScanQR from './pages/dashboard/receptionist/ScanQR';
import Patients from './pages/dashboard/receptionist/Patients';
import ReceptionistAppointments from './pages/dashboard/receptionist/Appointments';

// Doctor Pages
import DoctorOverview from './pages/dashboard/doctor/DoctorOverview';
import Treatment from './pages/dashboard/doctor/Treatment';
import DoctorAppointments from './pages/dashboard/doctor/Appointments';
import SlotManagement from './pages/dashboard/doctor/SlotManagement';

// Patient Pages
import PatientOverview from './pages/dashboard/patient/PatientOverview';
import BookAppointment from './pages/dashboard/patient/BookAppointment';
import MyHistory from './pages/dashboard/patient/MyHistory';


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

// Auto-redirect to specific dashboards based on role
const DashboardRoot = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    
    switch (user.role) {
        case 'admin': return <Navigate to="/dashboard/admin" replace />;
        case 'hospital_admin': return <Navigate to="/dashboard/hospital" replace />;
        case 'doctor': return <Navigate to="/dashboard/doctor" replace />;
        case 'receptionist': return <Navigate to="/dashboard/staff" replace />;
        case 'patient': return <Navigate to="/dashboard/patient" replace />;
        default: return <Navigate to="/login" replace />;
    }
}

// Global ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<Features />} />
      <Route path="/modules" element={<Modules />} />
      <Route path="/support" element={<Support />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardRoot />} />
        
        {/* === GLOBAL ADMIN DRILLDOWN === */}
        <Route path="admin">
           <Route index element={<ProtectedRoute allowedRoles={['admin']}><AdminOverview /></ProtectedRoute>} />
           <Route path="hospitals" element={<ProtectedRoute allowedRoles={['admin']}><Hospitals /></ProtectedRoute>} />
           <Route path="medicines" element={<ProtectedRoute allowedRoles={['admin']}><Medicines /></ProtectedRoute>} />
        </Route>

        {/* === HOSPITAL ADMIN DRILLDOWN === */}
        <Route path="hospital">
           <Route index element={<ProtectedRoute allowedRoles={['hospital_admin']}><HospitalOverview /></ProtectedRoute>} />
           <Route path="staff" element={<ProtectedRoute allowedRoles={['hospital_admin']}><StaffManagement /></ProtectedRoute>} />
           <Route path="slots" element={<ProtectedRoute allowedRoles={['hospital_admin']}><SlotManagement /></ProtectedRoute>} />
           <Route path="settings" element={<ProtectedRoute allowedRoles={['hospital_admin']}><HospitalSettings /></ProtectedRoute>} />
        </Route>

        {/* === RECEPTIONIST / STAFF DRILLDOWN === */}
        <Route path="staff">
           <Route index element={<ProtectedRoute allowedRoles={['receptionist']}><ReceptionistOverview /></ProtectedRoute>} />
           <Route path="register" element={<ProtectedRoute allowedRoles={['receptionist']}><RegisterPatient /></ProtectedRoute>} />
           <Route path="patients" element={<ProtectedRoute allowedRoles={['receptionist']}><Patients /></ProtectedRoute>} />
           <Route path="scan" element={<ProtectedRoute allowedRoles={['receptionist']}><ScanQR /></ProtectedRoute>} />
           <Route path="appointments" element={<ProtectedRoute allowedRoles={['receptionist']}><ReceptionistAppointments /></ProtectedRoute>} />
           <Route path="slots" element={<ProtectedRoute allowedRoles={['receptionist']}><SlotManagement /></ProtectedRoute>} />
        </Route>

        {/* === DOCTOR DRILLDOWN === */}
        <Route path="doctor">
           <Route index element={<ProtectedRoute allowedRoles={['doctor']}><DoctorOverview /></ProtectedRoute>} />
           <Route path="treatment" element={<ProtectedRoute allowedRoles={['doctor']}><Treatment /></ProtectedRoute>} />
           <Route path="appointments" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorAppointments /></ProtectedRoute>} />
        </Route>

        {/* === PATIENT DRILLDOWN === */}
        <Route path="patient">
           <Route index element={<ProtectedRoute allowedRoles={['patient']}><PatientOverview /></ProtectedRoute>} />
           <Route path="book" element={<ProtectedRoute allowedRoles={['patient']}><BookAppointment /></ProtectedRoute>} />
           <Route path="history" element={<ProtectedRoute allowedRoles={['patient']}><MyHistory /></ProtectedRoute>} />
        </Route>

      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

export default App;
