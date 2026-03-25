import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Building2, Users, Pill, Activity, ShieldAlert } from 'lucide-react';

const AdminOverview = () => {
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

    if (loading) return <div className="p-8 font-black uppercase tracking-widest text-gray-400">Syncing Global Data...</div>;

    const cards = [
        { title: 'Total Hospitals', value: stats?.total_hospitals || 0, icon: <Building2 />, color: 'bg-blue-500', sub: 'Verified across network' },
        { title: 'Pending Approval', value: stats?.pending_hospitals || 0, icon: <ShieldAlert />, color: 'bg-orange-500', sub: 'Action required' },
        { title: 'Global Patients', value: stats?.total_patients || 0, icon: <Users />, color: 'bg-green-500', sub: 'Registered UHIDs' },
        { title: 'Medicine Master', value: stats?.total_medicines || 0, icon: <Pill />, color: 'bg-purple-500', sub: 'Drug database size' },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8">
            <h2 className="text-4xl font-black italic uppercase text-gray-800 tracking-tighter mb-2">Global Overview</h2>
            <p className="font-bold tracking-widest text-xs text-gray-400 uppercase mb-10 pl-1">Network-wide analytics</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {cards.map((card, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-premium p-6 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col justify-between"
                    >
                        <div className="flex justify-between items-start">
                            <div className={`${card.color} text-white p-3 rounded-2xl shadow-lg`}>
                                {card.icon}
                            </div>
                            <span className="text-4xl font-black italic tracking-tighter text-gray-900">{card.value}</span>
                        </div>
                        <div className="mt-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{card.title}</h4>
                            <p className="text-[10px] font-bold text-gray-500 uppercase">{card.sub}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
                <div className="card-premium p-8 bg-gray-50 border-dashed border-2 border-gray-200 flex flex-col items-center justify-center text-center">
                    <Activity size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-xl font-black uppercase italic text-gray-400 tracking-tighter">System Health</h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest max-w-xs mt-2">All global servers are operational. Real-time monitoring enabled.</p>
                </div>
                
                <div className="card-premium p-8 border border-gray-100">
                    <h3 className="text-lg font-black uppercase italic text-gray-800 tracking-tighter mb-4">Quick Actions</h3>
                    <div className="space-y-4">
                        <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-colors">Generate Network Audit</button>
                        <button className="w-full py-4 border-2 border-gray-100 text-gray-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-colors">Export Global Ledger</button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminOverview;
