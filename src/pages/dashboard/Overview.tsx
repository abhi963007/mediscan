import { motion } from 'framer-motion';
import {
  Users,
  Stethoscope,
  FlaskConical,
  CreditCard,
  Scan,
  Calendar,
  Clock,
  ChevronRight,
  TrendingUp,
  Building2,
  UserPlus,
  Inbox,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const P = 'var(--color-primary)';
const PD = 'var(--color-primary-dark)';
const PL = 'var(--color-primary-light)';
const AM = 'var(--color-amber)';
const AML = 'var(--color-amber-light)';
const BG = 'var(--color-background)';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend: number;
  alert?: boolean;
}

const StatCard = ({ label, value, icon, trend, alert }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="card-premium flex flex-col justify-between group"
    style={{ height: '100%' }}
  >
    <div className="flex justify-between items-start mb-6">
      <div className="p-4 rounded-[20px] transition-transform group-hover:scale-110"
        style={{ backgroundColor: alert ? `${AML}30` : 'rgba(15,110,86,0.09)', color: alert ? AM : P }}>
        {icon}
      </div>
      <div className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest"
        style={{
          color: trend === 0 ? '#9CA3AF' : (trend > 0 ? P : AM),
          backgroundColor: trend === 0 ? '#F3F4F6' : (trend > 0 ? 'rgba(15,110,86,0.06)' : `${AML}30`),
        }}>
        {trend === 0 ? '' : (trend > 0 ? '+' : '')}{trend}% · Wk
      </div>
    </div>
    <div>
      <div className="text-sm font-black text-gray-400 uppercase tracking-[0.15em] mb-1"
        style={{ fontFamily: 'var(--font-display)' }}>
        {label}
      </div>
      <div className="text-4xl font-black italic tracking-tighter"
        style={{ fontFamily: 'var(--font-display)', color: PD }}>
        {value}
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const patientRows: any[] = [];
  const appointments: any[] = [];

  return (
    <div className="space-y-10">
      {/* ─── QR Scan CTA Banner ─── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-[24px] p-8 flex flex-col md:flex-row items-center justify-between text-white relative overflow-hidden"
        style={{ backgroundColor: PD, boxShadow: 'var(--shadow-premium)' }}
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20"
          style={{ backgroundColor: P, transform: 'translate(50%, -50%)' }} />
        <div className="relative z-10 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: PL }}>
            <Building2 size={12} strokeWidth={3} />
            Central Hospital Branch • Main Reception
          </div>
          <h2 className="text-4xl italic uppercase tracking-tighter leading-tight"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}>
            Seamless Check-in <br /> Ecosystem.
          </h2>
          <p className="font-medium max-w-sm" style={{ color: 'rgba(160,243,212,0.7)' }}>
            Scan any patient QR to retrieve complete history and active prescriptions instantly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 relative z-10 mt-8 md:mt-0">
          <Link to="/dashboard/scan"
            className="flex items-center gap-3 px-10 py-5 rounded-[16px] font-black uppercase italic tracking-tighter transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#fff', color: P }}>
            <Scan size={22} strokeWidth={3} />
            Scan Patient QR
          </Link>
          <Link to="/dashboard/register"
            className="flex items-center gap-3 px-8 py-5 rounded-[16px] font-black uppercase italic tracking-tighter transition-all text-white"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <UserPlus size={20} />
            New Registration
          </Link>
        </div>
      </motion.div>

      {/* ─── Stats Row ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard label="Total Patients Today" value="0"      icon={<Users size={24} />}        trend={0} />
        <StatCard label="Consultations"         value="0"       icon={<Stethoscope size={24} />}   trend={0} />
        <StatCard label="Pending Labs"          value="0"       icon={<FlaskConical size={24} />}  trend={0} />
        <StatCard label="Revenue Today"         value="₹0" icon={<CreditCard size={24} />}    trend={0} />
      </div>

      {/* ─── Main Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Patients Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xl italic uppercase tracking-tighter"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: PD,
                textDecoration: 'underline', textDecorationColor: 'rgba(15,110,86,0.15)',
                textDecorationThickness: '4px', textUnderlineOffset: '8px' }}>
              Recent Patient Activity
            </h3>
            <button className="text-xs font-bold uppercase hover:underline" style={{ color: P }}>View All</button>
          </div>

          <div className="card-premium overflow-hidden" style={{ padding: 0 }}>
            {patientRows.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr style={{ backgroundColor: 'rgba(244,246,248,0.6)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    {['Full Name', 'UHID', 'Doctor', 'Status', 'Time'].map(h => (
                      <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400"
                        style={{ fontFamily: 'var(--font-display)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {patientRows.map((p, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.06 }}
                      className="group cursor-pointer transition-colors hover:bg-[rgba(15,110,86,0.02)]"
                      style={{ borderBottom: '1px solid rgba(0,0,0,0.02)' }}
                    >
                      <td className="px-6 py-4" style={{ borderLeft: '4px solid transparent' }}>
                        <div className="font-bold" style={{ color: PD }}>{p.name}</div>
                        <div className="text-[10px] text-gray-400 font-medium">General Medicine</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-tight px-2.5 py-1 rounded-lg"
                          style={{ color: P, backgroundColor: 'rgba(15,110,86,0.09)' }}>
                          <Scan size={11} strokeWidth={3} /> {p.uhid}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold italic" style={{ color: '#6B7280' }}>{p.doc}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                          style={{ backgroundColor: p.statusBg, color: p.statusColor }}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                          <Clock size={13} /> {p.time}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-24 flex flex-col items-center justify-center text-center gap-4 opacity-40">
                <Inbox size={48} className="text-gray-400" />
                <div className="space-y-1">
                  <div className="font-display font-black uppercase italic tracking-widest text-sm">No Recent Activity</div>
                  <div className="text-xs font-medium">Active sessions will appear here after login or scan.</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="space-y-6">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xl italic uppercase tracking-tighter"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: PD }}>
              Upcoming <span style={{ color: '#D1D5DB', fontWeight: 300, fontStyle: 'normal' }}>Schedules</span>
            </h3>
            <Calendar size={16} style={{ color: P }} />
          </div>

          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-5 rounded-[24px] cursor-pointer transition-transform hover:translate-x-2"
                  style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.03)', boxShadow: 'var(--shadow-subtle)' }}
                >
                  <div className="w-14 h-14 rounded-[16px] flex flex-col items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: BG, border: '1px solid rgba(0,0,0,0.04)', fontFamily: 'var(--font-display)' }}>
                    <div className="text-[10px] font-black uppercase text-gray-400">{item.month}</div>
                    <div className="text-xl font-black leading-none" style={{ color: P }}>{item.day}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate" style={{ color: PD }}>{item.patient}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{item.type} · {item.time}</div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 flex-shrink-0" />
                </motion.div>
              ))
            ) : (
                <div className="p-10 rounded-[24px] border-2 border-dashed border-gray-100 flex flex-col items-center text-center gap-3 opacity-50">
                    <Calendar size={32} className="text-gray-300" />
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">No appointments scheduled</div>
                </div>
            )}
          </div>

          {/* Analytics Mini Card */}
          <div className="p-6 rounded-[24px] relative overflow-hidden"
            style={{ backgroundColor: 'rgba(15,110,86,0.05)', border: '1px solid rgba(15,110,86,0.1)' }}>
            <TrendingUp className="absolute top-4 right-4 opacity-20" size={64} style={{ color: P }} />
            <div className="relative z-10">
              <div className="text-[10px] font-black uppercase tracking-widest mb-1"
                style={{ fontFamily: 'var(--font-display)', color: P }}>
                Optimization Score
              </div>
              <div className="text-4xl font-black italic tracking-tighter"
                style={{ fontFamily: 'var(--font-display)', color: P }}>0%</div>
              <div className="text-xs font-semibold mt-2" style={{ color: 'rgba(15,110,86,0.6)' }}>
                Waiting for data synchronization.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
