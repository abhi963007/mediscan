import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Building2, Pill, Users, Settings, UserPlus, Scan, 
  Calendar, Stethoscope, Search, LogOut, ChevronRight, Bell, HeartPulse, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';


interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  badge?: number;
}

const SidebarLink = ({ to, icon, label, collapsed, badge }: SidebarLinkProps) => {
  return (
    <NavLink
      to={to}
      end={true}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3.5 rounded-[16px] transition-all duration-300 group relative
        ${isActive
          ? 'text-white'
          : 'text-gray-500 hover:text-[var(--color-primary)]'
        }`
      }
      style={({ isActive }) =>
        isActive
          ? { backgroundColor: 'var(--color-primary)', boxShadow: '0 4px 16px rgba(15,110,86,0.2)' }
          : { backgroundColor: 'transparent' }
      }
    >
      <div className="flex-shrink-0">{icon}</div>
      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}
        >
          {label}
        </motion.span>
      )}
      {badge ? (
        <div className={`absolute ${collapsed ? 'top-2 right-2' : 'right-4'} bg-red-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20 border-2 border-white`}>
          {badge}
        </div>
      ) : null}
      {collapsed && (
        <div className="absolute left-full ml-4 px-3 py-1 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100] whitespace-nowrap uppercase tracking-widest"
          style={{ backgroundColor: 'var(--color-primary)', boxShadow: 'var(--shadow-subtle)' }}>
          {label}
        </div>
      )}
    </NavLink>
  );
};

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const segment = location.pathname.split('/').filter(Boolean).pop() ?? 'dashboard';
  const pageTitle = segment.charAt(0).toUpperCase() + segment.slice(1);
  const [waitingCount, setWaitingCount] = useState(0);

  const fetchGlobalStats = async () => {
     if (user?.role === 'doctor') {
        try {
           const token = localStorage.getItem('access');
           const res = await axios.get('http://127.0.0.1:8000/api/appointment-queue/', {
              headers: { Authorization: `Bearer ${token}` }
           });
           const count = res.data.count || res.data.length || 0;
           setWaitingCount(count);
        } catch (e) {}
     }
  };

  useEffect(() => {
     fetchGlobalStats();
     const interval = setInterval(fetchGlobalStats, 30000);
     return () => clearInterval(interval);
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const renderNavLinks = () => {
    switch (user.role) {
      case 'admin':
        return (
          <>
            <SidebarLink to="/dashboard/admin" icon={<Search size={20} />} label="Overview" collapsed={collapsed} />
            <SidebarLink to="/dashboard/admin/hospitals" icon={<Building2 size={20} />} label="Hospitals Registry" collapsed={collapsed} />
            <SidebarLink to="/dashboard/admin/medicines" icon={<Pill size={20} />} label="Medicine Master" collapsed={collapsed} />
          </>
        );
      case 'hospital_admin':
        return (
          <>
            <SidebarLink to="/dashboard/hospital" icon={<Building2 size={20} />} label="Hospital Status" collapsed={collapsed} />
            <SidebarLink to="/dashboard/hospital/staff" icon={<Users size={20} />} label="Staff Registry" collapsed={collapsed} />
            <SidebarLink to="/dashboard/hospital/slots" icon={<Clock size={20} />} label="Clinic Slots" collapsed={collapsed} />
            <SidebarLink to="/dashboard/hospital/settings" icon={<Settings size={20} />} label="Settings" collapsed={collapsed} />
          </>
        );
      case 'receptionist':
        return (
          <>
            <SidebarLink to="/dashboard/staff" icon={<Building2 size={20} />} label="Overview" collapsed={collapsed} />
            <SidebarLink to="/dashboard/staff/register" icon={<UserPlus size={20} />} label="Register Patient" collapsed={collapsed} />
            <SidebarLink to="/dashboard/staff/patients" icon={<Users size={20} />} label="Patients" collapsed={collapsed} />
            <SidebarLink to="/dashboard/staff/scan" icon={<Scan size={20} />} label="Scan Patient Card" collapsed={collapsed} />
            <SidebarLink to="/dashboard/staff/appointments" icon={<Calendar size={20} />} label="Appointments" collapsed={collapsed} />
            <SidebarLink to="/dashboard/staff/slots" icon={<Clock size={20} />} label="Configure Slots" collapsed={collapsed} />
          </>
        );
      case 'doctor':
        return (
          <>
            <SidebarLink to="/dashboard/doctor" icon={<Stethoscope size={20} />} label="Overview" collapsed={collapsed} />
            <SidebarLink to="/dashboard/doctor/appointments" icon={<Calendar size={20} />} label="Check-ups" collapsed={collapsed} badge={waitingCount} />
            <SidebarLink to="/dashboard/doctor/treatment" icon={<HeartPulse size={20} />} label="Treatment Desk" collapsed={collapsed} />
          </>
        );
      case 'patient':
        return (
          <>
            <SidebarLink to="/dashboard/patient" icon={<Scan size={20} />} label="Health Card" collapsed={collapsed} />
            <SidebarLink to="/dashboard/patient/book" icon={<Calendar size={20} />} label="Book Appointment" collapsed={collapsed} />
            <SidebarLink to="/dashboard/patient/history" icon={<HeartPulse size={20} />} label="Medical History" collapsed={collapsed} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* ─── Sidebar ─── */}
      <motion.aside
        animate={{ width: collapsed ? 88 : 280 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="h-screen sticky top-0 bg-white border-r flex flex-col justify-between shrink-0 z-50 overflow-hidden"
        style={{ borderColor: 'rgba(0,0,0,0.04)', boxShadow: 'var(--shadow-premium)' }}
      >
        <div className="p-5 flex flex-col gap-2 flex-1 overflow-y-auto overflow-x-hidden">
          {/* Logo */}
          <div className="mb-8 px-2 flex items-center h-12">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
              style={{ backgroundColor: 'var(--color-primary)' }}>
              <HeartPulse size={16} />
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-3 flex flex-col justify-center"
              >
                 <span className="font-black italic text-xl tracking-tighter whitespace-nowrap leading-none"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary-dark)' }}>
                  MediScan
                 </span>
                 <span className="text-[10px] uppercase font-bold text-green-600 tracking-wider">{user.hospital_name || 'Global System'}</span>
              </motion.div>
            )}
          </div>

          <div className="px-4 mb-2 h-4">
            {!collapsed && (
              <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase select-none"
                style={{ fontFamily: 'var(--font-display)' }}>
                {user.role === 'receptionist' ? 'Receptionist' : user.role.replace('_', ' ')}
              </span>
            )}
          </div>

          {renderNavLinks()}
          
        </div>

        {/* Sidebar Footer */}
        <div className="p-5 space-y-2 border-t" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-[16px] text-gray-400 hover:bg-gray-50 transition-all group"
          >
            <ChevronRight
              className={`transition-transform duration-500 flex-shrink-0 ${collapsed ? '' : 'rotate-180'}`}
              size={20}
            />
            {!collapsed && (
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                Collapse
              </span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 overflow-y-auto h-screen">
        <header className="sticky top-0 z-40 px-10 h-20 flex items-center justify-between"
          style={{ backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-6">
            <h1 className="text-2xl italic uppercase"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: 'var(--color-primary-dark)',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(15,110,86,0.2)',
                textDecorationThickness: '4px',
                textUnderlineOffset: '6px',
              }}>
              {pageTitle === 'Admin' || pageTitle === 'Hospital' || pageTitle === 'Staff' || pageTitle === 'Doctor' || pageTitle === 'Patient' ? 'Overview' : pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 pl-4 pr-1 py-1 rounded-[16px] transition-all"
              style={{ backgroundColor: 'rgba(15,110,86,0.05)', border: '1px solid rgba(15,110,86,0.1)' }}>
              <div className="flex flex-col text-right">
                <div className="text-xs font-black uppercase tracking-widest leading-none mb-1"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
                  {user.username}
                </div>
                <div className="text-[10px] font-bold tracking-widest uppercase leading-none"
                  style={{ color: 'rgba(15,110,86,0.6)' }}>
                  {user.hospital_name ? `${user.hospital_name} · ` : ''}{user.role.replace('_', ' ')} {user.uhid ? `· ${user.uhid}` : ''}
                </div>
              </div>
              <div className="w-10 h-10 text-white rounded-[12px] flex items-center justify-center font-black text-sm uppercase italic tracking-tighter border-2 border-white"
                style={{ backgroundColor: 'var(--color-primary)' }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>

            <button onClick={() => logout()} className="w-10 h-10 flex items-center justify-center text-red-500 rounded-[12px] transition-all hover:bg-red-50" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="p-10" style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
