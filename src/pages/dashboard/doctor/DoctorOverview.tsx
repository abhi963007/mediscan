import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Stethoscope, HeartPulse, ClipboardCheck, History, ScanFace, Activity, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const DoctorOverview = () => {
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

    if (loading) return <div className="p-8 font-black uppercase tracking-widest text-gray-400">Loading Clinical Desk...</div>;

    const cards = [
        { title: 'Appointments Today', value: stats?.my_appointments_today || 0, icon: <HeartPulse />, color: 'bg-blue-600', sub: 'Assigned queue' },
        { title: 'Patients Treated', value: stats?.patients_treated || 0, icon: <ClipboardCheck />, color: 'bg-green-600', sub: 'Lifetime global consults' },
    ];

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8">
            <h2 className="text-4xl font-black italic uppercase text-gray-800 tracking-tighter mb-2">Clinical Desktop</h2>
            <p className="font-bold tracking-widest text-xs text-gray-400 uppercase mb-10 pl-1 font-['Montserrat']">Specialist Consultation Suite</p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                {cards.map((card, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-premium p-10 border-2 border-gray-50 flex items-center justify-between shadow-2xl shadow-blue-900/5 hover:scale-[1.01] transition-transform"
                    >
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">{card.title}</h4>
                            <p className="text-6xl font-black italic tracking-tighter text-gray-900">{card.value}</p>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 font-['Montserrat']">{card.sub}</p>
                        </div>
                        <div className={`${card.color} text-white w-24 h-24 rounded-[32px] flex items-center justify-center shadow-2xl shadow-gray-400/20`}>
                            {card.icon}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                <Link to="/dashboard/doctor/treatment" className="lg:col-span-8 group relative overflow-hidden">
                    <div className="card-premium p-12 bg-gradient-to-br from-blue-900 to-indigo-900 text-white shadow-2xl shadow-blue-900/30 group-hover:scale-[1.005] transition-transform">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-4 flex items-center gap-3 text-white">
                                   Open Global Terminal <Activity className="text-white/40 animate-pulse" />
                                </h3>
                                <p className="text-blue-200 font-bold uppercase tracking-widest text-xs max-w-sm leading-relaxed font-['Montserrat']">Scan any global E-Card to fetch complete diagnostic history and log new treatments into the registry.</p>
                            </div>
                            <div className="bg-white/10 p-6 rounded-[32px] flex items-center justify-center backdrop-blur-md shrink-0 border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
                                <ScanFace size={56} className="text-white" />
                            </div>
                        </div>
                        
                        <div className="flex gap-6">
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-blue-500/30 border border-blue-400/30 px-6 py-3 rounded-2xl shadow-lg shadow-blue-900/50 backdrop-blur-sm">
                                <CheckCircle size={14} className="text-blue-300" /> Unlock EMR
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-white/10 border border-white/20 px-6 py-3 rounded-2xl shadow-lg shadow-blue-900/50 backdrop-blur-sm">
                                <History size={14} className="text-blue-200" /> Issue Prescriptions
                            </div>
                        </div>
                    </div>
                </Link>

                <div className="lg:col-span-4 card-premium p-12 border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center opacity-70 cursor-default">
                    <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-[28px] flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                        <Stethoscope size={40} />
                    </div>
                    <h4 className="text-xl font-black italic uppercase text-gray-400 tracking-tighter">Clinical Stats</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed mt-4 max-w-[180px] font-['Montserrat']">Statistical visualization and clinic performance graphs coming in next sync.</p>
                </div>
            </div>
        </motion.div>
    );
};

export default DoctorOverview;
