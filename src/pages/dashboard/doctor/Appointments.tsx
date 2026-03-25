import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Calendar, UserCheck, Stethoscope, Clock, ChevronRight, ChevronLeft, Search, User } from 'lucide-react';

const Appointments = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchAppts = async () => {
            try {
                const token = localStorage.getItem('access');
                const res = await axios.get('http://127.0.0.1:8000/api/appointments/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAppointments(res.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchAppts();
    }, []);

    const handleCancel = async (id: number) => {
        try {
            const token = localStorage.getItem('access');
            await axios.post(`http://127.0.0.1:8000/api/appointments/${id}/cancel/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
        } catch (err) {
            alert('Cancel failed');
        }
    };

    const filteredAppts = appointments.filter(a => 
        a.patient?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.patient?.uhid?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredAppts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAppts = filteredAppts.slice(startIndex, startIndex + itemsPerPage);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 pb-32 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h2 className="text-4xl font-black italic uppercase text-gray-800 tracking-tighter mb-2">My Appointments</h2>
                    <p className="font-bold tracking-widest text-xs text-gray-400 uppercase pl-1 flex items-center gap-2">
                        <Activity className="text-blue-500" size={14} /> Clinical Queue Management
                    </p>
                </div>

                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by Patient Name or UHID..." 
                        className="w-full bg-white border-2 border-gray-100 py-4 pl-12 pr-6 rounded-2xl font-bold uppercase text-[10px] tracking-widest focus:border-blue-500 focus:outline-none transition-all shadow-sm group-hover:shadow-md"
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6 mb-12">
                <div className="card-premium p-6 flex justify-between items-center bg-gradient-to-br from-blue-700 to-indigo-900 text-white shadow-2xl shadow-blue-900/20 border-0 overflow-hidden relative group">
                    <div className="absolute -right-4 -bottom-4 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-transform">
                        <Stethoscope size={100} />
                    </div>
                    <div className="z-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-1">Queue Size</h4>
                        <p className="text-5xl font-black italic tracking-tighter">{appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length}</p>
                    </div>
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/10">
                        <UserCheck size={28} className="text-white" />
                    </div>
                </div>

                <div className="card-premium p-6 flex justify-between items-center bg-white border border-gray-100 shadow-xl shadow-gray-200/50">
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Today's Load</h4>
                        <p className="text-4xl font-black italic tracking-tighter text-gray-800">{appointments.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                        <Calendar size={24} />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-gray-50 rounded-[24px] animate-pulse border border-gray-100" />
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {paginatedAppts.map((a, idx) => (
                            <motion.div 
                                key={a.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative bg-white rounded-[32px] p-2 pr-8 border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all hover:-translate-y-1 flex flex-col md:flex-row items-center gap-6"
                            >
                                <div className="md:w-32 py-6 px-4 bg-gray-50 rounded-[28px] flex flex-col items-center justify-center text-center border border-gray-100 group-hover:bg-blue-50/50 transition-colors">
                                    <Clock className="text-blue-500 mb-2" size={18} />
                                    <span className="text-xl font-black italic tracking-tighter text-gray-900 leading-none">
                                        {new Date(a.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}
                                    </span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-2">
                                        {new Date(a.appointment_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>

                                <div className="flex-1 flex flex-col md:flex-row items-center gap-6 py-4 md:py-0 w-full md:w-auto">
                                    <div className="w-16 h-16 bg-blue-100/50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <User className="text-blue-600" size={32} />
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h5 className="text-xl font-black italic uppercase tracking-tighter text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                                            {a.patient?.full_name || 'Anonymous Patient'}
                                        </h5>
                                        <div className="flex items-center justify-center md:justify-start gap-2">
                                            <span className="text-[10px] font-black tracking-widest text-blue-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase">
                                                {a.patient?.uhid || a.patient?.user?.username || 'GUEST'}
                                            </span>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Global Patient System</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto pb-4 md:pb-0">
                                    <span className={`px-5 py-2.5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-sm border ${
                                        a.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-100' :
                                        a.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        'bg-red-50 text-red-600 border-red-100 opacity-60'}`}>
                                        {a.status}
                                    </span>
                                    
                                    {(a.status === 'pending' || a.status === 'confirmed') && (
                                        <button 
                                            onClick={() => handleCancel(a.id)}
                                            className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 group/btn"
                                        >
                                            Dismiss <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredAppts.length === 0 && (
                        <div className="card-premium p-20 text-center bg-gray-50/50 border-dashed border-2 border-gray-200">
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6">
                                <Stethoscope size={40} className="text-gray-200" />
                            </div>
                            <h3 className="text-2xl font-black italic uppercase text-gray-300 tracking-tighter mb-2">No Appointments</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Queue is currently clear of assignments</p>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center bg-white p-6 rounded-[32px] border border-gray-100 shadow-lg shadow-gray-200/50">
                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                PAGE {currentPage} <span className="mx-2 opacity-30">/</span> {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white disabled:opacity-30 disabled:hover:bg-gray-50 disabled:hover:text-gray-400 transition-all shadow-sm"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button 
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white disabled:opacity-30 disabled:hover:bg-gray-50 disabled:hover:text-gray-400 transition-all shadow-sm"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

// Add Activity icon import
const Activity = ({ className, size }: { className?: string, size?: number }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size || 24} 
        height={size || 24} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
);

export default Appointments;
