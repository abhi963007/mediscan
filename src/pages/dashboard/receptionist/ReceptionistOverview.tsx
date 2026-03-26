import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { CalendarDays, ScanFace, UserPlus, FileCheck, Landmark, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReceptionistOverview = () => {
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

    if (loading) return <div className="p-8 font-black uppercase tracking-widest text-gray-400">Loading...</div>;

    const cards = [
        { title: "Today's Visits", value: stats?.today_appointments || 0, icon: <CalendarDays />, color: 'bg-[var(--color-primary)]', sub: 'Upcoming for today' },
        { title: 'Ready for Visit', value: stats?.pending_checkins || 0, icon: <Landmark />, color: 'bg-indigo-600', sub: 'Patients waiting' },
    ];

    return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-8">
            <h2 className="text-4xl font-black italic uppercase text-gray-800 tracking-tighter mb-2">Check-In Desk</h2>
            <p className="font-bold tracking-widest text-xs text-gray-400 uppercase mb-10 pl-1 font-['Montserrat']">Register and check-in patients easily</p>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
                {cards.map((card, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-premium p-10 border-2 border-gray-50 flex justify-between items-center shadow-2xl shadow-gray-200/40 hover:scale-[1.01] transition-transform"
                    >
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">{card.title}</h4>
                            <p className="text-5xl font-black italic tracking-tighter text-gray-900">{card.value}</p>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 font-['Montserrat']">{card.sub}</p>
                        </div>
                        <div className={`${card.color} text-white w-20 h-20 rounded-[28px] flex items-center justify-center shadow-xl shadow-gray-400/20`}>
                            {card.icon}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <Link to="/dashboard/staff/scan" className="lg:col-span-2 group">
                    <div className="card-premium p-12 bg-gradient-to-br from-indigo-900 to-blue-900 text-white shadow-2xl shadow-indigo-900/40 relative overflow-hidden group-hover:scale-[1.005] transition-transform">
                        <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform">
                            <ScanFace size={240} />
                        </div>
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4 flex items-center gap-3 text-white">
                             Scan Health Card <ScanFace className="text-white/40" />
                        </h3>
                        <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs max-w-sm mb-10 leading-relaxed shadow-sm font-['Montserrat']">Scan a patient's health card to view records and check them in.</p>
                        <div className="bg-white/10 inline-grid grid-cols-2 gap-4 border border-white/20 p-2 rounded-2xl backdrop-blur-md">
                            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Scan Card</div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Medical History</div>
                        </div>
                    </div>
                </Link>

                <Link to="/dashboard/staff/register" className="group">
                    <div className="card-premium p-12 h-full border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center hover:bg-gray-50/50 hover:border-indigo-200 transition-all group-hover:border-solid group-hover:bg-white shadow-none hover:shadow-2xl hover:shadow-indigo-900/5">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                            <UserPlus size={32} />
                        </div>
                        <h4 className="text-xl font-black italic uppercase text-gray-900 tracking-tighter">New Patient</h4>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2 max-w-[160px] leading-relaxed font-['Montserrat']">Register a new patient and issue a health card.</p>
                    </div>
                </Link>
            </div>
        </motion.div>
    );
};

export default ReceptionistOverview;
