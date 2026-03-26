import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Users, UserPlus, Stethoscope, Briefcase, Plus, ShieldCheck, Mail, Lock, User, ChevronRight, X } from 'lucide-react';

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
            alert(err.response?.data?.error || 'Failed to create institutional account.');
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
                     <h2 className="text-5xl font-black italic uppercase text-gray-900 tracking-tighter leading-none mb-3 font-['Montserrat']">Staff Registry</h2>
                     <p className="font-bold tracking-[0.4em] text-[10px] text-gray-400 uppercase pl-1 font-['Montserrat']">Manage Specialists & Clinical Desks</p>
                </div>
                <button onClick={() => setIsAdding(!isAdding)} className="bg-gray-900 text-white px-10 py-5 rounded-2xl font-black italic uppercase text-[10px] tracking-widest shadow-2xl shadow-gray-900/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4">
                    <UserPlus size={18} /> 
                    <span>Deploy New Node</span>
                </button>
            </div>
            
            <AnimatePresence>
                {isAdding && (
                    <motion.div initial={{ height: 0, opacity: 0, scale: 0.98 }} animate={{ height: 'auto', opacity: 1, scale: 1 }} exit={{ height: 0, opacity: 0, scale: 0.98 }} className="overflow-hidden mb-12">
                        <form onSubmit={handleCreateStaff} className="card-premium p-10 grid md:grid-cols-2 gap-8 bg-white border-2 border-emerald-500/10 shadow-4xl shadow-emerald-900/5 relative">
                            <button type="button" onClick={() => setIsAdding(false)} className="absolute top-8 right-8 text-gray-300 hover:text-red-500 transition-colors"><X size={24}/></button>
                            <div className="col-span-full mb-4">
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">Institutional Credentials</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 font-['Montserrat']">Authorize a new specialist or receptionist node onto the network.</p>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">Identity UID</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-300" />
                                        <input type="text" placeholder="Username" required className="input-field-staff pl-14" value={newStaff.username} onChange={e => setNewStaff({...newStaff, username: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">Email Node</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-300" />
                                        <input type="email" placeholder="Email Address" required className="input-field-staff pl-14" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">Access Token (Password)</label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-300" />
                                        <input type="password" placeholder="Passphrase" required className="input-field-staff pl-14" value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})} />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                     <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">Functional Designation</label>
                                     <div className="flex gap-4 p-2 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                                        <button type="button" onClick={() => setNewStaff({...newStaff, role: 'doctor'})} 
                                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all ${newStaff.role === 'doctor' ? 'bg-[#064E3B] text-white shadow-xl' : 'text-gray-400 hover:bg-white'}`}>
                                            <Stethoscope size={16} /> Specialist
                                        </button>
                                        <button type="button" onClick={() => setNewStaff({...newStaff, role: 'receptionist'})} 
                                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all ${newStaff.role === 'receptionist' ? 'bg-[#064E3B] text-white shadow-xl' : 'text-gray-400 hover:bg-white'}`}>
                                            <Briefcase size={16} /> Clinical Desk
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-span-full pt-6">
                                <button type="submit" className="w-full py-6 bg-emerald-900 text-white rounded-[32px] font-black italic uppercase tracking-tighter text-xl shadow-4xl shadow-emerald-900/40 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4">
                                    <ShieldCheck size={28} /> Finalize Authorization
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {staff.length === 0 ? (
                <div className="card-premium p-20 text-center flex flex-col items-center justify-center bg-white border border-gray-100 shadow-xl min-h-[400px]">
                    <div className="w-32 h-32 rounded-[48px] flex items-center justify-center bg-emerald-50 text-emerald-200 mb-8 border border-emerald-50">
                        <Users size={56} />
                    </div>
                    <h3 className="text-4xl font-black italic uppercase text-gray-900 tracking-tighter">Registry Empty</h3>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em] max-w-sm mt-4 leading-loose font-['Montserrat']">No medical or administrative nodes have been deployed yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[48px] shadow-4xl shadow-emerald-900/5 border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8FAFC] border-b border-gray-100">
                            <tr>
                                <th className="p-8 pl-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Account Identity</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Assignment</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Status</th>
                                <th className="p-8 text-right pr-14 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Terminal Link</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {staff.map(s => (
                                <tr key={s.id} className="group-staff hover:bg-emerald-50/10 transition-colors">
                                    <td className="p-8 pl-12">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center font-black italic group-staff-hover:bg-[#064E3B] group-staff-hover:text-white transition-all">
                                                {s.username.substring(0,2).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black italic uppercase text-xl text-gray-900 tracking-tighter group-staff-hover:text-emerald-700 transition-colors">@{s.username}</span>
                                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest font-['Montserrat']">{s.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            {s.role === 'doctor' ? (
                                                <div className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Stethoscope size={14} /> Specialist</div>
                                            ) : (
                                                <div className="px-4 py-2 rounded-xl bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Briefcase size={14} /> Desk Staff</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]"></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 italic">Operational</span>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right pr-12">
                                        <button className="p-4 rounded-2xl bg-gray-50 text-gray-300 hover:bg-emerald-600 hover:text-white transition-all shadow-sm group-staff-hover:opacity-100 opacity-0">
                                            <ChevronRight size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            <style>{`
                .card-premium { border-radius: 48px; }
                .input-field-staff {
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
                    font-family: 'Montserrat';
                }
                .input-field-staff:focus {
                    background-color: white;
                    border-color: #10B981;
                    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.1);
                }
                .shadow-4xl {
                    box-shadow: 0 50px 100px -20px rgba(6, 78, 59, 0.1), 0 30px 60px -30px rgba(0, 0, 0, 0.15);
                }
                .group-staff:hover .w-14 { background-color: #064E3B; color: white; }
            `}</style>
        </motion.div>
    );
};

export default StaffManagement;
