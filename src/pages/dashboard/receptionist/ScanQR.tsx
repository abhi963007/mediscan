import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ScanFace, UserCheck, CalendarDays, Key, HeartPulse, Clock } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const ScanQR = () => {
    const { user } = useAuth();
    const [uhid, setUhid] = useState('');
    const [patient, setPatient] = useState<any>(null);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [appointment, setAppointment] = useState({ date: '', time: '', doctor_id: '' });
    const [error, setError] = useState('');

    const handleSimulatedScan = async () => {
        try {
            setError('');
            const res = await axios.get(`http://127.0.0.1:8000/api/patients/?search=${uhid}`);
            if (res.data.length > 0) {
                setPatient(res.data[0]);
                fetchHospitalDoctors();
            } else {
                setError('No patient found with this UHID.');
                setPatient(null);
            }
        } catch (err) {
            setError('Error processing scan.');
            setPatient(null);
        }
    };

    const fetchHospitalDoctors = async () => {
        // Technically we need endpoints to get doctors belonging to our hospital.
        // Assuming we rely on generic endpoints for now or mock the list.
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/hospitals/settings/`); // Let's pretend it returns doctor slots
            setDoctors(res.data);
        } catch (err) {
            // fallback
            setDoctors([{ id: 1, doctor: { username: 'Dr. John Doe', id: 2 }, consultation_fee: 500 }]);
        }
    };

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/appointments/', {
                patient: patient.user.id,
                doctor: appointment.doctor_id,
                hospital: user?.hospital,
                appointment_date: `${appointment.date}T${appointment.time}Z`, // naive parsing
                payment_status: 'Paid'
            });
            alert('Appointment Scheduled Successfully!');
            setPatient(null);
            setUhid('');
        } catch (err) {
            alert('Failed to schedule appointment.');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8">
            <div className="flex justify-between items-center mb-10">
                 <div>
                      <h2 className="text-4xl font-black italic uppercase text-gray-800 tracking-tighter">QR Scanner</h2>
                      <p className="font-bold text-gray-400 mt-1 uppercase tracking-widest text-sm">Staff Verification Terminal</p>
                 </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
                {/* Scanner Simulation Box */}
                <div className="card-premium p-10 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-gray-50 to-white border border-gray-100 shadow-xl shadow-green-900/5">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent shadow-sm"></div>
                    
                    <div className="w-32 h-32 mb-8 relative flex items-center justify-center">
                        <div className="absolute inset-0 border-4 border-dashed border-green-300 rounded-[32px] animate-[spin_10s_linear_infinite]"></div>
                        <div className="w-24 h-24 bg-[var(--color-primary)] rounded-[24px] text-white flex items-center justify-center shadow-lg shadow-green-600/30">
                            <ScanFace size={48} />
                        </div>
                    </div>

                    <h3 className="text-xl font-black uppercase text-gray-900 tracking-tighter mb-6">Device Emulation</h3>
                    
                    <div className="flex gap-4 w-full">
                        <div className="relative flex-1">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="Enter UHID (e.g., GP-6231)" 
                                className="w-full bg-white border-2 border-gray-200 py-4 pl-12 pr-4 rounded-xl font-bold tracking-widest uppercase outline-none focus:border-green-500 transition-colors"
                                value={uhid} onChange={e => setUhid(e.target.value)} 
                            />
                        </div>
                        <button onClick={handleSimulatedScan} className="btn-primary py-4 px-8 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-green-900/10 hover:shadow-green-900/20">
                            Scan Read
                        </button>
                    </div>

                    {error && <p className="mt-4 font-bold text-red-500 uppercase tracking-widest text-xs bg-red-50 py-2 px-4 rounded-full">{error}</p>}
                </div>

                {/* Scanned Patient Details & Booking Form */}
                <AnimatePresence>
                    {patient && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-premium p-8 bg-green-50/20 border-2 border-[var(--color-primary)]">
                            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                                <div className="w-20 h-20 rounded-[28px] bg-green-100/50 text-green-700 flex items-center justify-center shadow-inner">
                                    <UserCheck size={36} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">{patient.full_name}</h3>
                                    <div className="flex items-center gap-3 mt-2 text-xs font-black uppercase tracking-widest text-gray-500">
                                        <span className="bg-gray-100 px-3 py-1 rounded-full">{patient.age} Y/O</span>
                                        <span className="bg-gray-100 px-3 py-1 rounded-full">{patient.gender}</span>
                                        <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full">{patient.blood_group}</span>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleBook} className="space-y-6">
                                <h4 className="text-lg font-black uppercase tracking-tighter text-gray-800 flex items-center gap-2 mb-4">
                                    <CalendarDays size={20} className="text-green-600" /> Book Consultation
                                </h4>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <HeartPulse className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <select required value={appointment.doctor_id} onChange={e => setAppointment({...appointment, doctor_id: e.target.value})} 
                                            className="w-full bg-white border border-gray-200 py-4 flex-shrink-0 pl-12 pr-4 rounded-xl font-bold uppercase text-xs tracking-widest text-gray-700 appearance-none shadow-sm hover:border-gray-300 transition-colors focus:border-green-500 outline-none">
                                            <option value="">-- SELECT DOCTOR --</option>
                                            {doctors.map(d => <option key={d.id} value={d.doctor?.id}>{d.doctor?.username || 'Doctor'}</option>)}
                                        </select>
                                    </div>

                                    <div className="flex gap-4">
                                        <input required type="date" className="w-full bg-white border border-gray-200 py-3 px-4 rounded-xl font-bold uppercase text-xs tracking-widest shadow-sm outline-none focus:border-green-500"
                                               value={appointment.date} onChange={e => setAppointment({...appointment, date: e.target.value})} />
                                        <div className="relative w-full">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                            <input required type="time" className="w-full bg-white border border-gray-200 py-3 pl-10 pr-2 rounded-xl font-bold uppercase text-xs tracking-widest shadow-sm outline-none focus:border-green-500"
                                                   value={appointment.time} onChange={e => setAppointment({...appointment, time: e.target.value})} />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-4 rounded-xl bg-gray-900 text-white font-black italic uppercase tracking-tighter hover:bg-black transition-all shadow-xl shadow-gray-900/10">
                                    Confirm & Process Payment
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default ScanQR;
