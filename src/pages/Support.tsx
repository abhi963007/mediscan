import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare, ArrowLeft, HeartPulse, ShieldCheck, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Support = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
            {/* Abstract background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/5 rounded-full blur-[120px]" />

            <div className="max-w-6xl w-full relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 mb-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-all group font-['Montserrat']">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                </Link>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-gray-900 leading-[0.85] mb-8">
                            Dedicated <br />
                            <span className="text-[var(--color-primary)]">Support</span>
                        </h1>
                        <p className="text-xl font-medium text-gray-500 max-w-lg mb-12 leading-relaxed font-['Montserrat']">
                            Found a problem or need help setting up MediScan at your hospital? We are here for you.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                                <ShieldCheck className="text-blue-500" size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 font-['Montserrat']">Safe & Secure</span>
                            </div>
                            <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                                <Globe className="text-green-500" size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 font-['Montserrat']">Available All Day</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                        {[
                            { icon: <Mail />, label: 'Email Us', val: 'support@mediscan.hms', sub: 'We reply within 2 hours' },
                            { icon: <Phone />, label: 'Call Us Free', val: '1-800-442-QRMD', sub: 'Available 10AM - 6PM' },
                            { icon: <MessageSquare />, label: 'Live Chat', val: 'Open Dashboard Chat', sub: 'Talk to our team now' }
                        ].map((item, i) => (
                            <div key={i} className="group p-8 bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-[var(--color-primary)]/10 transition-all hover:-translate-y-1 flex items-center gap-8">
                                <div className="w-16 h-16 bg-gray-50 rounded-[24px] flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all shadow-inner">
                                    {item.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 font-['Montserrat']">{item.label}</div>
                                    <div className="text-2xl font-black italic uppercase tracking-tight text-gray-900 leading-none mb-1">{item.val}</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-['Montserrat']">{item.sub}</div>
                                </div>
                                <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-[var(--color-primary)] group-hover:border-[var(--color-primary)] transition-all">
                                    <ArrowLeft className="rotate-180" size={20} />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Decorative Pulse Icon */}
            <div className="absolute -bottom-20 -right-20 opacity-[0.03] rotate-[-15deg]">
                <HeartPulse size={400} />
            </div>
        </div>
    );
};

export default Support;
