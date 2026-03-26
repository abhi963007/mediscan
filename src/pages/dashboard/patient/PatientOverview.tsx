import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { QrCode, CalendarDays, History, Download, Smartphone, ShieldCheck, HeartPulse, Activity, User, ShieldAlert, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const PatientOverview = () => {
    const { user } = useAuth();
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

    const handleDownload = () => {
        if (stats?.qr_code_url) {
            const link = document.createElement('a');
            link.href = `http://127.0.0.1:8000${stats.qr_code_url}`;
            link.download = `MediScan_QR_${user?.username}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert('QR code not available for download.');
        }
    };

    if (loading) return (
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
    );

    const cards = [
        { 
            title: 'Past Visits', 
            value: stats?.my_appointments || 0, 
            icon: <CalendarDays size={32} />, 
            color: 'from-emerald-600 to-emerald-700', 
            sub: 'Past check-ups' 
        },
        { 
            title: 'Status', 
            value: 'Verified', 
            icon: <ShieldCheck size={32} />, 
            color: 'from-gray-800 to-gray-900 text-sm', 
            sub: 'Account Verified' 
        },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-7xl mx-auto pb-32">
            <div className="mb-12">
                <h2 className="text-5xl font-black italic uppercase text-gray-900 tracking-tighter leading-none mb-3 font-['Montserrat']">Health Card</h2>
                <p className="font-bold tracking-[0.4em] text-[10px] text-gray-400 uppercase pl-1 font-['Montserrat']">Your medical records in one place</p>
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
                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 font-['Montserrat']">{card.title}</h4>
                                <p className={`font-black italic tracking-tighter text-gray-900 ${card.value === 'Verified' ? 'text-4xl' : 'text-7xl'}`}>{card.value}</p>
                            </div>
                            <div className={`w-20 h-20 rounded-[30px] bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                                {card.icon}
                            </div>
                        </div>
                        <div className="flex items-center justify-between relative z-10">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-['Montserrat'] group-hover:text-emerald-600 transition-colors">{card.sub}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="card-premium p-10 bg-[#064E3B] text-white flex flex-col items-center justify-center text-center shadow-4xl shadow-emerald-900/40 border-0 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                        <div className="p-8 bg-white/5 rounded-[48px] backdrop-blur-3xl border border-white/10 flex flex-col items-center mb-8 shadow-inner relative z-10 group-hover:scale-105 transition-transform duration-700">
                            <div className="w-48 h-48 bg-white rounded-[40px] flex items-center justify-center shadow-2xl relative overflow-hidden p-4">
                                {stats?.qr_code_url ? (
                                    <img src={`http://127.0.0.1:8000${stats.qr_code_url}`} alt="QR Code" className="w-full h-full object-cover rounded-3xl" />
                                ) : (
                                    <QrCode size={100} className="text-gray-100" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent pointer-events-none"></div>
                            </div>
                        </div>
                        <h3 className="text-2xl font-black uppercase italic text-white tracking-tighter relative z-10 mb-2 font-['Montserrat']">My Health Card</h3>
                        <p className="text-[8px] font-black text-emerald-300/60 uppercase tracking-[0.4em] relative z-10 font-['Montserrat'] mb-8">Card No: {user?.uhid || user?.username}</p>
                        
                        <button onClick={handleDownload} className="w-full py-5 bg-white text-[#064E3B] rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 relative z-10 group/btn font-['Montserrat']">
                            <Download size={18} className="group-hover/btn:-translate-y-1 transition-transform" /> DOWNLOAD CARD
                        </button>
                    </div>

                    <div className="card-premium p-8 bg-white border border-gray-100 flex items-center gap-6 shadow-xl shadow-gray-200/50">
                        <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600"><Smartphone size={24} /></div>
                        <div>
                            <h5 className="font-black uppercase text-[10px] tracking-widest text-gray-900 mb-1">Live Updates</h5>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-['Montserrat']">Last update: Today</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 flex flex-col gap-10">
                    <div className="grid md:grid-cols-2 gap-10 h-full">
                        <Link to="/dashboard/patient/book" className="group h-full">
                            <div className="card-premium h-full p-12 bg-white border-2 border-emerald-50 flex flex-col items-center justify-center text-center transition-all duration-500 group-hover:border-emerald-500 group-hover:shadow-4xl group-hover:shadow-emerald-900/10 hover:-translate-y-1 relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl group-hover:bg-emerald-100 transition-colors"></div>
                                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[32px] flex items-center justify-center mb-8 shadow-inner border border-emerald-100 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                                    <HeartPulse size={40} />
                                </div>
                                <h4 className="text-3xl font-black italic uppercase text-gray-900 tracking-tighter mb-4 group-hover:text-emerald-700 transition-colors">Book Visit</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] max-w-[220px] leading-relaxed font-['Montserrat']">Book an appointment with a doctor at any hospital.</p>
                                <div className="mt-8 flex items-center gap-2 group-hover:translate-x-2 transition-transform text-emerald-500">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Book Now</span> <ChevronRight size={16} />
                                </div>
                            </div>
                        </Link>

                        <Link to="/dashboard/patient/history" className="group h-full">
                            <div className="card-premium h-full p-12 bg-white border-2 border-gray-50 flex flex-col items-center justify-center text-center transition-all duration-500 group-hover:border-gray-900 group-hover:shadow-4xl group-hover:shadow-gray-200/40 hover:-translate-y-1 relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-gray-50 rounded-full blur-3xl group-hover:bg-gray-100 transition-colors"></div>
                                <div className="w-20 h-20 bg-gray-50 text-gray-500 rounded-[32px] flex items-center justify-center mb-8 shadow-inner border border-gray-100 group-hover:scale-110 group-hover:bg-gray-900 group-hover:text-white transition-all duration-500">
                                    <History size={40} />
                                </div>
                                <h4 className="text-3xl font-black italic uppercase text-gray-900 tracking-tighter mb-4 group-hover:text-black transition-colors">Medical History</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] max-w-[220px] leading-relaxed font-['Montserrat']">Check your past visits and prescriptions.</p>
                                <div className="mt-8 flex items-center gap-2 group-hover:translate-x-2 transition-transform text-gray-900">
                                    <span className="text-[10px] font-black uppercase tracking-widest">See Records</span> <ChevronRight size={16} />
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="card-premium p-10 bg-gray-900 text-white shadow-2xl shadow-gray-900/40 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="w-20 h-20 bg-white/10 rounded-3xl backdrop-blur-xl flex items-center justify-center shrink-0 border border-white/20">
                            <ShieldAlert size={40} className="text-emerald-400" />
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="text-xl font-black italic uppercase tracking-tighter mb-2">Your Data is Safe</h4>
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] leading-loose font-['Montserrat']">Your medical records are private. Doctors can only see them when they scan your card.</p>
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

export default PatientOverview;
