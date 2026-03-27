import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
    Pill, Plus, Search, Trash2, Microscope, Tag, 
    FileWarning, ShoppingCart, ChevronLeft, ChevronRight, X,
    Edit3, Info, Globe, Filter
} from 'lucide-react';

interface Medicine {
  id: number;
  name: string;
  generic_name: string;
  brand_name: string;
  category: string;
  medicine_type: string;
  manufacturer: string;
  dosage_form: string;
  strength: string;
  unit_price: number;
  stock_quantity: number;
  is_prescription_required: boolean;
}

const Medicines = () => {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    
    const [newMed, setNewMed] = useState<Partial<Medicine>>({ 
        name: '', 
        generic_name: '', 
        brand_name: '', 
        category: 'General',
        medicine_type: 'Tablet',
        manufacturer: '',
        dosage_form: 'Oral',
        strength: '',
        unit_price: 0,
        stock_quantity: 0,
        is_prescription_required: false
    });

    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);

    const fetchMeds = async (pageNumber = 1) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access');
            const res = await axios.get(`http://127.0.0.1:8000/api/hospitals/medicines/?search=${searchTerm}&page=${pageNumber}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMedicines(res.data.results || []);
            setCount(res.data.count || 0);
        } catch (err: any) {
            console.error('Error fetching medicines:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setPage(1);
            fetchMeds(1);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access');
            await axios.post('http://127.0.0.1:8000/api/hospitals/medicines/', newMed, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewMed({ name: '', generic_name: '', brand_name: '', category: 'General', medicine_type: 'Tablet', manufacturer: '', dosage_form: 'Oral', strength: '', unit_price: 0, stock_quantity: 0, is_prescription_required: false });
            setShowForm(false);
            fetchMeds(page);
        } catch (err: any) {
            alert('Failed to add medicine.');
        }
    };

    const totalPages = Math.ceil(count / 10); // DRF usually defaults to 10 or 20

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to remove this medicine?')) return;
        try {
            const token = localStorage.getItem('access');
            await axios.delete(`http://127.0.0.1:8000/api/hospitals/medicines/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMeds(page);
        } catch (err) {
            alert('Operation Aborted: Persistence required.');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 pb-32 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-600 rounded-[28px] flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                        <Pill size={32} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black italic uppercase text-gray-900 tracking-tighter leading-none mb-2 font-['Montserrat']">Medicine Master</h2>
                        <p className="font-bold text-gray-400 uppercase tracking-widest text-[9px] pl-0.5">Global Pharmaceutical Registry</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                        <input 
                            type="text" 
                            placeholder="SEARCH MEDICINES..." 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-[24px] py-4 pl-14 pr-6 font-bold text-xs tracking-widest text-gray-800 focus:outline-none focus:border-emerald-500 transition-all shadow-sm uppercase" 
                        />
                    </div>
                    <button 
                        onClick={() => setShowForm(true)} 
                        className="bg-emerald-600 text-white px-8 py-4 rounded-[24px] font-black uppercase text-[11px] tracking-widest hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-900/10 flex items-center gap-2"
                    >
                        <Plus size={18} /> Add Medicine
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40 flex justify-between items-center group">
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Total Molecules</h4>
                        <p className="text-4xl font-black italic tracking-tighter text-gray-900">{count}</p>
                    </div>
                    <div className="w-14 h-14 bg-gray-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Globe size={28} />
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40 flex justify-between items-center group">
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Categories</h4>
                        <p className="text-4xl font-black italic tracking-tighter text-gray-900">12+</p>
                    </div>
                    <div className="w-14 h-14 bg-gray-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Tag size={28} />
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40 flex justify-between items-center group">
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">System Status</h4>
                        <p className="text-4xl font-black italic tracking-tighter text-gray-900">Active</p>
                    </div>
                    <div className="w-14 h-14 bg-gray-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Filter size={28} />
                    </div>
                </div>
            </div>

            {/* Main Table Layout */}
            {loading ? (
                <div className="text-center p-32 space-y-6">
                    <div className="w-12 h-12 border-4 border-gray-100 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
                    <p className="font-black italic uppercase tracking-[0.4em] text-gray-300 text-[11px] animate-pulse">Syncing Lab Data...</p>
                </div>
            ) : (
                <div className="bg-white rounded-[40px] shadow-4xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100 uppercase text-[10px] font-black tracking-widest text-gray-400 font-['Montserrat']">
                                <th className="p-8 pl-10">Medicine Name</th>
                                <th className="p-8">Classification</th>
                                <th className="p-8">Pricing</th>
                                <th className="p-8">Auth</th>
                                <th className="p-8 text-right pr-12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {medicines.map(m => (
                                <tr key={m.id} className="transition-all hover:bg-emerald-50/10 group/row">
                                    <td className="p-8 pl-10">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center group-hover/row:bg-emerald-100 group-hover/row:text-emerald-600 transition-all font-black italic shadow-inner">
                                                {m.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-black text-xl text-gray-900 group-hover/row:text-emerald-700 transition-colors uppercase italic tracking-tighter leading-tight">{m.name}</div>
                                                <div className="flex items-center gap-3 mt-1.5 font-['Montserrat']">
                                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{m.strength || 'N/A'}</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{m.dosage_form}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="space-y-1.5">
                                            <span className="px-4 py-1.5 bg-gray-100 text-gray-600 font-black uppercase text-[9px] tracking-widest rounded-lg">
                                                {m.category}
                                            </span>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">{m.medicine_type}</div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div>
                                            <div className="font-black text-lg text-gray-800 tracking-tighter">₹{m.unit_price} <span className="text-[10px] font-bold text-gray-400 opacity-60">/UNIT</span></div>
                                            <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2 mt-1">
                                                <Microscope size={12} /> {m.manufacturer || 'PRIVATE ENTITY'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        {m.is_prescription_required ? (
                                            <span className="px-5 py-2 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 font-black uppercase text-[9px] tracking-widest shadow-sm">
                                                Required Rx
                                            </span>
                                        ) : (
                                            <span className="px-5 py-2 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 font-black uppercase text-[9px] tracking-widest shadow-sm">
                                                OTC Global
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-8 text-right pr-12">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover/row:opacity-100 transition-all">
                                            <button className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 hover:border-blue-100 shadow-sm transition-all scale-90 hover:scale-100">
                                                <Edit3 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(m.id)} className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-red-500 hover:border-red-100 shadow-sm transition-all scale-90 hover:scale-100">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {count === 0 && (
                        <div className="p-32 text-center flex flex-col items-center">
                            <Info size={64} className="text-gray-100 mb-8" />
                            <h3 className="text-3xl font-black italic uppercase text-gray-200 tracking-tighter">No Active Molecules</h3>
                            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-300 mt-4 italic font-['Montserrat']">Start populating the global database</p>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="p-10 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                        <div className="pl-6 text-[11px] font-black uppercase tracking-[0.3em] text-gray-300 font-['Montserrat']">
                            RECORDS <span className="text-emerald-600">{count}</span> <span className="mx-3 opacity-20">AVAILABLE</span>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                disabled={page === 1} 
                                onClick={() => { setPage(p => p - 1); fetchMeds(page - 1); }}
                                className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm disabled:opacity-30"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button 
                                disabled={page === totalPages || totalPages === 0} 
                                onClick={() => { setPage(p => p + 1); fetchMeds(page + 1); }}
                                className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm disabled:opacity-30"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* NEW MEDICINE MODAL (Simplified Table-like Layout) */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-4xl rounded-[48px] overflow-hidden shadow-4xl relative border border-gray-100"
                        >
                            <div className="p-12 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h3 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">Add New Molecule</h3>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-2 font-['Montserrat']">Update the Global Pharmaceutical Registry</p>
                                </div>
                                <button onClick={() => setShowForm(false)} className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-all group">
                                    <X size={28} className="group-hover:rotate-90 transition-transform" />
                                </button>
                            </div>

                            <form onSubmit={handleAdd} className="p-12 space-y-10">
                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#064E3B] ml-1">Full Molecule Identity (Name)</label>
                                        <input type="text" placeholder="E.G. PARACETAMOL 500MG" required className="input-field-standard text-lg font-black"
                                               value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#064E3B] ml-1">Global Classification</label>
                                        <input type="text" placeholder="E.G. ANALGESIC" required className="input-field-standard"
                                               value={newMed.category} onChange={e => setNewMed({...newMed, category: e.target.value})} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/40 ml-1">Generic Name</label>
                                            <input type="text" placeholder="IDENTITY..." className="input-field-standard"
                                                   value={newMed.generic_name} onChange={e => setNewMed({...newMed, generic_name: e.target.value})} />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/40 ml-1">Molecule Strength</label>
                                            <input type="text" placeholder="500MG" className="input-field-standard"
                                                   value={newMed.strength} onChange={e => setNewMed({...newMed, strength: e.target.value})} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/40 ml-1">Form Type</label>
                                            <select className="input-field-standard appearance-none"
                                                    value={newMed.medicine_type} onChange={e => setNewMed({...newMed, medicine_type: e.target.value})}>
                                                <option>Tablet</option>
                                                <option>Capsule</option>
                                                <option>Syrup</option>
                                                <option>Injection</option>
                                                <option>Ointment</option>
                                            </select>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/40 ml-1">Unit Valuation (₹)</label>
                                            <div className="relative">
                                                <ShoppingCart size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-300" />
                                                <input type="number" step="0.01" className="input-field-standard pl-14"
                                                       value={newMed.unit_price} onChange={e => setNewMed({...newMed, unit_price: parseFloat(e.target.value)})} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/40 ml-1">Manufacturer</label>
                                        <input type="text" placeholder="ENTITY NAME..." className="input-field-standard"
                                               value={newMed.manufacturer} onChange={e => setNewMed({...newMed, manufacturer: e.target.value})} />
                                    </div>

                                    <div className="pt-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600/40 ml-1 block mb-4">Lexicon Status</label>
                                        <div className="flex gap-4">
                                            <button 
                                                type="button" 
                                                onClick={() => setNewMed({...newMed, is_prescription_required: false})}
                                                className={`flex-1 py-4 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest border-2 transition-all ${!newMed.is_prescription_required ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20' : 'bg-white text-gray-400 border-gray-100 hover:border-emerald-200'}`}
                                            >
                                                OTC Global
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => setNewMed({...newMed, is_prescription_required: true})}
                                                className={`flex-1 py-4 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest border-2 transition-all ${newMed.is_prescription_required ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-white text-gray-400 border-gray-100 hover:border-amber-200'}`}
                                            >
                                                Required Rx
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-7 bg-emerald-900 text-white rounded-[32px] font-black italic uppercase tracking-[0.3em] text-xl shadow-4xl shadow-emerald-900/40 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-6">
                                    Initialize New Molecule
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .input-field-standard {
                    width: 100%;
                    background-color: #F8FAFC;
                    border: 2px solid #F1F5F9;
                    border-radius: 24px;
                    padding: 1.25rem 1.75rem;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    font-size: 0.8rem;
                    outline: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: 'Montserrat';
                }
                .input-field-standard:focus {
                    background-color: white;
                    border-color: #10B981;
                    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.1);
                }
                .shadow-4xl {
                    box-shadow: 0 50px 100px -20px rgba(0,0,0,0.25), 0 30px 60px -30px rgba(0,0,0,0.3);
                }
            `}</style>
        </motion.div>
    );
};

export default Medicines;
