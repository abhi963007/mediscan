import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Building2, CheckCircle2, ShieldAlert, Plus, X, UserCog, Mail, Phone, MapPin, ShieldCheck, UserPlus } from 'lucide-react';

interface Hospital {
  id: number;
  name: string;
  contact: string;
  email: string;
  location: string;
  address: string;
  is_verified: boolean;
  created_at: string;
}

interface Admin {
    id: number;
    username: string;
    email: string;
}

const Hospitals = () => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState<Hospital | null>(null);
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [newHospital, setNewHospital] = useState({ name: '', contact: '', email: '', location: '', address: '' });
    const [newAdmin, setNewAdmin] = useState({ username: '', password: '', email: '' });

    const fetchHospitals = async () => {
        try {
            const token = localStorage.getItem('access');
            const res = await axios.get('http://127.0.0.1:8000/api/hospitals/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHospitals(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAdmins = async (hospitalId: number) => {
        try {
            const token = localStorage.getItem('access');
            const res = await axios.get(`http://127.0.0.1:8000/api/auth/hospital-admins/?hospital=${hospitalId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAdmins(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchHospitals();
    }, []);

    const handleApprove = async (id: number) => {
        try {
            const token = localStorage.getItem('access');
            await axios.post(`http://127.0.0.1:8000/api/hospitals/${id}/approve/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchHospitals();
        } catch (err) {
            alert('Failed to approve hospital');
        }
    };

    const handleCreateHospital = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access');
            await axios.post('http://127.0.0.1:8000/api/hospitals/', newHospital, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowAddModal(false);
            setNewHospital({ name: '', contact: '', email: '', location: '', address: '' });
            fetchHospitals();
        } catch (err) {
            alert('Failed to create hospital');
        }
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!showAdminModal) return;
        try {
            const token = localStorage.getItem('access');
            await axios.post('http://127.0.0.1:8000/api/auth/create-hospital-admin/', {
                ...newAdmin,
                hospital: showAdminModal.id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewAdmin({ username: '', password: '', email: '' });
            fetchAdmins(showAdminModal.id);
            alert('Admin created successfully');
        } catch (err) {
            alert('Failed to create hospital admin');
        }
    };

    const handleRemoveAdmin = async (adminId: number) => {
        if (!showAdminModal) return;
        if (!confirm('Are you sure you want to remove this administrator?')) return;
        
        try {
            const token = localStorage.getItem('access');
            await axios.delete(`http://127.0.0.1:8000/api/auth/hospital-admins/${adminId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAdmins(showAdminModal.id);
        } catch (err) {
            alert('Failed to remove admin');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8">
            <div className="flex justify-between items-center mb-10">
                 <div>
                    <h2 className="text-4xl font-black italic uppercase text-gray-800 tracking-tighter">Hospitals Registry</h2>
                    <p className="font-bold text-gray-400 mt-1 uppercase tracking-widest text-xs">Global Network Management</p>
                 </div>
                 <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-900/10"
                 >
                    <Plus size={18} /> Register Hospital
                 </button>
            </div>
            
            {loading ? (
                <div className="text-center p-20 text-gray-300 font-black uppercase tracking-[0.2em] animate-pulse">Syncing Network...</div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {hospitals.map(hospital => (
                        <div key={hospital.id} className="card-premium p-8 flex flex-col justify-between group">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center text-white shadow-lg transition-all group-hover:scale-105 ${hospital.is_verified ? 'bg-[var(--color-primary)] shadow-green-900/20' : 'bg-gray-400 shadow-gray-900/10'}`}>
                                        <Building2 size={28} />
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {hospital.is_verified ? (
                                            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                                                <ShieldCheck size={12} /> Verified
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                                                <ShieldAlert size={12} /> Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black italic tracking-tighter text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">{hospital.name}</h3>
                                <div className="space-y-2 mt-4">
                                    <p className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest leading-none">
                                        <MapPin size={12} className="text-gray-400" /> {hospital.location}
                                    </p>
                                    <p className="flex items-center gap-2 text-gray-400 font-medium text-[11px] leading-tight mt-1">
                                        {hospital.address}
                                    </p>
                                </div>
                                
                                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 font-bold text-[10px] uppercase tracking-[0.1em] text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Mail size={12} /> {hospital.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={12} /> {hospital.contact}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3">
                                {hospital.is_verified ? (
                                    <button
                                        onClick={() => {
                                            setShowAdminModal(hospital);
                                            fetchAdmins(hospital.id);
                                        }}
                                        className="flex-1 py-4 rounded-xl bg-gray-50 text-gray-900 border border-gray-200 font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2 group/btn"
                                    >
                                        <UserCog size={14} className="group-hover/btn:rotate-12 transition-transform" /> Admins
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleApprove(hospital.id)}
                                        className="flex-1 py-4 rounded-xl bg-green-600 text-white font-black uppercase text-[10px] tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-900/10"
                                    >
                                        Authorize Hospital
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {hospitals.length === 0 && (
                        <div className="col-span-full card-premium p-20 text-center flex flex-col items-center">
                            <Building2 size={64} className="text-gray-100 mb-6" />
                            <p className="text-gray-400 font-black uppercase tracking-[0.2em] italic">No active nodes in network</p>
                        </div>
                    )}
                </div>
            )}

            {/* Add Hospital Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden p-10">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-3xl font-black italic uppercase text-gray-900 tracking-tighter">New Node</h3>
                                <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateHospital} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Hospital Identity</label>
                                    <input required type="text" placeholder="HOSPITAL NAME" value={newHospital.name} onChange={e => setNewHospital({...newHospital, name: e.target.value})}
                                           className="w-full bg-gray-50 border-2 border-transparent py-4 px-6 rounded-2xl font-bold transition-all focus:bg-white focus:border-green-500 outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input required type="email" placeholder="EMAIL@HOSPITAL.COM" value={newHospital.email} onChange={e => setNewHospital({...newHospital, email: e.target.value})}
                                           className="w-full bg-gray-50 border-2 border-transparent py-4 px-6 rounded-2xl font-bold transition-all focus:bg-white focus:border-green-500 outline-none" />
                                    <input required type="text" placeholder="CONTACT NUMBER" value={newHospital.contact} onChange={e => setNewHospital({...newHospital, contact: e.target.value})}
                                           className="w-full bg-gray-50 border-2 border-transparent py-4 px-6 rounded-2xl font-bold transition-all focus:bg-white focus:border-green-500 outline-none" />
                                </div>
                                <input required type="text" placeholder="CITY / LOCATION" value={newHospital.location} onChange={e => setNewHospital({...newHospital, location: e.target.value})}
                                       className="w-full bg-gray-50 border-2 border-transparent py-4 px-6 rounded-2xl font-bold transition-all focus:bg-white focus:border-green-500 outline-none" />
                                <textarea required placeholder="FULL ADDRESS DETAILS" value={newHospital.address} onChange={e => setNewHospital({...newHospital, address: e.target.value})}
                                          className="w-full bg-gray-50 border-2 border-transparent py-4 px-6 rounded-2xl font-bold transition-all focus:bg-white focus:border-green-500 outline-none h-32 resize-none" />
                                
                                <button type="submit" className="w-full py-5 bg-[var(--color-primary)] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-green-900/20 hover:scale-[1.02] transition-all">
                                    Initialize Infrastructure
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Manage Admins Modal */}
            <AnimatePresence>
                {showAdminModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdminModal(null)} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
                            <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h3 className="text-3xl font-black italic uppercase text-gray-900 tracking-tighter">Authority Management</h3>
                                    <p className="font-bold text-gray-400 mt-1 uppercase tracking-widest text-[10px]">{showAdminModal.name} Admins</p>
                                </div>
                                <button onClick={() => setShowAdminModal(null)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 grid lg:grid-cols-2 gap-10">
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                        <ShieldCheck size={16} className="text-green-500" /> Active Administrators
                                    </h4>
                                    <div className="space-y-4">
                                        {admins.map(admin => (
                                            <div key={admin.id} className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center justify-between group hover:border-[var(--color-primary)] transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-black text-gray-400 group-hover:bg-green-50 group-hover:text-green-600">
                                                        {admin.username[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-sm uppercase text-gray-900">{admin.username}</p>
                                                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">{admin.email}</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleRemoveAdmin(admin.id)}
                                                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        {admins.length === 0 && <p className="text-xs font-bold text-gray-400 italic">No nodes assigned yet.</p>}
                                    </div>
                                </div>

                                <div className="bg-gray-50/50 p-8 rounded-[32px] border border-gray-100 h-fit">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-2">
                                        <UserPlus size={16} className="text-[var(--color-primary)]" /> Provision New Admin
                                    </h4>
                                    <form onSubmit={handleCreateAdmin} className="space-y-4">
                                        <input required type="text" placeholder="USERNAME" value={newAdmin.username} onChange={e => setNewAdmin({...newAdmin, username: e.target.value})}
                                               className="w-full bg-white border border-gray-100 py-3.5 px-5 rounded-xl font-bold text-xs transition-all focus:border-green-500 outline-none" />
                                        <input required type="email" placeholder="EMAIL ADDRESS" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})}
                                               className="w-full bg-white border border-gray-100 py-3.5 px-5 rounded-xl font-bold text-xs transition-all focus:border-green-500 outline-none" />
                                        <input required type="password" placeholder="PASSWORD" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
                                               className="w-full bg-white border border-gray-100 py-3.5 px-5 rounded-xl font-bold text-xs transition-all focus:border-green-500 outline-none" />
                                        <button type="submit" className="w-full py-4 bg-gray-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-black shadow-lg shadow-gray-900/10">
                                            Grant Privileges
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Hospitals;
