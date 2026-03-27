import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Stethoscope, HeartPulse, ClipboardCheck, History, ScanFace, Activity, CheckCircle, Clock, ChevronRight, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const DoctorOverview = () => {
    const [stats, setStats] = useState<any>(null);
    const [queueCount, setQueueCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('access');
            const [statsRes, queueRes] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/auth/dashboard-stats/', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://127.0.0.1:8000/api/appointments/queue/', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setStats(statsRes.data);
            setQueueCount(queueRes.data.count || (queueRes.data.results || queueRes.data).length || 0);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // 30s auto-sync
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
    );

    const cards = [
        { 
            title: 'Waiting List', 
            value: queueCount, 
            icon: <UserCheck size={32} />, 
            color: 'from-emerald-600 to-emerald-700', 
            sub: 'Patients waiting',
            trend: 'Live'
        },
        { 
            title: 'Finished', 
            value: stats?.patients_treated || 0, 
            icon: <ClipboardCheck size={32} />, 
            color: 'from-gray-800 to-gray-900', 
            sub: 'Completed visits',
            trend: 'Total'
        },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-7xl mx-auto pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                <div>
                <h2 className="text-5xl font-black italic uppercase text-gray-900 tracking-tighter leading-none mb-3 font-['Montserrat']">Doctor's Desk</h2>
                <p className="font-bold tracking-[0.4em] text-[10px] text-gray-400 uppercase pl-1 font-['Montserrat']">Manage your patients and visits</p>
                </div>
                <div className="bg-white px-8 py-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <Activity size={20} className="text-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900">Connected</span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10 mb-12">
                {cards.map((card, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-premium p-10 relative overflow-hidden group shadow-3xl shadow-emerald-900/5 bg-white border border-gray-50 h-full"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-[0.02] transition-opacity`}></div>
                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 font-['Montserrat']">{card.title}</h4>
                                <p className="text-7xl font-black italic tracking-tighter text-gray-900">{card.value}</p>
                            </div>
                            <div className={`w-20 h-20 rounded-[30px] bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                                {card.icon}
                            </div>
                        </div>
                        <div className="flex items-center justify-between relative z-10">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-['Montserrat'] group-hover:text-emerald-600 transition-colors">{card.sub}</p>
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">{card.trend}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                <Link to="/dashboard/doctor/treatment" className="lg:col-span-8 group relative overflow-hidden h-full">
                    <div className="card-premium h-full p-12 bg-white text-gray-900 border border-gray-100 shadow-xl shadow-gray-200/50 transition-all duration-500 group-hover:-translate-y-1 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-transparent pointer-events-none"></div>
                        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-400/10 transition-colors duration-700"></div>
                        
                        <div className="flex justify-between items-start mb-12 relative z-10">
                            <div>
                                <h3 className="text-5xl font-black italic uppercase tracking-tighter mb-6 flex items-center gap-6 leading-tight">
                                   Check In <br/> Patient <ChevronRight size={48} className="text-emerald-600 group-hover:translate-x-4 transition-transform duration-500" />
                                </h3>
                                <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] max-w-sm leading-loose font-['Montserrat']">View patient records and start treatment.</p>
                            </div>
                            <div className="bg-emerald-50 p-10 rounded-[48px] flex items-center justify-center shrink-0 border border-emerald-100 shadow-sm group-hover:scale-110 transition-transform duration-700">
                                <ScanFace size={72} className="text-emerald-600" />
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 relative z-10">
                            {[
                                { icon: <CheckCircle size={14}/>, text: 'Confirm Patient' },
                                { icon: <History size={14}/>, text: 'View History' },
                                { icon: <HeartPulse size={14}/>, text: 'Check Vitals' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl hover:bg-emerald-50 hover:border-emerald-100 transition-colors">
                                    <span className="text-emerald-600">{item.icon}</span> {item.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </Link>

                <div className="lg:col-span-4 flex flex-col gap-10">
                    <div className="card-premium p-10 border border-gray-100 bg-white flex flex-col items-center justify-center text-center shadow-xl shadow-gray-200/50 group h-full">
                        <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-[36px] flex items-center justify-center mb-8 border border-gray-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:scale-110 transition-all duration-500">
                            <Activity size={48} />
                        </div>
                        <h4 className="text-2xl font-black italic uppercase text-gray-900 tracking-tighter">Health Analysis</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose mt-4 px-6 font-['Montserrat']">Patient health records and reports are being updated.</p>
                        <div className="w-full h-1 bg-gray-50 rounded-full mt-10 overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: '65%' }} 
                                className="h-full bg-emerald-500"
                                transition={{ duration: 2, ease: "easeOut" }}
                            />
                        </div>
                    </div>

                    <div className="card-premium p-8 bg-gray-50 border border-gray-100 flex items-center gap-6">
                        <div className="p-3 bg-white rounded-xl shadow-sm"><Clock size={20} className="text-emerald-500" /></div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Session Status</p>
                            <p className="text-xs font-black italic uppercase text-gray-900">Online @ Terminal-09</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .card-premium {
                    border-radius: 48px;
                }
            `}</style>
        </motion.div>
    );
};

export default DoctorOverview;
