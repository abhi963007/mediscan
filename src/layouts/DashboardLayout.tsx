import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Scan, 
  Bell, 
  Search,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const SidebarLink = ({ to, icon, label, collapsed }: SidebarLinkProps) => {
  return (
    <NavLink
      to={to}
      end={to === '/dashboard'}
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

  // Derive a readable page title from path segment
  const segment = location.pathname.split('/').filter(Boolean).pop() ?? 'dashboard';
  const pageTitle = segment.charAt(0).toUpperCase() + segment.slice(1);

  if (!user) {
    return null;
  }

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
              <Scan size={16} />
            </div>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-3 font-black italic text-xl tracking-tighter whitespace-nowrap overflow-hidden"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary-dark)' }}
              >
                MediScan
              </motion.span>
            )}
          </div>

          {/* Nav Label */}
          <div className="px-4 mb-2 h-4">
            {!collapsed && (
              <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase select-none"
                style={{ fontFamily: 'var(--font-display)' }}>
                Main Menu
              </span>
            )}
          </div>

          {/* Navigation links */}
          <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" collapsed={collapsed} />
          
          {['receptionist', 'admin'].includes(user.role) && (
            <SidebarLink to="/dashboard/register" icon={<UserPlus size={20} />} label="Registration" collapsed={collapsed} />
          )}
          
          {['doctor', 'receptionist', 'admin'].includes(user.role) && (
            <SidebarLink to="/dashboard/scan" icon={<Scan size={20} />} label="QR Scanner" collapsed={collapsed} />
          )}
          
          {['doctor', 'receptionist', 'admin'].includes(user.role) && (
            <SidebarLink to="/dashboard/patients" icon={<Users size={20} />} label="Patients" collapsed={collapsed} />
          )}
          <SidebarLink to="/dashboard/appointments" icon={<Calendar size={20} />} label="Schedules" collapsed={collapsed} />
          <SidebarLink to="/dashboard/billing" icon={<CreditCard size={20} />} label="Billing" collapsed={collapsed} />
          <SidebarLink to="/dashboard/reports" icon={<BarChart3 size={20} />} label="Analytics" collapsed={collapsed} />
        </div>

        {/* Sidebar Footer */}
        <div className="p-5 space-y-2 border-t" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
          <SidebarLink to="/dashboard/settings" icon={<Settings size={20} />} label="Settings" collapsed={collapsed} />
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
        {/* Top Header */}
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
              {pageTitle}
            </h1>
            <div className="hidden md:flex items-center px-4 py-2 rounded-[12px] gap-3 w-64 transition-all"
              style={{ backgroundColor: 'var(--color-background)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Find patient, UHID..."
                className="bg-transparent text-sm w-full outline-none font-medium"
                style={{ color: 'var(--color-primary-dark)' }}
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden sm:flex flex-col text-right">
              <div className="text-xs font-black uppercase tracking-[0.15em] text-gray-400"
                style={{ fontFamily: 'var(--font-display)' }}>
                Tuesday, 24 March
              </div>
              <div className="text-sm font-bold italic" style={{ color: 'var(--color-primary)' }}>16:58 IST</div>
            </div>

            <div className="w-px h-8 bg-black/5" />

            <button className="relative w-10 h-10 flex items-center justify-center text-gray-500 rounded-[12px] transition-all hover:bg-gray-50">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full border-2 border-white"
                style={{ backgroundColor: 'var(--color-red)' }} />
            </button>

            <div className="flex items-center gap-3 pl-4 pr-1 py-1 rounded-[16px] transition-all"
              style={{ backgroundColor: 'rgba(15,110,86,0.05)', border: '1px solid rgba(15,110,86,0.1)' }}>
              <div className="flex flex-col text-right">
                <div className="text-xs font-black uppercase tracking-widest leading-none mb-1"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
                  {user.username}
                </div>
                <div className="text-[10px] font-bold tracking-widest uppercase leading-none"
                  style={{ color: 'rgba(15,110,86,0.6)' }}>
                  {user.role} {user.uhid ? `· ${user.uhid}` : ''}
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

        {/* Page Content */}
        <div className="p-10" style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
