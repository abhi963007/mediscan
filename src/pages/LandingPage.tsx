import { motion, useScroll, useMotionValueEvent, useSpring, useTransform, animate } from 'framer-motion';
import {
  QrCode,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Activity,
  Heart,
  Zap,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import healthAnimation from '../assets/health.lottie';
import { useState, useEffect, useRef } from 'react';

const CountUp = ({ value, suffix = "" }: { value: string, suffix?: string }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const numericValue = parseFloat(value.replace(/,/g, ''));
  
    useEffect(() => {
      const controls = animate(0, numericValue, {
        duration: 3.5, // Slower, more elegant count
        ease: "easeOut",
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = Math.floor(value).toLocaleString() + suffix;
          }
        },
      });
      return () => controls.stop();
    }, [numericValue, suffix]);
  
    return <span ref={ref}>0</span>;
  };
  
const LandingPage = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <div className="min-h-screen bg-white overflow-x-hidden selection:bg-[var(--color-primary)] selection:text-white">
      {/* ─── Premium Navbar ─── */}
      <motion.nav 
        variants={{
            visible: { y: 0 },
            hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/70 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-gray-200/50 rounded-[32px] px-8 h-20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-[var(--color-primary)]/40 bg-gradient-to-br from-[var(--color-primary)] to-green-700">
              <QrCode size={24} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">
              Medi<span className="text-[var(--color-primary)]">Scan</span>
              <div className="text-[8px] font-black tracking-[0.3em] text-gray-300 mt-1">HEALTH SYSTEM</div>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-12">
            {[
                { name: 'How It Works', path: '/modules' },
                { name: 'Features', path: '/features' },
                { name: 'Help', path: '/support' }
            ].map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[var(--color-primary)] transition-all relative group font-['Montserrat']"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--color-primary)] group-hover:w-full transition-all" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-primary)] hover:scale-105 transition-all shadow-xl shadow-gray-200 font-['Montserrat']">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ─── Interactive Hero ─── */}
      <section className="relative pt-48 pb-32 px-6 md:px-12">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-[-10%] w-[60%] h-[100%] bg-green-50/50 rounded-full blur-[140px] -z-10" />
        <div className="absolute bottom-0 left-[-10%] w-[40%] h-[60%] bg-blue-50/40 rounded-full blur-[140px] -z-10" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-green-50 border border-green-100 mb-10 shadow-sm">
              <ShieldCheck className="text-[var(--color-primary)]" size={16} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-green-700">Trusted by Hospitals Everywhere</span>
            </div>

            <h1 className="text-6xl md:text-[6.5rem] font-black italic uppercase tracking-tighter text-gray-900 leading-[0.85] mb-10">
              Healthcare <br />
              At Every <span className="text-[var(--color-primary)] relative">
                Scan.
                <div className="absolute -right-12 -top-4 opacity-10 animate-pulse">
                    <Activity size={80} />
                </div>
              </span>
            </h1>

            <p className="text-xl md:text-2xl font-medium text-gray-500 max-w-xl mb-12 leading-relaxed font-['Montserrat']">
              Making patient care easier with QR cards, full medical history in one place, and access from any hospital.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link to="/dashboard/register" className="group relative bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-900/10 hover:scale-105 transition-all flex items-center justify-center gap-3 whitespace-nowrap font-['Montserrat']">
                Register as Patient <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/modules" className="bg-white border-2 border-gray-100 text-gray-900 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all flex items-center justify-center gap-3 whitespace-nowrap font-['Montserrat']">
                See All Features
              </Link>
            </div>

            <div className="mt-20 p-8 bg-gray-50/50 backdrop-blur-md border border-white rounded-[40px] inline-flex items-center gap-8 shadow-sm">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-14 h-14 rounded-2xl border-4 border-white overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform">
                    <img src={`https://i.pravatar.cc/150?u=medical${i}`} alt="Specialist" className="grayscale hover:grayscale-0 transition-all" />
                  </div>
                ))}
              </div>
              <div>
                <div className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 leading-none mb-1">12K+</div>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Doctors Using MediScan</div>
              </div>
            </div>
          </motion.div>

          {/* Lottie Container with Glow */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1.2, delay: 0.2 }}
            className="hidden lg:block relative -mt-16 xl:-mt-24"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-blue-500 opacity-20 blur-[120px] rounded-full animate-pulse" />
            <div className="relative group p-12 bg-white/30 backdrop-blur-2xl rounded-[80px] border border-white/50 shadow-inner">
                <DotLottieReact 
                    src={healthAnimation} 
                    loop 
                    autoplay 
                    className="w-full h-full scale-110 group-hover:scale-125 transition-transform duration-1000" 
                />
                
                {/* Floating UI Elements */}
                <motion.div 
                    animate={{ y: [0, -20, 0] }} 
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -top-10 -right-10 bg-white p-6 rounded-[32px] shadow-2xl border border-gray-100 flex items-center gap-4"
                >
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white"><Zap size={20} /></div>
                    <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-['Montserrat']">Response Time</div>
                        <div className="text-xl font-black text-gray-900 uppercase italic">0.2ms</div>
                    </div>
                </motion.div>

                <motion.div 
                    animate={{ y: [0, 20, 0] }} 
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-10 -left-20 bg-white p-6 rounded-[32px] shadow-2xl border border-gray-100 flex items-center gap-4"
                >
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white"><Globe size={20} /></div>
                    <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-['Montserrat']">Available At</div>
                        <div className="text-xl font-black text-gray-900 uppercase italic">45 Hospitals</div>
                    </div>
                </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Ultra-Wide Stats ─── */}
      <section className="bg-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-50/20 -z-10" />
        <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col sm:flex-row items-center justify-between gap-12 sm:gap-0">
          {[
            { label: 'Daily Scans', val: '4200', suffix: '+', desc: 'QR cards scanned daily' },
            { label: 'Time Saved', val: '65', suffix: '%', desc: 'Less waiting per visit' },
            { label: 'Patient Records', val: '142000', suffix: '+', desc: 'Safely stored online' },
            { label: 'System Uptime', val: '99', suffix: '.9%', desc: 'Always up and running' },
          ].map((stat, i, arr) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`flex-1 text-center py-8 px-4 ${i < arr.length - 1 ? 'sm:border-r border-gray-100' : ''}`}
            >
              <div className="text-5xl lg:text-6xl xl:text-7xl font-black italic tracking-tighter mb-4 text-gray-900 whitespace-nowrap">
                <CountUp value={stat.val} suffix={stat.suffix} />
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-2 font-['Montserrat']">{stat.label}</div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-['Montserrat']">{stat.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Modern CTA ─── */}
      <section className="py-40 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            whileInView={{ scale: [0.95, 1] }}
            className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] to-green-900 rounded-[80px] p-16 md:p-32 text-center text-white shadow-3xl"
          >
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                <Heart size={600} className="absolute -right-20 -top-20 rotate-12" />
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] mb-12 text-white">
                Ready To Get <br />
                Started?
              </h2>
              <p className="text-xl md:text-2xl font-medium opacity-80 mb-16 leading-relaxed max-w-2xl mx-auto text-white/90 font-['Montserrat']">
                Join hospitals that are making patient check-in faster and easier with QR cards.
              </p>
              <Link to="/dashboard" className="bg-white text-gray-900 px-12 py-8 rounded-[40px] text-2xl font-black uppercase tracking-tighter hover:scale-110 transition-all inline-flex items-center gap-6 shadow-2xl">
                Open MediScan <ArrowRight size={32} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Clean Footer ─── */}
      <footer className="py-24 px-6 md:px-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white"><QrCode size={20} /></div>
            <span className="text-xl font-black italic uppercase tracking-tighter text-gray-900">MediScan</span>
          </div>
          <div className="flex flex-wrap justify-center gap-12 font-black uppercase text-[10px] tracking-[0.2em] text-gray-400 font-['Montserrat']">
            <Link to="/modules" className="hover:text-gray-900 transition-colors">How It Works</Link>
            <Link to="/support" className="hover:text-gray-900 transition-colors">Get Help</Link>
            <Link to="/features" className="hover:text-gray-900 transition-colors">Privacy</Link>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-300 font-['Montserrat']">
            © 2026 MediScan Healthcare Solutions.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
