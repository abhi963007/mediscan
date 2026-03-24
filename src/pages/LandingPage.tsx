import { motion } from 'framer-motion';
import {
  QrCode,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import healthAnimation from '../assets/health.lottie';

const P = 'var(--color-primary)';
const PD = 'var(--color-primary-dark)';
const PL = 'var(--color-primary-light)';

const LandingPage = () => {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: 'var(--color-background)', fontFamily: 'var(--font-body)' }}>
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 md:px-16 h-20 flex items-center justify-between"
        style={{ backgroundColor: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-white flex-shrink-0"
            style={{ backgroundColor: P }}>
            <QrCode size={22} strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.04em', color: PD }}>
            MediScan
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {['/features', '/modules', '/support'].map((path, i) => (
            <Link key={path} to={path} className="font-medium transition-colors"
              style={{ color: '#6B7280' }}
              onMouseEnter={e => (e.currentTarget.style.color = P)}
              onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}>
              {['Features', 'Modules', 'Support'][i]}
            </Link>
          ))}
        </div>

        <Link to="/dashboard" className="btn-primary py-2.5 px-6 text-sm" style={{ borderRadius: '12px' }}>
          Launch App
        </Link>
      </nav>

      {/* ─── Hero ─── */}
      <section className="pt-40 pb-24 px-8 md:px-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-bold uppercase tracking-widest"
              style={{ backgroundColor: 'rgba(15,110,86,0.09)', color: P }}>
              <ShieldCheck size={14} />
              Securing Patient Data with QR Technology
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', lineHeight: 1.05, color: PD, marginBottom: '2rem' }}>
              Seamless Healthcare<br />
              <span style={{ color: P, fontStyle: 'italic' }}>at Every Scan.</span>
            </h1>

            <p className="text-xl leading-relaxed mb-10 max-w-lg" style={{ color: '#6B7280' }}>
              Unlock instant patient history, secure prescriptions, and centralized medical records with MediScan's innovative QR-based ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link to="/dashboard/register" className="btn-primary text-lg px-10">
                Register New Patient <ArrowRight size={20} />
              </Link>
              <Link to="/dashboard" className="btn-secondary text-lg px-10">
                Go to Dashboard
              </Link>
            </div>

            <div className="mt-16 flex items-center gap-8">
              <div className="flex">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden -ml-3 first:ml-0"
                    style={{ backgroundColor: '#E5E7EB' }}>
                    <img src={`https://i.pravatar.cc/150?u=${i * 10}`} alt="Medical professional" />
                  </div>
                ))}
              </div>
              <div>
                <div className="font-bold" style={{ color: PD }}>Trusted by 12,000+ Providers</div>
                <div className="text-sm" style={{ color: '#9CA3AF' }}>Across 45 national branches</div>
              </div>
            </div>
          </motion.div>

          {/* Hero Animation */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} 
            className="relative flex items-center justify-center -translate-y-12 lg:-translate-y-16">
            <div className="absolute inset-0 rounded-full blur-3xl opacity-15 animate-pulse"
              style={{ background: `linear-gradient(135deg, ${P}, ${PL})` }} />
            <div className="relative w-full aspect-square max-w-[600px]">
              <DotLottieReact src={healthAnimation} loop autoplay className="w-full h-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats Banner ─── */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: PD }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] opacity-20"
          style={{ backgroundColor: P, transform: 'translate(50%, -50%)' }} />
        <div className="max-w-7xl mx-auto px-8 md:px-16 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: 'QR Scans Daily', val: '4,200+' },
            { label: 'Wait Time Reduced', val: '65%' },
            { label: 'Consultations', val: '142k+' },
            { label: 'System Uptime', val: '99.9%' },
          ].map((stat, i) => (
            <motion.div key={i} viewport={{ once: true }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="text-5xl font-black mb-2 italic uppercase tracking-tighter"
                style={{ fontFamily: 'var(--font-display)', color: PL }}>
                {stat.val}
              </div>
              <div className="font-medium tracking-widest text-xs uppercase" style={{ color: 'rgba(160,243,212,0.6)' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-24 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden text-center text-white p-12 lg:p-24 rounded-[40px]"
            style={{ backgroundColor: P }}>
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-10"
              style={{ backgroundColor: '#fff', transform: 'translate(40%, -40%)' }} />
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="leading-tight italic uppercase mb-8"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-0.04em', color: '#ffffff' }}>
                Ready to Upgrade Your Hospital Workflow?
              </h2>
              <p className="text-xl mb-12 font-medium opacity-80" style={{ color: '#ffffff' }}>
                Join hundreds of medical facilities transitioning to the paperless, secure, and fast QR-based infrastructure.
              </p>
              <Link to="/dashboard" className="btn-primary text-xl" style={{ backgroundColor: '#fff', color: P, display: 'inline-flex' }}>
                Launch Deployment <ArrowRight size={24} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-16 px-8 md:px-16" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: P }}>
              <QrCode size={16} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.2rem', color: PD, fontStyle: 'italic', letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
              MediScan
            </span>
          </div>
          <div className="text-sm font-medium" style={{ color: '#9CA3AF' }}>
            © 2026 MediScan Healthcare Solutions.
          </div>
          <div className="flex gap-8">
            <a href="#" className="font-bold text-xs uppercase" style={{ color: P }}>Privacy Policy</a>
            <a href="#" className="font-bold text-xs uppercase" style={{ color: P }}>Deployment Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
