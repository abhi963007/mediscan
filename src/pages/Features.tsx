import { motion } from 'framer-motion';
import { UserPlus, Stethoscope, QrCode, Database, Pill, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const P = 'var(--color-primary)';
const PD = 'var(--color-primary-dark)';

const Features = () => {
  return (
    <div className="min-h-screen py-20 px-8 md:px-16" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 mb-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-all group font-['Montserrat']">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        
        <div className="mb-20 text-center md:text-left">
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: PD, lineHeight: 1 }}>
            Core <span style={{ color: P, fontStyle: 'italic' }}>Features</span>
          </h1>
          <p className="text-xl max-w-2xl mt-6 font-medium font-['Montserrat']" style={{ color: '#6B7280' }}>
            A comprehensive breakdown of the tools powering MediScan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            { icon: <UserPlus style={{ color: P }} size={32} />, title: 'Patient Registration', desc: 'Quick multi-column onboarding with instant QR assignment for lifetime medical identity.' },
            { icon: <Stethoscope style={{ color: P }} size={32} />, title: 'EMR & Consultation', desc: 'Role-specific dashboards for doctors with prescription builders and historical data access.' },
            { icon: <QrCode style={{ color: P }} size={32} />, title: 'QR Code Engine', desc: 'Secure client-side and server-side QR generation for physical print or digital wallet access.' },
            { icon: <Database style={{ color: P }} size={32} />, title: 'Centralized Records', desc: 'SQLite-backed persistence layer ensuring zero overwrites and immutable medical history logs.' },
            { icon: <Pill style={{ color: P }} size={32} />, title: 'Pharmacy Module', desc: 'Instant prescription retrieval and real-time drug interaction safeguards for patient safety.' },
            { icon: <LayoutDashboard style={{ color: P }} size={32} />, title: 'Admin Analytics', desc: 'Real-time bed occupancy, staff loading, and revenue tracking via aggregated endpoints.' },
          ].map((feat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="card-premium group hover:-translate-y-2 transition-transform duration-300" style={{ height: '100%' }}>
              <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-8 transition-colors duration-300"
                style={{ backgroundColor: 'rgba(15,110,86,0.09)' }}>
                {feat.icon}
              </div>
              <h3 className="text-2xl mb-4 italic uppercase tracking-tighter" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: PD }}>{feat.title}</h3>
              <p className="leading-relaxed font-medium font-['Montserrat'] text-sm" style={{ color: '#6B7280' }}>{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
