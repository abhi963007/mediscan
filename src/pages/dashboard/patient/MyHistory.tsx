import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { History, Calendar, HeartPulse } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const MyHistory = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access');
                const headers = { Authorization: `Bearer ${token}` };

                // Fetch Appointments (filtered by user role in backend)
                const resA = await axios.get('http://127.0.0.1:8000/api/appointments/', { headers });
                setAppointments(resA.data);
                
                // Fetch Consultations (History)
                if (user?.id) {
                    const resC = await axios.get(`http://127.0.0.1:8000/api/patients/consultations/?patient=${user.id}`, { headers });
                    setHistory(resC.data);
                }
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleCancel = async (id: number) => {
        try {
            const token = localStorage.getItem('access');
            await axios.post(`http://127.0.0.1:8000/api/appointments/${id}/cancel/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
        } catch (err) {
            alert('Failed to cancel');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 pb-32 max-w-6xl mx-auto">
            <h2 className="text-4xl font-black italic uppercase text-gray-800 tracking-tighter mb-2">Medical History</h2>
            <p className="font-bold tracking-widest text-xs text-gray-400 uppercase mb-10 pl-1 font-['Montserrat']">Your visit history and check-up records</p>

            {loading ? (
                <div className="text-center p-10 font-bold uppercase tracking-widest text-gray-400">Loading Records...</div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-10">
                    {/* Appointments Section */}
                    <div>
                        <h3 className="font-black italic uppercase tracking-tighter text-gray-400 text-2xl flex items-center gap-2 mb-6 ml-2">
                            <Calendar className="text-[var(--color-primary)]" /> My Appointments
                        </h3>
                        <div className="space-y-4">
                            {appointments.map(a => (
                                <div key={a.id} className="card-premium p-6 border-l-4 border-[var(--color-primary)] hover:translate-x-2 transition-transform">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="text-lg font-black uppercase tracking-tight text-gray-900">{a.hospital?.name || 'Hospital'}</h4>
                                            <p className="font-bold text-xs uppercase tracking-widest text-[var(--color-primary)] font-['Montserrat']">Dr. {a.doctor?.username || 'Doctor'}</p>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border shadow-sm ${a.status === 'Booked' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                                            {a.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                        <div className="font-bold text-gray-500 text-xs uppercase tracking-widest">
                                            {new Date(a.appointment_date).toLocaleString()}
                                        </div>
                                        {a.status === 'Booked' && (
                                            <button onClick={() => handleCancel(a.id)} className="text-[10px] font-black uppercase tracking-widest bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-[10px] transition-colors">
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {appointments.length === 0 && (
                                <div className="card-premium p-10 text-center font-bold text-gray-400 uppercase tracking-widest italic border-dashed border-2">
                                    No upcoming visits.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Medical History Section */}
                    <div>
                        <h3 className="font-black italic uppercase tracking-tighter text-gray-400 text-2xl flex items-center gap-2 mb-6 ml-2">
                            <HeartPulse className="text-blue-600" /> Past Check-ups
                        </h3>
                        <div className="space-y-4">
                            {history.map(h => (
                                <div key={h.id} className="card-premium p-6 border-2 border-blue-50 hover:border-blue-200 transition-colors bg-gradient-to-r from-blue-50/20 to-transparent">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-black uppercase tracking-tight text-xl text-blue-900 drop-shadow-sm">{h.diagnosis}</h4>
                                        <div className="text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-800 px-3 py-1 rounded-xl shadow-inner">
                                            {new Date(h.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <p className="font-bold text-sm text-gray-500 mb-4 font-['Montserrat']">{h.chief_complaint || 'No complaint recorded'}</p>
                                    
                                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest mb-4">
                                        <span className="bg-white border border-gray-100 px-3 py-1.5 rounded-lg shadow-sm text-gray-400">BP: {h.blood_pressure || 'N/A'}</span>
                                        <span className="bg-white border border-gray-100 px-3 py-1.5 rounded-lg shadow-sm text-gray-400">Temp: {h.temperature || 'N/A'}</span>
                                    </div>

                                    <div className="pt-4 border-t border-blue-100 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-blue-600">
                                        <span>Official Record</span>
                                        <span className="bg-blue-600 text-white px-3 py-1 rounded-lg">Dr. {h.doctor_name || h.doctor?.username}</span>
                                    </div>
                                </div>
                            ))}
                            {history.length === 0 && (
                                <div className="card-premium p-10 text-center font-bold text-gray-400 uppercase tracking-widest italic border-dashed border-2 border-blue-100">
                                    No records found yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default MyHistory;
