import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Calendar, UserCheck, Stethoscope } from 'lucide-react';

const Appointments = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8">
            <h2 className="text-4xl font-black italic uppercase text-gray-800 tracking-tighter mb-2">My Appointments</h2>
            <p className="font-bold tracking-widest text-xs text-gray-400 uppercase mb-10 pl-1">Clinical Queue</p>

            <div className="grid lg:grid-cols-3 gap-6 mb-10">
                <div className="card-premium p-6 flex justify-between items-center bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-xl shadow-blue-900/20">
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-blue-200 mb-1">Queue Size</h4>
                        <p className="text-4xl font-black italic tracking-tighter">{appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/10 rounded-[20px] flex items-center justify-center backdrop-blur-sm shadow-inner">
                        <Stethoscope size={32} className="text-blue-100" />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center p-10 font-bold uppercase tracking-widest text-gray-400">Loading DB...</div>
            ) : (
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 uppercase text-[10px] font-black tracking-widest text-gray-400">
                            <tr>
                                <th className="p-6 pl-8">Time</th>
                                <th className="p-6">Patient E-Card (UHID)</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(a => (
                                <tr key={a.id} className="border-t border-gray-50 transition-colors hover:bg-blue-50/50">
                                    <td className="p-6 pl-8 font-black text-sm uppercase text-gray-900 tracking-tight">
                                        <div className="flex flex-col">
                                            <span className="text-blue-600 mb-1">{new Date(a.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            <span className="text-[10px] text-gray-400 tracking-widest">{new Date(a.appointment_date).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <h5 className="font-bold uppercase tracking-tight text-gray-800 text-sm mb-1">
                                            {a.patient?.full_name || 'Patient'}
                                        </h5>
                                        <span className="text-[10px] font-black tracking-widest text-blue-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                            {a.patient?.user?.username || 'UNKNOWN'}
                                        </span>
                                    </td>
                                    <td className="p-6 font-bold text-[10px] uppercase tracking-widest">
                                        <span className={`px-4 py-2 rounded-xl border shadow-sm ${
                                            a.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                                            a.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                            'bg-red-50 text-red-600 border-red-200'}`}>
                                            {a.status}
                                        </span>
                                    </td>
                                    <td className="p-6 pr-8 text-right">
                                        {(a.status === 'pending' || a.status === 'confirmed') && (
                                            <button onClick={() => handleCancel(a.id)} className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold uppercase text-[10px] tracking-widest px-4 py-2 flex items-center justify-center gap-2 rounded-xl transition-colors ml-auto">
                                                Mark Unattended
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {appointments.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-16 text-center font-bold text-gray-400 uppercase tracking-widest italic border-t border-dashed">
                                        No upcoming consultations assigned.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    );
};

export default Appointments;
