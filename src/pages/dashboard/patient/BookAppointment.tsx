import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Building2, Search, CalendarPlus, MapPin, Stethoscope, CheckCircle, Smartphone, ChevronLeft, ChevronRight } from 'lucide-react';
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

    // Hospital Pagination State
    const [hospitalPage, setHospitalPage] = useState(1);
    const hospitalsPerPage = 3;

    // Doctor Pagination State
    const [doctorPage, setDoctorPage] = useState(1);
    const doctorsPerPage = 4;

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const token = localStorage.getItem('access');
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
            const res = await axios.get(`http://127.0.0.1:8000/api/hospitals/${hospitalId}/hospital-slots/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoctors(res.data);
            setDoctorPage(1); // Reset doctor page when fetching new doctors
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

    // Hospital Pagination Logic
    const lastHospitalIndex = hospitalPage * hospitalsPerPage;
    const firstHospitalIndex = lastHospitalIndex - hospitalsPerPage;
    const currentHospitals = hospitals.slice(firstHospitalIndex, lastHospitalIndex);
    const totalHospitalPages = Math.ceil(hospitals.length / hospitalsPerPage);

    // Doctor Pagination Logic
    const lastDoctorIndex = doctorPage * doctorsPerPage;
    const firstDoctorIndex = lastDoctorIndex - doctorsPerPage;
    const currentDoctors = doctors.slice(firstDoctorIndex, lastDoctorIndex);
    const totalDoctorPages = Math.ceil(doctors.length / doctorsPerPage);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 pb-32 max-w-7xl mx-auto">
            <div className="mb-12">
                <h2 className="text-5xl font-black italic uppercase text-gray-900 tracking-tighter leading-none mb-3 font-['Montserrat']">Book Appointment</h2>
                <p className="font-bold tracking-[0.4em] text-[10px] text-gray-400 uppercase pl-1 font-['Montserrat']">Find a hospital and book your visit</p>
            </div>

            <AnimatePresence mode="wait">
                {bookingSuccess ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card-premium p-16 text-center max-w-2xl mx-auto flex flex-col items-center bg-gradient-to-b from-green-50 to-white shadow-2xl border border-green-100">
                        <div className="w-24 h-24 bg-green-500 rounded-full text-white flex items-center justify-center mb-6 shadow-xl shadow-green-500/30">
                            <CheckCircle size={48} />
                        </div>
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter text-green-800 mb-2 font-['Montserrat']">Booking Complete!</h3>
                        <p className="text-gray-500 font-medium mb-8 font-['Montserrat']">Your visit is confirmed. You can see the details on your dashboard.</p>
                        
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
                                    <span className="font-black text-green-900 italic text-lg tracking-tighter uppercase font-['Montserrat']">{appointmentDate} • {appointmentTime}</span>
                                </div>
                                <div className="bg-green-600 text-white font-bold text-xs uppercase px-4 py-2 rounded-xl">Paid</div>
                            </div>
                        </div>

                        <button onClick={() => {setBookingSuccess(false); setSelectedHospital(null); setSelectedDoctor(null);}} className="mt-10 py-5 px-12 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95">
                            Book Another
                        </button>
                    </motion.div>
                ) : (
                    <div className="flex flex-col gap-10">
                        {/* Headers Row */}
                        <div className="grid lg:grid-cols-12 gap-8 items-center px-2">
                             <div className="lg:col-span-5">
                                <h3 className="font-black uppercase italic tracking-[0.1em] text-gray-400 flex items-center gap-3 text-sm font-['Montserrat']">
                                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[var(--color-primary)] not-italic">1</span>
                                    Choose Hospital
                                </h3>
                             </div>
                             <div className="lg:col-span-1 hidden lg:block text-center text-gray-200">
                                <div className="w-px h-8 bg-current mx-auto opacity-20"></div>
                             </div>
                             <div className="lg:col-span-6 border-l-0 lg:border-l lg:border-gray-50 lg:pl-8">
                                <h3 className="font-black uppercase italic tracking-[0.1em] text-gray-400 flex items-center gap-3 text-sm font-['Montserrat']">
                                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[var(--color-primary)] not-italic">2</span>
                                    Pick Time
                                </h3>
                             </div>
                        </div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-12 gap-8">
                            {/* Hospital Selection Column */}
                            <div className="lg:col-span-5 flex flex-col justify-between min-h-[640px]">
                                <div className="space-y-4">
                                    {currentHospitals.map(h => (
                                        <div key={h.id} onClick={() => handleHospitalSelect(h)}
                                             className={`p-6 rounded-[32px] border-2 cursor-pointer transition-all duration-300 relative group ${selectedHospital?.id === h.id ? 'border-[var(--color-primary)] bg-green-50 shadow-2xl shadow-green-900/10' : 'border-gray-50 hover:border-green-100 bg-white hover:shadow-xl hover:shadow-gray-200/40'}`}>
                                            <div className="flex gap-5">
                                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 ${selectedHospital?.id === h.id ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-green-600/20' : 'bg-gray-50 text-gray-300'}`}>
                                                    <Building2 size={28} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="text-xl font-black tracking-tight text-gray-900 uppercase italic font-['Montserrat']">{h.name}</h4>
                                                        {selectedHospital?.id === h.id && <CheckCircle className="text-[var(--color-primary)]" size={20} />}
                                                    </div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 font-['Montserrat']">
                                                        <MapPin size={12} className="text-gray-300" /> {h.location}
                                                    </p>
                                                    <div className="mt-4 flex items-center gap-2">
                                                        <span className="text-[8px] uppercase tracking-[0.2em] font-black px-2.5 py-1 bg-white border border-gray-100 rounded-lg text-green-600 shadow-sm font-['Montserrat']">
                                                            Verified
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {hospitals.length === 0 && (
                                        <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-[32px] text-gray-300 font-bold uppercase tracking-widest font-['Montserrat']">
                                            No hospitals found
                                        </div>
                                    )}
                                </div>

                                {/* Hospital Pagination */}
                                {totalHospitalPages > 1 && (
                                    <div className="flex items-center justify-center gap-4 mt-8 bg-white p-4 rounded-3xl border border-gray-50 shadow-sm">
                                        <button 
                                            disabled={hospitalPage === 1}
                                            onClick={() => setHospitalPage(prev => prev - 1)}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${hospitalPage === 1 ? 'text-gray-200' : 'text-gray-600 hover:bg-gray-50 hover:text-[var(--color-primary)]'}`}>
                                            <ChevronLeft size={20} />
                                        </button>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 font-['Montserrat']">
                                            {hospitalPage} / {totalHospitalPages}
                                        </span>
                                        <button 
                                            disabled={hospitalPage === totalHospitalPages}
                                            onClick={() => setHospitalPage(prev => prev + 1)}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${hospitalPage === totalHospitalPages ? 'text-gray-200' : 'text-gray-600 hover:bg-gray-50 hover:text-[var(--color-primary)]'}`}>
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="lg:col-span-1 hidden lg:flex flex-col items-center">
                                <div className="w-px h-full bg-gradient-to-b from-transparent via-gray-100 to-transparent"></div>
                            </div>

                            {/* Booking Form Column */}
                            <div className="lg:col-span-6">
                                {!selectedHospital ? (
                                    <div className="card-premium h-full min-h-[640px] flex flex-col items-center justify-center text-center p-12 bg-gray-50/30 border-2 border-dashed border-gray-100 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
                                        <div className="relative z-10 flex flex-col items-center">
                                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-gray-200 mb-8 shadow-sm">
                                                <Building2 size={48} />
                                            </div>
                                            <p className="font-bold text-gray-400 uppercase tracking-[0.2em] text-[10px] max-w-[200px] leading-relaxed font-['Montserrat']">
                                                Pick a hospital to see doctors and available slots.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-premium p-10 min-h-[640px] flex flex-col justify-between bg-white border border-gray-50 shadow-2xl shadow-gray-200/40 relative overflow-hidden group">
                                        <div className="relative z-10 h-full flex flex-col">
                                            <div className="flex justify-between items-start mb-10 pb-8 border-b border-gray-50 shrink-0">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                                        <span className="text-[9px] font-black text-green-600 uppercase tracking-widest font-['Montserrat']">Live Booking Available</span>
                                                    </div>
                                                    <h4 className="text-3xl font-black italic uppercase text-gray-900 tracking-tighter leading-none font-['Montserrat']">{selectedHospital.name}</h4>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 font-['Montserrat']">{selectedHospital.location}</p>
                                                </div>
                                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shadow-inner"><Smartphone size={28} /></div>
                                            </div>

                                            <div className="flex-1 flex flex-col">
                                                <form id="bookingForm" onSubmit={handleBook} className="flex-1 flex flex-col">
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-5 px-2">
                                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 font-['Montserrat']">Choose Doctor</label>
                                                            {totalDoctorPages > 1 && (
                                                                <div className="flex items-center gap-2">
                                                                    <button type="button" onClick={() => setDoctorPage(p => Math.max(1, p - 1))} disabled={doctorPage === 1} className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 disabled:opacity-30"><ChevronLeft size={14}/></button>
                                                                    <span className="text-[8px] font-black text-gray-400">{doctorPage}/{totalDoctorPages}</span>
                                                                    <button type="button" onClick={() => setDoctorPage(p => Math.min(totalDoctorPages, p + 1))} disabled={doctorPage === totalDoctorPages} className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 disabled:opacity-30"><ChevronRight size={14}/></button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            {currentDoctors.map(d => (
                                                                <div key={d.id} onClick={() => setSelectedDoctor(d)}
                                                                     className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-4 group ${selectedDoctor?.id === d.id ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-xl shadow-green-900/20' : 'border-gray-50 bg-gray-50/50 text-gray-600 hover:border-gray-200 hover:bg-white'}`}>
                                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${selectedDoctor?.id === d.id ? 'bg-white/20' : 'bg-white text-gray-300 shadow-sm'}`}>
                                                                        <Stethoscope size={24} />
                                                                    </div>
                                                                    <div>
                                                                        <h5 className="font-black italic uppercase tracking-tight text-[11px] font-['Montserrat']">Dr. {d.doctor?.username}</h5>
                                                                        <p className={`text-[9px] font-black tracking-widest uppercase mt-1 ${selectedDoctor?.id === d.id ? 'text-green-200' : 'text-gray-400'}`}>₹{d.consultation_fee}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {doctors.length === 0 && <p className="col-span-2 text-[10px] text-gray-300 font-bold italic p-10 text-center border-2 border-dashed border-gray-50 rounded-3xl uppercase tracking-widest font-['Montserrat']">No doctors available</p>}
                                                        </div>
                                                    </div>

                                                    <AnimatePresence>
                                                        {selectedDoctor && (
                                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-6 pt-10 mt-10 border-t border-gray-50 border-dashed shrink-0">
                                                                <div className="space-y-3">
                                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block ml-2 font-['Montserrat']">Date</label>
                                                                    <input required type="date" value={appointmentDate} onChange={e => setAppointmentDate(e.target.value)}
                                                                           className="w-full bg-gray-50 border-2 border-transparent py-4 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest text-gray-800 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-sm font-['Montserrat']" />
                                                                </div>
                                                                <div className="space-y-3">
                                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block ml-2 font-['Montserrat']">Time</label>
                                                                    <input required type="time" value={appointmentTime} onChange={e => setAppointmentTime(e.target.value)}
                                                                           className="w-full bg-gray-50 border-2 border-transparent py-4 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest text-gray-800 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-sm font-['Montserrat']" />
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </form>

                                                {selectedDoctor && (
                                                    <div className="pt-10 shrink-0">
                                                        <button form="bookingForm" type="submit" className="w-full py-6 rounded-3xl bg-gray-900 text-white font-black italic uppercase tracking-[0.1em] text-sm hover:bg-black transition-all shadow-2xl shadow-gray-900/30 active:scale-95 group flex items-center justify-center gap-3 overflow-hidden relative font-['Montserrat']">
                                                            <span className="relative z-10 font-['Montserrat']">Confirm & Pay ₹{selectedDoctor.consultation_fee}</span>
                                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 opacity-20"></div>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .card-premium {
                    border-radius: 40px;
                }
                @font-face {
                    font-family: 'Montserrat';
                    src: url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap');
                }
            `}</style>
        </motion.div>
    );
};

export default BookAppointment;
