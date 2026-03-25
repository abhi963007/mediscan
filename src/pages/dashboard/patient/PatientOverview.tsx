import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { QrCode, CalendarDays, History, Download, Smartphone, ShieldCheck, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const PatientOverview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/auth/dashboard-stats/');
                setStats(res.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-8 font-black uppercase tracking-widest text-gray-400">Syncing Health Profile...</div>;

    const cards = [
        { title: 'My Appointments', value: stats?.my_appointments || 0, icon: <CalendarDays />, color: 'bg-[var(--color-primary)]', sub: 'Future consultations' },
        { title: 'UHID Verified', value: '1', icon: <ShieldCheck />, color: 'bg-indigo-600', sub: 'Global E-Card active' },
    ];

    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-8">
            <h2 className="text-4xl font-black italic uppercase text-gray-800 tracking-tighter mb-2">Health Passport</h2>
            <p className="font-bold tracking-widest text-xs text-gray-400 uppercase mb-10 pl-1">Patient Global ID Overview</p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                {cards.map((card, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-premium p-10 border-2 border-gray-50 flex items-center justify-between shadow-2xl shadow-gray-200/40"
                    >
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">{card.title}</h4>
                            <p className="text-6xl font-black italic tracking-tighter text-gray-900">{card.value}</p>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">{card.sub}</p>
                        </div>
                        <div className={`${card.color} text-white w-24 h-24 rounded-[32px] flex items-center justify-center shadow-2xl shadow-gray-400/20`}>
                            {card.icon}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 card-premium p-10 border-2 border-[var(--color-primary)] bg-gradient-to-b from-green-50/50 to-white flex flex-col items-center justify-center text-center shadow-2xl shadow-green-900/5">
                    <div className="p-8 bg-white rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center mb-6">
                        <div className="w-32 h-32 bg-gray-50 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden">
                            <QrCode size={80} className="text-gray-300" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent"></div>
                        </div>
                    </div>
                    <h3 className="text-xl font-black uppercase italic text-gray-900 tracking-tighter">My Global E-Card</h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 px-10 leading-relaxed italic">UHID: {user?.username}</p>
                    <button className="w-full mt-6 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-xl shadow-gray-900/10">
                        <Download size={14} /> Download Digital ID
                    </button>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm leading-relaxed max-w-[180px]">Scan this card at any global verified hospital desk.</p>
                </div>

                <div className="lg:col-span-8 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <Link to="/dashboard/patient/book" className="group">
                            <div className="card-premium p-10 h-full border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center hover:bg-white hover:border-green-300 transition-all hover:shadow-2xl hover:shadow-green-900/5">
                                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                                    <HeartPulse size={32} />
                                </div>
                                <h4 className="text-xl font-black italic uppercase text-gray-900 tracking-tighter">New Consultation</h4>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2 max-w-[200px] leading-relaxed">Book seats via online booking network.</p>
                            </div>
                        </Link>

                        <Link to="/dashboard/patient/history" className="group">
                            <div className="card-premium p-10 h-full border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center hover:bg-white hover:border-blue-300 transition-all hover:shadow-2xl hover:shadow-blue-900/5">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                                    <History size={32} />
                                </div>
                                <h4 className="text-xl font-black italic uppercase text-gray-900 tracking-tighter">Unified History</h4>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2 max-w-[200px] leading-relaxed">My global medical journals and visits.</p>
                            </div>
                        </Link>
                    </div>

                    <div className="card-premium p-8 border border-gray-100 bg-gray-50 flex gap-6 items-center shadow-inner">
                        <Smartphone size={32} className="text-gray-300 shrink-0" />
                        <div>
                            <h4 className="text-sm font-black uppercase text-gray-800 tracking-widest mb-1 italic">Real-Time Sync Operational</h4>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">Your data is currently syncing across the global E-Card ledger system. Last update: Just now.</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PatientOverview;
