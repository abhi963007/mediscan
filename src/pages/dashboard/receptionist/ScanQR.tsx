import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { UserCheck, CalendarDays, HeartPulse, Clock, XCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { Html5Qrcode } from 'html5-qrcode';

const ScanQR = () => {
    const { user } = useAuth();
    const [uhid, setUhid] = useState('');
    const [patient, setPatient] = useState<any>(null);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [appointment, setAppointment] = useState({ date: '', time: '', doctor_id: '' });
    const [error, setError] = useState('');
    const [cameraReady, setCameraReady] = useState(true); // Start camera on mount

    const scannerRef = useRef<Html5Qrcode | null>(null);

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
                // Stop camera once patient found
                setCameraReady(false);
            } else {
                setError('No patient found with this ID.');
                setPatient(null);
            }
        } catch {
            setError('Could not process scan. Try again.');
            setPatient(null);
        }
    };

    // Auto-start camera directly — no file upload UI
    useEffect(() => {
        if (!cameraReady) return;

        const html5Qr = new Html5Qrcode('qr-reader');
        scannerRef.current = html5Qr;

        html5Qr.start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: { width: 260, height: 260 } },
            (decodedText) => {
                setUhid(decodedText);
                processScan(decodedText);
                html5Qr.stop().then(() => html5Qr.clear()).catch(() => {});
                scannerRef.current = null;
                setCameraReady(false);
            },
            () => { /* per-frame scan errors — normal */ }
        ).catch((err) => {
            setError('Camera access denied. Please allow camera permissions.');
            console.error('Camera start error:', err);
            setCameraReady(false);
        });

        return () => {
            html5Qr.stop().then(() => html5Qr.clear()).catch(() => {});
            scannerRef.current = null;
        };
    }, [cameraReady]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().then(() => scannerRef.current?.clear()).catch(() => {});
            }
        };
    }, []);

    const fetchHospitalDoctors = async () => {
        try {
            const token = localStorage.getItem('access');
            if (!user?.hospital) return;
            const res = await axios.get(`http://127.0.0.1:8000/api/hospitals/${user.hospital}/hospital-slots/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoctors(res.data);
        } catch { /* silently fail */ }
    };

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access');
            const selectedSlot = doctors.find(d => d.doctor === parseInt(appointment.doctor_id));
            await axios.post('http://127.0.0.1:8000/api/appointments/', {
                patient: patient.user,
                doctor: appointment.doctor_id,
                hospital: user?.hospital,
                appointment_date: appointment.date,
                time_slot: appointment.time,
                fee: selectedSlot?.consultation_fee || 0,
                payment_status: 'paid'
            }, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } });
            alert('Appointment Booked!');
            handleReset();
        } catch {
            alert('Could not book. Please try again.');
        }
    };

    const handleReset = () => {
        setPatient(null);
        setUhid('');
        setError('');
        setAppointment({ date: '', time: '', doctor_id: '' });
        setCameraReady(true); // Restart camera
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 max-w-7xl mx-auto pb-24"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-5xl font-black italic uppercase text-gray-900 tracking-tighter leading-none font-['Montserrat']">
                        Check-in Desk
                    </h2>
                    <p className="font-bold text-gray-400 mt-2 uppercase tracking-[0.3em] text-[10px] font-['Montserrat']">
                        Camera is ready — hold the patient's QR card up to scan
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 font-['Montserrat']">Scanner Active</span>
                </div>
            </div>

            <div className={patient ? 'grid lg:grid-cols-5 gap-10 items-start' : 'grid lg:grid-cols-2 gap-10 items-start'}>

                {/* LEFT: Camera Scanner Card */}
                <div className={patient ? 'lg:col-span-2' : 'lg:col-span-1'}>
                    <div className="card-premium bg-white border border-gray-100 shadow-2xl shadow-gray-200/60 overflow-hidden relative">
                        {/* Green top accent */}
                        <div className="h-1.5 bg-gradient-to-r from-green-400 via-[var(--color-primary)] to-green-400"></div>

                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-black uppercase italic text-gray-900 tracking-tighter font-['Montserrat']">Live Scanner</h3>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-['Montserrat'] mt-0.5">Point QR card at camera</p>
                                </div>
                                {patient && (
                                    <button
                                        onClick={handleReset}
                                        className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-green-600 transition-colors"
                                    >
                                        <RefreshCw size={14} /> Scan Again
                                    </button>
                                )}
                            </div>

                            {/* Camera View — always mounted, hidden when patient found */}
                            <div className={patient ? 'hidden' : 'block'}>
                                {cameraReady && (
                                    <div
                                        id="qr-reader"
                                        className="w-full overflow-hidden rounded-3xl"
                                        style={{ minHeight: '300px' }}
                                    ></div>
                                )}
                            </div>

                            {patient && (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="w-20 h-20 rounded-[28px] bg-green-50 text-green-600 flex items-center justify-center mb-4 shadow-inner border border-green-100">
                                        <UserCheck size={40} />
                                    </div>
                                    <span className="bg-green-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-2 animate-pulse">Patient Verified</span>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-['Montserrat']">QR Card Scanned</p>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="px-8 pb-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl p-4"
                                >
                                    <XCircle size={16} className="text-red-400 shrink-0" />
                                    <p className="font-black text-red-500 uppercase tracking-widest text-[9px] font-['Montserrat']">{error}</p>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Patient Card + Booking */}
                <AnimatePresence>
                    {patient && (
                        <motion.div
                            key="patient-panel"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            className="lg:col-span-3"
                        >
                            <div className="card-premium p-10 bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-bl-[120px] -z-0 opacity-60"></div>

                                <div className="relative z-10">
                                    {/* Patient Identity */}
                                    <div className="flex items-start gap-6 mb-10 pb-10 border-b border-gray-50">
                                        <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-green-50 to-green-100 text-[var(--color-primary)] flex items-center justify-center shadow-inner border border-green-100 shrink-0">
                                            <UserCheck size={44} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="bg-[var(--color-primary)] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">✓ Verified</span>
                                                <span className="text-gray-300 font-black text-[10px] tracking-widest uppercase">UHID: {patient.uhid}</span>
                                            </div>
                                            <h3 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 font-['Montserrat'] leading-none mb-4">
                                                {patient.full_name}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">{patient.age} Years</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">{patient.gender}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-100">{patient.blood_group} Blood</span>
                                                {patient.phone && (
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">{patient.phone}</span>
                                                )}
                                            </div>
                                            {patient.known_allergies && (
                                                <div className="mt-4 px-4 py-3 bg-orange-50 border border-orange-100 rounded-2xl">
                                                    <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">⚠ Allergy Alert: {patient.known_allergies}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Book Appointment */}
                                    <form onSubmit={handleBook} className="space-y-6">
                                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 flex items-center gap-3 font-['Montserrat']">
                                            <CalendarDays size={16} className="text-[var(--color-primary)]" /> Book Appointment
                                        </h4>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 font-['Montserrat']">Choose Doctor</label>
                                            <div className="relative group">
                                                <HeartPulse className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[var(--color-primary)] transition-colors" size={18} />
                                                <select
                                                    required
                                                    value={appointment.doctor_id}
                                                    onChange={e => setAppointment({ ...appointment, doctor_id: e.target.value })}
                                                    className="w-full bg-gray-50 border-2 border-transparent py-4 pl-12 pr-4 rounded-xl font-black uppercase text-[10px] tracking-widest text-gray-700 appearance-none shadow-sm focus:bg-white focus:border-[var(--color-primary)] outline-none font-['Montserrat'] transition-all"
                                                >
                                                    <option value="">-- Choose a Doctor --</option>
                                                    {doctors.map(d => <option key={d.id} value={d.doctor?.id}>{d.doctor?.username || 'Doctor'}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 font-['Montserrat']">Date</label>
                                                <input
                                                    required type="date"
                                                    className="w-full bg-gray-50 border-2 border-transparent py-4 px-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-sm outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all font-['Montserrat']"
                                                    value={appointment.date}
                                                    onChange={e => setAppointment({ ...appointment, date: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 font-['Montserrat']">Time</label>
                                                <div className="relative">
                                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                                    <input
                                                        required type="time"
                                                        className="w-full bg-gray-50 border-2 border-transparent py-4 pl-12 pr-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-sm outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all font-['Montserrat']"
                                                        value={appointment.time}
                                                        onChange={e => setAppointment({ ...appointment, time: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full group relative overflow-hidden bg-gray-900 text-white py-6 rounded-2xl font-black italic uppercase tracking-[0.1em] text-sm hover:bg-black transition-all shadow-2xl shadow-gray-900/20 active:scale-[0.98] font-['Montserrat']"
                                        >
                                            <span className="relative z-10">Confirm & Book Appointment</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 opacity-20"></div>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                .card-premium { border-radius: 40px; }
                #qr-reader { border: none !important; }
                #qr-reader video { border-radius: 24px !important; width: 100% !important; }
                #qr-reader__scan_region { background: transparent !important; }
                #qr-reader__dashboard { padding: 12px 0 0 !important; }
                #qr-reader__dashboard_section_swaplink { display: none !important; }
                #qr-reader__status_span { font-family: 'Montserrat', sans-serif !important; font-size: 10px !important; font-weight: 900 !important; text-transform: uppercase !important; letter-spacing: 0.1em !important; color: #6B7280 !important; }
                #qr-reader__camera_permission_button {
                    background: #064E3B !important;
                    color: white !important;
                    border: none !important;
                    padding: 14px 28px !important;
                    border-radius: 16px !important;
                    font-family: 'Montserrat', sans-serif !important;
                    font-weight: 900 !important;
                    font-size: 10px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.15em !important;
                    cursor: pointer !important;
                    width: 100% !important;
                    margin-top: 8px !important;
                }
                #qr-reader select {
                    background: #F8FAFC !important;
                    border: 2px solid #E2E8F0 !important;
                    border-radius: 12px !important;
                    padding: 8px 12px !important;
                    font-family: 'Montserrat', sans-serif !important;
                    font-size: 10px !important;
                    font-weight: 700 !important;
                    text-transform: uppercase !important;
                    outline: none !important;
                    margin-right: 8px !important;
                }
            `}</style>
        </motion.div>
    );
};

export default ScanQR;
