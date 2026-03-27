import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
    Calendar, UserCheck, Stethoscope, Clock, ChevronRight, 
    ChevronLeft, Search, User, CheckCircle2, PlayCircle, 
    MoreHorizontal, Timer, RefreshCw
} from 'lucide-react';

const Appointments = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [queue, setQueue] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [totalAppointments, setTotalAppointments] = useState(0);
    const [totalWaiting, setTotalWaiting] = useState(0);
    const itemsPerPage = 6;

    const fetchData = async () => {
        setRefreshing(true);
        try {
            const token = localStorage.getItem('access');
            const [apptsRes, queueRes] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/appointments/', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://127.0.0.1:8000/api/appointment-queue/', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            const apptsData = apptsRes.data.results || apptsRes.data;
            const queueData = queueRes.data.results || queueRes.data;
            
            setAppointments(apptsData);
            setQueue(queueData);
            setTotalAppointments(apptsRes.data.count || apptsData.length);
            setTotalWaiting(queueRes.data.count || queueData.filter((q: any) => q.appointment_status === 'checked_in').length);
            
            setLoading(false);
            setRefreshing(false);
        } catch (err) {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Auto-refresh every 30 seconds for "sync"
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleAction = async (queueId: number, action: 'call-next' | 'complete') => {
        try {
            const token = localStorage.getItem('access');
            await axios.post(`http://127.0.0.1:8000/api/appointment-queue/${queueId}/${action}/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData(); // Sync everything
        } catch (err) {
            alert(`Action ${action} failed`);
        }
    };

    const currentPatient = queue.find(q => q.appointment_status === 'in_progress');
    const waitingPatients = queue.filter(q => q.appointment_status === 'checked_in');

    const filteredAppts = appointments.filter(a => 
        a.patient_username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.appointment_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredAppts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAppts = filteredAppts.slice(startIndex, startIndex + itemsPerPage);

    if (loading) return (
        <div className="p-32 text-center">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-8"></div>
            <p className="font-black italic uppercase tracking-[0.4em] text-gray-300 text-[10px] animate-pulse">Syncing with Clinic Queue...</p>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 pb-32 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
                <div>
                    <h2 className="text-6xl font-black italic uppercase text-gray-900 tracking-tighter leading-none mb-3 font-['Montserrat']">Check-ups</h2>
                    <div className="flex items-center gap-4">
                        <p className="font-bold tracking-[0.4em] text-[10px] text-gray-400 uppercase pl-1 font-['Montserrat'] underline decoration-blue-500/30 decoration-4">Manage Live Waiting List</p>
                        {refreshing && <RefreshCw size={12} className="text-blue-500 animate-spin" />}
                    </div>
                </div>

                <div className="relative w-full md:w-[400px] group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="SEARCH BY PATIENT NAME OR UHID..." 
                        className="w-full bg-white border-2 border-gray-100 py-6 pl-16 pr-8 rounded-3xl font-black uppercase text-[10px] tracking-widest focus:border-blue-600 focus:outline-none transition-all shadow-xl shadow-gray-200/20 group-hover:shadow-2xl font-['Montserrat']"
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
            </div>

            {/* Quick Stats / Active Queue */}
            <div className="grid lg:grid-cols-12 gap-8 mb-16">
                <div className="lg:col-span-4 grid gap-6">
                    <div className="card-premium p-10 flex justify-between items-center bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] text-white shadow-4xl shadow-blue-900/40 border-0 relative overflow-hidden group">
                        <div className="absolute -right-6 -bottom-6 opacity-10 scale-150 rotate-12 transition-transform group-hover:rotate-0"><Stethoscope size={140} /></div>
                        <div className="relative z-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200 mb-3 font-['Montserrat']">Waiting Node</h4>
                            <p className="text-7xl font-black italic tracking-tighter leading-none">{totalWaiting}</p>
                        </div>
                        <div className="w-20 h-20 bg-white/10 rounded-[32px] flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner group-hover/btn:scale-110 transition-transform">
                            <UserCheck size={40} className="text-white" />
                        </div>
                    </div>

                    <div className="card-premium p-10 flex justify-between items-center bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 relative group">
                        <div className="absolute -right-2 -bottom-2 opacity-5 scale-110">
                            <Calendar size={100} className="text-gray-900" />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3 font-['Montserrat']">Total Visits</h4>
                            <p className="text-6xl font-black italic tracking-tighter text-gray-900 leading-none">{totalAppointments}</p>
                        </div>
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center border border-emerald-100">
                            <Calendar size={32} />
                        </div>
                    </div>
                </div>

                {/* Primary Action Card: Currently Serving */}
                <div className="lg:col-span-8">
                    <div className="h-full card-premium p-1 relative overflow-hidden bg-white border border-gray-100 shadow-4xl group/active">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 transition-transform group-hover/active:scale-110"></div>
                        <div className="relative z-10 p-10 flex flex-col h-full bg-white rounded-[44px]">
                            <div className="flex justify-between items-center mb-10">
                                <span className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 font-['Montserrat'] bg-blue-50/50 px-6 py-2 rounded-full border border-blue-100">
                                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></div> Live Session
                                </span>
                                {currentPatient && <span className="text-[10px] font-black uppercase text-gray-400 font-['Montserrat']">Token #{currentPatient.queue_number}</span>}
                            </div>

                            {currentPatient ? (
                                <div className="flex-1 flex flex-col md:flex-row items-center gap-12">
                                    <div className="w-32 h-32 rounded-[48px] bg-blue-100/50 flex items-center justify-center border-4 border-white shadow-xl">
                                        <User size={64} className="text-blue-600" />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-5xl font-black italic uppercase tracking-tight text-gray-900 mb-3 leading-none">{currentPatient.patient_full_name}</h3>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                            <span className="text-[11px] font-black tracking-widest text-emerald-600 uppercase bg-emerald-50 px-4 py-1.5 rounded-xl border border-emerald-100 italic">IN TREATMENT</span>
                                            <span className="text-[11px] font-black tracking-widest text-gray-400 uppercase font-['Montserrat']">ID: {currentPatient.appointment_id}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleAction(currentPatient.id, 'complete')}
                                        className="w-full md:w-auto px-12 py-8 bg-emerald-600 text-white rounded-[32px] font-black italic uppercase tracking-tighter text-lg shadow-4xl shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group/btn"
                                    >
                                        <CheckCircle2 size={24} /> Mark Completed
                                    </button>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                                    <PlayCircle size={64} className="text-gray-100 mb-6" />
                                    <h3 className="text-3xl font-black italic uppercase text-gray-200 tracking-tighter mb-8 italic">No Active Consultation</h3>
                                    {waitingPatients.length > 0 ? (
                                        <button 
                                            onClick={() => handleAction(waitingPatients[0].id, 'call-next')}
                                            className="px-16 py-8 bg-blue-600 text-white rounded-[32px] font-black italic uppercase tracking-tighter text-lg shadow-4xl shadow-blue-500/40 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-4 group/btn"
                                        >
                                            <PlayCircle size={32} /> Call Next Patient (Token #{waitingPatients[0].queue_number})
                                        </button>
                                    ) : (
                                        <div className="text-[10px] font-black uppercase text-gray-300 tracking-[0.3em] font-['Montserrat']">Queue is empty. Relax.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* List Header */}
            <div className="flex items-center gap-8 mb-10 px-4">
                <h3 className="text-2xl font-black italic uppercase text-gray-900 tracking-tighter">Daily Schedule</h3>
                <div className="h-0.5 flex-1 bg-gray-100 rounded-full opacity-50"></div>
            </div>

            {/* Appointment List */}
            <div className="grid gap-6">
                <AnimatePresence mode="popLayout">
                    {paginatedAppts.map((a, idx) => (
                        <motion.div 
                            key={a.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.03 }}
                            className="group relative bg-white rounded-[40px] p-3 pr-10 border border-gray-50 shadow-xl shadow-gray-200/30 hover:shadow-2xl hover:shadow-blue-500/5 transition-all hover:border-blue-100 flex flex-col md:flex-row items-center gap-8 overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1.5 h-full transition-all group-hover:w-3" style={{ 
                                backgroundColor: a.status === 'completed' ? '#10B981' : a.status === 'in_progress' ? '#3B82F6' : a.status === 'checked_in' ? '#8B5CF6' : '#F1F5F9' 
                            }}></div>
                            
                            <div className="md:w-36 py-8 px-6 bg-gray-50/50 rounded-[32px] flex flex-col items-center justify-center text-center border border-gray-100 group-hover:bg-white transition-all shadow-inner">
                                <Clock className="text-gray-300 group-hover:text-blue-500 transition-colors mb-2" size={20} />
                                <span className="text-2xl font-black italic tracking-tighter text-gray-900 leading-none font-['Montserrat']">
                                    {a.time_slot ? a.time_slot.substring(0,5) : '--:--'}
                                </span>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mt-3 font-['Montserrat']">
                                    TOKEN NOT SET
                                </span>
                            </div>

                            <div className="flex-1 flex flex-col md:flex-row items-center gap-8 py-4 md:py-0 w-full md:w-auto">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform">
                                    <User className="text-blue-400" size={32} />
                                </div>
                                <div className="text-center md:text-left flex-1">
                                    <h5 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 group-hover:text-blue-600 transition-colors mb-1.5">
                                        {a.patient_full_name || 'Anonymous Patient'}
                                    </h5>
                                    <div className="flex items-center justify-center md:justify-start gap-3 font-['Montserrat']">
                                        <span className="text-[10px] font-black tracking-widest text-[#1E3A8A] uppercase flex items-center gap-2">
                                            <Timer size={12} /> Appointment #{a.appointment_id.slice(-6)}
                                        </span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">UHID: {a.patient_username}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto pb-4 md:pb-0">
                                <span className={`px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] border shadow-sm transition-all ${
                                    a.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                    a.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-100 animate-pulse' :
                                    a.status === 'checked_in' ? 'bg-blue-50 text-blue-600 border-blue-100 italic' :
                                    a.status === 'confirmed' ? 'bg-gray-50 text-gray-500 border-gray-100' :
                                    'bg-red-50 text-red-600 border-red-100 opacity-60'}`}>
                                    {a.status.replace('_', ' ')}
                                </span>
                                <div className="flex gap-4">
                                     <button className="text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-blue-600 transition-colors flex items-center gap-2 group/icon">
                                        <MoreHorizontal size={16} /> Details
                                     </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredAppts.length === 0 && (
                    <div className="card-premium p-24 text-center bg-gray-50 border-2 border-dashed border-gray-200 shadow-inner">
                        <Stethoscope size={64} className="text-gray-100 mx-auto mb-8" />
                        <h3 className="text-3xl font-black italic uppercase text-gray-200 tracking-tighter">No Scheduled Visits</h3>
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-300 mt-4 font-['Montserrat'] italic">Empty Registry for the current filter</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-12 flex justify-between items-center bg-white p-6 rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/40">
                    <div className="pl-6 text-[11px] font-black uppercase tracking-[0.3em] text-gray-300 font-['Montserrat']">
                        NODE <span className="text-blue-600">{currentPage}</span> <span className="mx-3 opacity-20">OF</span> {totalPages}
                    </div>
                    <div className="flex gap-4">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="w-16 h-16 rounded-[28px] bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white disabled:opacity-20 transition-all"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="w-16 h-16 rounded-[28px] bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white disabled:opacity-20 transition-all"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                .card-premium { border-radius: 48px; }
                .shadow-4xl {
                    box-shadow: 0 40px 100px -20px rgba(30, 58, 138, 0.15), 0 30px 60px -30px rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </motion.div>
    );
};

export default Appointments;
