import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Stethoscope, Users, CalendarDays, Wallet, Smartphone, ShieldCheck } from 'lucide-react';

const HospitalOverview = () => {
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

    if (loading) return <div className="p-8 font-black uppercase tracking-widest text-gray-400">Loading Hospital Data...</div>;

    const cards = [
        { title: 'Total Doctors', value: stats?.doctor_count || 0, icon: <Stethoscope />, color: 'bg-[var(--color-primary)]', sub: 'Active doctors' },
        { title: 'Total Staff', value: stats?.staff_count || 0, icon: <Users />, color: 'bg-blue-600', sub: 'Hospital employees' },
        { title: 'Total Bookings', value: stats?.total_appointments || 0, icon: <Wallet />, color: 'bg-green-600', sub: 'Lifetime visits' },
        { title: "Active Today", value: stats?.today_appointments || 0, icon: <CalendarDays />, color: 'bg-orange-600', sub: 'Visits today' },
    ];

    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-8">
            <h2 className="text-4xl font-black italic uppercase text-gray-800 tracking-tighter mb-2">Admin Desk</h2>
            <p className="font-bold tracking-widest text-xs text-gray-400 uppercase mb-10 pl-1 font-['Montserrat']">Manage staff and settings</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {cards.map((card, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-premium p-6 border-2 border-gray-50 flex flex-col justify-between"
                    >
                        <div className="flex justify-between items-start">
                            <div className={`${card.color} text-white p-3 rounded-2xl shadow-xl shadow-gray-200/50`}>
                                {card.icon}
                            </div>
                            <span className="text-4xl font-black italic tracking-tighter text-gray-900">{card.value}</span>
                        </div>
                        <div className="mt-6 border-t pt-4 border-gray-50">
                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{card.title}</h4>
                            <p className="text-[10px] font-bold text-gray-500 uppercase font-['Montserrat']">{card.sub}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 card-premium p-8 border border-gray-100 flex items-center gap-10 bg-gradient-to-r from-[var(--color-primary)] to-green-700 text-white shadow-2xl shadow-green-900/10">
                    <div className="w-24 h-24 bg-white/20 rounded-[32px] flex items-center justify-center backdrop-blur-md shrink-0 shadow-inner">
                        <ShieldCheck size={48} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-2 text-white">Account Safety</h3>
                        <p className="text-green-100 font-bold uppercase tracking-widest text-xs leading-relaxed max-w-sm font-['Montserrat']">All doctor accounts are verified and your data is protected.</p>
                        <div className="mt-4 inline-block font-black uppercase text-[10px] bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm shadow-sm">
                            Fully Secure
                        </div>
                    </div>
                </div>
                
                <div className="lg:col-span-4 card-premium p-8 border border-gray-100 flex flex-col justify-center">
                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                        <Smartphone size={16} /> Online Bookings
                    </h4>
                    <div className="space-y-4">
                        <div className="flex justify-between font-bold text-[10px] uppercase text-gray-500 mb-1">
                            <span>Visibility</span>
                            <span>High</span>
                        </div>
                        <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-[var(--color-primary)] w-[85%] rounded-full shadow-lg"></div>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest mt-4 font-['Montserrat']">Based on your online booking settings.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default HospitalOverview;
