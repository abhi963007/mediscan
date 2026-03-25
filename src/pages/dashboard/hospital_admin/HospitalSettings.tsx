import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Settings, Clock, IndianRupee, Smartphone, Plus, Trash2, X } from 'lucide-react';

interface Slot {
    id: number;
    doctor: number;
    doctor_name?: string;
    consultation_fee: string;
    start_time: string;
    end_time: string;
}

const HospitalSettings = () => {
    const [seats, setSeats] = useState(0);
    const [doctors, setDoctors] = useState<Slot[]>([]);
    const [availableDoctors, setAvailableDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddingSlot, setIsAddingSlot] = useState(false);
    
    // New Slot Form
    const [newSlot, setNewSlot] = useState({
        doctor: '',
        consultation_fee: '500',
        start_time: '09:00',
        end_time: '17:00'
    });

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('access');
            // Fetch online seats
            const resSeats = await axios.get('http://127.0.0.1:8000/api/hospitals/my-settings/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSeats(resSeats.data.online_seats);

            // Fetch doctor slots
            const resSlots = await axios.get('http://127.0.0.1:8000/api/hospitals/my-slots/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoctors(resSlots.data);

            // Fetch staff to find doctors
            const resStaff = await axios.get('http://127.0.0.1:8000/api/auth/staff/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAvailableDoctors(resStaff.data.filter((s: any) => s.role === 'doctor'));

            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSaveSeats = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access');
            await axios.patch('http://127.0.0.1:8000/api/hospitals/my-settings/', {
                online_seats: seats
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`Updated daily online capacity to ${seats} seats.`);
        } catch (err) {
            alert('Failed to update capacity.');
        }
    };

    const handleCreateSlot = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access');
            await axios.post('http://127.0.0.1:8000/api/hospitals/doctor-slots/', newSlot, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAddingSlot(false);
            fetchSettings();
        } catch (err) {
            alert('Failed to create slot.');
        }
    };

    const handleDeleteSlot = async (id: number) => {
        if (!window.confirm('Remove this doctor configuration?')) return;
        try {
            const token = localStorage.getItem('access');
            await axios.delete(`http://127.0.0.1:8000/api/hospitals/doctor-slots/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSettings();
        } catch (err) {
            alert('Failed to delete slot.');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8">
            <h2 className="text-4xl font-black italic uppercase text-gray-800 tracking-tighter mb-2">Hospital Settings</h2>
            <p className="font-bold tracking-widest text-xs text-gray-400 uppercase mb-10 pl-1">Configuration limits & constraints</p>
            
            <div className="grid lg:grid-cols-12 gap-10">
                {/* Online Seats Configuration */}
                <div className="lg:col-span-4">
                    <form onSubmit={handleSaveSeats} className="card-premium p-8 bg-gradient-to-br from-green-50/50 to-white border-2 border-green-600/20 shadow-2xl shadow-green-900/5">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-green-600 mb-6 shadow-sm border border-green-100">
                            <Smartphone size={32} />
                        </div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900 mb-2">Capacity Control</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 leading-relaxed">Daily threshold for network-wide online bookings.</p>
                        
                        <div className="relative group">
                            <input type="number" className="w-full text-center text-5xl font-black italic tracking-tighter text-gray-900 py-8 bg-white/50 border-2 border-transparent border-b-gray-100 focus:border-green-500 focus:bg-white outline-none transition-all rounded-3xl"
                                value={seats} onChange={e => setSeats(parseInt(e.target.value))} />
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Global Seat Limit</div>
                        </div>
                        
                        <button type="submit" className="w-full mt-6 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white shadow-xl shadow-green-900/20 hover:scale-[1.02] active:scale-95 transition-all bg-gray-900">
                            Update Registry
                        </button>
                    </form>
                </div>

                {/* Doctor Consultations Configuration */}
                <div className="lg:col-span-8">
                    <div className="card-premium p-10 border border-gray-100 min-h-full">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 flex items-center gap-4">
                                    <Settings size={32} className="text-green-600" /> Specialist Rules
                                </h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">Manage consultation fees & timing slots</p>
                            </div>
                            <button onClick={() => setIsAddingSlot(true)} className="w-14 h-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-gray-900/20">
                                <Plus size={24} />
                            </button>
                        </div>

                        <AnimatePresence>
                            {isAddingSlot && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="mb-10 p-8 border-2 border-dashed border-gray-200 rounded-[32px] bg-gray-50/30">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="font-black uppercase italic tracking-tighter text-gray-800">Assign New Doctor Slot</h4>
                                        <button onClick={() => setIsAddingSlot(false)} className="text-gray-400 hover:text-black"><X size={20} /></button>
                                    </div>
                                    <form onSubmit={handleCreateSlot} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <select required className="input-field py-3 font-bold" value={newSlot.doctor} onChange={e => setNewSlot({...newSlot, doctor: e.target.value})}>
                                            <option value="">Select Doctor</option>
                                            {availableDoctors.map(d => (
                                                <option key={d.id} value={d.id}>@{d.username}</option>
                                            ))}
                                        </select>
                                        <input type="number" placeholder="Fee (Rs)" required className="input-field py-3 font-bold" value={newSlot.consultation_fee} onChange={e => setNewSlot({...newSlot, consultation_fee: e.target.value})} />
                                        <input type="time" required className="input-field py-3 font-bold" value={newSlot.start_time} onChange={e => setNewSlot({...newSlot, start_time: e.target.value})} />
                                        <input type="time" required className="input-field py-3 font-bold" value={newSlot.end_time} onChange={e => setNewSlot({...newSlot, end_time: e.target.value})} />
                                        <button type="submit" className="col-span-full mt-2 py-4 rounded-xl bg-green-600 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-green-600/20">Initialize Configuration</button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {loading ? (
                            <div className="p-20 text-center font-black uppercase tracking-[0.3em] text-gray-200 animate-pulse italic">Syncing Specialist Network...</div>
                        ) : (
                            <div className="grid gap-4">
                                {doctors.map(d => (
                                    <div key={d.id} className="group bg-white p-6 rounded-[32px] border-2 border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-green-500/20 hover:shadow-2xl hover:shadow-green-900/5 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black italic text-xl">
                                                {d.doctor_name?.substring(0,2).toUpperCase() || "DR"}
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black uppercase tracking-tighter text-gray-900 italic">Dr. {d.doctor_name}</h4>
                                                <div className="flex gap-3 mt-2">
                                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest"><Clock size={12} className="text-green-500" /> {d.start_time.substring(0,5)} - {d.end_time.substring(0,5)}</span>
                                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full"><IndianRupee size={12} /> {d.consultation_fee}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <button onClick={() => handleDeleteSlot(d.id)} className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                {doctors.length === 0 && (
                                    <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[40px]">
                                        <p className="font-black uppercase tracking-[0.2em] text-gray-200 italic">No specialists configured</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default HospitalSettings;
