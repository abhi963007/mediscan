import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
    Clock, Plus, X, Calendar, Save, Trash2, 
    Stethoscope, DollarSign, AlertCircle, CheckCircle2,
    CalendarDays, Timer, Info, Users, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

interface Slot {
    id: number;
    start_time: string;
    end_time: string;
    consultation_fee: string;
    doctor: number;
    hospital: number;
}

interface Schedule {
    id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    max_appointments: number;
    is_holiday: boolean;
}

interface Doctor {
    id: number;
    username: string;
}

const SlotManagement = () => {
    const { user } = useAuth();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'slots' | 'schedule'>('slots');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form states
    const [newSlot, setNewSlot] = useState({
        start_time: '09:00',
        end_time: '10:00',
        consultation_fee: '500.00'
    });

    const [newSchedule, setNewSchedule] = useState({
        day_of_week: 'MONDAY',
        start_time: '09:00',
        end_time: '17:00',
        max_appointments: 20,
        is_holiday: false
    });

    const days = [
        'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
    ];

    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('access');
            const res = await axios.get('http://127.0.0.1:8000/api/auth/staff/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter only doctors
            const doctorList = res.data.filter((s: any) => s.role === 'doctor');
            setDoctors(doctorList);
            if (doctorList.length > 0) {
                setSelectedDoctorId(doctorList[0].id);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    const fetchDoctorData = async (doctorId: number) => {
        try {
            const token = localStorage.getItem('access');
            const [slotsRes, schedRes] = await Promise.all([
                axios.get(`http://127.0.0.1:8000/api/hospitals/doctor-slots/?doctor=${doctorId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`http://127.0.0.1:8000/api/hospitals/doctor-schedules/?doctor=${doctorId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setSlots(slotsRes.data);
            setSchedules(schedRes.data);
        } catch (err) {}
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        if (selectedDoctorId) {
            fetchDoctorData(selectedDoctorId);
        }
    }, [selectedDoctorId]);

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleAddSlot = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDoctorId) return;
        try {
            const token = localStorage.getItem('access');
            await axios.post('http://127.0.0.1:8000/api/hospitals/doctor-slots/', {
                ...newSlot,
                doctor: selectedDoctorId,
                hospital: user?.hospital
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showMessage('success', 'Slot added successfully');
            fetchDoctorData(selectedDoctorId);
        } catch (err) {
            showMessage('error', 'Failed to add slot');
        }
    };

    const handleDeleteSlot = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this slot?')) return;
        try {
            const token = localStorage.getItem('access');
            await axios.delete(`http://127.0.0.1:8000/api/hospitals/doctor-slots/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showMessage('success', 'Slot deleted');
            if (selectedDoctorId) fetchDoctorData(selectedDoctorId);
        } catch (err) {
            showMessage('error', 'Failed to delete slot');
        }
    };

    const handleAddSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDoctorId) return;
        try {
            const token = localStorage.getItem('access');
            await axios.post('http://127.0.0.1:8000/api/hospitals/doctor-schedules/', {
                ...newSchedule,
                doctor: selectedDoctorId,
                hospital: user?.hospital
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showMessage('success', 'Schedule updated');
            fetchDoctorData(selectedDoctorId);
        } catch (err) {
            showMessage('error', 'Failed to update schedule');
        }
    };

    if (loading) return (
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-7xl mx-auto pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                <div>
                     <h2 className="text-5xl font-black italic uppercase text-gray-900 tracking-tighter leading-none mb-3 font-['Montserrat']">Clinic Slots</h2>
                     <p className="font-bold tracking-[0.4em] text-[10px] text-gray-400 uppercase pl-1 font-['Montserrat']">Manage working hours for hospital doctors</p>
                </div>

                <div className="w-full md:w-80">
                    <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1 mb-2 block font-['Montserrat']">Select Doctor</label>
                    <div className="relative">
                        <Stethoscope size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-400 border-r border-emerald-100 pr-2 h-4 w-6" />
                        <select 
                            className="input-field pl-16 pr-10 appearance-none bg-white shadow-xl shadow-emerald-900/5 cursor-pointer"
                            value={selectedDoctorId || ''}
                            onChange={(e) => setSelectedDoctorId(Number(e.target.value))}
                        >
                            <option value="">Select a Doctor</option>
                            {doctors.map(d => (
                                <option key={d.id} value={d.id}>DR. {d.username.toUpperCase()}</option>
                            ))}
                        </select>
                        <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Status Message */}
            <AnimatePresence>
                {message && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className={`fixed top-8 right-8 z-50 p-6 rounded-3xl shadow-2xl flex items-center gap-4 ${message.type === 'success' ? 'bg-emerald-900 text-white' : 'bg-red-900 text-white'}`}
                    >
                        {message.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                        <span className="font-black italic uppercase text-[10px] tracking-widest leading-none">{message.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex gap-4 mb-10 p-2 bg-gray-50 rounded-3xl w-fit border border-gray-100 shadow-inner">
                <button 
                    onClick={() => setActiveTab('slots')}
                    className={`px-8 py-4 rounded-2xl font-black italic uppercase text-[10px] tracking-widest transition-all ${activeTab === 'slots' ? 'bg-[#064E3B] text-white shadow-xl' : 'text-gray-400 hover:bg-white'}`}
                >
                    <Timer size={16} className="inline mr-2" /> Booking Slots
                </button>
                <button 
                    onClick={() => setActiveTab('schedule')}
                    className={`px-8 py-4 rounded-2xl font-black italic uppercase text-[10px] tracking-widest transition-all ${activeTab === 'schedule' ? 'bg-[#064E3B] text-white shadow-xl' : 'text-gray-400 hover:bg-white'}`}
                >
                    <CalendarDays size={16} className="inline mr-2" /> Weekly Routine
                </button>
            </div>

            {!selectedDoctorId ? (
                <div className="card-premium p-20 text-center flex flex-col items-center justify-center bg-white border border-gray-100 shadow-xl min-h-[400px]">
                    <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-200 flex items-center justify-center mb-8">
                        <Users size={48} />
                    </div>
                    <h3 className="text-3xl font-black italic uppercase text-gray-300 tracking-tighter">No Doctor Selected</h3>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest max-w-sm mt-4 font-['Montserrat']">Please pick a doctor from the dropdown above to manage their consultation hours.</p>
                </div>
            ) : (
                <div className="grid lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-5">
                        {activeTab === 'slots' ? (
                            <div className="card-premium p-10 bg-white border border-gray-100 shadow-4xl shadow-emerald-900/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 mb-2 relative z-10">Add Slot</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-10 font-['Montserrat'] relative z-10">Define precise availability for the doctor.</p>
                                <form onSubmit={handleAddSlot} className="space-y-8 relative z-10">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">Start Time</label>
                                            <input type="time" required className="input-field" value={newSlot.start_time} onChange={e => setNewSlot({...newSlot, start_time: e.target.value})} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">End Time</label>
                                            <input type="time" required className="input-field" value={newSlot.end_time} onChange={e => setNewSlot({...newSlot, end_time: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">Consultation Fee (INR)</label>
                                        <div className="relative">
                                            <DollarSign size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-300" />
                                            <input type="number" required className="input-field pl-14" value={newSlot.consultation_fee} onChange={e => setNewSlot({...newSlot, consultation_fee: e.target.value})} />
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full py-6 bg-emerald-900 text-white rounded-[32px] font-black italic uppercase tracking-tighter text-lg shadow-4xl shadow-emerald-900/40 hover:scale-[1.01] transition-all flex items-center justify-center gap-4">
                                        <Plus size={24} /> Create Slot
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="card-premium p-10 bg-white border border-gray-100 shadow-4xl shadow-emerald-900/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 mb-2 relative z-10">Routine Schedule</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-10 font-['Montserrat'] relative z-10">Set standard weekly working hours.</p>
                                <form onSubmit={handleAddSchedule} className="space-y-8 relative z-10">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">Select Day</label>
                                        <select className="input-field appearance-none" value={newSchedule.day_of_week} onChange={e => setNewSchedule({...newSchedule, day_of_week: e.target.value})}>
                                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">Shift Start</label>
                                            <input type="time" required className="input-field" value={newSchedule.start_time} onChange={e => setNewSchedule({...newSchedule, start_time: e.target.value})} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">Shift End</label>
                                            <input type="time" required className="input-field" value={newSchedule.end_time} onChange={e => setNewSchedule({...newSchedule, end_time: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">Max Patients</label>
                                        <input type="number" className="input-field" value={newSchedule.max_appointments} onChange={e => setNewSchedule({...newSchedule, max_appointments: Number(e.target.value)})} />
                                    </div>
                                    <button type="submit" className="w-full py-6 bg-emerald-900 text-white rounded-[32px] font-black italic uppercase tracking-tighter text-lg shadow-4xl shadow-emerald-900/40 hover:scale-[1.01] transition-all flex items-center justify-center gap-4">
                                        <Save size={24} /> Save Schedule
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="mt-8 p-6 bg-emerald-50 rounded-[32px] border border-emerald-100 flex gap-4">
                            <Info size={24} className="text-emerald-600 shrink-0" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800 mb-1">Clinic Policy</p>
                                <p className="text-[10px] font-bold text-emerald-600/70 leading-relaxed font-['Montserrat'] uppercase">All slot prices and timings are maintained by clinic staff. Doctors will be automatically notified of bookings through their treatment terminals.</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        {activeTab === 'slots' ? (
                            <div className="space-y-6">
                                {slots.length === 0 ? (
                                    <div className="card-premium p-20 text-center flex flex-col items-center justify-center bg-white border border-dashed border-gray-200 shadow-inner">
                                        <Timer size={48} className="text-gray-100 mb-6" />
                                        <h4 className="text-2xl font-black italic uppercase text-gray-200">No Custom Slots</h4>
                                    </div>
                                ) : (
                                    slots.map(slot => (
                                        <motion.div layout key={slot.id} className="card-premium p-8 bg-white border border-gray-50 shadow-xl shadow-gray-200/40 flex items-center justify-between group">
                                            <div className="flex items-center gap-8">
                                                <div className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center shadow-inner group-hover:bg-[#064E3B] group-hover:text-white transition-all">
                                                    <Clock size={28} />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Time</span>
                                                    <h4 className="text-2xl font-black italic uppercase text-gray-900 tracking-tighter">{slot.start_time.substring(0,5)} — {slot.end_time.substring(0,5)}</h4>
                                                </div>
                                                <div className="px-6 border-l border-gray-100">
                                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Fee</span>
                                                    <h4 className="text-2xl font-black italic uppercase text-emerald-600 tracking-tighter leading-none">₹{slot.consultation_fee}</h4>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDeleteSlot(slot.id)} className="w-12 h-12 rounded-xl bg-gray-50 text-gray-300 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={20} /></button>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[48px] shadow-4xl shadow-emerald-900/5 border border-gray-100 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-[#F8FAFC] border-b border-gray-100">
                                        <tr>
                                            <th className="p-8 pl-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Week Day</th>
                                            <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Time Node</th>
                                            <th className="p-8 text-right pr-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {days.map(day => {
                                            const schedule = schedules.find(s => s.day_of_week === day);
                                            return (
                                                <tr key={day} className="group hover:bg-emerald-50/10 transition-colors">
                                                    <td className="p-8 pl-12"><span className="font-black italic uppercase text-gray-900 tracking-tighter group-active:text-emerald-700">{day}</span></td>
                                                    <td className="p-8">{schedule ? <span className="font-bold text-gray-500 font-['Montserrat'] text-[12px]">{schedule.start_time.substring(0,5)} - {schedule.end_time.substring(0,5)}</span> : <span className="text-[10px] font-black uppercase text-gray-200 tracking-widest italic">Offline</span>}</td>
                                                    <td className="p-8 text-right pr-12">{schedule ? (<div className="flex items-center justify-end gap-2 text-emerald-600 font-black uppercase text-[10px] italic tracking-widest"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Active</div>) : <span className="text-[10px] font-black tracking-widest uppercase text-gray-200 italic opacity-40">Not Set</span>}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .card-premium { border-radius: 48px; }
                .input-field {
                    width: 100%;
                    background-color: #F8FAFC;
                    border: 2px solid transparent;
                    border-radius: 24px;
                    padding: 1.25rem 1.75rem;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    outline: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-size: 0.75rem;
                    font-family: 'Montserrat';
                }
                .input-field:focus {
                    background-color: white;
                    border-color: #10B981;
                    box-shadow: 0 10px 15px -10px rgba(16, 185, 129, 0.4);
                }
            `}</style>
        </motion.div>
    );
};

export default SlotManagement;
