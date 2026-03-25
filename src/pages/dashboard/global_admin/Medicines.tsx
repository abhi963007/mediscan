import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Pill, Plus, Search } from 'lucide-react';

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

    const fetchMeds = async () => {
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/hospitals/medicines/?search=${searchTerm}`);
            setMedicines(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeds();
    }, [searchTerm]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/hospitals/medicines/', newMed);
            setNewMed({ name: '', category: 'General' });
            fetchMeds();
        } catch (err) {
            alert('Failed to add medicine. It might already exist.');
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
                    <form onSubmit={handleAdd} className="card-premium p-6 space-y-4 sticky top-24">
                        <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-white mb-4" 
                             style={{ backgroundColor: 'var(--color-primary)' }}>
                            <Plus size={24} />
                        </div>
                        <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-2">New Medicine</h3>
                        
                        <input type="text" placeholder="Medicine Name (e.g., Paracetamol 500mg)" required
                               className="input-field" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} />
                               
                        <input type="text" placeholder="Category" required
                               className="input-field" value={newMed.category} onChange={e => setNewMed({...newMed, category: e.target.value})} />
                               
                        <button type="submit" className="btn-primary w-full py-3 mt-4 text-sm tracking-wider uppercase">
                            Add to Database
                        </button>
                    </form>
                </div>

                {/* List column */}
                <div className="col-span-2 space-y-4">
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" placeholder="Search medicines..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                               className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
                    </div>

                    {loading ? (
                        <div className="text-center p-10 font-bold uppercase tracking-widest text-gray-400">Loading DB...</div>
                    ) : (
                        <div className="bg-white rounded-[24px] shadow-sm overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 uppercase text-xs font-black tracking-widest text-gray-400">
                                    <tr>
                                        <th className="p-4 pl-6">ID</th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Category</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicines.map(m => (
                                        <tr key={m.id} className="border-t border-gray-50 transition-colors hover:bg-green-50/50">
                                            <td className="p-4 pl-6 font-medium text-gray-400 text-sm">#{m.id}</td>
                                            <td className="p-4 font-bold text-gray-900 flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-green-100/50 text-green-600"><Pill size={16} /></div>
                                                {m.name}
                                            </td>
                                            <td className="p-4 font-medium text-sm text-gray-500">{m.category}</td>
                                        </tr>
                                    ))}
                                    {medicines.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="p-10 text-center font-bold text-gray-400 uppercase tracking-widest italic">
                                                No Medicines Found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Medicines;
