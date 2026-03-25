import { motion } from 'framer-motion';
import { Building2, UserCog, Users, Settings, Calendar, Scan, Stethoscope, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const P = 'var(--color-primary)';
const PD = 'var(--color-primary-dark)';

const moduleList = [
  {
    icon: <Building2 size={40} />,
    title: 'Hospital Registration & Verification',
    desc: 'Hospitals register by providing their details (contact, location, address, email). A central Admin verifies each hospital before they can access the platform. The Admin also manages the global medicine list.',
  },
  {
    icon: <UserCog size={40} />,
    title: 'Doctor Detail Authentication',
    desc: 'Hospital admins add doctors working in their institute. The system generates unique credentials (username & password) that are sent to each doctor for individual login access.',
  },
  {
    icon: <Users size={40} />,
    title: 'Employee Detail Authentication',
    desc: 'Hospital admins manage all staff (receptionists, lab technicians, etc.) in the same way — creating accounts and sending login credentials to corresponding employees.',
  },
  {
    icon: <Settings size={40} />,
    title: 'Hospital Settings',
    desc: 'Hospital admins configure consultation fees per doctor and set their official operating timings. They also control the total number of available online booking seats per day.',
  },
  {
    icon: <Calendar size={40} />,
    title: 'Online Booking',
    desc: 'Patients search for verified hospitals and available doctors, view real-time seat availability for a specific day, book consultations, manage bookings (view/cancel), and complete payments online.',
  },
  {
    icon: <Scan size={40} />,
    title: 'Patient Visit',
    desc: 'New patients are issued a unique QR Code card upon first visit. Reception staff scan returning patient QR codes to instantly retrieve their profile and create appointment queues against available doctors.',
  },
  {
    icon: <Stethoscope size={40} />,
    title: 'Treatment',
    desc: 'Doctors scan patient QR codes to access the full treatment history — all past diagnoses, prescriptions, and vitals. Doctors view their appointment queue, examine patients, and prescribe medicines from the master list.',
  },
];

const Modules = () => {
  return (
    <div className="min-h-screen py-20 px-8 md:px-16" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 mb-10 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-[var(--color-primary)] transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="mb-20 text-center md:text-left">
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: PD, lineHeight: 1 }}>
            System <span style={{ color: P, fontStyle: 'italic' }}>Modules</span>
          </h1>
          <p className="text-xl max-w-2xl mt-6 font-medium" style={{ color: '#6B7280' }}>
            7 integrated modules powering the complete Global Patient ecosystem — from hospital onboarding to bedside treatment.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {moduleList.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="flex flex-col md:flex-row items-start gap-8 card-premium" style={{ borderLeft: `8px solid ${P}` }}>
              <div className="w-20 h-20 min-w-[5rem] rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(15,110,86,0.08)', color: P }}>
                {m.icon}
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: P, fontFamily: 'var(--font-display)' }}>MODULE {String(i + 1).padStart(2, '0')}</div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-3" style={{ fontFamily: 'var(--font-display)', color: PD }}>{m.title}</h3>
                <p className="text-lg font-medium leading-relaxed" style={{ color: '#6B7280' }}>{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modules;
