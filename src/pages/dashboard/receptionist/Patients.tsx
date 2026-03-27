import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Users, Search, Eye, Edit2, 
  Trash2, Plus, ChevronLeft, ChevronRight, X, Save, Phone, Heart, Shield, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Patients = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); 
    const [error, setError] = useState('');

    // Modal States
    const [viewPatient, setViewPatient] = useState<any | null>(null);
    const [editPatient, setEditPatient] = useState<any | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, [search]);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access');
            const res = await axios.get(`http://127.0.0.1:8000/api/patients/patients/?search=${search}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = res.data.results || res.data;
            setPatients(data);
            setError('');
        } catch (err) {
            setError('Failed to load patients.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (uhid: string) => {
        if (!window.confirm('Are you sure you want to delete this patient record?')) return;
        try {
            const token = localStorage.getItem('access');
            await axios.delete(`http://127.0.0.1:8000/api/patients/patients/${uhid}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPatients(prev => prev.filter(p => p.uhid !== uhid));
        } catch (err) {
            alert('Failed to delete patient.');
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editPatient) return;
        setSaving(true);
        try {
            const token = localStorage.getItem('access');
            const res = await axios.patch(`http://127.0.0.1:8000/api/patients/patients/${editPatient.uhid}/`, editPatient, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPatients(prev => prev.map(p => p.uhid === editPatient.uhid ? res.data : p));
            setEditPatient(null);
            alert('Patient profile updated successfully!');
        } catch (err) {
            alert('Failed to update patient.');
        } finally {
            setSaving(false);
        }
    };

    const filteredPatients = [...patients].sort((a, b) => {
        if (filter === 'recent') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        return 0;
    });

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-5xl font-black italic uppercase text-gray-900 tracking-tighter leading-none mb-3 font-['Montserrat']">Patients Registry</h2>
                    <p className="font-bold text-gray-400 uppercase tracking-[0.3em] text-[10px] pl-1 font-['Montserrat']">Manage all registered health records</p>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard/staff/register')} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-gray-900/20 hover:bg-black transition-all flex items-center gap-3 active:scale-95">
                        <Plus size={18} className="text-emerald-400" /> New Patient
                    </button>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm items-center">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input type="text" placeholder="SEARCH BY NAME, UHID, OR PHONE..." className="w-full bg-gray-50/50 border-2 border-transparent py-4 pl-14 pr-6 rounded-2xl font-black tracking-widest uppercase outline-none focus:bg-white focus:border-emerald-500/20 transition-all text-xs font-['Montserrat']" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="flex items-center gap-2 bg-gray-50/50 p-2 rounded-2xl w-full lg:w-auto">
                    {['all', 'recent'].map((t) => (
                        <button key={t} onClick={() => setFilter(t)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Patients Table */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl relative overflow-hidden min-h-[400px]">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600"></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Patient Identity</th>
                                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">UHID / ID</th>
                                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Details</th>
                                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Contact</th>
                                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredPatients.map((p, idx) => (
                                <tr key={p.uhid} className="group hover:bg-emerald-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-black italic text-lg shadow-lg">
                                                {p.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black uppercase italic tracking-tighter text-gray-900 leading-none mb-1">{p.full_name}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{p.gender} · {p.age} Years</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-mono text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">{p.uhid}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${p.blood_group ? 'bg-red-500' : 'bg-gray-200'}`}></span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{p.blood_group || 'N/A'} BLOOD</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[10px] font-bold text-gray-700">{p.phone}</p>
                                            <p className={`text-[9px] font-bold uppercase tracking-widest ${p.email ? 'text-gray-400' : 'text-rose-400'}`}>
                                                {p.email || 'no email set'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => setViewPatient(p)} className="p-3 text-gray-400 hover:text-emerald-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-emerald-100"><Eye size={18} /></button>
                                            <button onClick={() => setEditPatient({...p})} className="p-3 text-gray-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-100"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(p.uhid)} className="p-3 text-gray-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {loading && <div className="flex items-center justify-center py-20"><div className="w-12 h-12 border-4 border-emerald-500 border-t-white rounded-full animate-spin"></div></div>}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {/* View Details Modal */}
                {viewPatient && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewPatient(null)} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-5xl rounded-[48px] shadow-4xl relative z-10 overflow-hidden">
                            <div className="h-40 bg-gradient-to-r from-[#064E3B] to-[#065F46] relative">
                                <button onClick={() => setViewPatient(null)} className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center backdrop-blur-md transition-all"><X size={24} /></button>
                                <div className="absolute -bottom-16 left-12 p-2 bg-white rounded-[40px] shadow-2xl">
                                    <div className="w-32 h-32 rounded-[32px] bg-emerald-500 flex items-center justify-center text-white font-black italic text-5xl">{viewPatient.full_name.charAt(0)}</div>
                                </div>
                            </div>
                            <div className="pt-24 px-12 pb-12">
                                <div className="flex justify-between items-start mb-12">
                                    <div>
                                        <h3 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 mb-2">{viewPatient.full_name}</h3>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 uppercase tracking-widest">{viewPatient.uhid}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registered on {new Date(viewPatient.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center justify-end gap-2 mb-2">
                                            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active Profile</span>
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Visits: <span className="text-gray-900">{viewPatient.total_visits || 0}</span></p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-8 mb-12">
                                    <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm"><Users size={24} /></div>
                                        <div><p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">AGE / GENDER</p><p className="font-black uppercase tracking-tighter text-gray-900 text-lg">{viewPatient.age}Y · {viewPatient.gender}</p></div>
                                    </div>
                                    <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-red-600 shadow-sm"><Heart size={24} /></div>
                                        <div><p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">BLOOD GROUP</p><p className="font-black uppercase tracking-tighter text-gray-900 text-lg">{viewPatient.blood_group || 'NOT SET'}</p></div>
                                    </div>
                                    <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm"><Phone size={24} /></div>
                                        <div><p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">CONTACT</p><p className="font-black uppercase tracking-tighter text-gray-900 text-lg">{viewPatient.phone}</p></div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 flex items-center gap-3">MEDICAL INFORMATION</h4>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-6 border border-gray-100 rounded-3xl"><p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 font-['Montserrat']">Known Allergies</p><p className="text-sm font-bold text-gray-700">{viewPatient.known_allergies || 'None Documented'}</p></div>
                                        <div className="p-6 border border-gray-100 rounded-3xl"><p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 font-['Montserrat']">Chronic Diseases</p><p className="text-sm font-bold text-gray-700">{viewPatient.chronic_diseases || 'None Documented'}</p></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* ────────── Edit Profile Modal ────────── */}
                {editPatient && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setEditPatient(null)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            className="bg-white w-full max-w-2xl rounded-[28px] shadow-2xl relative z-10 flex flex-col"
                            style={{ maxHeight: 'calc(100vh - 2rem)' }}
                        >
                            <form onSubmit={handleUpdate} className="flex flex-col min-h-0 h-full">

                                {/* ── Header ── */}
                                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center flex-shrink-0 rounded-t-[28px]">
                                    <div>
                                        <h3 className="text-xl font-black italic uppercase tracking-tight text-gray-900 leading-none">Edit Profile</h3>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Update patient contact and medical info</p>
                                    </div>
                                    <button type="button" onClick={() => setEditPatient(null)} className="w-9 h-9 bg-white text-gray-400 hover:text-rose-500 rounded-xl flex items-center justify-center shadow-sm transition-all flex-shrink-0">
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* ── Scrollable Body ── */}
                                <div className="px-6 py-4 space-y-5 overflow-y-auto ef-scroll flex-1">

                                    {/* Basic Information */}
                                    <section className="space-y-2">
                                        <h4 className="ef-section-title text-emerald-600"><User size={11} /> Basic Information</h4>
                                        <div className="grid grid-cols-4 gap-3">
                                            <div className="col-span-4 ef-field">
                                                <label className="ef-label">Full Name</label>
                                                <input type="text" className="ef-input" value={editPatient.full_name} onChange={e => setEditPatient({...editPatient, full_name: e.target.value})} />
                                            </div>
                                            <div className="ef-field">
                                                <label className="ef-label">Age</label>
                                                <input type="number" className="ef-input" value={editPatient.age} onChange={e => setEditPatient({...editPatient, age: parseInt(e.target.value)})} />
                                            </div>
                                            <div className="ef-field">
                                                <label className="ef-label">Gender</label>
                                                <select className="ef-input" value={editPatient.gender} onChange={e => setEditPatient({...editPatient, gender: e.target.value})}>
                                                    {['Male','Female','Other'].map(g => <option key={g} value={g}>{g}</option>)}
                                                </select>
                                            </div>
                                            <div className="ef-field">
                                                <label className="ef-label">Blood Group</label>
                                                <select className="ef-input" value={editPatient.blood_group} onChange={e => setEditPatient({...editPatient, blood_group: e.target.value})}>
                                                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => <option key={g} value={g}>{g}</option>)}
                                                </select>
                                            </div>
                                            <div className="ef-field">
                                                <label className="ef-label">Marital Status</label>
                                                <select className="ef-input" value={editPatient.marital_status} onChange={e => setEditPatient({...editPatient, marital_status: e.target.value})}>
                                                    {[{v:'single',l:'Single'},{v:'married',l:'Married'},{v:'divorced',l:'Divorced'},{v:'widowed',l:'Widowed'}].map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Contact Details */}
                                    <section className="space-y-2">
                                        <h4 className="ef-section-title text-blue-600"><Phone size={11} /> Contact Details</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="ef-field">
                                                <label className="ef-label">Phone</label>
                                                <input type="text" className="ef-input" value={editPatient.phone} onChange={e => setEditPatient({...editPatient, phone: e.target.value})} />
                                            </div>
                                            <div className="ef-field">
                                                <label className="ef-label">Email</label>
                                                <input type="email" className="ef-input" value={editPatient.email || ''} onChange={e => setEditPatient({...editPatient, email: e.target.value})} />
                                            </div>
                                            <div className="ef-field col-span-2">
                                                <label className="ef-label">Address</label>
                                                <textarea className="ef-input ef-ta" value={editPatient.address || ''} onChange={e => setEditPatient({...editPatient, address: e.target.value})} />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Medical History */}
                                    <section className="space-y-2">
                                        <h4 className="ef-section-title text-red-500"><Heart size={11} /> Medical History</h4>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="ef-field">
                                                <label className="ef-label">Known Allergies</label>
                                                <textarea className="ef-input ef-ta" value={editPatient.known_allergies || ''} onChange={e => setEditPatient({...editPatient, known_allergies: e.target.value})} />
                                            </div>
                                            <div className="ef-field">
                                                <label className="ef-label">Chronic Diseases</label>
                                                <textarea className="ef-input ef-ta" value={editPatient.chronic_diseases || ''} onChange={e => setEditPatient({...editPatient, chronic_diseases: e.target.value})} />
                                            </div>
                                            <div className="ef-field">
                                                <label className="ef-label">Current Medications</label>
                                                <textarea className="ef-input ef-ta" value={editPatient.current_medications || ''} onChange={e => setEditPatient({...editPatient, current_medications: e.target.value})} />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Emergency & Insurance */}
                                    <section className="space-y-2">
                                        <h4 className="ef-section-title text-orange-500"><Shield size={11} /> Emergency &amp; Insurance</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="ef-field">
                                                <label className="ef-label">Emergency Phone</label>
                                                <input type="text" className="ef-input" value={editPatient.emergency_contact_phone || ''} onChange={e => setEditPatient({...editPatient, emergency_contact_phone: e.target.value})} />
                                            </div>
                                            <div className="ef-field">
                                                <label className="ef-label">Relation</label>
                                                <input type="text" className="ef-input" value={editPatient.emergency_contact_relation || ''} onChange={e => setEditPatient({...editPatient, emergency_contact_relation: e.target.value})} />
                                            </div>
                                            <div className="ef-field">
                                                <label className="ef-label">Insurance Provider</label>
                                                <input type="text" className="ef-input" value={editPatient.insurance_provider || ''} onChange={e => setEditPatient({...editPatient, insurance_provider: e.target.value})} />
                                            </div>
                                            <div className="ef-field">
                                                <label className="ef-label">Policy Number</label>
                                                <input type="text" className="ef-input" value={editPatient.insurance_policy_number || ''} onChange={e => setEditPatient({...editPatient, insurance_policy_number: e.target.value})} />
                                            </div>
                                        </div>
                                    </section>

                                </div>

                                {/* ── Footer ── */}
                                <div className="px-6 py-4 bg-white border-t border-gray-100 flex-shrink-0 rounded-b-[28px]">
                                    <button
                                        disabled={saving}
                                        type="submit"
                                        className="w-full bg-emerald-600 text-white py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50"
                                    >
                                        {saving
                                            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            : <><Save size={15} /> Save Changes</>
                                        }
                                    </button>
                                </div>

                            </form>
                        </motion.div>
                    </div>
                )}

            </AnimatePresence>

            <style>{`
                /* Edit-form helpers */
                .ef-field   { display:flex; flex-direction:column; gap:3px; }
                .ef-label   { font-size:9px; font-weight:900; text-transform:uppercase; letter-spacing:.1em; color:#94a3b8; padding-left:2px; }
                .ef-input   { width:100%; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; padding:.5rem .85rem; font-weight:700; font-size:.78rem; outline:none; transition:all .2s; color:#1e293b; }
                .ef-input:focus { background:white; border-color:#10B981; box-shadow:0 0 0 3px rgba(16,185,129,.08); }
                .ef-ta      { resize:none; height:60px; line-height:1.4; }
                .ef-section-title { font-size:9px; font-weight:900; text-transform:uppercase; letter-spacing:.15em; display:flex; align-items:center; gap:6px; }
                .ef-scroll::-webkit-scrollbar       { width:4px; }
                .ef-scroll::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:10px; }
            `}</style>
        </motion.div>
    );
};

export default Patients;
