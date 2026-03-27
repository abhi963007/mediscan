import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Settings, Clock, IndianRupee, Smartphone, Plus, Trash2, X, Building2, Truck, Activity, ShieldCheck, ChevronRight, PenSquare } from 'lucide-react';

interface Slot {
    id: number;
    doctor: number;
    doctor_name?: string;
    consultation_fee: string;
    start_time: string;
    end_time: string;
}

const HospitalSettings = () => {
    const [hospitalInfo, setHospitalInfo] = useState<any>({
        name: '',
        address: '',
        total_beds: 0,
        available_beds: 0,
        has_ambulance: false,
        facilities: '',
        online_seats: 0
    });
    const [doctors, setDoctors] = useState<Slot[]>([]);
    const [availableDoctors, setAvailableDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddingSlot, setIsAddingSlot] = useState(false);
    
    const [newSlot, setNewSlot] = useState({
        doctor: '',
        consultation_fee: '500',
        start_time: '09:00',
        end_time: '17:00'
    });

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('access');
            const [resSettings, resSlots, resStaff] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/hospitals/my-settings/', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://127.0.0.1:8000/api/hospitals/my-slots/', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://127.0.0.1:8000/api/auth/staff/', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            
            setHospitalInfo(resSettings.data);
            
            // Handle potentially paginated slots
            const slotsData = resSlots.data.results || resSlots.data;
            setDoctors(slotsData);
            
            // Handle potentially paginated staff list
            const staffList = resStaff.data.results || resStaff.data;
            setAvailableDoctors(staffList.filter((s: any) => s.role?.toLowerCase() === 'doctor'));
            
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSettings(); }, []);

    const handleUpdateHospital = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access');
            await axios.patch('http://127.0.0.1:8000/api/hospitals/my-settings/', hospitalInfo, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Details updated successfully.');
            fetchSettings();
        } catch (err) { alert('Failed to save changes.'); }
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
        } catch (err) { alert('Failed to add schedule.'); }
    };

    const handleDeleteSlot = async (id: number) => {
        if (!window.confirm("Delete this doctor's schedule?")) return;
        try {
            const token = localStorage.getItem('access');
            await axios.delete(`http://127.0.0.1:8000/api/hospitals/doctor-slots/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSettings();
        } catch (err) { alert('Operation Failed.'); }
    };

    if (loading) return (
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-7xl mx-auto pb-32">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h2 className="text-5xl font-black italic uppercase text-gray-900 tracking-tighter leading-none mb-3 font-['Montserrat']">Hospital Management</h2>
                    <p className="font-bold tracking-[0.4em] text-[10px] text-gray-400 uppercase pl-1 font-['Montserrat']">Update hospital info and doctor schedules</p>
                </div>
            </div>
            
            <div className="grid lg:grid-cols-12 gap-10">
                {/* Infrastructure Control Panel */}
                <div className="lg:col-span-12">
                   <form onSubmit={handleUpdateHospital} className="card-premium p-10 bg-white border-2 border-gray-100 shadow-3xl shadow-emerald-900/5 relative overflow-hidden group mb-10">
                        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-600 to-emerald-400"></div>
                        <div className="flex justify-between items-start mb-12">
                            <div className="flex items-center gap-6">
                                <div className="p-6 bg-emerald-50 text-emerald-600 rounded-[32px] shadow-inner group-hover:scale-110 transition-transform"><Building2 size={36} /></div>
                                <div>
                                    <h3 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900">Hospital Details</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-['Montserrat']">Keep your hospital details up to date</p>
                                </div>
                            </div>
                            <button type="submit" className="bg-gray-900 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-gray-900/30 hover:bg-black transition-all flex items-center gap-3">
                                <ShieldCheck size={18} /> SAVE CHANGES
                            </button>
                        </div>

                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#064E3B] ml-1">Hospital Name</label>
                                <input type="text" className="input-field-infra" value={hospitalInfo.name} onChange={e => setHospitalInfo({...hospitalInfo, name: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#064E3B] ml-1">Total Bed Capacity</label>
                                <div className="relative">
                                    <Activity size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-300" />
                                    <input type="number" className="input-field-infra pl-14" value={hospitalInfo.total_beds} onChange={e => setHospitalInfo({...hospitalInfo, total_beds: parseInt(e.target.value)})} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#064E3B] ml-1">Patients per day</label>
                                <div className="relative">
                                    <Smartphone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-300" />
                                    <input type="number" className="input-field-infra pl-14" value={hospitalInfo.online_seats} onChange={e => setHospitalInfo({...hospitalInfo, online_seats: parseInt(e.target.value)})} />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">List of Services</label>
                                <input type="text" placeholder="E.G. ICU, NICU, BLOOD BANK, PHARMACY 24/7..." className="input-field-infra" value={hospitalInfo.facilities} onChange={e => setHospitalInfo({...hospitalInfo, facilities: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Available Beds</label>
                                <input type="number" className="input-field-infra" value={hospitalInfo.available_beds} onChange={e => setHospitalInfo({...hospitalInfo, available_beds: parseInt(e.target.value)})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Ambulance Service</label>
                                <button type="button" onClick={() => setHospitalInfo({...hospitalInfo, has_ambulance: !hospitalInfo.has_ambulance})}
                                     className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest border-2 transition-all flex items-center justify-center gap-3 ${hospitalInfo.has_ambulance ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-50 bg-white text-gray-300'}`}>
                                    <Truck size={18} /> {hospitalInfo.has_ambulance ? 'Available' : 'Not Available'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Specialist Engine */}
                <div className="lg:col-span-12">
                   <div className="card-premium p-10 border border-gray-100 bg-white shadow-xl shadow-gray-200/50 min-h-full">
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 flex items-center gap-6">
                                    <PenSquare size={40} className="text-emerald-600" /> Manage Doctor Slots
                                </h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2 font-['Montserrat']">Set consultation fees and timing for doctors</p>
                            </div>
                            <button onClick={() => setIsAddingSlot(true)} className="group bg-gray-900 text-white p-5 rounded-2xl shadow-xl shadow-gray-900/30 hover:scale-110 active:scale-95 transition-all">
                                <Plus size={28} className="group-hover:rotate-90 transition-transform duration-500" />
                            </button>
                        </div>

                        <AnimatePresence>
                            {isAddingSlot && (
                                <motion.div initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 20 }} className="mb-12 p-10 border-2 border-emerald-500/20 bg-emerald-50/5 rounded-[40px] relative">
                                    <div className="flex justify-between items-center mb-8">
                                        <h4 className="text-xl font-black uppercase italic tracking-tighter text-[#064E3B]">Add Doctor Schedule</h4>
                                        <button onClick={() => setIsAddingSlot(false)} className="p-3 hover:bg-red-50 text-red-400 rounded-xl transition-all"><X size={24} /></button>
                                    </div>
                                    <form onSubmit={handleCreateSlot} className="grid md:grid-cols-4 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">Doctor Name</label>
                                            <select required className="input-field-infra shadow-sm appearance-none bg-white font-black" value={newSlot.doctor} onChange={e => setNewSlot({...newSlot, doctor: e.target.value})}>
                                                <option value="">Select Doctor</option>
                                                {availableDoctors.map(d => (
                                                    <option key={d.id} value={d.id}>{d.hospital_name ? `Dr. ${d.username}` : d.username} (@{d.username})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">Fees (₹)</label>
                                            <div className="relative">
                                                <IndianRupee size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-300" />
                                                <input type="number" required className="input-field-infra pl-14" value={newSlot.consultation_fee} onChange={e => setNewSlot({...newSlot, consultation_fee: e.target.value})} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">Start Time</label>
                                            <input type="time" required className="input-field-infra" value={newSlot.start_time} onChange={e => setNewSlot({...newSlot, start_time: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">End Time</label>
                                            <input type="time" required className="input-field-infra" value={newSlot.end_time} onChange={e => setNewSlot({...newSlot, end_time: e.target.value})} />
                                        </div>
                                        <div className="col-span-full pt-4">
                                            <button type="submit" className="w-full py-6 rounded-3xl bg-[#064E3B] text-white font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-emerald-900/30 hover:bg-black transition-all">ADD SCHEDULE</button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid md:grid-cols-2 gap-6">
                            {doctors.map(d => (
                                <div key={d.id} className="group-hospital bg-gray-50 p-8 rounded-[40px] border border-transparent hover:border-emerald-500/20 hover:bg-white transition-all duration-300 flex items-center justify-between shadow-sm hover:shadow-2xl">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-[28px] bg-white border border-gray-100 flex items-center justify-center font-black italic text-gray-400 group-hospital-hover:bg-emerald-600 group-hospital-hover:text-white transition-all shadow-sm">
                                            {d.doctor_name?.substring(0,2).toUpperCase() || "DR"}
                                        </div>
                                        <div>
                                            <div className="font-black text-xl italic uppercase tracking-tighter text-gray-900 group-hospital-hover:text-emerald-700 transition-colors">Dr. {d.doctor_name}</div>
                                            <div className="flex gap-4 mt-2">
                                                <span className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest"><Clock size={12} className="text-emerald-500" /> {d.start_time.substring(0,5)} - {d.end_time.substring(0,5)}</span>
                                                <span className="flex items-center gap-2 text-[9px] font-black text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-xl"><IndianRupee size={12} /> {d.consultation_fee}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button onClick={() => handleDeleteSlot(d.id)} className="w-12 h-12 rounded-2xl hover:bg-red-50 text-gray-200 hover:text-red-500 transition-all opacity-0 group-hospital-hover:opacity-100">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .card-premium { border-radius: 48px; }
                .input-field-infra {
                    width: 100%;
                    background-color: #F8FAFC;
                    border: 2px solid transparent;
                    border-radius: 20px;
                    padding: 1.25rem 1.5rem;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    outline: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-size: 0.75rem;
                }
                .input-field-infra:focus {
                    background-color: white;
                    border-color: #10B981;
                    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.1);
                }
                .group-hospital:hover .w-16 { background-color: #064E3B; color: white; }
                .group-hospital:hover { border-color: rgba(6, 78, 59, 0.1); }
            `}</style>
        </motion.div>
    );
};

export default HospitalSettings;
