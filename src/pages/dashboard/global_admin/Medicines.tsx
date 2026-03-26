import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Pill, Plus, Search, Trash2, Microscope, Briefcase, Tag, FileWarning, ShoppingCart, Activity, ChevronLeft, ChevronRight, X } from 'lucide-react';

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
            alert('Failed to add molecule to Global Register.');
        }
    };

    const totalPages = Math.ceil(count / 5);

    const handleDelete = async (id: number) => {
        if (!window.confirm('IRREVERSIBLE ACTION: Remove this molecule from Global Lexicon?')) return;
        try {
            const token = localStorage.getItem('access');
            await axios.delete(`http://127.0.0.1:8000/api/hospitals/medicines/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMeds(page);
        } catch (err) {
            alert('Operation Aborted: System Restriction.');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 pb-32 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
                 <div>
                    <h2 className="text-5xl font-black italic uppercase text-gray-900 tracking-tighter leading-none mb-2 font-['Montserrat']">Global Lexicon</h2>
                    <p className="font-bold text-gray-300 uppercase tracking-[0.4em] text-[10px] pl-1 font-['Montserrat']">Pharmacological Master Control</p>
                 </div>
                 
                 <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="relative flex-1 md:w-96">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input type="text" placeholder="SEARCH GLOBAL MOLECULES..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                               className="w-full bg-white border-2 border-gray-100 rounded-[24px] py-5 pl-14 pr-4 font-black text-gray-800 tracking-tight focus:outline-none focus:border-emerald-500 transition-all shadow-sm uppercase text-[10px]" />
                    </div>
                    <button onClick={() => setShowForm(true)} className="bg-gray-900 text-white p-5 rounded-3xl shadow-2xl hover:bg-black hover:scale-110 active:scale-95 transition-all">
                        <Plus size={24} />
                    </button>
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                <div className="card-premium p-8 bg-emerald-700 text-white shadow-3xl shadow-emerald-900/20 border-0 flex justify-between items-center group overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform"><Pill size={100} /></div>
                    <div className="relative z-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200 mb-2">Lexicon Depth</h4>
                        <p className="text-5xl font-black italic tracking-tighter">{count}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/10 rounded-[22px] flex items-center justify-center backdrop-blur-md border border-white/10 relative z-10">
                        <Microscope size={32} />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center p-32 space-y-6">
                    <div className="w-10 h-10 border-4 border-gray-100 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
                    <p className="font-black uppercase tracking-[0.4em] text-gray-300 text-[10px]">Syncing Global Records...</p>
                </div>
            ) : (
                <div className="bg-white rounded-[40px] shadow-4xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative group/table h-full">
                    <table className="w-full text-left relative z-10">
                        <thead>
                            <tr className="bg-[#F8FAFC] border-b border-gray-100 uppercase text-[9px] font-black tracking-[0.2em] text-gray-400 font-['Montserrat']">
                                <th className="p-8">Molecular Identity</th>
                                <th className="p-8">Classification</th>
                                <th className="p-8">Commercial Data</th>
                                <th className="p-8">Control</th>
                                <th className="p-8 text-right pr-12">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {medicines.map(m => (
                                <tr key={m.id} className="transition-all hover:bg-emerald-50/10 group/row">
                                    <td className="p-8">
                                        <div className="flex items-center gap-6">
                                            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-[22px] shadow-inner group-hover/row:scale-110 transition-transform"><Pill size={24} /></div>
                                            <div>
                                                <div className="font-black text-lg text-gray-900 italic tracking-tighter uppercase group-hover/row:text-emerald-700 transition-colors">{m.name}</div>
                                                <div className="flex items-center gap-2 mt-2 font-['Montserrat']">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{m.generic_name || 'NO GENERIC LOG'}</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                                                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{m.strength} ({m.dosage_form})</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="space-y-2">
                                            <span className="px-4 py-1.5 bg-gray-100 text-gray-500 font-black uppercase text-[8px] tracking-[0.2em] rounded-lg">
                                                {m.category}
                                            </span>
                                            <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest pl-1">{m.medicine_type}</div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div>
                                            <div className="font-black text-sm text-gray-900 italic tracking-tighter">₹{m.unit_price} / Unit</div>
                                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                                                <Briefcase size={10} /> {m.manufacturer || 'PRIVATE ENTITY'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <span className={`px-4 py-2 rounded-xl font-black uppercase text-[8px] tracking-[0.2em] border shadow-sm ${m.is_prescription_required ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                                            {m.is_prescription_required ? 'Rx Restricted' : 'Global OTC'}
                                        </span>
                                    </td>
                                    <td className="p-8 text-right pr-12">
                                        <button onClick={() => handleDelete(m.id)} className="p-4 rounded-2xl hover:bg-red-50 text-gray-200 hover:text-red-500 transition-all opacity-0 group-hover/row:opacity-100 hover:scale-110">
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {count === 0 && (
                        <div className="p-32 text-center opacity-30 group-hover/table:opacity-50 transition-opacity flex flex-col items-center">
                            <Microscope size={64} className="mb-6" />
                            <p className="font-black uppercase tracking-[0.3em] text-[11px]">No atomic records found.</p>
                        </div>
                    )}

                    <div className="p-8 bg-gray-50/30 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-[9px] font-black tracking-[0.3em] text-gray-300 uppercase">SYNCHRONIZED: {count} ACTIVE RECORDS</p>
                        <div className="flex gap-3">
                            <button disabled={page === 1} onClick={() => { setPage(p => p - 1); fetchMeds(page - 1); }}
                                    className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm disabled:opacity-30">
                                <ChevronLeft size={20} />
                            </button>
                            <button disabled={page === totalPages || totalPages === 0} onClick={() => { setPage(p => p + 1); fetchMeds(page + 1); }}
                                    className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm disabled:opacity-30">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Molecule Creation Overlay */}
            <AnimatePresence>
                {showForm && (
                     <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/40 overflow-y-auto">
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 50 }}
                                    className="bg-white w-full max-w-4xl rounded-[48px] p-12 shadow-4xl my-auto relative border border-gray-100">

                             <div className="flex justify-between items-center mb-10">
                                 <div>
                                     <h3 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">Molecule Synthesis</h3>
                                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 font-['Montserrat']">Initialize New Global Pharmaceutic Record</p>
                                 </div>
                                 <button onClick={() => setShowForm(false)} className="p-4 hover:bg-gray-100 rounded-2xl transition-all">
                                     <X size={32} className="text-gray-300" />
                                 </button>
                             </div>

                             <form onSubmit={handleAdd} className="space-y-10">
                                 <div className="grid md:grid-cols-3 gap-8">
                                     <div className="space-y-2 md:col-span-2">
                                         <label className="text-[10px] font-black uppercase tracking-widest text-[#064E3B] ml-1">Full Molecule Identity (Name)</label>
                                         <input type="text" placeholder="E.G. PARACETAMOL 500MG FORTE" required className="input-field-lexicon text-lg italic tracking-tight"
                                                value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} />
                                     </div>
                                     <div className="space-y-2">
                                         <label className="text-[10px] font-black uppercase tracking-widest text-[#064E3B] ml-1">Global Classification</label>
                                         <div className="relative">
                                             <Tag size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-300" />
                                             <input type="text" placeholder="E.G. ANALGESIC" required className="input-field-lexicon pl-14"
                                                    value={newMed.category} onChange={e => setNewMed({...newMed, category: e.target.value})} />
                                         </div>
                                     </div>

                                     <div className="space-y-2">
                                         <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600/40 ml-1">Generic Identity</label>
                                         <input type="text" placeholder="GLYCERIN..." className="input-field-lexicon"
                                                value={newMed.generic_name} onChange={e => setNewMed({...newMed, generic_name: e.target.value})} />
                                     </div>
                                     <div className="space-y-2">
                                         <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600/40 ml-1">Brand Mapping</label>
                                         <input type="text" placeholder="PANADOL..." className="input-field-lexicon"
                                                value={newMed.brand_name} onChange={e => setNewMed({...newMed, brand_name: e.target.value})} />
                                     </div>
                                     <div className="space-y-2">
                                         <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600/40 ml-1">Molecule Strength</label>
                                         <input type="text" placeholder="500MG" className="input-field-lexicon"
                                                value={newMed.strength} onChange={e => setNewMed({...newMed, strength: e.target.value})} />
                                     </div>

                                     <div className="space-y-2">
                                         <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600/40 ml-1">Type of Form</label>
                                         <select className="input-field-lexicon appearance-none bg-gray-50/50"
                                                 value={newMed.medicine_type} onChange={e => setNewMed({...newMed, medicine_type: e.target.value})}>
                                             <option>Tablet</option>
                                             <option>Capsule</option>
                                             <option>Syrup</option>
                                             <option>Injection</option>
                                             <option>Ointment</option>
                                             <option>Eye Drop</option>
                                         </select>
                                     </div>
                                     <div className="space-y-2">
                                         <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600/40 ml-1">Unit Valuation (₹)</label>
                                         <div className="relative">
                                             <ShoppingCart size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-300" />
                                             <input type="number" step="0.01" className="input-field-lexicon pl-14"
                                                    value={newMed.unit_price} onChange={e => setNewMed({...newMed, unit_price: parseFloat(e.target.value)})} />
                                         </div>
                                     </div>
                                     <div className="space-y-2">
                                         <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600/40 ml-1">Lexicon Authorization</label>
                                         <button type="button" onClick={() => setNewMed({...newMed, is_prescription_required: !newMed.is_prescription_required})}
                                                 className={`w-full py-5 rounded-[22px] font-black uppercase text-[10px] tracking-widest border-2 transition-all flex items-center justify-center gap-3 ${newMed.is_prescription_required ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-100 bg-white text-gray-400'}`}>
                                             <FileWarning size={16} /> {newMed.is_prescription_required ? 'Prescription Encrypted' : 'Open Allocation (OTC)'}
                                         </button>
                                     </div>
                                 </div>

                                 <button type="submit" className="w-full py-7 rounded-[32px] bg-[#064E3B] text-white font-black italic uppercase tracking-[0.2em] text-xl shadow-3xl shadow-emerald-900/40 hover:bg-black hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-6">
                                     <Microscope size={32} className="animate-pulse" /> BROADCAST TO GLOBAL NETWORK
                                 </button>
                             </form>
                        </motion.div>
                     </div>
                )}
            </AnimatePresence>

            <style>{`
                .input-field-lexicon {
                    width: 100%;
                    background-color: #F8FAFC;
                    border: 2px solid transparent;
                    border-radius: 22px;
                    padding: 1.25rem 1.75rem;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    outline: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .input-field-lexicon:focus {
                    background-color: white;
                    border-color: #10B981;
                    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.1);
                }
            `}</style>
        </motion.div>
    );
};

export default Medicines;
