import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Calendar, UserCheck, Stethoscope, FileText, Activity } from 'lucide-react';

const Appointments = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppts = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/appointments/');
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
            await axios.post(`http://127.0.0.1:8000/api/appointments/${id}/cancel/`);
            setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
        } catch (err) {
            alert('Cancel failed');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8">
            <h2 className="text-4xl font-black italic uppercase text-gray-800 tracking-tighter mb-2">Hospital Schedule</h2>
            <p className="font-bold tracking-widest text-xs text-gray-400 uppercase mb-10 pl-1">Daily Clinic Admissions</p>

            <div className="grid lg:grid-cols-3 gap-6 mb-10">
                <div className="card-premium p-6 flex justify-between items-center bg-gradient-to-r from-[var(--color-primary)] to-green-700 text-white border border-green-800 shadow-xl shadow-green-900/20">
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-green-200 mb-1">Today's Visits</h4>
                        <p className="text-4xl font-black italic tracking-tighter">{appointments.filter(a => a.status === 'Booked').length}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/10 rounded-[20px] flex items-center justify-center backdrop-blur-sm">
                        <UserCheck size={32} />
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
                                <th className="p-6">Patient</th>
                                <th className="p-6">E-Card (UHID)</th>
                                <th className="p-6">Doctor</th>
                                <th className="p-6">Schedule</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(a => (
                                <tr key={a.id} className="border-t border-gray-50 transition-colors hover:bg-gray-50/50">
                                    <td className="p-6 font-black uppercase text-sm tracking-tight text-gray-900 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center shadow-inner">
                                            {a.patient?.full_name?.charAt(0) || 'P'}
                                        </div>
                                        {a.patient?.full_name || 'Walking Patient'}
                                    </td>
                                    <td className="p-6 font-bold text-xs uppercase tracking-widest text-[var(--color-primary)]">{a.patient?.user?.username || 'UNKNOWN'}</td>
                                    <td className="p-6 font-bold text-sm text-gray-600 flex items-center gap-2">
                                        <Stethoscope size={16} className="text-gray-400" /> Dr. {a.doctor?.username}
                                    </td>
                                    <td className="p-6 font-medium text-xs text-gray-500">
                                        {new Date(a.appointment_date).toLocaleString()}
                                    </td>
                                    <td className="p-6 font-bold text-[10px] uppercase tracking-widest">
                                        <span className={`px-3 py-1.5 rounded-lg border shadow-sm ${a.status === 'Booked' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                                            {a.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        {a.status === 'Booked' && (
                                            <button onClick={() => handleCancel(a.id)} className="text-[10px] font-black uppercase tracking-widest bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-xl transition-colors">
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {appointments.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-16 text-center font-bold text-gray-400 uppercase tracking-widest italic flex flex-col justify-center items-center gap-4">
                                        <Calendar size={48} className="text-gray-200" />
                                        No Admissions Scheduled
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
