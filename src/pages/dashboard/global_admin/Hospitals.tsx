import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Building2, CheckCircle2, ShieldAlert } from 'lucide-react';

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

const Hospitals = () => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHospitals = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/hospitals/');
            setHospitals(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHospitals();
    }, []);

    const handleApprove = async (id: number) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/hospitals/${id}/approve/`);
            fetchHospitals(); // Refresh list after approval
        } catch (err) {
            alert('Failed to approve hospital');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-3xl font-black italic uppercase text-gray-800 tracking-tighter">Hospitals Registry</h2>
            </div>
            
            {loading ? (
                <div className="text-center p-10 text-gray-400 font-bold uppercase tracking-widest">Loading Registry...</div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hospitals.map(hospital => (
                        <div key={hospital.id} className="card-premium p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-white" 
                                         style={{ backgroundColor: hospital.is_verified ? 'var(--color-primary)' : '#9ca3af' }}>
                                        <Building2 size={24} />
                                    </div>
                                    {hospital.is_verified ? (
                                        <span className="flex items-center gap-1 text-xs font-bold uppercase text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                            <CheckCircle2 size={14} /> Verified
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-xs font-bold uppercase text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                                            <ShieldAlert size={14} /> Pending
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold italic tracking-tight text-gray-900">{hospital.name}</h3>
                                <p className="text-gray-500 text-sm mt-1">{hospital.location} • {hospital.contact}</p>
                                <p className="text-gray-400 text-xs mt-2 truncate bg-gray-50 p-2 rounded-lg">{hospital.email}</p>
                            </div>

                            {!hospital.is_verified && (
                                <button
                                    onClick={() => handleApprove(hospital.id)}
                                    className="mt-6 w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold uppercase text-sm tracking-wider transition-all"
                                >
                                    Approve Hospital
                                </button>
                            )}
                        </div>
                    ))}

                    {hospitals.length === 0 && (
                        <div className="col-span-full card-premium p-10 text-center text-gray-400 italic">
                            No hospitals registered yet.
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default Hospitals;
