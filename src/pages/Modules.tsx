import { motion } from 'framer-motion';
import { LayoutDashboard, Users, CreditCard, Calendar, BarChart3, Scan, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const P = 'var(--color-primary)';
const PD = 'var(--color-primary-dark)';

const moduleList = [
  { icon: <Scan size={40} />, title: 'Reception Desk', desc: 'Secure entry points where patients register, sync QR identifiers, and are quickly triaged into the next available doctor queue.' },
  { icon: <Users size={40} />, title: 'Doctor EMR', desc: 'Clinical dashboards granting doctors real-time vitals, historical diagnoses, and an integrated prescription builder for paperless handouts.' },
  { icon: <CreditCard size={40} />, title: 'Billing Center', desc: 'Financial aggregators grouping consultation charges, pharmacy receipts, and lab fees into single unified patient invoices.' },
  { icon: <Calendar size={40} />, title: 'Scheduling System', desc: 'Automated appointment calendars allowing receptionists to seamlessly book follow-ups and avoid overlapping timeslots.' },
  { icon: <LayoutDashboard size={40} />, title: 'Pharmacy Point', desc: 'Instant fulfillment interface where pharmacists scan a patient\'s QR to view, dispense, and clear active doctor prescriptions.' },
  { icon: <BarChart3 size={40} />, title: 'Hospital Analytics', desc: 'C-Level executive insights tracking daily hospital footfall, revenue streams, and average consultation durations for optimization.' },
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
            A modular approach allowing flexible adoption across any clinical department.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {moduleList.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
              className="flex flex-col md:flex-row items-center gap-8 card-premium" style={{ borderLeft: `8px solid ${P}` }}>
              <div className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(15,110,86,0.08)', color: P }}>
                {m.icon}
              </div>
              <div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4" style={{ fontFamily: 'var(--font-display)', color: PD }}>{m.title}</h3>
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
