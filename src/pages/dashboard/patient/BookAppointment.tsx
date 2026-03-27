import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Building2, Search, CalendarPlus, MapPin, Stethoscope, CheckCircle, Smartphone, ChevronLeft, ChevronRight, IndianRupee, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import PaymentGateway from '../../../components/PaymentGateway';

const BookAppointment = () => {
    const { user } = useAuth();
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [selectedHospital, setSelectedHospital] = useState<any>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isBooking, setIsBooking] = useState(false);

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
            setDoctorPage(1); 
        } catch (err) {}
    };

    const handleHospitalSelect = (hospital: any) => {
        setSelectedHospital(hospital);
        setSelectedDoctor(null);
        fetchDoctors(hospital.id);
    };

    const handleBookingFinalize = async () => {
        setIsBooking(true);
        try {
            const token = localStorage.getItem('access');
            await axios.post('http://127.0.0.1:8000/api/appointments/', {
                patient: user?.id,
                doctor: selectedDoctor.doctor_id || selectedDoctor.doctor,
                hospital: selectedHospital.id,
                appointment_date: appointmentDate,
                time_slot: appointmentTime,
                fee: selectedDoctor.consultation_fee,
                payment_status: 'paid',
                payment_id: `PAY-${Math.random().toString(36).substring(7).toUpperCase()}`
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookingSuccess(true);
            setShowPaymentModal(false);
        } catch (err: any) {
            alert(err.response?.data?.error || 'Booking failed. Please try again.');
        } finally {
            setIsBooking(false);
        }
    };

    const handleConfirmBooking = (e: React.FormEvent) => {
        e.preventDefault();
        setShowPaymentModal(true);
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 pb-32 max-w-7xl mx-auto font-['Montserrat']">
            <div className="mb-12">
                <h2 className="text-5xl font-black italic uppercase text-gray-900 tracking-tighter leading-none mb-3 font-['Montserrat']">RESERVATION DESK</h2>
                <p className="font-bold tracking-[0.4em] text-[10px] text-gray-400 uppercase pl-1 font-['Montserrat']">Establishing clinical nodes for patient encounters</p>
            </div>

            <AnimatePresence mode="wait">
                {bookingSuccess ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card-premium p-16 text-center max-w-2xl mx-auto flex flex-col items-center bg-gradient-to-b from-green-50 to-white shadow-3xl border border-green-100">
                        <div className="w-24 h-24 bg-emerald-600 rounded-full text-white flex items-center justify-center mb-6 shadow-2xl shadow-emerald-600/30">
                            <CheckCircle size={48} />
                        </div>
                        <h3 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 mb-2 font-['Montserrat']">Booking Success!</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-10 font-['Montserrat']">Account synchronized for clinical record entry</p>
                        
                        <div className="bg-white p-8 rounded-[40px] border border-gray-100 w-full text-left shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={100} />
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-6 mb-6">
                                <div>
                                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest block mb-1 font-['Montserrat']">Hospital Authority</span>
                                    <span className="font-black italic text-lg tracking-tighter text-gray-900 uppercase font-['Montserrat']">{selectedHospital.name}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest block mb-1 font-['Montserrat']">Clinical Node</span>
                                    <span className="font-black italic text-lg tracking-tighter text-gray-900 uppercase font-['Montserrat']">DR. {selectedDoctor?.doctor_username || selectedDoctor?.doctor?.username || 'Specialist'}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center bg-emerald-600 p-6 rounded-[28px] text-white shadow-xl shadow-emerald-900/10">
                                <div>
                                    <span className="text-[9px] font-black uppercase text-emerald-200 tracking-[0.3em] block mb-1 font-['Montserrat']">Operational Slot</span>
                                    <span className="font-black italic text-xl tracking-tighter uppercase font-['Montserrat']">{appointmentDate} @ {appointmentTime}</span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 font-black text-xs uppercase tracking-widest">
                                    TRANS_PAID
                                </div>
                            </div>
                        </div>

                        <button onClick={() => {setBookingSuccess(false); setSelectedHospital(null); setSelectedDoctor(null);}} className="mt-12 py-6 px-16 bg-gray-900 text-white rounded-[24px] font-black italic uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-black transition-all active:scale-95">
                            NEW RESERVATION
                        </button>
                    </motion.div>
                ) : (
                    <div className="flex flex-col gap-10">
                        {/* Headers Row */}
                        <div className="grid lg:grid-cols-12 gap-8 items-center px-2">
                             <div className="lg:col-span-5">
                                <h3 className="font-black uppercase italic tracking-[0.1em] text-gray-400 flex items-center gap-4 text-xs font-['Montserrat']">
                                    <span className="w-10 h-10 rounded-2xl bg-gray-900 text-white flex items-center justify-center not-italic shadow-xl shadow-gray-200 shadow-gray-900/10">1</span>
                                    IDENTIFY FACILITY
                                </h3>
                             </div>
                             <div className="lg:col-span-1 hidden lg:block text-center text-gray-200">
                                <div className="w-px h-10 bg-current mx-auto opacity-20"></div>
                             </div>
                             <div className="lg:col-span-6 border-l-0 lg:border-l lg:border-gray-50 lg:pl-10">
                                <h3 className="font-black uppercase italic tracking-[0.1em] text-gray-400 flex items-center gap-4 text-xs font-['Montserrat']">
                                    <span className="w-10 h-10 rounded-2xl bg-gray-100 text-[var(--color-primary)] flex items-center justify-center not-italic">2</span>
                                    ESTABLISH ENCOUNTER SLOT
                                </h3>
                             </div>
                        </div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-12 gap-12">
                            {/* Hospital Selection Column */}
                            <div className="lg:col-span-5 flex flex-col justify-between min-h-[680px]">
                                <div className="space-y-5">
                                    {currentHospitals.map(h => (
                                        <div key={h.id} onClick={() => handleHospitalSelect(h)}
                                             className={`p-7 rounded-[40px] border-2 cursor-pointer transition-all duration-300 relative group/hcard ${selectedHospital?.id === h.id ? 'border-emerald-600 bg-emerald-50/50 shadow-2xl shadow-emerald-900/10' : 'border-gray-50 hover:border-gray-200 bg-white hover:shadow-2xl hover:shadow-gray-200/40'}`}>
                                            <div className="flex gap-6">
                                                <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center shrink-0 transition-all duration-500 group-hover/hcard:scale-110 ${selectedHospital?.id === h.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' : 'bg-gray-50 text-gray-300'}`}>
                                                    <Building2 size={32} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="text-2xl font-black tracking-tighter text-gray-900 uppercase italic font-['Montserrat'] leading-tight group-hover/hcard:text-emerald-800 transition-colors">{h.name}</h4>
                                                        {selectedHospital?.id === h.id && <CheckCircle className="text-emerald-600" size={24} />}
                                                    </div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 font-['Montserrat']">
                                                        <MapPin size={12} className="text-gray-300" /> {h.location}
                                                    </p>
                                                    <div className="mt-4 flex items-center gap-3">
                                                        <span className="text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1.5 bg-white border border-gray-100 rounded-xl text-emerald-600 shadow-sm font-['Montserrat']">
                                                            Verified Identity
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {hospitals.length === 0 && (
                                        <div className="p-16 text-center border-2 border-dashed border-gray-100 rounded-[48px] text-gray-300 font-black uppercase tracking-[0.4em] text-[10px] font-['Montserrat']">
                                            NO CLINICAL NODES DETECTED
                                        </div>
                                    )}
                                </div>

                                {/* Hospital Pagination */}
                                {totalHospitalPages > 1 && (
                                    <div className="flex items-center justify-center gap-6 mt-10 bg-white p-5 rounded-[28px] border border-gray-50 shadow-2xl shadow-gray-200/50">
                                        <button 
                                            disabled={hospitalPage === 1}
                                            onClick={() => setHospitalPage(prev => prev - 1)}
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${hospitalPage === 1 ? 'text-gray-100 pointer-events-none' : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600 shadow-sm border border-gray-100 hover:scale-110 active:scale-95'}`}>
                                            <ChevronLeft size={24} />
                                        </button>
                                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 font-['Montserrat']">
                                            {hospitalPage} / {totalHospitalPages}
                                        </span>
                                        <button 
                                            disabled={hospitalPage === totalHospitalPages}
                                            onClick={() => setHospitalPage(prev => prev + 1)}
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${hospitalPage === totalHospitalPages ? 'text-gray-100 pointer-events-none' : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600 shadow-sm border border-gray-100 hover:scale-110 active:scale-95'}`}>
                                            <ChevronRight size={24} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Booking Form Column */}
                            <div className="lg:col-span-7">
                                {!selectedHospital ? (
                                    <div className="card-premium h-full min-h-[680px] flex flex-col items-center justify-center text-center p-16 bg-gray-50/20 border border-gray-50 relative overflow-hidden group">
                                         <div className="absolute inset-0 bg-white/20 backdrop-blur-[4px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                         <div className="relative z-10 flex flex-col items-center">
                                            <div className="w-32 h-32 bg-white rounded-[40px] flex items-center justify-center text-gray-100 mb-10 shadow-3xl shadow-gray-200 scale-100 group-hover:scale-110 transition-transform">
                                                <Building2 size={64} />
                                            </div>
                                            <p className="font-bold text-gray-300 uppercase tracking-[0.4em] text-[10px] max-w-[280px] leading-loose font-['Montserrat'] italic">
                                                Identify a health facility to access professional nodes.
                                            </p>
                                         </div>
                                    </div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-premium p-12 min-h-[680px] flex flex-col justify-between bg-white border border-gray-50 shadow-4xl relative overflow-hidden">
                                        <div className="relative z-10 h-full flex flex-col">
                                            <div className="flex justify-between items-start mb-12 pb-10 border-b border-gray-50 shrink-0 font-['Montserrat']">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse"></div>
                                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-['Montserrat']">Operational Node Active</span>
                                                    </div>
                                                    <h4 className="text-4xl font-black italic uppercase text-gray-900 tracking-tighter leading-none font-['Montserrat'] drop-shadow-sm">{selectedHospital.name}</h4>
                                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-3 font-['Montserrat'] opacity-80">{selectedHospital.location}</p>
                                                </div>
                                                <div className="w-16 h-16 bg-gray-50 rounded-[20px] shadow-inner flex items-center justify-center text-gray-200"><Smartphone size={32} /></div>
                                            </div>

                                            <div className="flex-1 flex flex-col">
                                                <form id="bookingForm" onSubmit={handleConfirmBooking} className="flex-1 flex flex-col">
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-8 px-2">
                                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 font-['Montserrat']">Clinical Professional Node</label>
                                                            {totalDoctorPages > 1 && (
                                                                <div className="flex items-center gap-3">
                                                                    <button type="button" onClick={() => setDoctorPage(p => Math.max(1, p - 1))} disabled={doctorPage === 1} className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-white hover:text-emerald-600 border border-transparent hover:border-gray-100 disabled:opacity-20 transition-all"><ChevronLeft size={16}/></button>
                                                                    <span className="text-[9px] font-black text-gray-400 tracking-widest">{doctorPage} / {totalDoctorPages}</span>
                                                                    <button type="button" onClick={() => setDoctorPage(p => Math.min(totalDoctorPages, p + 1))} disabled={doctorPage === totalDoctorPages} className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-white hover:text-emerald-600 border border-transparent hover:border-gray-100 disabled:opacity-20 transition-all"><ChevronRight size={16}/></button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
                                                            {currentDoctors.map(d => (
                                                                <div key={d.id} onClick={() => setSelectedDoctor(d)}
                                                                     className={`p-6 rounded-[32px] border-2 cursor-pointer transition-all duration-300 flex items-center gap-5 group/dcard relative overflow-hidden ${selectedDoctor?.id === d.id ? 'border-emerald-600 bg-emerald-600 text-white shadow-2xl shadow-emerald-900/30' : 'border-gray-50 bg-gray-50/40 text-gray-600 hover:border-gray-200 hover:bg-white shadow-sm'}`}>
                                                                    {selectedDoctor?.id === d.id && <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/50 to-transparent"></div>}
                                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center relative z-10 transition-transform duration-500 group-hover/dcard:scale-110 ${selectedDoctor?.id === d.id ? 'bg-white/10 backdrop-blur-md border border-white/20' : 'bg-white text-gray-300 shadow-sm border border-gray-100'}`}>
                                                                        <Stethoscope size={28} />
                                                                    </div>
                                                                    <div className="relative z-10">
                                                                        <h5 className="font-black italic uppercase tracking-tighter text-sm font-['Montserrat']">DR. {d.doctor_username || d.doctor?.username}</h5>
                                                                        <div className="flex items-center gap-2 mt-1.5 font-['Montserrat']">
                                                                            <IndianRupee size={10} className={selectedDoctor?.id === d.id ? 'text-emerald-200' : 'text-emerald-500'} />
                                                                            <span className={`text-[10px] font-black tracking-[0.1em] uppercase ${selectedDoctor?.id === d.id ? 'text-emerald-100' : 'text-gray-400'}`}>{d.consultation_fee}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {doctors.length === 0 && <p className="col-span-2 text-[10px] text-gray-300 font-black italic p-16 text-center border border-gray-50 border-dashed rounded-[40px] uppercase tracking-[0.4em] font-['Montserrat']">NODES NOT INITIALIZED</p>}
                                                        </div>
                                                    </div>

                                                    <AnimatePresence>
                                                        {selectedDoctor && (
                                                            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-8 pt-12 mt-12 border-t border-gray-50 border-dashed shrink-0">
                                                                <div className="space-y-4">
                                                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block ml-3 font-['Montserrat'] italic">Sync Date</label>
                                                                    <input required type="date" value={appointmentDate} onChange={e => setAppointmentDate(e.target.value)}
                                                                           className="w-full bg-gray-50 border-2 border-transparent py-5 px-8 rounded-3xl font-black uppercase text-xs tracking-widest text-gray-900 outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner font-['Montserrat']" />
                                                                </div>
                                                                <div className="space-y-4">
                                                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block ml-3 font-['Montserrat'] italic">Sync Time</label>
                                                                    <input required type="time" value={appointmentTime} onChange={e => setAppointmentTime(e.target.value)}
                                                                           className="w-full bg-gray-50 border-2 border-transparent py-5 px-8 rounded-3xl font-black uppercase text-xs tracking-widest text-gray-900 outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner font-['Montserrat']" />
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </form>

                                                {selectedDoctor && (
                                                    <div className="pt-12 shrink-0">
                                                        <button form="bookingForm" type="submit" className="w-full py-8 rounded-[36px] bg-gray-900 text-white font-black italic uppercase tracking-[0.2em] text-sm hover:bg-black transition-all shadow-4xl shadow-gray-900/40 active:scale-95 group overflow-hidden relative font-['Montserrat']">
                                                            <span className="relative z-10 flex items-center justify-center gap-4 font-['Montserrat']">
                                                                CONFIRM & CHECKOUT ₹{selectedDoctor.consultation_fee}
                                                                <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                                                            </span>
                                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 opacity-20"></div>
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

            <AnimatePresence>
                {showPaymentModal && selectedDoctor && (
                    <PaymentGateway 
                        amount={selectedDoctor.consultation_fee}
                        hospitalName={selectedHospital.name}
                        onSuccess={handleBookingFinalize}
                        onClose={() => setShowPaymentModal(false)}
                    />
                )}
            </AnimatePresence>

            <style>{`
                .card-premium {
                    border-radius: 56px;
                }
                .shadow-4xl {
                    box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.15), 0 30px 60px -30px rgba(0, 0, 0, 0.1);
                }
                .shadow-3xl {
                    box-shadow: 0 40px 80px -15px rgba(6, 78, 59, 0.2);
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
