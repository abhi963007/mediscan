import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Users, UserPlus, Stethoscope, Briefcase, Plus } from 'lucide-react';

interface Staff {
  id: number;
  username: string;
  email: string;
  role: string;
}

const StaffManagement = () => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    
    // Form state
    const [newStaff, setNewStaff] = useState({
        username: '',
        email: '',
        password: '',
        role: 'doctor' // default
    });

    const fetchStaff = async () => {
        try {
            const token = localStorage.getItem('access');
            const res = await axios.get('http://127.0.0.1:8000/api/auth/staff/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStaff(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleCreateStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access');
            await axios.post('http://127.0.0.1:8000/api/auth/create-staff/', newStaff, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`Successfully added ${newStaff.role} ${newStaff.username}`);
            setIsAdding(false);
            setNewStaff({ username: '', email: '', password: '', role: 'doctor' });
            fetchStaff();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to create staff');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                     <h2 className="text-3xl font-black italic uppercase text-gray-800 tracking-tighter">Staff Registry</h2>
                     <p className="font-bold text-gray-400 mt-1 uppercase text-xs tracking-widest">Manage Doctors & Receptionists</p>
                </div>
                <button onClick={() => setIsAdding(!isAdding)} className="btn-primary py-3 px-8 rounded-2xl flex items-center gap-3 shadow-xl shadow-green-900/10">
                    <UserPlus size={18} /> 
                    <span className="font-black italic uppercase tracking-tighter">New Staff</span>
                </button>
            </div>
            
            <AnimatePresence>
                {isAdding && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-8">
                        <form onSubmit={handleCreateStaff} className="card-premium p-8 grid md:grid-cols-2 gap-6 bg-green-50/20 border-2 border-green-100/50">
                            <div className="col-span-full mb-2">
                                <h3 className="text-xl font-black uppercase italic tracking-tighter text-gray-800">Assign Institutional Credentials</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Generate a secure login for your staff member.</p>
                            </div>
                            
                            <div className="space-y-4">
                                <input type="text" placeholder="Desired Username" required
                                       className="input-field px-6 py-4 font-bold" value={newStaff.username} onChange={e => setNewStaff({...newStaff, username: e.target.value})} />
                                <input type="email" placeholder="Official Email Address" required
                                       className="input-field px-6 py-4 font-bold" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} />
                            </div>
                            
                            <div className="space-y-4">
                                <input type="password" placeholder="Temporary Access Token (Password)" required
                                       className="input-field px-6 py-4 font-bold" value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})} />
                                
                                <div className="flex gap-4 p-1 bg-white/50 rounded-xl border border-gray-100 shadow-sm backdrop-blur-sm">
                                    <button type="button" onClick={() => setNewStaff({...newStaff, role: 'doctor'})} 
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-black text-[10px] tracking-[0.2em] uppercase transition-all ${newStaff.role === 'doctor' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:bg-white'}`}>
                                        <Stethoscope size={16} /> Doctor
                                    </button>
                                    <button type="button" onClick={() => setNewStaff({...newStaff, role: 'receptionist'})} 
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-black text-[10px] tracking-[0.2em] uppercase transition-all ${newStaff.role === 'receptionist' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:bg-white'}`}>
                                        <Briefcase size={16} /> Desk Staff
                                    </button>
                                </div>
                            </div>
                            
                            <div className="col-span-full pt-4 border-t border-gray-100">
                                <button type="submit" className="btn-primary w-full py-5 rounded-2xl font-black italic uppercase tracking-tighter text-xl shadow-2xl shadow-green-900/20 active:scale-95 transition-transform">
                                    Finalize & Secure Credentials
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {loading ? (
                 <div className="p-20 text-center font-black uppercase tracking-[0.3em] text-gray-300 animate-pulse italic">Syncing Staff Registry...</div>
            ) : staff.length === 0 ? (
                <div className="card-premium p-16 text-center flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-24 h-24 rounded-[32px] flex items-center justify-center bg-gray-50 text-gray-200 mb-6 group-hover:scale-110 transition-transform">
                        <Users size={40} />
                    </div>
                    <h3 className="text-2xl font-black italic uppercase text-gray-800 tracking-tighter">Registry Empty</h3>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] max-w-sm mt-3 leading-relaxed">No medical or administrative staff have been assigned to your institution yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8FAFC] border-b border-gray-100">
                            <tr>
                                <th className="p-6 pl-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Account Identity</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Assignment</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                                <th className="p-6 text-right pr-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {staff.map(s => (
                                <tr key={s.id} className="group hover:bg-green-50/10 transition-colors">
                                    <td className="p-6 pl-10">
                                        <div className="flex flex-col">
                                            <span className="font-black italic uppercase text-gray-900 tracking-tighter">@{s.username}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            {s.role === 'doctor' ? (
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center"><Stethoscope size={14} /></div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center"><Briefcase size={14} /></div>
                                            )}
                                            <span className="font-black italic uppercase text-xs text-gray-700 tracking-tighter">{s.role}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Active</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right pr-10">
                                        <button className="p-3 rounded-xl hover:bg-red-50 text-gray-200 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                                            <Plus size={18} className="rotate-45" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
        </motion.div>
    );
};

export default StaffManagement;
