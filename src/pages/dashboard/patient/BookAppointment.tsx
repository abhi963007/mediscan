import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Building2, Search, CalendarPlus, MapPin, Stethoscope, CheckCircle, Smartphone } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const BookAppointment = () => {
    const { user } = useAuth();
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [selectedHospital, setSelectedHospital] = useState<any>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const token = localStorage.getItem('access');
                // Should fetch only verified hospitals
                const res = await axios.get('http://127.0.0.1:8000/api/hospitals/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHospitals(res.data.filter((h: any) => h.is_verified));
            } catch (err) {}
        };
        fetchHospitals();
    }, []);

    const fetchDoctors = async (hospitalId: number) => {
        try {
            const token = localStorage.getItem('access');
            // Fetch public slots/doctors for this hospital
            const res = await axios.get(`http://127.0.0.1:8000/api/hospitals/${hospitalId}/hospital-slots/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoctors(res.data);
        } catch (err) {}
    };

    const handleHospitalSelect = (hospital: any) => {
        setSelectedHospital(hospital);
        setSelectedDoctor(null);
        fetchDoctors(hospital.id);
    };

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access');
            await axios.post('http://127.0.0.1:8000/api/appointments/', {
                patient: user?.id,
                doctor: selectedDoctor.doctor,
                hospital: selectedHospital.id,
                appointment_date: appointmentDate,
                time_slot: appointmentTime,
                fee: selectedDoctor.consultation_fee,
                payment_status: 'paid'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookingSuccess(true);
        } catch (err) {
            alert('Booking failed. Please try again.');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 pb-32 max-w-6xl mx-auto">
            <h2 className="text-4xl font-black italic uppercase text-gray-800 tracking-tighter mb-2">Book Appointment</h2>
            <p className="font-bold tracking-widest text-xs text-gray-400 uppercase mb-10 pl-1">Search and book appointments easily</p>

            <AnimatePresence mode="wait">
                {bookingSuccess ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card-premium p-16 text-center max-w-2xl mx-auto flex flex-col items-center bg-gradient-to-b from-green-50 to-white shadow-2xl border border-green-100">
                        <div className="w-24 h-24 bg-green-500 rounded-full text-white flex items-center justify-center mb-6 shadow-xl shadow-green-500/30">
                            <CheckCircle size={48} />
                        </div>
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter text-green-800 mb-2">Booked Successfully!</h3>
                        <p className="text-gray-500 font-medium mb-8">Your appointment is booked! You can see the details in your dashboard.</p>
                        
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 w-full text-left shadow-sm">
                            <div className="flex justify-between border-b pb-4 mb-4">
                                <div>
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Hospital</span>
                                    <span className="font-bold text-gray-800">{selectedHospital.name}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Doctor</span>
                                    <span className="font-bold text-gray-800">{selectedDoctor.doctor?.username || 'Specialist'}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center bg-green-50 p-4 rounded-2xl">
                                <div>
                                    <span className="text-[10px] font-black uppercase text-green-600 tracking-widest block mb-1">Date & Time</span>
                                    <span className="font-black text-green-900 italic text-lg tracking-tighter uppercase">{appointmentDate} • {appointmentTime}</span>
                                </div>
                                <div className="bg-green-600 text-white font-bold text-xs uppercase px-4 py-2 rounded-xl">Paid</div>
                            </div>
                        </div>

                        <button onClick={() => {setBookingSuccess(false); setSelectedHospital(null); setSelectedDoctor(null);}} className="btn-primary mt-10 py-4 px-10 rounded-2xl">
                            Book More
                        </button>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-12 gap-8">
                        {/* Hospital Selection */}
                        <div className="lg:col-span-5 space-y-4">
                            <h3 className="font-black uppercase italic tracking-tighter text-gray-500 flex items-center gap-2 px-2">
                                <Search size={18} /> 1. Select Hospital
                            </h3>
                            <div className="pr-2 space-y-4 h-[600px] overflow-y-auto">
                                {hospitals.map(h => (
                                    <div key={h.id} onClick={() => handleHospitalSelect(h)}
                                         className={`p-6 rounded-[28px] border-2 cursor-pointer transition-all ${selectedHospital?.id === h.id ? 'border-[var(--color-primary)] bg-green-50 shadow-lg shadow-green-900/5' : 'border-gray-100 hover:border-green-200 bg-white shadow-sm'}`}>
                                        <div className="flex gap-4">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${selectedHospital?.id === h.id ? 'bg-[var(--color-primary)] text-white shadow-inner' : 'bg-gray-50 text-gray-400'}`}>
                                                <Building2 size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold tracking-tight text-gray-900">{h.name}</h4>
                                                <p className="text-xs font-medium text-gray-500 mt-1 flex items-center gap-1"><MapPin size={12}/> {h.location}</p>
                                                <span className="text-[10px] uppercase tracking-widest font-black inline-block mt-3 px-3 py-1 bg-white border border-gray-100 rounded-lg text-green-600 shadow-sm">
                                                    Trusted Hospital
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Booking Form */}
                        <div className="lg:col-span-7">
                            <h3 className="font-black uppercase italic tracking-tighter text-gray-500 flex items-center gap-2 px-2 mb-4">
                                <CalendarPlus size={18} /> 2. Schedule Details
                            </h3>
                            
                            {!selectedHospital ? (
                                <div className="card-premium h-[600px] flex flex-col items-center justify-center text-center p-10 opacity-70">
                                    <Building2 size={64} className="text-gray-200 mb-6" />
                                    <p className="font-bold text-gray-400 uppercase tracking-widest text-sm max-w-xs">Please select a hospital from the list to see available doctors and timings.</p>
                                </div>
                            ) : (
                                <div className="card-premium p-8 h-[600px] flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                                            <div>
                                                <h4 className="text-2xl font-black italic uppercase text-gray-900 tracking-tighter">{selectedHospital.name}</h4>
                                                <p className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-widest mt-1">Booking Available</p>
                                            </div>
                                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600"><Smartphone size={28} /></div>
                                        </div>

                                        <form id="bookingForm" onSubmit={handleBook} className="space-y-6">
                                            <div>
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-500 block mb-3 ml-2">Select Doctor</label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {doctors.map(d => (
                                                        <div key={d.id} onClick={() => setSelectedDoctor(d)}
                                                             className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${selectedDoctor?.id === d.id ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-xl shadow-green-900/20' : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-300'}`}>
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedDoctor?.id === d.id ? 'bg-white/20' : 'bg-white text-gray-400'}`}>
                                                                <Stethoscope size={20} />
                                                            </div>
                                                            <div>
                                                                <h5 className="font-bold uppercase tracking-tight text-sm">Dr. {d.doctor?.username}</h5>
                                                                <p className={`text-[10px] font-black tracking-widest uppercase mt-1 ${selectedDoctor?.id === d.id ? 'text-green-200' : 'text-gray-400'}`}>Fee: ₹{d.consultation_fee}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {doctors.length === 0 && <p className="col-span-2 text-sm text-gray-400 font-bold italic p-4 text-center border-2 border-dashed rounded-2xl">No doctors available right now.</p>}
                                                </div>
                                            </div>

                                            {selectedDoctor && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                                    <div>
                                                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 block mb-3 ml-2">Date</label>
                                                        <input required type="date" value={appointmentDate} onChange={e => setAppointmentDate(e.target.value)}
                                                               className="w-full bg-gray-50 border border-gray-200 py-4 px-6 rounded-2xl font-bold uppercase text-xs tracking-widest text-gray-800 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner" />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 block mb-3 ml-2">Time</label>
                                                        <input required type="time" value={appointmentTime} onChange={e => setAppointmentTime(e.target.value)}
                                                               className="w-full bg-gray-50 border border-gray-200 py-4 px-6 rounded-2xl font-bold uppercase text-xs tracking-widest text-gray-800 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner" />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </form>
                                    </div>

                                    {selectedDoctor && (
                                        <button form="bookingForm" type="submit" className="w-full py-5 rounded-2xl bg-gray-900 text-white font-black italic uppercase tracking-tighter text-lg hover:bg-black transition-all shadow-2xl shadow-gray-900/20 active:scale-[0.98]">
                                            Pay ₹{selectedDoctor.consultation_fee} & Confirm
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default BookAppointment;
