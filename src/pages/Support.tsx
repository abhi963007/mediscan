import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare, ArrowLeft, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

const P = 'var(--color-primary)';
const PD = 'var(--color-primary-dark)';

const Support = () => {
  return (
    <div className="min-h-screen py-20 px-8 md:px-16 flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10"
        style={{ backgroundColor: P, transform: 'translate(-50%, -50%)' }} />

      <div className="max-w-4xl w-full mx-auto relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 mb-10 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-[var(--color-primary)] transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
          className="card-premium p-12 md:p-20 text-center relative overflow-hidden">
          <HeartPulse size={120} className="absolute -right-10 -bottom-10 opacity-5" style={{ color: P }} />
          
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: PD, lineHeight: 1, marginBottom: '2rem' }}
            className="italic uppercase tracking-tighter">
            Dedicated <span style={{ color: P }}>Support</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto font-medium" style={{ color: '#6B7280' }}>
            Encountering a bug or need architecture assistance for your hospital? We are here to help scale your digital transformation.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-16 text-left">
            <div className="p-8 rounded-[24px] border border-gray-100 hover:border-gray-200 transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>
              <Mail style={{ color: P }} className="mb-4" size={32} />
              <div className="text-xs font-black tracking-widest uppercase text-gray-400 mb-2">Email Us</div>
              <div className="font-bold text-lg" style={{ color: PD }}>support@mediscan.hms</div>
            </div>
            <div className="p-8 rounded-[24px] border border-gray-100 hover:border-gray-200 transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>
              <Phone style={{ color: P }} className="mb-4" size={32} />
              <div className="text-xs font-black tracking-widest uppercase text-gray-400 mb-2">Call Toll-Free</div>
              <div className="font-bold text-lg" style={{ color: PD }}>1-800-442-QRMD</div>
            </div>
            <div className="p-8 rounded-[24px] border border-gray-100 hover:border-gray-200 transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>
              <MessageSquare style={{ color: P }} className="mb-4" size={32} />
              <div className="text-xs font-black tracking-widest uppercase text-gray-400 mb-2">Live Chat</div>
              <div className="font-bold text-lg" style={{ color: PD }}>In-App Dashboard</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Support;
