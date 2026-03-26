import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ScanFace, UserCheck, Stethoscope, FileText, Pill, Plus, Activity, Wind, Thermometer, Droplets, Trash2, ChevronRight, Clock } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const Treatment = () => {
    const { user } = useAuth();
    const [uhid, setUhid] = useState('');
    const [patient, setPatient] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [medicines, setMedicines] = useState<any[]>([]);
    const [queue, setQueue] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [loadingQueue, setLoadingQueue] = useState(true);

    const [consultation, setConsultation] = useState({ 
        chief_complaint: '', 
        diagnosis: '', 
        symptoms: '',
        physical_examination: '',
        investigations: '',
        treatment_plan: '',
        blood_pressure: '', 
        temperature: '',
        pulse_rate: '',
        sp_o2: '',
        respiratory_rate: '',
        weight: '',
        height: '',
        bmi: ''
    });
    
    const [prescriptions, setPrescriptions] = useState<any[]>([
        { medicine: '', dosage: '', duration_value: '', duration_unit: 'Days', frequency: '1-0-1', instructions: '', temp_search: '', show_list: false }
    ]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('access');
            const [medRes, queueRes] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/hospitals/medicines/', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://127.0.0.1:8000/api/appointments/queue/', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            // Pagination check for medicines
            setMedicines(medRes.data.results || medRes.data);
            setQueue(queueRes.data.results || queueRes.data);
            setLoadingQueue(false);
        } catch (err) {
            setLoadingQueue(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleCallPatient = async (qId: number) => {
        try {
            const token = localStorage.getItem('access');
            await axios.post(`http://127.0.0.1:8000/api/appointments/queue/${qId}/call-next/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) { alert('Failed to call patient'); }
    };

    const handlePatientSelect = (p: any) => {
        setPatient(p);
        fetchHistory(p.id);
        // Pre-fill some patient metrics if available
        setConsultation(prev => ({
            ...prev,
            weight: p.weight || '',
            height: p.height || '',
            bmi: p.bmi || ''
        }));
    };

    const handleScan = async () => {
        try {
            setError('');
            const token = localStorage.getItem('access');
            const res = await axios.get(`http://127.0.0.1:8000/api/patients/?search=${uhid}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.length > 0) {
                handlePatientSelect(res.data[0]);
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
            const token = localStorage.getItem('access');
            const res = await axios.get(`http://127.0.0.1:8000/api/patients/consultations/?patient=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data.results || res.data);
        } catch (err) { }
    };

    const handleAddPrescriptionRow = () => {
        setPrescriptions([...prescriptions, { medicine: '', dosage: '', duration_value: '', duration_unit: 'Days', frequency: '1-0-1', instructions: '', temp_search: '', show_list: false }]);
    };

    const handleRemovePrescriptionRow = (idx: number) => {
        setPrescriptions(prescriptions.filter((_, i) => i !== idx));
    };

    const handleSaveConsultation = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access');
            const headers = { Authorization: `Bearer ${token}` };
            
            const res = await axios.post('http://127.0.0.1:8000/api/patients/consultations/', {
                patient: patient.id,
                hospital: user?.hospital,
                ...consultation
            }, { headers });
            const c_id = res.data.id;
            
            // Save prescriptions
            for (const p of prescriptions) {
                if (p.medicine) {
                    await axios.post('http://127.0.0.1:8000/api/patients/prescriptions/', {
                        consultation: c_id,
                        medicine: parseInt(p.medicine),
                        dosage: p.dosage,
                        duration_value: p.duration_value,
                        duration_unit: p.duration_unit,
                        frequency: p.frequency,
                        instructions: p.instructions
                    }, { headers });
                }
            }

            // If patient was in queue, complete it
            const queueEntry = queue.find(q => q.appointment_details?.patient_username === patient.user?.username);
            if (queueEntry) {
                await axios.post(`http://127.0.0.1:8000/api/appointments/queue/${queueEntry.id}/complete/`, {}, { headers });
            }

            alert('Consultation Saved & Identity Synced Successfully!');
            setPatient(null);
            setUhid('');
            fetchData();
            setConsultation({ chief_complaint: '', diagnosis: '', symptoms: '', physical_examination: '', investigations: '', treatment_plan: '', blood_pressure: '', temperature: '', pulse_rate: '', sp_o2: '', respiratory_rate: '', weight: '', height: '', bmi: '' });
            setPrescriptions([{ medicine: '', dosage: '', duration_value: '', duration_unit: 'Days', frequency: '1-0-1', instructions: '', temp_search: '', show_list: false }]);
        } catch (err) {
            alert('Failed to save consultation. Check required fields.');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 pb-32">
            <h2 className="text-4xl font-black italic uppercase text-gray-800 tracking-tighter mb-10">Clinical Terminal</h2>
            
            {!patient && (
                <div className="grid lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8">
                        <div className="card-premium p-10 flex flex-col items-center justify-center bg-gray-50 border-2 border-gray-100 shadow-2xl">
                            <div className="w-32 h-32 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                                <ScanFace size={64} />
                            </div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-blue-900 mb-6 drop-shadow-sm font-['Montserrat']">Unlock Global E-Card</h3>
                            <div className="flex gap-4 w-full max-w-lg">
                                <input type="text" placeholder="PATIENT UHID (E.G. GP-6231)" className="flex-1 bg-white border-2 border-blue-200 py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-xs focus:outline-none focus:border-blue-500 transition-colors font-['Montserrat']"
                                    value={uhid} onChange={e => setUhid(e.target.value)} />
                                <button onClick={handleScan} className="bg-blue-600 hover:bg-blue-700 text-white font-black italic uppercase tracking-tighter px-10 rounded-2xl shadow-xl shadow-blue-600/20">
                                    Unlock
                                </button>
                            </div>
                            {error && <p className="mt-4 text-red-500 font-black uppercase text-[10px] tracking-widest">{error}</p>}
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="card-premium p-8 h-full bg-white border-2 border-gray-100 flex flex-col">
                            <h3 className="text-xl font-black italic uppercase text-gray-800 tracking-tighter mb-6 flex items-center gap-3">
                                <Activity className="text-green-600" size={24} /> Live Admission Queue
                            </h3>
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                {loadingQueue ? (
                                    <div className="animate-pulse space-y-3">
                                        {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-50 rounded-2xl" />)}
                                    </div>
                                ) : queue.length > 0 ? (
                                    queue.map(q => (
                                        <div key={q.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-blue-200 transition-all flex justify-between items-center">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="w-6 h-6 bg-blue-600 text-white text-[10px] font-black rounded-lg flex items-center justify-center shadow-sm">#{q.queue_number}</span>
                                                    <h4 className="font-black text-xs uppercase italic tracking-tighter text-gray-900">{q.appointment_details?.patient_username}</h4>
                                                </div>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                    <Clock size={10} /> Wait: {q.estimated_wait_time} MIN
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => handleCallPatient(q.id)}
                                                className="p-3 bg-white border border-gray-200 text-gray-400 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                                        <Activity size={48} className="text-gray-300 mb-4" />
                                        <p className="font-black uppercase text-[9px] tracking-widest">No active admissions</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {patient && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-12 gap-10">
                        {/* Left Column: Patient Profile & History */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="card-premium p-6 bg-gradient-to-br from-[#064E3B] to-[#065F46] text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
                                <div className="flex items-center gap-5 mb-8 relative z-10">
                                    <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/10">
                                        <UserCheck size={40} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-2">{patient.full_name}</h3>
                                        <div className="flex gap-2">
                                            <span className="bg-white/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{patient.uhid}</span>
                                            <span className="bg-red-500 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">{patient.blood_group}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3 text-center text-[10px] font-black uppercase tracking-widest relative z-10">
                                    <div className="bg-white/10 py-4 rounded-2xl backdrop-blur-sm border border-white/5">{patient.age} YRS</div>
                                    <div className="bg-white/10 py-4 rounded-2xl backdrop-blur-sm border border-white/5">{patient.gender}</div>
                                    <div className="bg-white/10 py-4 rounded-2xl backdrop-blur-sm border border-white/5">{patient.weight || '--'} KG</div>
                                </div>
                                
                                {patient.chronic_diseases && (
                                    <div className="mt-6 p-4 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/5">
                                        <p className="text-[9px] font-black text-emerald-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Activity size={12} /> Chronic Alerts
                                        </p>
                                        <p className="text-xs font-bold text-white/80">{patient.chronic_diseases}</p>
                                    </div>
                                )}
                            </div>

                            <div className="card-premium p-8 border-2 border-gray-100 relative overflow-hidden h-[700px] flex flex-col bg-white">
                                <h3 className="text-xl font-black italic uppercase text-gray-800 tracking-tighter mb-6 flex items-center gap-3">
                                    <FileText className="text-emerald-600" size={24} /> Global EHR Link
                                </h3>
                                
                                <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                                    {history.map((h, i) => (
                                        <div key={i} className="p-5 bg-gray-50 rounded-3xl border border-gray-100 hover:border-emerald-200 transition-all group relative overflow-hidden">
                                            <div className="absolute right-0 top-0 w-16 h-16 bg-emerald-50 rounded-bl-[40px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
                                                <ChevronRight className="text-emerald-500" size={20} />
                                            </div>
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">{new Date(h.consultation_date).toLocaleDateString()}</span>
                                                <span className="text-[8px] font-bold text-gray-400 bg-white shadow-sm border px-2.5 py-1.5 rounded-lg uppercase tracking-widest">
                                                    DR. {h.doctor_name || h.doctor?.username}
                                                </span>
                                            </div>
                                            <h4 className="font-black text-gray-900 uppercase text-sm italic tracking-tight mb-2">{h.diagnosis}</h4>
                                            <div className="grid grid-cols-2 gap-2 mb-4">
                                                <div className="text-[9px] font-bold text-gray-500 uppercase bg-white px-3 py-1.5 rounded-lg border border-gray-100 flex items-center gap-2">
                                                    <Activity size={10} className="text-emerald-500" /> BP: {h.blood_pressure || '--'}
                                                </div>
                                                <div className="text-[9px] font-bold text-gray-500 uppercase bg-white px-3 py-1.5 rounded-lg border border-gray-100 flex items-center gap-2">
                                                    <Thermometer size={10} className="text-orange-500" /> {h.temperature || '--'}°F
                                                </div>
                                            </div>
                                            <p className="text-gray-500 text-[11px] font-medium leading-relaxed line-clamp-2 italic">“{h.treatment_plan || h.chief_complaint}”</p>
                                        </div>
                                    ))}
                                    {history.length === 0 && (
                                        <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
                                            <FileText size={56} className="text-gray-300" />
                                            <p className="font-black uppercase text-[10px] tracking-[0.2em] text-gray-400 px-8">Identity found, but Global history is clear.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Active Terminal */}
                        <div className="lg:col-span-8">
                            <form onSubmit={handleSaveConsultation} className="card-premium p-10 border-2 border-emerald-500 bg-emerald-50/5 shadow-3xl shadow-emerald-500/10">
                                <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                                    <h3 className="text-3xl font-black italic uppercase text-emerald-900 tracking-tighter flex items-center gap-4">
                                        <Stethoscope size={36} className="text-emerald-500" /> Diagnostic Command
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/20"></span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Terminal Encrypted</span>
                                    </div>
                                </div>

                                {/* Vitals Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">BP (mmHg)</label>
                                        <input type="text" placeholder="120/80" className="input-field-terminal"
                                            value={consultation.blood_pressure} onChange={e => setConsultation({...consultation, blood_pressure: e.target.value})}/>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">Pulse (BPM)</label>
                                        <div className="relative">
                                            <Activity size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300" />
                                            <input type="text" placeholder="72" className="input-field-terminal pl-10"
                                                value={consultation.pulse_rate} onChange={e => setConsultation({...consultation, pulse_rate: e.target.value})}/>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">SPO2 (%)</label>
                                        <div className="relative">
                                            <Droplets size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                                            <input type="text" placeholder="98" className="input-field-terminal pl-10"
                                                value={consultation.sp_o2} onChange={e => setConsultation({...consultation, sp_o2: e.target.value})}/>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">Temp (°F)</label>
                                        <div className="relative">
                                            <Thermometer size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300" />
                                            <input type="text" placeholder="98.6" className="input-field-terminal pl-10"
                                                value={consultation.temperature} onChange={e => setConsultation({...consultation, temperature: e.target.value})}/>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">Resp Rate</label>
                                        <div className="relative">
                                            <Wind size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300" />
                                            <input type="text" placeholder="18" className="input-field-terminal pl-10"
                                                value={consultation.respiratory_rate} onChange={e => setConsultation({...consultation, respiratory_rate: e.target.value})}/>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 mb-10">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Chief Complaints & History</label>
                                        <textarea required rows={4} className="input-field-terminal min-h-[120px] py-6 px-8 leading-relaxed font-medium"
                                            placeholder="DESCRIBE ONSET, DURATION, AND CHARACTER OF SYMPTOMS..."
                                            value={consultation.chief_complaint} onChange={e => setConsultation({...consultation, chief_complaint: e.target.value})}></textarea>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Clinical Physical Examination</label>
                                        <textarea rows={4} className="input-field-terminal min-h-[120px] py-6 px-8 leading-relaxed font-medium"
                                            placeholder="PALLOR, ICTERUS, CLUBBING, LYMPHADENOPATHY, EDEMA, SYSTEMIC EXAM..."
                                            value={consultation.physical_examination} onChange={e => setConsultation({...consultation, physical_examination: e.target.value})}></textarea>
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1">Provisional / Differential Diagnosis</label>
                                        <input required type="text" className="input-field-terminal py-6 px-8 font-black text-lg text-emerald-900 placeholder:opacity-30 uppercase tracking-tighter italic"
                                            placeholder="E.G. ACUTE UPPER RESPIRATORY INFECTION"
                                            value={consultation.diagnosis} onChange={e => setConsultation({...consultation, diagnosis: e.target.value})} />
                                    </div>
                                </div>

                                {/* Enhanced Prescriptions */}
                                <div className="bg-white p-8 rounded-[40px] border border-emerald-100 shadow-xl shadow-emerald-500/5 mb-10 relative overflow-hidden">
                                    <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50/50 rounded-bl-[100px] -z-0"></div>
                                    <div className="flex justify-between items-center mb-10 relative z-10">
                                        <h4 className="text-xl font-black italic uppercase tracking-tighter text-gray-800 flex items-center gap-3">
                                            <Pill size={28} className="text-emerald-500" /> Clinical Directives
                                        </h4>
                                        <button type="button" onClick={handleAddPrescriptionRow} className="group flex items-center gap-3 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-700 hover:scale-105 transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
                                            <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Add Medication
                                        </button>
                                    </div>

                                    <div className="space-y-6 relative z-10">
                                        {prescriptions.map((p, idx) => (
                                            <div key={idx} className="bg-gray-50/50 p-3 pr-6 rounded-[28px] border border-gray-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 relative group/row">
                                                <div className="flex flex-wrap lg:flex-nowrap gap-4 items-center">
                                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-black italic text-gray-300 border border-gray-100 group-hover/row:bg-emerald-500 group-hover/row:text-white group-hover/row:border-emerald-500 transition-all">{idx + 1}</div>
                                                    
                                                    {/* Medicine Search */}
                                                    <div className="flex-[3] min-w-[200px] relative">
                                                        <input 
                                                            type="text" 
                                                            placeholder="SEARCH MOLECULE..."
                                                            className="w-full bg-transparent font-black text-gray-800 uppercase text-[11px] tracking-[0.1em] outline-none placeholder:text-gray-300"
                                                            value={medicines.find(m => m.id.toString() === p.medicine)?.name || p.temp_search || ''}
                                                            onChange={e => {
                                                                const val = e.target.value;
                                                                const np = [...prescriptions];
                                                                np[idx].temp_search = val;
                                                                np[idx].show_list = true;
                                                                if (val === '') np[idx].medicine = '';
                                                                setPrescriptions(np);
                                                            }}
                                                            onFocus={() => {
                                                                const np = [...prescriptions];
                                                                np[idx].show_list = true;
                                                                setPrescriptions(np);
                                                            }}
                                                        />
                                                        <AnimatePresence>
                                                            {p.show_list && (
                                                                <motion.div 
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0 }}
                                                                    className="absolute left-0 right-0 top-full mt-4 bg-white border border-gray-100 rounded-3xl shadow-3xl z-[100] max-h-64 overflow-y-auto custom-scrollbar"
                                                                >
                                                                    {medicines
                                                                        .filter(m => m.name.toLowerCase().includes((p.temp_search || '').toLowerCase()))
                                                                        .map(m => (
                                                                            <div 
                                                                                key={m.id} 
                                                                                onClick={() => {
                                                                                    const np = [...prescriptions];
                                                                                    np[idx].medicine = m.id.toString();
                                                                                    np[idx].temp_search = m.name;
                                                                                    np[idx].show_list = false;
                                                                                    setPrescriptions(np);
                                                                                }}
                                                                                className="p-5 hover:bg-emerald-50 cursor-pointer border-b border-gray-50 last:border-0 group/item flex justify-between items-center"
                                                                            >
                                                                                <div>
                                                                                    <p className="text-[11px] font-black uppercase text-gray-800 tracking-widest group-hover/item:text-emerald-700 transition-colors">{m.name}</p>
                                                                                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">{m.category}</p>
                                                                                </div>
                                                                                <ChevronRight size={14} className="text-gray-200 group-hover/item:text-emerald-500 group-hover/item:translate-x-1 transition-all" />
                                                                            </div>
                                                                        ))
                                                                    }
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>

                                                    <div className="flex-[2] flex gap-3">
                                                        <input type="text" placeholder="FREQUENCE (1-0-1)" className="w-full bg-white border border-gray-200 py-3 px-5 rounded-xl font-black uppercase text-[10px] tracking-widest outline-none focus:border-emerald-500 transition-all font-['Montserrat'] shadow-sm"
                                                            value={p.frequency} onChange={e => { const np = [...prescriptions]; np[idx].frequency = e.target.value; setPrescriptions(np); }} />
                                                        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                                                            <input type="text" placeholder="5" className="w-12 bg-transparent text-center font-black text-gray-800 outline-none"
                                                                value={p.duration_value} onChange={e => { const np = [...prescriptions]; np[idx].duration_value = e.target.value; setPrescriptions(np); }} />
                                                            <select className="bg-gray-100 rounded-lg text-[9px] font-black uppercase px-2 outline-none border-none py-2"
                                                                value={p.duration_unit} onChange={e => { const np = [...prescriptions]; np[idx].duration_unit = e.target.value; setPrescriptions(np); }}>
                                                                <option>Days</option>
                                                                <option>Weeks</option>
                                                                <option>Months</option>
                                                                <option>SOS</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <button type="button" onClick={() => handleRemovePrescriptionRow(idx)} className="p-3 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover/row:opacity-100">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                                <input type="text" placeholder="ADDITIONAL INSTRUCTIONS (E.G. AFTER MEAL, EMPTY STOMACH...)" className="w-full mt-4 bg-transparent border-t border-gray-100 pt-3 font-bold text-gray-400 uppercase text-[9px] tracking-widest outline-none focus:text-gray-600 transition-all"
                                                    value={p.instructions} onChange={e => { const np = [...prescriptions]; np[idx].instructions = e.target.value; setPrescriptions(np); }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <button type="submit" className="py-6 rounded-[32px] bg-emerald-600 text-white font-black italic uppercase tracking-[0.1em] text-xl shadow-2xl shadow-emerald-900/40 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group">
                                        <Plus size={28} className="group-hover:rotate-180 transition-transform duration-500" /> Save & Broadcast Identity
                                    </button>
                                    <button type="button" onClick={() => {setPatient(null); setUhid('');}} className="py-6 rounded-[32px] bg-gray-100 text-gray-400 font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-200 transition-all font-['Montserrat']">
                                        Abort Session
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <style>{`
                .input-field-terminal {
                    width: 100%;
                    background-color: white;
                    border: 2px solid #F1F5F9;
                    border-radius: 20px;
                    padding: 1rem 1.5rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    outline: none;
                    transition: all 0.3s;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                .input-field-terminal:focus {
                    border-color: #10B981;
                    background-color: #F0FDF4;
                    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.1);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E2E8F0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #CBD5E1;
                }
            `}</style>
        </motion.div>
    );
};

export default Treatment;
