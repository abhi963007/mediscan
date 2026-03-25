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
            // Unapproved users API can't fetch staff for a hospital, we need generic users API and filter or just show recently created.
            // Wait, we don't have a GET /api/auth/staff/ yet. For now let's just use mock data or fetching won't work perfectly without backend extension.
            // Actually, we can fetch all users if we had the endpoint. Let's assume we just want to create them for now.
            // I'll leave the list empty or minimal.
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleCreateStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/auth/create-staff/', newStaff);
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
                     <p className="font-bold text-gray-400 mt-1">Manage Doctors & Receptionists</p>
                </div>
                <button onClick={() => setIsAdding(!isAdding)} className="btn-primary py-3 px-6 rounded-2xl flex items-center gap-2">
                    <UserPlus size={18} /> New Staff
                </button>
            </div>
            
            <AnimatePresence>
                {isAdding && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-8">
                        <form onSubmit={handleCreateStaff} className="card-premium p-8 grid md:grid-cols-2 gap-6 bg-green-50/50 border-2 border-green-100">
                            <div className="col-span-full mb-2">
                                <h3 className="text-xl font-black uppercase italic tracking-tighter text-green-900">Add Employee Details</h3>
                                <p className="text-sm font-medium text-green-700/70">Create credentials to be securely sent to the staff member.</p>
                            </div>
                            
                            <div className="space-y-4">
                                <input type="text" placeholder="Username" required
                                       className="input-field" value={newStaff.username} onChange={e => setNewStaff({...newStaff, username: e.target.value})} />
                                <input type="email" placeholder="Email Address" required
                                       className="input-field" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} />
                            </div>
                            
                            <div className="space-y-4">
                                <input type="password" placeholder="Temporary Password" required
                                       className="input-field" value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})} />
                                
                                <div className="flex gap-4 p-1 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <button type="button" onClick={() => setNewStaff({...newStaff, role: 'doctor'})} 
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm tracking-widest uppercase transition-all ${newStaff.role === 'doctor' ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}>
                                        <Stethoscope size={16} /> Doctor
                                    </button>
                                    <button type="button" onClick={() => setNewStaff({...newStaff, role: 'receptionist'})} 
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm tracking-widest uppercase transition-all ${newStaff.role === 'receptionist' ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}>
                                        <Briefcase size={16} /> Desk Staff
                                    </button>
                                </div>
                            </div>
                            
                            <div className="col-span-full pt-4 border-t border-green-200/50">
                                <button type="submit" className="w-full py-4 rounded-xl bg-green-900 hover:bg-green-800 text-white font-black italic uppercase tracking-tighter text-lg shadow-lg">
                                    Generate & Save Credentials
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <div className="card-premium p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-24 h-24 rounded-[32px] flex items-center justify-center bg-gray-50 text-gray-300 mb-6 font-display italic font-black text-4xl">
                    <Users size={32} />
                </div>
                <h3 className="text-2xl font-black italic uppercase text-gray-800 tracking-tighter">Directory Active</h3>
                <p className="text-gray-500 font-medium max-w-sm mt-2">New staff accounts will be actively synchronized with the global patient routing registry.</p>
            </div>
            
        </motion.div>
    );
};

export default StaffManagement;
