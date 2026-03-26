import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Users, Search, Filter, MoreVertical, Eye, Edit2, 
  Trash2, Plus, Download, ChevronLeft, ChevronRight, UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Patients = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, recent, active
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPatients();
    }, [search, filter]);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access');
            const res = await axios.get(`http://127.0.0.1:8000/api/patients/patients/?search=${search}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Handle results if paginated or direct array
            const data = res.data.results || res.data;
            setPatients(data);
            setError('');
        } catch (err) {
            setError('Failed to load patients.');
            console.error(err);
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

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-8"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-5xl font-black italic uppercase text-gray-900 tracking-tighter leading-none mb-3 font-['Montserrat']">
                        Patients Registry
                    </h2>
                    <p className="font-bold text-gray-400 uppercase tracking-[0.3em] text-[10px] pl-1 font-['Montserrat']">
                        Manage all registered health records
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/dashboard/staff/register')}
                        className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-gray-900/20 hover:bg-black transition-all flex items-center gap-3 active:scale-95"
                    >
                        <Plus size={18} className="text-emerald-400" /> New Patient
                    </button>
                    <button className="bg-white text-gray-400 p-4 rounded-2xl border border-gray-100 shadow-sm hover:text-emerald-600 transition-all active:scale-95">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm items-center">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="SEARCH BY NAME, UHID, OR PHONE..." 
                        className="w-full bg-gray-50/50 border-2 border-transparent py-4 pl-14 pr-6 rounded-2xl font-black tracking-widest uppercase outline-none focus:bg-white focus:border-emerald-500/20 transition-all text-xs font-['Montserrat']"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 bg-gray-50/50 p-2 rounded-2xl w-full lg:w-auto">
                    {['all', 'recent', 'favorites'].map((t) => (
                        <button 
                            key={t}
                            onClick={() => setFilter(t)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
                <button className="flex items-center gap-3 px-6 py-4 bg-gray-50/50 rounded-2xl font-black uppercase text-[10px] tracking-widest text-gray-400 hover:text-emerald-600 transition-all w-full lg:w-auto justify-center">
                    <Filter size={16} /> Filters
                </button>
            </div>

            {/* Patients Table/Grid */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden min-h-[400px]">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600"></div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 font-['Montserrat']">Patient Identity</th>
                                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 font-['Montserrat']">UHID / ID</th>
                                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 font-['Montserrat']">Details</th>
                                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 font-['Montserrat']">Contact</th>
                                <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 font-['Montserrat'] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence mode='popLayout'>
                                {patients.map((p, idx) => (
                                    <motion.tr 
                                        key={p.uhid}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group hover:bg-emerald-50/30 transition-colors"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-black italic text-lg shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                                                    {p.full_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black uppercase italic tracking-tighter text-gray-900 leading-none mb-1">{p.full_name}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{p.gender} · {p.age} Years</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-mono text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                                {p.uhid}
                                            </span>
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
                                                <p className="text-[9px] font-bold text-gray-400 lowercase">{p.email || 'no email set'}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-3 text-gray-400 hover:text-emerald-600 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md border border-transparent hover:border-emerald-100">
                                                    <Eye size={18} />
                                                </button>
                                                <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md border border-transparent hover:border-blue-100">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(p.uhid)}
                                                    className="p-3 text-gray-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md border border-transparent hover:border-red-100"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {!loading && patients.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mb-6 border border-gray-100">
                            <Users size={40} className="text-gray-200" />
                        </div>
                        <h4 className="font-black italic uppercase text-xl text-gray-900 tracking-tighter mb-2">No Patients Found</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest max-w-[200px]">Try adjusting your search query or add a new patient.</p>
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-white rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Pagination */}
                <div className="p-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Showing <span className="text-gray-900">{patients.length}</span> Patients Total
                    </p>
                    <div className="flex items-center gap-4">
                        <button className="p-4 rounded-2xl border border-gray-100 text-gray-300 cursor-not-allowed transition-all">
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center gap-2">
                            {[1].map(n => (
                                <button key={n} className="w-10 h-10 rounded-xl bg-gray-900 text-white font-black text-[10px] flex items-center justify-center shadow-lg shadow-gray-900/20">
                                    {n}
                                </button>
                            ))}
                        </div>
                        <button className="p-4 rounded-2xl border border-gray-100 text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition-all active:scale-95">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Records', value: patients.length, color: 'emerald', icon: <Users /> },
                    { label: 'Verified Patients', value: patients.length, color: 'blue', icon: <UserCheck /> },
                    { label: 'Growth rate', value: '+12%', color: 'rose', icon: <Plus /> },
                ].map((s) => (
                    <div key={s.label} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-lg transition-all duration-500">
                        <div className={`w-16 h-16 rounded-[24px] bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            {s.icon}
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{s.label}</p>
                            <h4 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">{s.value}</h4>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default Patients;
