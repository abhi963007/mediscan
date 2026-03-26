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
            const token = localStorage.getItem('access');
            const res = await axios.get(`http://127.0.0.1:8000/api/patients/?search=${scannedUhid}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
            alert('Appointment Booked!');
            setPatient(null);
            setUhid('');
        } catch (err) {
            alert('Could not book the appointment.');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="p-8 max-w-7xl mx-auto"
        >
            <div className="flex justify-between items-center mb-12">
                 <div>
                      <h2 className="text-5xl font-black italic uppercase text-gray-900 tracking-tighter leading-none font-['Montserrat']">
                        Check-in Desk
                      </h2>
                      <p className="font-bold text-gray-400 mt-2 uppercase tracking-[0.3em] text-[10px] font-['Montserrat']">
                        Scan patient cards to check them in
                      </p>
                 </div>
                 <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 font-['Montserrat']">System Online</span>
                 </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-10 items-start">
                {/* Scanner Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card-premium p-10 flex flex-col items-center relative overflow-hidden bg-white group transition-all duration-500 hover:shadow-2xl hover:shadow-green-900/10">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-30"></div>
                        
                        <div className="w-40 h-40 mb-10 relative flex items-center justify-center">
                            {/* Animated Scanner Ring */}
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-2 border-dashed border-green-200 rounded-[40px]"
                            />
                            <motion.div 
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute inset-4 bg-green-50 rounded-[32px]"
                            />
                            <div className="w-24 h-24 bg-[var(--color-primary)] rounded-[28px] text-white flex items-center justify-center shadow-2xl shadow-green-600/40 z-10 relative transform group-hover:scale-110 transition-transform duration-500">
                                <ScanFace size={44} />
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h3 className="text-xl font-black uppercase text-gray-900 tracking-tighter font-['Montserrat']">Scan Card</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 font-['Montserrat']">Find patient using their QR card</p>
                        </div>
                        
                        <div className="space-y-6 w-full">
                            <div className="flex flex-col gap-3">
                                <div className="relative group/input">
                                    <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-[var(--color-primary)] transition-colors" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="ENTER PATIENT ID (E.G. GP-6231)" 
                                        className="w-full bg-gray-50 border-2 border-transparent py-5 pl-14 pr-6 rounded-2xl font-black tracking-[0.1em] uppercase outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all text-xs font-['Montserrat']"
                                        value={uhid} onChange={e => setUhid(e.target.value)} 
                                    />
                                </div>
                                <button 
                                    onClick={handleSimulatedScan} 
                                    className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-gray-900/10 hover:bg-black hover:scale-[1.02] active:scale-95 transition-all font-['Montserrat']"
                                >
                                    Search Patient
                                </button>
                            </div>

                            <div className="flex items-center gap-4 py-2">
                                <div className="h-px bg-gray-100 flex-1"></div>
                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] font-['Montserrat']">Or upload a card</span>
                                <div className="h-px bg-gray-100 flex-1"></div>
                            </div>

                            <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />
                            
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full py-5 px-6 rounded-2xl border-2 border-dashed border-gray-200 font-black uppercase text-[9px] tracking-[0.2em] text-gray-400 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-green-50/30 transition-all flex items-center justify-center gap-3 font-['Montserrat']"
                            >
                                <UploadCloud size={16} /> Upload Health Card Image
                            </button>
                        </div>

                        {error && (
                            <motion.p 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 font-black text-red-500 uppercase tracking-widest text-[9px] bg-red-50 py-3 px-6 rounded-xl w-full text-center border border-red-100 font-['Montserrat']"
                            >
                                {error}
                            </motion.p>
                        )}
                    </div>
                </div>

                {/* Patient Details & Booking Section */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {patient ? (
                            <motion.div 
                                key="patient-card"
                                initial={{ opacity: 0, x: 30 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: -30 }}
                                className="card-premium p-10 bg-white border border-gray-100 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-[100px] -z-0 opacity-50"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-10 pb-10 border-b border-gray-50">
                                        <div className="flex items-center gap-8">
                                            <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-green-50 to-green-100 text-[var(--color-primary)] flex items-center justify-center shadow-inner border border-green-200/50">
                                                <UserCheck size={44} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="bg-[var(--color-primary)] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full animate-pulse">Patient Verified</span>
                                                    <span className="text-gray-300 font-black text-[10px] tracking-widest uppercase">UHID: {patient.uhid}</span>
                                                </div>
                                                <h3 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 font-['Montserrat'] leading-none">
                                                    {patient.full_name}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-4">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 font-['Montserrat']">{patient.age} Years</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 font-['Montserrat']">{patient.gender}</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-100 font-['Montserrat']">{patient.blood_group} Blood</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleBook} className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6 md:col-span-2">
                                            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 flex items-center gap-3 font-['Montserrat'] mb-2">
                                                <CalendarDays size={16} className="text-[var(--color-primary)]" /> Book Appointment
                                            </h4>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 font-['Montserrat']">Choose Doctor</label>
                                            <div className="relative group">
                                                <HeartPulse className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors" size={18} />
                                                <select required value={appointment.doctor_id} onChange={e => setAppointment({...appointment, doctor_id: e.target.value})} 
                                                    className="w-full bg-gray-50 border-2 border-transparent py-4 pl-12 pr-4 rounded-xl font-black uppercase text-[10px] tracking-widest text-gray-700 appearance-none shadow-sm hover:bg-gray-100 transition-all focus:bg-white focus:border-[var(--color-primary)] outline-none font-['Montserrat']">
                                                    <option value="">-- CHOOSE A DOCTOR --</option>
                                                    {doctors.map(d => <option key={d.id} value={d.doctor?.id}>{d.doctor?.username || 'Doctor'}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 font-['Montserrat']">Date</label>
                                                <input required type="date" 
                                                    className="w-full bg-gray-50 border-2 border-transparent py-4 px-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-sm outline-none hover:bg-gray-100 focus:bg-white focus:border-[var(--color-primary)] transition-all font-['Montserrat']"
                                                    value={appointment.date} onChange={e => setAppointment({...appointment, date: e.target.value})} 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 font-['Montserrat']">Time Slot</label>
                                                <div className="relative">
                                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                    <input required type="time" 
                                                        className="w-full bg-gray-50 border-2 border-transparent py-4 pl-12 pr-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-sm outline-none hover:bg-gray-100 focus:bg-white focus:border-[var(--color-primary)] transition-all font-['Montserrat']"
                                                        value={appointment.time} onChange={e => setAppointment({...appointment, time: e.target.value})} 
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button type="submit" className="md:col-span-2 group relative overflow-hidden bg-gray-900 text-white py-6 rounded-2xl font-black italic uppercase tracking-[0.1em] text-xs hover:bg-black transition-all shadow-2xl shadow-gray-900/20 active:scale-[0.98] font-['Montserrat']">
                                            <span className="relative z-10">Confirm & Book Appointment</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 opacity-20"></div>
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="empty-state"
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                className="h-full min-h-[500px] border-2 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center p-10 text-center bg-gray-50/30"
                            >
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-gray-100 mb-8 shadow-sm">
                                    <ScanFace size={64} />
                                </div>
                                <h4 className="text-xl font-black uppercase text-gray-300 tracking-[0.2em] italic font-['Montserrat']">Waiting for Scan</h4>
                                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-4 max-w-xs font-['Montserrat']">Scan a patient's QR card to start the check-in process.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default ScanQR;
