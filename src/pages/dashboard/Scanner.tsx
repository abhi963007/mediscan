import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan,
  Camera,
  X,
  ArrowRight,
  Stethoscope,
  UserCircle2,
  History,
  HeartPulse,
  MonitorCheck,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const P = 'var(--color-primary)';
const PD = 'var(--color-primary-dark)';
const RL = 'var(--color-red-light)';
const RD = 'var(--color-red)';
const AM = 'var(--color-amber)';
const BG = 'var(--color-background)';

interface PatientResult {
  name: string;
  uhid: string;
  age: string;
  gender: string;
  lastVisit: string;
  lastDoc: string;
  vitals: string;
  allergies: string;
}

const Scanner = () => {
  const [scanning, setScanning] = useState(true);
  const [scannedResult, setScannedResult] = useState<PatientResult | null>(null);

  // In a real app, this would be an actual QR scanning library callback
  useEffect(() => {
    if (scanning) {
      // Mocking a successful scan for DEMO purposes ONLY if the user registers first.
      // For now, let's keep it in "Waiting" state until a real API is connected.
    }
  }, [scanning]);

  const resetScanner = () => {
    setScannedResult(null);
    setScanning(true);
  };

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Title */}
      <div className="w-full text-center space-y-2">
        <h2 className="text-3xl italic uppercase tracking-tighter"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: PD }}>
          Instant Patient <span style={{ color: '#D1D5DB', fontWeight: 300, fontStyle: 'normal' }}>QR Retrieval</span>
        </h2>
        <p className="font-medium" style={{ color: '#9CA3AF' }}>
          Use the desk webcam to scan the patient's physical card or digital ID.
        </p>
      </div>

      {/* Scanner Viewport */}
      <div className="relative w-full max-w-2xl">
        <div className="relative rounded-[24px] overflow-hidden aspect-square flex items-center justify-center"
          style={{ backgroundColor: '#0a0a0a', border: '8px solid #fff', boxShadow: 'var(--shadow-premium)' }}>

          {/* Animated Viewfinder Overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none p-16">
            <div className="w-full h-full relative rounded-[24px] overflow-hidden"
              style={{ border: '2px solid rgba(255,255,255,0.15)' }}>
              {/* Corner Brackets */}
              {[
                'top-0 left-0 border-t-8 border-l-8 rounded-tl-[12px]',
                'top-0 right-0 border-t-8 border-r-8 rounded-tr-[12px]',
                'bottom-0 left-0 border-b-8 border-l-8 rounded-bl-[12px]',
                'bottom-0 right-0 border-b-8 border-r-8 rounded-br-[12px]',
              ].map((cls, i) => (
                <div key={i} className={`absolute w-12 h-12 ${cls}`}
                  style={{ borderColor: P }} />
              ))}

              {/* Laser Line */}
              {scanning && (
                <motion.div
                  initial={{ top: '10%' }}
                  animate={{ top: '90%' }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className="absolute left-0 w-full z-20"
                  style={{ height: '3px', backgroundColor: P, boxShadow: `0 0 20px 4px ${P}` }}
                />
              )}
            </div>
          </div>

          {/* Camera Active Badge */}
          <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse z-20"
            style={{ backgroundColor: 'rgba(34,197,94,0.2)', color: '#4ADE80', border: '1px solid rgba(74,222,128,0.3)' }}>
            <MonitorCheck size={12} />
            Camera Active · 1080p
          </div>

          {/* Center UI */}
          <div className="relative z-10 flex flex-col items-center gap-4 px-16 text-center">
            {scanning && (
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <Camera size={40} style={{ color: 'rgba(255,255,255,0.15)' }} />
                </div>
                <div className="font-black uppercase tracking-[0.2em] text-xs"
                  style={{ fontFamily: 'var(--font-display)', color: 'rgba(255,255,255,0.15)' }}>
                  Place QR Code Inside Box
                </div>
              </div>
            )}
            <AnimatePresence>
              {scannedResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="rounded-full p-3 flex items-center justify-center"
                  style={{ border: `4px solid rgba(15,110,86,0.5)`, backgroundColor: 'rgba(15,110,86,0.2)' }}
                >
                  <div className="w-28 h-28 text-white rounded-full flex items-center justify-center"
                    style={{ backgroundColor: P }}>
                    <Scan size={52} strokeWidth={2.5} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Grid BG */}
          <div className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: 'linear-gradient(to right, #555 1px, transparent 1px), linear-gradient(to bottom, #555 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        {/* Reset Button */}
        <div className="mt-8 flex justify-center">
          <button onClick={resetScanner} className="btn-secondary h-14 px-10" style={{ borderRadius: '20px' }}>
            Restart Camera
          </button>
        </div>
      </div>

      {/* ─── Slide-up Patient Card ─── */}
      <AnimatePresence>
        {scannedResult && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
            style={{ padding: '0 2rem 2rem' }}
          >
            <div className="w-full max-w-4xl bg-white rounded-[40px] flex flex-col md:flex-row gap-8 items-center overflow-hidden"
              style={{ padding: '2.5rem', borderTop: `8px solid ${P}`, boxShadow: '0 -8px 60px rgba(0,0,0,0.15)' }}>

              {/* Patient Avatar */}
              <div className="w-40 h-40 rounded-[28px] flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                style={{ backgroundColor: BG, border: '4px solid rgba(15,110,86,0.1)' }}>
                <UserCircle2 size={100} style={{ color: PD, opacity: 0.08 }} />
              </div>

              {/* Patient Info */}
              <div className="flex-1 space-y-5 w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2"
                      style={{ backgroundColor: 'rgba(15,110,86,0.09)', color: P }}>
                      Match Found · {scannedResult.uhid}
                    </div>
                    <h3 className="text-4xl font-black italic uppercase tracking-tighter"
                      style={{ fontFamily: 'var(--font-display)', color: PD }}>
                      {scannedResult.name}
                    </h3>
                  </div>
                  <button onClick={() => setScannedResult(null)}
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all">
                    <X size={22} className="text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Last Visit', val: scannedResult.lastVisit, icon: <History size={13} style={{ color: P }} /> },
                    { label: 'Doctor', val: scannedResult.lastDoc, icon: <Stethoscope size={13} style={{ color: P }} /> },
                    { label: 'Vitals', val: scannedResult.vitals },
                    { label: 'Allergies', val: scannedResult.allergies, icon: <AlertCircle size={13} style={{ color: RD }} />, style: { color: RD }, bg: `${RL}30` },
                  ].map((item: any, i) => (
                    <div key={i} className="p-4 rounded-[18px]"
                      style={{ backgroundColor: item.bg ?? BG }}>
                      <div className="text-[10px] font-black uppercase mb-1 text-gray-400">{item.label}</div>
                      <div className="text-sm font-bold flex items-center gap-1.5" style={{ color: PD, ...item.style }}>
                        {item.icon} {item.val}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link to={`/dashboard/patients/${scannedResult.uhid}`} className="btn-secondary text-base flex-1">
                    Open Profile
                  </Link>
                  <Link to={`/dashboard/consultation/${scannedResult.uhid}`} className="btn-primary text-base flex-1">
                    Start Consultation <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
            <div className="fixed inset-0 -z-10 bg-black/40 backdrop-blur-sm" onClick={() => setScannedResult(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Triage Section ─── */}
      <div className="w-full max-w-4xl flex items-center gap-6 p-8 rounded-[28px]"
        style={{ backgroundColor: 'rgba(186,117,23,0.06)', border: '1px solid rgba(186,117,23,0.12)' }}>
        <div className="w-16 h-16 text-white rounded-[20px] flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: AM }}>
          <HeartPulse size={32} />
        </div>
        <div className="flex-1">
          <div className="text-xl font-black italic uppercase mb-1" style={{ color: AM }}>Emergency Bypass</div>
          <p className="text-sm font-medium" style={{ color: 'rgba(186,117,23,0.8)' }}>
            If QR is missing, initialize Emergency Triage for immediate care.
          </p>
        </div>
        <button className="btn-secondary h-12 px-6" style={{ color: AM, borderColor: 'rgba(186,117,23,0.2)' }}>
          Start Triage
        </button>
      </div>
    </div>
  );
};

export default Scanner;
