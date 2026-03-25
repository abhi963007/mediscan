import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ScanFace, UserCheck, CalendarDays, Key, HeartPulse, Clock, UploadCloud } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import jsQR from 'jsqr';

const ScanQR = () => {
    const { user } = useAuth();
    const [uhid, setUhid] = useState('');
    const [patient, setPatient] = useState<any>(null);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [appointment, setAppointment] = useState({ date: '', time: '', doctor_id: '' });
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processScan = async (scannedUhid: string) => {
        try {
            setError('');
            const res = await axios.get(`http://127.0.0.1:8000/api/patients/?search=${scannedUhid}`);
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

    const handleSimulatedScan = () => {
        if (!uhid) return;
        processScan(uhid);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                if (context) {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img, 0, 0);
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    if (code) {
                        setUhid(code.data);
                        processScan(code.data);
                    } else {
                        setError('No valid QR code found in the image.');
                    }
                }
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const fetchHospitalDoctors = async () => {
        try {
            const token = localStorage.getItem('access');
            // Fetch public slots/doctors for this hospital
            // In a real scenario, the receptionist's hospital ID is known from user profile
            if (!user?.hospital) return;
            
            const res = await axios.get(`http://127.0.0.1:8000/api/hospitals/${user.hospital}/hospital-slots/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoctors(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access');
            const selectedSlot = doctors.find(d => d.doctor === parseInt(appointment.doctor_id));
            
            await axios.post('http://127.0.0.1:8000/api/appointments/', {
                patient: patient.user, // The patient user ID
                doctor: appointment.doctor_id,
                hospital: user?.hospital,
                appointment_date: appointment.date,
                time_slot: appointment.time,
                fee: selectedSlot?.consultation_fee || 0,
                payment_status: 'paid'
            }, {
                headers: { Authorization: `Bearer ${token}` }
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
                    
                    <div className="flex flex-col gap-6 w-full">
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

                        <div className="flex items-center gap-4 w-full">
                            <div className="h-px bg-gray-200 flex-1"></div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">OR UPLOAD CARD</span>
                            <div className="h-px bg-gray-200 flex-1"></div>
                        </div>

                        <input 
                            type="file" 
                            className="hidden" 
                            ref={fileInputRef} 
                            accept="image/*" 
                            onChange={handleFileUpload} 
                        />
                        
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-4 px-8 rounded-xl border-2 border-dashed border-gray-300 font-black uppercase tracking-widest text-gray-500 hover:border-green-500 hover:text-green-600 transition-all flex items-center justify-center gap-3 bg-gray-50/50"
                        >
                            <UploadCloud size={20} /> Upload QR E-Card Image
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
