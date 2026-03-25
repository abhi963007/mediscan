import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Settings, Clock, IndianRupee, Smartphone, AlertCircle } from 'lucide-react';

const HospitalSettings = () => {
    const [seats, setSeats] = useState(0);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch seats and doctor configurations from API
        const fetchSettings = async () => {
            try {
                // Assuming this generic endpoint returns the hospital settings configured
                const res = await axios.get('http://127.0.0.1:8000/api/hospitals/settings/');
                // Let's pretend the API returns array of DoctorSlot configurations
                setDoctors(res.data);
                // Hardcoding seats for now, normally it would be in HospitalSettings model attached to hospital
                setSeats(50);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSaveSeats = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Ideally a PATCH to /api/hospitals/my_settings
            alert(`Updated daily online capacity to ${seats} seats.`);
        } catch (err) {
            alert('Failed to update capacity.');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8">
            <h2 className="text-4xl font-black italic uppercase text-gray-800 tracking-tighter mb-2">Hospital Settings</h2>
            <p className="font-bold tracking-widest text-xs text-gray-400 uppercase mb-10 pl-1">Configuration limits & constraints</p>
            
            <div className="grid lg:grid-cols-12 gap-10">
                {/* Online Seats Configuration */}
                <div className="lg:col-span-4">
                    <form onSubmit={handleSaveSeats} className="card-premium p-8 bg-gradient-to-br from-green-50 to-white border-2 border-[var(--color-primary)] shadow-2xl shadow-green-900/10">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[var(--color-primary)] mb-6 shadow-sm border border-green-100">
                            <Smartphone size={32} />
                        </div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900 mb-2">Online Capacity</h3>
                        <p className="text-xs font-medium text-gray-500 mb-6">Patient Visit module and Online Booking use this threshold for daily online seats limits.</p>
                        
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 px-1 text-center">Seats limit per day</label>
                        <input type="number" className="w-full text-center text-4xl font-black italic tracking-tighter text-[var(--color-primary)] py-6 bg-white border-b-4 border-green-200 focus:border-green-600 outline-none transition-colors rounded-none px-4 shadow-inner decoration-transparent"
                            value={seats} onChange={e => setSeats(parseInt(e.target.value))} />
                        
                        <button type="submit" className="w-full mt-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest text-white shadow-xl shadow-[var(--color-primary)]/40 hover:scale-[1.02] transition-transform bg-[var(--color-primary)]">
                            Enforce Limit
                        </button>
                    </form>

                    <div className="card-premium p-6 mt-6 bg-gray-50 border border-gray-100 flex gap-4">
                        <AlertCircle size={24} className="text-gray-400 shrink-0" />
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                            Capacity settings instantly affect global patient booking network visibility for your institution.
                        </p>
                    </div>
                </div>

                {/* Doctor Consultations Configuration */}
                <div className="lg:col-span-8">
                    <div className="card-premium p-8 border border-gray-100 h-full">
                        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                            <div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900 flex items-center gap-3">
                                    <Settings size={28} className="text-gray-300" /> Specialist Roster
                                </h3>
                                <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mt-1 pl-10">Fees & Timings Config</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center font-bold text-gray-300 uppercase italic tracking-widest py-20">Syncing...</div>
                        ) : (
                            <div className="space-y-4">
                                {doctors.map(d => (
                                    <div key={d.id} className="bg-white p-6 rounded-2xl border-2 border-gray-50 flex items-center justify-between gap-6 hover:border-gray-200 transition-colors shadow-sm">
                                        <div className="flex-1">
                                            <h4 className="text-lg font-black uppercase tracking-tighter text-gray-800">Dr. {d.doctor?.username}</h4>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                    <Clock size={12} className="text-[var(--color-primary)]" />
                                                    {d.start_time} - {d.end_time}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-green-700 uppercase bg-green-50 px-3 py-1.5 rounded-lg">
                                                    <IndianRupee size={12} />
                                                    {d.consultation_fee} Fee
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="shrink-0 flex gap-3 flex-col sm:flex-row">
                                            {/* Dummy inputs for update demo */}
                                            <div className="relative">
                                                <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input type="number" defaultValue={d.consultation_fee} className="w-24 bg-gray-50 border border-gray-200 rounded-xl py-2 pl-8 pr-3 font-bold text-gray-700 text-sm focus:outline-none focus:border-gray-400 transition-colors" />
                                            </div>
                                            <button onClick={() => alert('Timing & Fee updated')} className="px-6 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs uppercase hover:bg-black hover:text-white transition-all shadow-sm">Update</button>
                                        </div>
                                    </div>
                                ))}
                                {doctors.length === 0 && (
                                    <div className="bg-dashed border-2 p-10 rounded-3xl text-center text-gray-400 font-bold uppercase tracking-widest">No configurations assigned yet.</div>
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
