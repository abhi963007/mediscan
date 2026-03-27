import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Calendar, UserCheck, Stethoscope, Clock, X, Check, MessageSquare, AlertCircle, LogIn, ChevronRight, Search } from 'lucide-react';

const Appointments = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppt, setSelectedAppt] = useState<any>(null);
    const [suggestion, setSuggestion] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAppts = async () => {
        try {
            const token = localStorage.getItem('access');
            const res = await axios.get('http://127.0.0.1:8000/api/appointments/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(res.data.results || res.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppts();
        const interval = setInterval(fetchAppts, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleUpdateStatus = async (id: number, status: string, suggestionText?: string) => {
        try {
            const token = localStorage.getItem('access');
            await axios.patch(`http://127.0.0.1:8000/api/appointments/${id}/`, { 
                status: status,
                suggestion: suggestionText || null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAppts();
            setShowModal(false);
            setSuggestion('');
        } catch (err) {
            alert('Operation failed');
        }
    };

    const handleCheckIn = async (id: number) => {
        try {
            const token = localStorage.getItem('access');
            await axios.post(`http://127.0.0.1:8000/api/appointments/${id}/check-in/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Patient Checked In: Added to doctor queue.');
            fetchAppts();
        } catch (err) {
            alert('Check-in failed. Patient might already be in queue.');
        }
    };

    const filteredAppts = appointments.filter(a => 
        a.patient_username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.appointment_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-7xl mx-auto pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                <div>
                    <h2 className="text-5xl font-black italic uppercase text-gray-900 tracking-tighter mb-2 font-['Montserrat']">Appointments</h2>
                    <p className="font-bold tracking-[0.3em] text-[10px] text-gray-400 uppercase pl-1 font-['Montserrat']">Manage patient appointments and check-ins</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input type="text" placeholder="SEARCH PATIENT NAME OR ID..." 
                        className="w-full bg-white border-2 border-gray-100 py-5 pl-14 pr-6 rounded-3xl font-black uppercase text-[10px] tracking-widest focus:border-green-500 focus:outline-none transition-all shadow-sm"
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8 mb-12">
                <div className="card-premium p-8 flex justify-between items-center bg-gray-900 text-white shadow-2xl shadow-gray-900/20 border-0 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform"><Clock size={100} /></div>
                    <div className="relative z-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">To Confirm</h4>
                        <p className="text-5xl font-black italic tracking-tighter">{appointments.filter(a => a.status === 'pending').length}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/10 rounded-[24px] flex items-center justify-center backdrop-blur-md border border-white/10 relative z-10">
                        <AlertCircle size={32} className="text-amber-400" />
                    </div>
                </div>

                <div className="card-premium p-8 flex justify-between items-center bg-white border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform"><Check size={100} /></div>
                    <div className="relative z-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Confirmed</h4>
                        <p className="text-5xl font-black italic tracking-tighter text-gray-900">{appointments.filter(a => a.status === 'confirmed').length}</p>
                    </div>
                    <div className="w-16 h-16 bg-green-50 rounded-[24px] flex items-center justify-center text-green-600 border border-green-100 relative z-10">
                        <UserCheck size={32} />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center p-32">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="font-black uppercase tracking-[0.4em] text-gray-300 text-[10px] animate-pulse">Loading Appointments...</p>
                </div>
            ) : (
                <div className="bg-white rounded-[40px] shadow-3xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative group/table">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 to-transparent opacity-0 group-hover/table:opacity-100 transition-opacity pointer-events-none"></div>
                    <table className="w-full text-left relative z-10">
                        <thead>
                            <tr className="bg-[#F8FAFC] border-b border-gray-100 uppercase text-[9px] font-black tracking-[0.2em] text-gray-400 font-['Montserrat']">
                                <th className="p-8">Patient Info</th>
                                <th className="p-8">Doctor</th>
                                <th className="p-8 text-center">Status</th>
                                <th className="p-8">Fees</th>
                                <th className="p-8 text-right pr-12">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredAppts.map(a => (
                                <tr key={a.id} className="transition-all hover:bg-green-50/10 group/row">
                                    <td className="p-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-[22px] bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 font-black italic shadow-inner group-hover/row:bg-white transition-colors">
                                                {a.patient_username?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-black uppercase text-base italic tracking-tighter text-gray-900 leading-tight group-hover/row:text-green-700 transition-colors">
                                                    {a.patient_username}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1.5 font-['Montserrat']">
                                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{a.appointment_id || 'RESERVATION'}</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase">UHID: {a.patient_username}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white border border-gray-100 text-green-600 rounded-2xl shadow-sm group-hover/row:scale-110 transition-transform">
                                                <Stethoscope size={20} />
                                            </div>
                                            <div>
                                                <div className="font-black uppercase text-xs tracking-tight text-gray-800 italic">DR. {a.doctor_username}</div>
                                                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 font-['Montserrat']">{a.appointment_date} @ {a.time_slot}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8 text-center px-4">
                                        <span className={`px-5 py-2.5 rounded-2xl font-black uppercase text-[9px] tracking-[0.2em] shadow-sm border inline-block min-w-[120px] transition-all group-hover/row:scale-105 ${
                                            a.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            a.status === 'checked_in' ? 'bg-blue-50 text-blue-700 border-blue-100 animate-pulse' :
                                            a.status === 'in_progress' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                            a.status === 'completed' ? 'bg-gray-50 text-gray-400 border-gray-200' :
                                            a.status === 'pending' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                                            'bg-red-50 text-red-600 border-red-100'}`}>
                                            {a.status}
                                        </span>
                                    </td>
                                    <td className="p-8">
                                        <div>
                                            <div className="font-black text-sm text-gray-900 italic tracking-tighter">₹{a.fee}</div>
                                            <div className={`text-[9px] font-black uppercase tracking-widest mt-1.5 ${a.payment_status === 'paid' ? 'text-green-500' : 'text-red-400'}`}>
                                                {a.payment_status}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right pr-12">
                                        <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover/row:translate-x-0 group-hover/row:opacity-100 transition-all duration-300">
                                            {a.status === 'pending' && (
                                                <>
                                                    <button 
                                                        onClick={() => handleUpdateStatus(a.id, 'confirmed')}
                                                        className="p-4 bg-emerald-600 text-white rounded-[18px] hover:bg-emerald-700 hover:scale-110 transition-all shadow-xl shadow-emerald-500/20"
                                                        title="Approve Reservation"
                                                    >
                                                        <Check size={20} />
                                                    </button>
                                                    <button 
                                                        onClick={() => { setSelectedAppt(a); setShowModal(true); }}
                                                        className="p-4 bg-gray-900 text-white rounded-[18px] hover:bg-black hover:scale-110 transition-all shadow-xl shadow-gray-900/20 text-xs font-black"
                                                        title="Alternative Suggestion"
                                                    >
                                                        <MessageSquare size={20} />
                                                    </button>
                                                </>
                                            )}
                                            {a.status === 'confirmed' && (
                                                <button 
                                                    onClick={() => handleCheckIn(a.id)}
                                                    className="flex items-center gap-3 bg-emerald-600 text-white px-6 py-4 rounded-[22px] font-black uppercase text-[10px] tracking-widest hover:bg-emerald-700 hover:scale-105 transition-all shadow-xl shadow-emerald-600/30 group/checkin"
                                                >
                                                    <LogIn size={18} className="group-hover/checkin:translate-x-1 transition-transform" /> CHECK IN PATIENT
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Suggestion Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/40">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="bg-white w-full max-w-xl rounded-[48px] p-12 shadow-4xl overflow-hidden relative border border-gray-100"
                        >
                            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600"></div>
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">Suggest New Time</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Choose a different time for the patient</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-all">
                                    <X size={28} className="text-gray-300" />
                                </button>
                            </div>

                            <textarea 
                                className="w-full bg-gray-50 border-2 border-transparent p-8 rounded-[32px] font-bold text-base outline-none focus:bg-white focus:border-emerald-500 transition-all min-h-[200px] mb-10 shadow-inner placeholder:italic placeholder:opacity-40"
                                placeholder="PROVIDE REASONING OR ALTERNATIVE SLOT (E.G. 'HOSPITAL OVERLOAD - SUGGEST 4:00 PM明天')..."
                                value={suggestion}
                                onChange={(e) => setSuggestion(e.target.value)}
                            />

                            <div className="flex gap-5">
                                <button 
                                    onClick={() => handleUpdateStatus(selectedAppt.id, 'cancelled', suggestion)}
                                    className="flex-[2] bg-gray-900 text-white py-6 rounded-[24px] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-gray-900/30 hover:bg-black hover:scale-[1.02] active:scale-95 transition-all font-['Montserrat']"
                                >
                                    SEND SUGGESTION
                                </button>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-50 text-gray-400 py-6 rounded-[24px] font-black uppercase text-[11px] tracking-[0.2em] hover:bg-gray-200 transition-all font-['Montserrat'] border border-gray-100"
                                >
                                    CANCEL
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Appointments;
