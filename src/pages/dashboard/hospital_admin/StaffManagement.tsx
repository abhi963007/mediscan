import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
    Users, UserPlus, Stethoscope, Briefcase, Plus, 
    ShieldCheck, Mail, Lock, User, ChevronRight, X, 
    Award, Medal, Milestone, Trash2, Edit3, 
    AtSign, CreditCard, Activity, Search, Save
} from 'lucide-react';

interface Staff {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  role: string;
  department?: string;
  specialization?: string;
  qualification?: string;
  experience_years?: number;
  registration_number?: string;
  consultation_fee?: string;
  bio?: string;
}

const StaffManagement = () => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Form state
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'doctor' as 'doctor' | 'receptionist',
        specialization: 'other',
        qualification: '',
        experience_years: '',
        registration_number: '',
        consultation_fee: '',
        bio: '',
        department: ''
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
            await axios.post('http://127.0.0.1:8000/api/auth/create-staff/', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`Successfully added ${formData.role} ${formData.first_name} ${formData.last_name}`);
            resetForm();
            fetchStaff();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to create institutional account.');
        }
    };

    const handleUpdateStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStaff) return;
        try {
            const token = localStorage.getItem('access');
            const updateData = { ...formData };
            if (!updateData.password) delete (updateData as any).password;
            
            await axios.patch(`http://127.0.0.1:8000/api/auth/staff/${editingStaff.id}/`, updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`Successfully updated ${editingStaff.full_name || editingStaff.username}`);
            resetForm();
            fetchStaff();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to update personnel record.');
        }
    };

    const resetForm = () => {
        setShowFormModal(false);
        setEditingStaff(null);
        setFormData({ 
            username: '', first_name: '', last_name: '', email: '', password: '', role: 'doctor', 
            specialization: 'other', qualification: '', experience_years: '', 
            registration_number: '', consultation_fee: '', bio: '', department: '' 
        });
    };

    const startEditing = (s: Staff) => {
        setEditingStaff(s);
        setShowFormModal(true);
        setFormData({
            username: s.username,
            first_name: s.first_name || '',
            last_name: s.last_name || '',
            email: s.email,
            password: '',
            role: s.role as 'doctor' | 'receptionist',
            specialization: s.specialization || 'other',
            qualification: s.qualification || '',
            experience_years: s.experience_years?.toString() || '',
            registration_number: s.registration_number || '',
            consultation_fee: s.consultation_fee || '',
            bio: s.bio || '',
            department: s.department || ''
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to remove this staff member? This action is permanent.')) return;
        try {
            const token = localStorage.getItem('access');
            await axios.delete(`http://127.0.0.1:8000/api/auth/staff/delete/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchStaff();
        } catch (err) {
            alert('Failed to delete staff member.');
        }
    };

    const filteredStaff = staff.filter(s => 
        (s.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-7xl mx-auto pb-32">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
                <div>
                     <h2 className="text-5xl font-black italic uppercase text-gray-900 tracking-tighter leading-none mb-3 font-['Montserrat']">Personnel Hub</h2>
                     <p className="font-bold tracking-[0.4em] text-[10px] text-gray-400 uppercase pl-1 font-['Montserrat']">Manage institutional clinical nodes</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                         <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                         <input 
                            type="text" 
                            placeholder="SEARCH RECORDS..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-14 pr-6 font-bold text-[10px] tracking-widest text-gray-800 focus:outline-none focus:border-emerald-500 transition-all shadow-sm uppercase" 
                         />
                    </div>
                    <button onClick={() => { resetForm(); setShowFormModal(true); }} className="bg-emerald-600 text-white px-10 py-5 rounded-3xl font-black italic uppercase text-[10px] tracking-widest shadow-2xl shadow-emerald-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4">
                        <UserPlus size={18} /> 
                        <span>Register Staff</span>
                    </button>
                </div>
            </div>
            
            {loading ? (
                 <div className="text-center p-32 space-y-6">
                    <div className="w-12 h-12 border-4 border-gray-100 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
                    <p className="font-black italic uppercase tracking-[0.4em] text-gray-300 text-[11px] animate-pulse">Establishing Network Sync...</p>
                </div>
            ) : filteredStaff.length === 0 ? (
                <div className="bg-white rounded-[48px] p-32 text-center flex flex-col items-center justify-center border border-gray-100 shadow-2xl">
                    <div className="w-32 h-32 rounded-[48px] flex items-center justify-center bg-gray-50 text-gray-200 mb-8">
                        <Users size={64} />
                    </div>
                    <h3 className="text-4xl font-black italic uppercase text-gray-900 tracking-tighter leading-none">Node Empty</h3>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-6 leading-loose">No active clinical or support nodes detected.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[48px] shadow-4xl shadow-emerald-900/5 border border-gray-100 overflow-hidden relative group/table">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8FAFC] border-b border-gray-100">
                            <tr>
                                <th className="p-8 pl-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 font-['Montserrat']">Account Identity</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 font-['Montserrat']">Assignment</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 font-['Montserrat']">System Status</th>
                                <th className="p-8 text-right pr-14 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 font-['Montserrat']">Terminal Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredStaff.map(s => (
                                <tr key={s.id} className="group/row hover:bg-emerald-50/10 transition-colors">
                                    <td className="p-8 pl-12">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-300 flex items-center justify-center font-black italic group-hover/row:bg-emerald-100 group-hover/row:text-emerald-700 transition-all shadow-inner">
                                                {s.first_name ? s.first_name[0] : s.username[0]}{s.last_name ? s.last_name[0] : ''}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black italic uppercase text-xl text-gray-900 tracking-tighter group-hover/row:text-emerald-800 transition-colors">
                                                    {s.full_name || s.username}
                                                </span>
                                                <div className="flex items-center gap-2 mt-1 font-['Montserrat']">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">@{s.username}</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                                                    <span className="text-[10px] font-bold text-gray-300 tracking-widest">{s.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex flex-col gap-1.5">
                                            {s.role === 'doctor' ? (
                                                <div className="w-fit px-4 py-1.5 rounded-xl bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-blue-100 shadow-sm"><Stethoscope size={12} /> Medical Node</div>
                                            ) : (
                                                <div className="w-fit px-4 py-1.5 rounded-xl bg-orange-50 text-orange-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-orange-100 shadow-sm"><Briefcase size={12} /> Support Node</div>
                                            )}
                                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest pl-1 font-['Montserrat']">{s.specialization || s.department || 'General'}</span>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse"></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 italic">Auth Active</span>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right pr-12">
                                        <div className="flex justify-end items-center gap-3 opacity-0 group-hover/row:opacity-100 transition-all translate-x-4 group-hover/row:translate-x-0">
                                            <button 
                                                onClick={() => startEditing(s)}
                                                className="p-4 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-emerald-600 hover:border-emerald-100 shadow-sm transition-all hover:scale-110"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(s.id)}
                                                className="p-4 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 shadow-sm transition-all hover:scale-110"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL FORM OVERLAY */}
            <AnimatePresence>
                {showFormModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-3xl overflow-y-auto">
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }}
                                    className="bg-white w-full max-w-4xl rounded-[56px] overflow-hidden shadow-4xl my-auto relative border border-gray-100">
                             
                             <div className="p-12 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h3 className="text-4xl font-black uppercase italic tracking-tighter text-gray-900">{editingStaff ? 'Update Provider' : 'Account Provision'}</h3>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-2 font-['Montserrat']">Institutional Clinical Network Registry</p>
                                </div>
                                <button onClick={resetForm} className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center text-gray-300 hover:text-red-500 shadow-sm transition-all group">
                                    <X size={32} className="group-hover:rotate-90 transition-transform" />
                                </button>
                            </div>

                            <form onSubmit={editingStaff ? handleUpdateStaff : handleCreateStaff} className="p-12 space-y-10">
                                <div className="grid md:grid-cols-3 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[#064E3B] ml-1">Entity Handle</label>
                                        <div className="relative">
                                            <AtSign size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-300" />
                                            <input type="text" placeholder="Username" required disabled={!!editingStaff} className="input-field-staff-pro pl-14 disabled:opacity-50" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#064E3B] ml-1">First Name</label>
                                        <input type="text" placeholder="GIVEN NAME" required className="input-field-staff-pro" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#064E3B] ml-1">Last Name</label>
                                        <input type="text" placeholder="SURNAME" required className="input-field-staff-pro" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600/40 ml-1">Email Node</label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-300" />
                                            <input type="email" placeholder="Email Address" required className="input-field-staff-pro pl-14" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600/40 ml-1">{editingStaff ? 'Reset Passphrase (Optional)' : 'Access Passphrase'}</label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-300" />
                                            <input type="password" placeholder={editingStaff ? "New Passphrase" : "MIN 8 CHARS"} required={!editingStaff} className="input-field-staff-pro pl-14" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                         <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600/40 ml-1">Network Role</label>
                                         <div className="flex gap-4 p-1.5 bg-gray-50/50 rounded-2xl border border-gray-100 shadow-inner">
                                            <button type="button" disabled={!!editingStaff} onClick={() => setFormData({...formData, role: 'doctor'})} 
                                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[9px] tracking-[0.2em] uppercase transition-all ${formData.role === 'doctor' ? 'bg-[#064E3B] text-white shadow-lg' : 'text-gray-400 hover:bg-white'} disabled:opacity-50`}>
                                                <Stethoscope size={14} /> Doctor
                                            </button>
                                            <button type="button" disabled={!!editingStaff} onClick={() => setFormData({...formData, role: 'receptionist'})} 
                                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[9px] tracking-[0.2em] uppercase transition-all ${formData.role === 'receptionist' ? 'bg-[#064E3B] text-white shadow-lg' : 'text-gray-400 hover:bg-white'} disabled:opacity-50`}>
                                                <Briefcase size={14} /> Receptionist
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <AnimatePresence mode="wait">
                                    {formData.role === 'doctor' && (
                                        <motion.div 
                                            key="doctor-fields" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                            className="pt-10 border-t border-gray-100 grid md:grid-cols-4 gap-8"
                                        >
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/40 ml-1">Specialization</label>
                                                <select className="input-field-staff-pro appearance-none" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})}>
                                                    <option value="cardiology">Cardiology</option>
                                                    <option value="dermatology">Dermatology</option>
                                                    <option value="neurology">Neurology</option>
                                                    <option value="pediatrics">Pediatrics</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/40 ml-1">Qualification</label>
                                                <input type="text" placeholder="e.g., MBBS, MD" required className="input-field-staff-pro" value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/40 ml-1">MCI Reg. Number</label>
                                                <input type="text" placeholder="Reg ID" required className="input-field-staff-pro" value={formData.registration_number} onChange={e => setFormData({...formData, registration_number: e.target.value})} />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/40 ml-1">Consult Fee (₹)</label>
                                                <input type="number" placeholder="Fee Node" className="input-field-staff-pro" value={formData.consultation_fee} onChange={e => setFormData({...formData, consultation_fee: e.target.value})} />
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {formData.role === 'receptionist' && (
                                        <motion.div 
                                            key="receptionist-fields" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                            className="pt-10 border-t border-gray-100"
                                        >
                                            <div className="space-y-4 max-w-md">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/40 ml-1">Department Node</label>
                                                <input type="text" placeholder="e.g., MAIN RECEPTION" required className="input-field-staff-pro" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                
                                <button type="submit" className="w-full py-7 bg-emerald-900 text-white rounded-[32px] font-black italic uppercase tracking-[0.2em] text-xl shadow-4xl shadow-emerald-900/40 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4">
                                    {editingStaff ? <Save size={28} /> : <ShieldCheck size={28} />} 
                                    {editingStaff ? 'COMMIT PROVIDER UPDATE' : 'LEGALIZE PERSONNEL ACCOUNT'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            
            <style>{`
                .input-field-staff-pro {
                    width: 100%;
                    background-color: #F8FAFC;
                    border: 2px solid #F1F5F9;
                    border-radius: 24px;
                    padding: 1.25rem 1.75rem;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    outline: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-size: 0.8rem;
                    font-family: 'Montserrat', sans-serif;
                }
                .input-field-staff-pro:focus {
                    background-color: white;
                    border-color: #10B981;
                    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.1);
                }
                .shadow-4xl {
                    box-shadow: 0 50px 100px -20px rgba(6, 78, 59, 0.2), 0 30px 60px -30px rgba(0, 0, 0, 0.2);
                }
            `}</style>
        </motion.div>
    );
};

export default StaffManagement;
