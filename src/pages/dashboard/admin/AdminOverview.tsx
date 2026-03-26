import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Building2, Users, Pill, Activity, ShieldAlert, ChevronRight, CheckCircle, Smartphone, Globe, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminOverview = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('access');
                const res = await axios.get('http://127.0.0.1:8000/api/auth/dashboard-stats/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
    );

    const cards = [
        { title: 'Total Hospitals', value: stats?.total_hospitals || 0, icon: <Building2 size={32} />, color: 'from-emerald-600 to-emerald-700', sub: 'Hospitals in the system' },
        { title: 'Total Patients', value: stats?.total_patients || 0, icon: <Users size={32} />, color: 'from-gray-800 to-gray-900', sub: 'All registered patients' },
        { title: 'Total Medicines', value: stats?.total_medicines || 0, icon: <Pill size={32} />, color: 'from-emerald-900 to-[#064E3B]', sub: 'Medicines in the database' },
        { title: 'Pending Approval', value: stats?.pending_hospitals || 0, icon: <ShieldAlert size={32} />, color: 'from-orange-500 to-red-600', sub: 'Hospitals waiting for approval' },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-7xl mx-auto pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                <div>
                    <h2 className="text-5xl font-black italic uppercase text-gray-900 tracking-tighter leading-none mb-3 font-['Montserrat']">Admin Dashboard</h2>
                    <p className="font-bold tracking-[0.4em] text-[10px] text-gray-400 uppercase pl-1 font-['Montserrat']">Manage hospitals, patients and medicines</p>
                </div>
                <div className="bg-white px-8 py-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <Globe size={20} className="text-emerald-500 animate-[spin_10s_linear_infinite]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900">System: Online</span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {cards.map((card, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-premium p-8 relative overflow-hidden group shadow-3xl shadow-emerald-900/5 bg-white border border-gray-50 h-full"
                    >
                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 font-['Montserrat']">{card.title}</h4>
                                <p className="text-5xl font-black italic tracking-tighter text-gray-900">{card.value}</p>
                            </div>
                            <div className={`w-14 h-14 rounded-[22px] bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110`}>
                                {card.icon}
                            </div>
                        </div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-['Montserrat'] group-hover:text-emerald-600 transition-colors relative z-10">{card.sub}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    <div className="card-premium p-12 bg-[#064E3B] text-white shadow-4xl shadow-emerald-900/40 relative overflow-hidden h-[450px] flex flex-col justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent pointer-events-none"></div>
                        <div className="absolute -right-20 -top-20 w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none"></div>
                        
                        <div className="relative z-10 mb-10">
                            <h3 className="text-5xl font-black italic uppercase tracking-tighter leading-tight mb-6">
                                System Status: <br/> All Good
                            </h3>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-3 px-6 py-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
                                    <CheckCircle size={16} className="text-emerald-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Records: Active</span>
                                </div>
                                <div className="flex items-center gap-3 px-6 py-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
                                    <Smartphone size={16} className="text-blue-300" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Uptime: 99.8%</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 relative z-10">
                            <Link to="/dashboard/global_admin/hospitals" className="bg-white text-gray-900 p-8 rounded-[36px] flex items-center justify-between group/btn hover:scale-[1.02] transition-all">
                                <div>
                                    <h4 className="text-lg font-black italic uppercase tracking-tighter">Manage Hospitals</h4>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1 font-['Montserrat']">Approve and view hospitals</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl group-hover/btn:bg-emerald-600 group-hover/btn:text-white transition-all">
                                    <ChevronRight size={24} />
                                </div>
                            </Link>

                            <Link to="/dashboard/global_admin/medicines" className="bg-white text-gray-900 p-8 rounded-[36px] flex items-center justify-between group/btn hover:scale-[1.02] transition-all">
                                <div>
                                    <h4 className="text-lg font-black italic uppercase tracking-tighter">Manage Medicines</h4>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1 font-['Montserrat']">Add and update medicines</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl group-hover/btn:bg-emerald-600 group-hover/btn:text-white transition-all">
                                    <ChevronRight size={24} />
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="card-premium p-10 bg-white border border-gray-100 flex flex-col items-center justify-center text-center shadow-xl shadow-gray-200/50 group">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[32px] flex items-center justify-center mb-6 shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                                <Activity size={40} />
                            </div>
                            <h4 className="text-xl font-black italic uppercase text-gray-900 tracking-tighter">Activity Monitor</h4>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] leading-loose mt-4 px-6 font-['Montserrat']">View all recent actions and activity across the system.</p>
                        </div>

                        <div className="card-premium p-10 bg-white border border-gray-100 flex flex-col items-center justify-center text-center shadow-xl shadow-gray-200/50 group">
                            <div className="w-20 h-20 bg-gray-900 text-white rounded-[32px] flex items-center justify-center mb-6 shadow-inner group-hover:bg-emerald-600 transition-all duration-500">
                                <ShieldAlert size={40} />
                            </div>
                            <h4 className="text-xl font-black italic uppercase text-gray-900 tracking-tighter">Data Security</h4>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] leading-loose mt-4 px-6 font-['Montserrat']">All patient data is encrypted and kept safe at all times.</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-10">
                    <div className="card-premium p-10 bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 flex flex-col h-full">
                        <h4 className="text-xl font-black italic uppercase text-gray-900 tracking-tighter mb-10 pb-6 border-b border-gray-50 flex items-center gap-4">
                            <Briefcase size={24} className="text-emerald-600" /> Quick Actions
                        </h4>
                        <div className="space-y-6 flex-1">
                            {[
                                { text: 'Download Audit Report', color: 'bg-emerald-600' },
                                { text: 'Export Medicine List', color: 'bg-gray-900' },
                                { text: 'Send System Notice', color: 'bg-orange-500' },
                                { text: 'Pause System', color: 'bg-red-600' }
                            ].map((action, i) => (
                                <button key={i} className={`w-full py-5 ${action.color} text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all font-['Montserrat']`}>
                                    {action.text}
                                </button>
                            ))}
                        </div>
                        <div className="mt-12 p-8 bg-gray-50 rounded-[36px] text-center">
                            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-300 font-['Montserrat']">Terminal ID: MAIN-001 <br/> Version 2.0.4-Stable</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .card-premium { border-radius: 48px; }
            `}</style>
        </motion.div>
    );
};

export default AdminOverview;
