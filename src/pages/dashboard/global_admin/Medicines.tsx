import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Pill, Plus, Search, Trash2 } from 'lucide-react';

interface Medicine {
  id: number;
  name: string;
  category: string;
}

const Medicines = () => {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [newMed, setNewMed] = useState({ name: '', category: 'General' });

    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);

    const fetchMeds = async (pageNumber = 1) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access');
            const res = await axios.get(`http://127.0.0.1:8000/api/hospitals/medicines/?search=${searchTerm}&page=${pageNumber}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // DRF with pagination returns { count: n, next: url, previous: url, results: [...] }
            setMedicines(res.data.results || []);
            setCount(res.data.count || 0);
        } catch (err: any) {
            console.error('Error fetching medicines:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1); // Reset to page 1 on new search
        fetchMeds(1);
    }, [searchTerm]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access');
            await axios.post('http://127.0.0.1:8000/api/hospitals/medicines/', newMed, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewMed({ name: '', category: 'General' });
            fetchMeds(page);
        } catch (err: any) {
            console.error('Add medicine error:', err);
            const msg = err.response?.data?.name?.[0] || err.response?.data?.detail || 'Failed to add medicine.';
            alert(msg === 'medicine master with this name already exists.' ? 'Medicine already exists in the Global database.' : msg);
        }
    };

    const totalPages = Math.ceil(count / 5);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to remove this medicine from the global registry?')) return;
        try {
            const token = localStorage.getItem('access');
            await axios.delete(`http://127.0.0.1:8000/api/hospitals/medicines/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMeds(page);
        } catch (err) {
            alert('Failed to delete medicine');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-3xl font-black italic uppercase text-gray-800 tracking-tighter">Global Medicine Master</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                {/* Form column */}
                <div className="col-span-1">
                    <form onSubmit={handleAdd} className="card-premium p-6 space-y-4 sticky top-24 border-2 border-transparent hover:border-green-100 transition-all">
                        <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-white mb-4 shadow-lg shadow-green-900/20" 
                             style={{ backgroundColor: 'var(--color-primary)' }}>
                            <Plus size={24} />
                        </div>
                        <h3 className="text-xl font-black italic tracking-tight text-gray-900 mb-2 uppercase">New Medicine</h3>
                        
                        <input type="text" placeholder="Medicine Name (e.g., Paracetamol 500mg)" required
                               className="input-field px-6 font-bold text-gray-800" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} />
                               
                        <input type="text" placeholder="Category" required
                               className="input-field px-6 font-bold text-gray-800" value={newMed.category} onChange={e => setNewMed({...newMed, category: e.target.value})} />
                               
                        <button type="submit" className="btn-primary w-full py-4 mt-4 text-[10px] font-black tracking-[0.2em] uppercase shadow-xl shadow-green-900/10 hover:scale-[1.02] transform transition-all active:scale-[0.98]">
                            Add to Global Database
                        </button>
                    </form>
                </div>

                {/* List column */}
                <div className="col-span-2 space-y-4">
                    <div className="relative mb-6">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" placeholder="Search global registry (Identity or Classification)..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                               className="w-full bg-white border-2 border-gray-100 rounded-[24px] py-5 pl-14 pr-4 font-black text-gray-800 tracking-tight focus:outline-none focus:border-[var(--color-primary)] transition-all shadow-sm" />
                    </div>

                    {loading ? (
                        <div className="text-center p-20 font-black uppercase tracking-[0.2em] text-gray-400 animate-pulse">Syncing Database...</div>
                    ) : (
                        <>
                            <div className="bg-white rounded-[32px] shadow-md border border-gray-100 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-[#F8FAFC] uppercase text-[10px] font-black tracking-[0.2em] text-gray-400 border-b border-gray-100">
                                        <tr>
                                            <th className="p-6 pl-10">ID</th>
                                            <th className="p-6">Medicine Identity</th>
                                            <th className="p-6">Classification</th>
                                            <th className="p-6 text-right pr-12">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {medicines.map(m => (
                                            <tr key={m.id} className="transition-all hover:bg-green-50/10 group">
                                                <td className="p-6 pl-10 font-black text-gray-300 text-xs tracking-widest">#{m.id}</td>
                                                <td className="p-6 flex items-center gap-4">
                                                    <div className="p-2.5 rounded-xl bg-green-100/30 text-green-600 transition-transform group-hover:scale-110"><Pill size={16} /></div>
                                                    <span className="font-black text-sm uppercase text-gray-900 italic tracking-tighter">{m.name}</span>
                                                </td>
                                                <td className="p-6">
                                                    <span className="px-3 py-1 bg-[#F1F5F9] text-gray-500 font-bold uppercase text-[9px] tracking-[0.1em] rounded-md">
                                                        {m.category}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-right pr-10">
                                                    <button onClick={() => handleDelete(m.id)} className="p-3 rounded-2xl hover:bg-red-50 text-gray-200 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {medicines.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="p-24 text-center flex flex-col items-center justify-center space-y-4 opacity-50">
                                                    <Search size={48} className="text-gray-300 stroke-[1.5]" />
                                                    <p className="font-black uppercase text-xs tracking-[0.2em] text-gray-400">No matching records found.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* Pagination Controls Inside Card */}
                                <div className="p-6 bg-gray-50/30 border-t border-gray-100 flex justify-between items-center px-10">
                                    <div className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400">
                                        Showing {medicines.length} of {count} Items
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <button 
                                            disabled={page === 1}
                                            onClick={() => { setPage(p => p - 1); fetchMeds(page - 1); }}
                                            className="px-6 py-2.5 rounded-xl bg-white border border-gray-100 text-gray-900 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
                                        >
                                            Prev
                                        </button>
                                        <div className="flex gap-1.5">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                                <button key={p} onClick={() => { setPage(p); fetchMeds(p); }}
                                                        className={`w-9 h-9 flex items-center justify-center rounded-xl text-[10px] font-black transition-all ${page === p ? 'bg-gray-900 text-white shadow-lg lg:scale-110' : 'bg-white text-gray-400 border border-transparent hover:border-gray-200'}`}>
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                        <button 
                                            disabled={page === totalPages || totalPages === 0}
                                            onClick={() => { setPage(p => p + 1); fetchMeds(page + 1); }}
                                            className="px-6 py-2.5 rounded-xl bg-gray-900 border border-gray-200 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Medicines;
