import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ScanFace, UserCheck, Stethoscope, FileText, Pill, Plus } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const Treatment = () => {
    const { user } = useAuth();
    const [uhid, setUhid] = useState('');
    const [patient, setPatient] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [medicines, setMedicines] = useState<any[]>([]);
    const [error, setError] = useState('');

    const [consultation, setConsultation] = useState({ chief_complaint: '', diagnosis: '', blood_pressure: '', temperature: '' });
    const [prescriptions, setPrescriptions] = useState([{ medicine: '', dosage: '', duration: '', instructions: '' }]);

    const fetchMeds = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/hospitals/medicines/');
            setMedicines(res.data);
        } catch (err) { }
    };

    useEffect(() => { fetchMeds(); }, []);

    const handleScan = async () => {
        try {
            setError('');
            const res = await axios.get(`http://127.0.0.1:8000/api/patients/?search=${uhid}`);
            if (res.data.length > 0) {
                const p = res.data[0];
                setPatient(p);
                fetchHistory(p.id);
            } else {
                setError('No Global Patient found.');
                setPatient(null);
            }
        } catch (err) {
            setError('Error processing E-Card.');
            setPatient(null);
        }
    };

    const fetchHistory = async (id: number) => {
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/patients/consultations/?patient=${id}`);
            setHistory(res.data);
        } catch (err) { }
    };

    const handleAddPrescriptionRow = () => {
        setPrescriptions([...prescriptions, { medicine: '', dosage: '', duration: '', instructions: '' }]);
    };

    const handleSaveConsultation = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/patients/consultations/', {
                patient: patient.id,
                ...consultation
            });
            const c_id = res.data.id;
            
            // Save prescriptions
            for (const p of prescriptions) {
                if (p.medicine) {
                    await axios.post('http://127.0.0.1:8000/api/patients/prescriptions/', {
                        consultation: c_id,
                        ...p,
                        medicine: parseInt(p.medicine)
                    });
                }
            }
            alert('Consultation Saved Successfully to Global Registry!');
            setPatient(null);
            setUhid('');
            setConsultation({ chief_complaint: '', diagnosis: '', blood_pressure: '', temperature: '' });
            setPrescriptions([{ medicine: '', dosage: '', duration: '', instructions: '' }]);
        } catch (err) {
            alert('Failed to save consultation.');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 pb-32">
            <h2 className="text-4xl font-black italic uppercase text-gray-800 tracking-tighter mb-10">Clinical Terminal</h2>
            
            {/* Scanner Input */}
            {!patient && (
                <div className="card-premium p-10 max-w-2xl mx-auto flex flex-col items-center justify-center bg-gray-50 border-2 border-gray-100 shadow-2xl">
                    <div className="w-32 h-32 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                        <ScanFace size={64} />
                    </div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-blue-900 mb-6 drop-shadow-sm">Scan E-Card</h3>
                    <div className="flex gap-4 w-full">
                        <input type="text" placeholder="Patient UHID" className="flex-1 bg-white border-2 border-blue-200 py-4 px-6 rounded-2xl font-bold uppercase tracking-widest text-lg focus:outline-none focus:border-blue-500 transition-colors"
                            value={uhid} onChange={e => setUhid(e.target.value)} />
                        <button onClick={handleScan} className="bg-blue-600 hover:bg-blue-700 text-white font-black italic uppercase tracking-tighter px-10 rounded-2xl shadow-xl shadow-blue-600/20 text-xl">
                            Unlock
                        </button>
                    </div>
                    {error && <p className="mt-4 text-red-500 font-bold uppercase text-xs tracking-widest">{error}</p>}
                </div>
            )}

            <AnimatePresence>
                {patient && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-12 gap-10">
                        {/* Left Column: Patient Info & History */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="card-premium p-6 bg-gradient-to-br from-blue-900 to-indigo-900 text-white shadow-2xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                                        <UserCheck size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter">{patient.full_name}</h3>
                                        <p className="font-bold tracking-widest text-xs text-blue-300 uppercase">{patient.user?.username}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center text-xs font-black uppercase tracking-widest">
                                    <div className="bg-white/10 py-3 rounded-xl backdrop-blur-sm">{patient.age} Y/O</div>
                                    <div className="bg-white/10 py-3 rounded-xl backdrop-blur-sm">{patient.gender}</div>
                                    <div className="bg-red-500/80 py-3 rounded-xl backdrop-blur-sm text-white shadow-md">{patient.blood_group}</div>
                                </div>
                            </div>

                            <div className="card-premium p-6 border-2 border-gray-100 relative overflow-hidden h-[600px] flex flex-col">
                                <h3 className="text-lg font-black italic uppercase text-gray-800 tracking-tighter mb-4 flex items-center gap-2">
                                    <FileText className="text-blue-600" size={20} /> Global History
                                </h3>
                                
                                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                    {history.map((h, i) => (
                                        <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors group">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{new Date(h.date).toLocaleDateString()}</span>
                                                <span className="text-[10px] font-bold text-gray-400 bg-white shadow-sm border px-2 py-1 rounded uppercase tracking-widest">
                                                    Dr. {h.doctor_name || h.doctor?.username}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-gray-900 uppercase text-sm">{h.diagnosis}</h4>
                                            <p className="text-gray-500 text-xs mt-1 font-medium">{h.chief_complaint}</p>
                                            {/* Show Prescriptions count or details here if available in expanded API */}
                                            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400">
                                                <Pill size={12} /> Prescriptions inside
                                            </div>
                                        </div>
                                    ))}
                                    {history.length === 0 && (
                                        <div className="h-full flex flex-col items-center justify-center opacity-50 text-center">
                                            <FileText size={48} className="text-gray-300 mb-4" />
                                            <p className="font-bold uppercase text-xs tracking-widest text-gray-400 px-4">No previous global medical history found.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Active Consultation */}
                        <div className="lg:col-span-8">
                            <form onSubmit={handleSaveConsultation} className="card-premium p-8 border-2 border-blue-500 bg-blue-50/10 shadow-xl shadow-blue-500/10">
                                <h3 className="text-2xl font-black italic uppercase text-blue-900 tracking-tighter mb-6 flex items-center gap-3">
                                    <Stethoscope size={28} className="text-blue-600" /> New Consultation
                                </h3>

                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <div className="col-span-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block ml-1">Chief Complaint</label>
                                        <textarea required rows={3} className="input-field rounded-[20px] bg-white border-2 border-gray-100 shadow-sm w-full font-medium resize-none px-6 py-4"
                                            value={consultation.chief_complaint} onChange={e => setConsultation({...consultation, chief_complaint: e.target.value})}></textarea>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block ml-1">Diagnosis</label>
                                        <input required type="text" className="input-field rounded-2xl bg-white border-2 border-gray-100 shadow-sm w-full font-bold text-gray-800 uppercase px-6"
                                            value={consultation.diagnosis} onChange={e => setConsultation({...consultation, diagnosis: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block ml-1">BP (mmHg)</label>
                                        <input type="text" placeholder="120/80" className="input-field rounded-2xl bg-white border-2 border-gray-100 shadow-sm font-bold tracking-widest px-6"
                                            value={consultation.blood_pressure} onChange={e => setConsultation({...consultation, blood_pressure: e.target.value})}/>
                                    </div>
                                    <div>
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block ml-1">Temp (°F/°C)</label>
                                        <input type="text" placeholder="98.6" className="input-field rounded-2xl bg-white border-2 border-gray-100 shadow-sm font-bold tracking-widest px-6"
                                            value={consultation.temperature} onChange={e => setConsultation({...consultation, temperature: e.target.value})}/>
                                    </div>
                                </div>

                                {/* Prescriptions Section */}
                                <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-sm mb-8">
                                    <div className="flex justify-between items-end mb-6">
                                        <h4 className="text-lg font-black italic uppercase tracking-tighter text-gray-800 flex items-center gap-2">
                                            <Pill size={20} className="text-blue-600" /> Prescriptions
                                        </h4>
                                        <button type="button" onClick={handleAddPrescriptionRow} className="text-xs font-bold uppercase tracking-widest bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
                                            <Plus size={14} /> Add Medicine
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {prescriptions.map((p, idx) => (
                                            <div key={idx} className="flex gap-4 items-center bg-gray-50 p-2 pl-4 rounded-2xl border border-gray-100 transition-all hover:bg-gray-100/80">
                                                <div className="font-display font-black text-gray-300 text-xl italic drop-shadow-sm pr-2 border-r border-gray-200">{idx + 1}</div>
                                                <select className="flex-[2] bg-transparent font-bold text-gray-800 uppercase text-xs tracking-widest outline-none appearance-none"
                                                    value={p.medicine} onChange={e => {
                                                        const np = [...prescriptions]; np[idx].medicine = e.target.value; setPrescriptions(np);
                                                    }}>
                                                    <option value="">-- SELECT MEDICINE --</option>
                                                    {medicines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                                </select>
                                                <input type="text" placeholder="Dosage (1-0-1)" className="flex-1 bg-white border border-gray-200 py-3 px-4 rounded-xl font-bold uppercase text-[10px] tracking-widest outline-none focus:border-blue-400"
                                                    value={p.dosage} onChange={e => { const np = [...prescriptions]; np[idx].dosage = e.target.value; setPrescriptions(np); }} />
                                                <input type="text" placeholder="Duration (5 Days)" className="flex-1 bg-white border border-gray-200 py-3 px-4 rounded-xl font-bold uppercase text-[10px] tracking-widest outline-none focus:border-blue-400"
                                                    value={p.duration} onChange={e => { const np = [...prescriptions]; np[idx].duration = e.target.value; setPrescriptions(np); }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-5 rounded-[24px] bg-gradient-to-r from-blue-700 to-indigo-800 text-white font-black italic uppercase tracking-tighter text-xl shadow-2xl shadow-blue-900/40 hover:scale-[1.01] transition-transform">
                                    Save & Issue Prescription
                                </button>
                                <button type="button" onClick={() => {setPatient(null); setUhid('');}} className="w-full mt-4 py-4 rounded-[24px] text-gray-500 font-bold uppercase text-xs tracking-widest hover:bg-gray-100 transition-colors">
                                    Cancel Consultation
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Treatment;
