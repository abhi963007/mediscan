import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
    ScanFace, UserCheck, Stethoscope, FileText, Pill, Plus, Activity, 
    Wind, Thermometer, Droplets, Trash2, ChevronRight, Clock, 
    RefreshCw, XCircle, HeartPulse, Weight, Ruler, Search 
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useAuth } from '../../../contexts/AuthContext';

const Treatment = () => {
    const { user } = useAuth();
    const [uhid, setUhid] = useState('');
    const [patient, setPatient] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [medicines, setMedicines] = useState<any[]>([]);
    const [loadingMeds, setLoadingMeds] = useState(false);
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
    const [scanning, setScanning] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const mountedRef = useRef(true);
    const scanProcessedRef = useRef(false);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('access');
            const queueRes = await axios.get('http://127.0.0.1:8000/api/appointments/queue/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQueue(queueRes.data.results || queueRes.data);
            setLoadingQueue(false);
        } catch (err) {
            setLoadingQueue(false);
        }
    };

    // Dynamic Medicine Search
    const searchMedicines = async (term: string, idx: number) => {
        if (!term) return;
        setLoadingMeds(true);
        try {
            const token = localStorage.getItem('access');
            const res = await axios.get(`http://127.0.0.1:8000/api/hospitals/medicines/?search=${encodeURIComponent(term)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMedicines(res.data.results || res.data);
            setLoadingMeds(false);
        } catch (err) {
            setLoadingMeds(false);
        }
    };

    const handleCallPatient = async (qId: number) => {
        try {
            const token = localStorage.getItem('access');
            await axios.post(`http://127.0.0.1:8000/api/appointments/queue/${qId}/call-next/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) { alert('Failed to call patient'); }
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

    const stopScanner = useCallback(async () => {
        if (!scannerRef.current) return;
        try {
            const state = scannerRef.current.getState();
            if (state === 2 || state === 3) {
                await scannerRef.current.stop();
            }
            scannerRef.current.clear();
        } catch (e) {}
        scannerRef.current = null;
        if (mountedRef.current) setScanning(false);
    }, []);

    const performAutoCheckIn = async (patientId: number) => {
        try {
            const token = localStorage.getItem('access');
            // 1. Find today's appointment for this patient with this doctor
            const today = new Date().toISOString().split('T')[0];
            const apptRes = await axios.get(`http://127.0.0.1:8000/api/appointments/?patient=${patientId}&date=${today}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const appts = apptRes.data.results || apptRes.data;
            const targetAppt = appts.find((a: any) => a.status === 'confirmed' || a.status === 'pending');
            
            if (targetAppt) {
                // 2. Perform check-in
                await axios.post(`http://127.0.0.1:8000/api/appointments/${targetAppt.id}/check-in/`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('[Treatment] Auto Check-in successful for appointment:', targetAppt.id);
                fetchData(); // Refresh queue
            }
        } catch (err) {
            console.error('[Treatment] Auto Check-in failed:', err);
        }
    };

    const handlePatientSelect = useCallback((p: any) => {
        setPatient(p);
        fetchHistory(p.id);
        stopScanner();
        performAutoCheckIn(p.id); // Trigger auto check-in when scanned
        setConsultation(prev => ({
            ...prev,
            weight: p.weight || '',
            height: p.height || '',
            bmi: p.bmi || ''
        }));
    }, [stopScanner]);

    const handleScan = useCallback(async (searchId: string) => {
        if (!searchId) return;
        const cleanId = searchId.trim().split('\n')[0].trim();
        console.log('[Treatment] Processing UHID:', cleanId);

        try {
            setError('');
            const token = localStorage.getItem('access');
            const res = await axios.get(`http://127.0.0.1:8000/api/patients/patients/?search=${encodeURIComponent(cleanId)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = res.data.results || res.data;
            if (data.length > 0) {
                const foundPatient = data.find((p: any) => p.uhid === cleanId) || data[0];
                handlePatientSelect(foundPatient);
            } else {
                setError(`No patient record found for UHID: ${cleanId}`);
                setPatient(null);
                setTimeout(() => { scanProcessedRef.current = false; }, 2000);
            }
        } catch (err: any) {
            setError(err?.response?.data?.detail || 'Could not lookup patient.');
            setPatient(null);
            setTimeout(() => { scanProcessedRef.current = false; }, 2000);
        }
    }, [handlePatientSelect]);

    const startScanner = useCallback(async () => {
        await stopScanner();
        scanProcessedRef.current = false;
        
        const readerId = 'qr-reader';
        const readerEl = document.getElementById(readerId);
        if (!readerEl) return;

        const html5Qr = new Html5Qrcode(readerId);
        scannerRef.current = html5Qr;

        try {
            await html5Qr.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => {
                    if (!scanProcessedRef.current) {
                        scanProcessedRef.current = true;
                        handleScan(decodedText);
                        stopScanner();
                    }
                },
                () => {}
            );
            if (mountedRef.current) setScanning(true);
        } catch (err) {
            if (mountedRef.current) setScanning(false);
        }
    }, [stopScanner, handleScan]);

    useEffect(() => { 
        mountedRef.current = true;
        fetchData(); 
        const timer = setTimeout(() => {
            if (mountedRef.current && !patient) {
                startScanner();
            }
        }, 500);
        return () => {
            mountedRef.current = false;
            clearTimeout(timer);
            stopScanner();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

            const queueEntry = queue.find(q => q.appointment_details?.patient_username === (patient.user?.username || patient.uhid));
            if (queueEntry) {
                await axios.post(`http://127.0.0.1:8000/api/appointments/queue/${queueEntry.id}/complete/`, {}, { headers });
            }

            alert('Check-up saved and patient records updated!');
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
            <h2 className="text-4xl font-black italic uppercase text-gray-800 tracking-tighter mb-10">Care Room</h2>
            
            {!patient && (
                <div className="grid lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8">
                        <div className="card-premium p-10 flex flex-col items-center justify-center bg-white border border-gray-100 shadow-2xl relative overflow-hidden h-full">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[80px] -z-0"></div>
                            
                            <div className="w-full max-w-sm mb-8 relative z-10">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-gray-900 font-['Montserrat']">Patient Scanner</h3>
                                    <button onClick={startScanner} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors">
                                        <RefreshCw size={14} className={scanning ? 'animate-spin' : ''} /> {scanning ? 'Scanning...' : 'Restart Camera'}
                                    </button>
                                </div>
                                <div className="relative w-full overflow-hidden rounded-[32px] border-2 border-dashed border-gray-200 min-h-[300px] bg-gray-50 flex items-center justify-center">
                                    <div id="qr-reader" className="w-full"></div>
                                    {!scanning && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 pointer-events-none">
                                            <ScanFace size={64} className="mb-4" />
                                            <p className="font-black uppercase text-[10px] tracking-widest">Camera Ready</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="w-full max-w-lg relative z-10 mt-4 text-center">
                                {error && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl p-4 mx-auto max-w-sm">
                                        <XCircle size={16} className="text-red-400 shrink-0" />
                                        <p className="font-black text-red-500 uppercase tracking-widest text-[9px] font-['Montserrat']">{error}</p>
                                    </motion.div>
                                )}
                                <div className="mt-10 flex flex-col items-center gap-4 opacity-40">
                                    <Activity size={24} className="text-emerald-500" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Scan health card for auto-check-in</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="card-premium p-8 h-full bg-white border-2 border-gray-100 flex flex-col">
                            <h3 className="text-xl font-black italic uppercase text-gray-800 tracking-tighter mb-6 flex items-center gap-3">
                                <Activity className="text-green-600" size={24} /> Patients Waiting
                            </h3>
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
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
                                                    <h4 className="font-black text-xs uppercase italic tracking-tighter text-gray-900">{q.patient_full_name || q.appointment_details?.patient_username}</h4>
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
                                        <p className="font-black uppercase text-[9px] tracking-widest">No patients waiting</p>
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
                        <div className="lg:col-span-4 space-y-6">
                            <div className="card-premium p-6 bg-gradient-to-br from-[#064E3B] to-[#065F46] text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
                                <div className="flex items-center gap-5 mb-8 relative z-10">
                                    <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/10">
                                        <UserCheck size={40} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-2 text-white">{patient.full_name}</h3>
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
                            </div>

                            <div className="card-premium p-8 border-2 border-gray-100 relative overflow-hidden h-[700px] flex flex-col bg-white">
                                <h3 className="text-xl font-black italic uppercase text-gray-800 tracking-tighter mb-6 flex items-center gap-3">
                                    <FileText className="text-emerald-600" size={24} /> Medical History
                                </h3>
                                <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                                    {history.map((h, i) => (
                                        <div key={i} className="p-5 bg-gray-50 rounded-3xl border border-gray-100 hover:border-emerald-200 transition-all group relative overflow-hidden">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">{new Date(h.consultation_date).toLocaleDateString()}</span>
                                                <span className="text-[8px] font-bold text-gray-400 bg-white shadow-sm border px-2.5 py-1.5 rounded-lg uppercase tracking-widest">
                                                    DR. {h.doctor_name}
                                                </span>
                                            </div>
                                            <h4 className="font-black text-gray-900 uppercase text-sm italic tracking-tight mb-2">{h.diagnosis}</h4>
                                            <p className="text-gray-500 text-[11px] font-medium leading-relaxed italic">“{h.treatment_plan || h.chief_complaint}”</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8">
                            <form onSubmit={handleSaveConsultation} className="card-premium p-10 border-2 border-emerald-500 bg-emerald-50/5 shadow-3xl shadow-emerald-500/10">
                                <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                                    <h3 className="text-3xl font-black italic uppercase text-emerald-900 tracking-tighter flex items-center gap-4">
                                        <Stethoscope size={36} className="text-emerald-500" /> Visit Record
                                    </h3>
                                </div>

                                {/* Vitals Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-10">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">BP</label>
                                        <input type="text" placeholder="120/80" className="input-field-terminal"
                                            value={consultation.blood_pressure} onChange={e => setConsultation({...consultation, blood_pressure: e.target.value})}/>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">Pulse</label>
                                        <input type="text" placeholder="72" className="input-field-terminal"
                                            value={consultation.pulse_rate} onChange={e => setConsultation({...consultation, pulse_rate: e.target.value})}/>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">SPO2</label>
                                        <input type="text" placeholder="98" className="input-field-terminal"
                                            value={consultation.sp_o2} onChange={e => setConsultation({...consultation, sp_o2: e.target.value})}/>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">Temp</label>
                                        <input type="text" placeholder="98.6" className="input-field-terminal"
                                            value={consultation.temperature} onChange={e => setConsultation({...consultation, temperature: e.target.value})}/>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">Resp</label>
                                        <input type="text" placeholder="18" className="input-field-terminal"
                                            value={consultation.respiratory_rate} onChange={e => setConsultation({...consultation, respiratory_rate: e.target.value})}/>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">WT</label>
                                        <input type="text" placeholder="0.0" className="input-field-terminal"
                                            value={consultation.weight} onChange={e => setConsultation({...consultation, weight: e.target.value})}/>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">HT</label>
                                        <input type="text" placeholder="0" className="input-field-terminal"
                                            value={consultation.height} onChange={e => setConsultation({...consultation, height: e.target.value})}/>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 ml-1">BMI</label>
                                        <input type="text" placeholder="0.0" className="input-field-terminal"
                                            value={consultation.bmi} onChange={e => setConsultation({...consultation, bmi: e.target.value})}/>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 mb-10">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 block ml-1">Chief Complaint</label>
                                        <textarea required rows={4} className="input-field-terminal min-h-[120px]"
                                            placeholder="REASON FOR VISIT..."
                                            value={consultation.chief_complaint} onChange={e => setConsultation({...consultation, chief_complaint: e.target.value})}></textarea>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 block ml-1">Diagnosis</label>
                                        <textarea required rows={4} className="input-field-terminal min-h-[120px] font-black text-emerald-900"
                                            placeholder="FINAL DIAGNOSIS..."
                                            value={consultation.diagnosis} onChange={e => setConsultation({...consultation, diagnosis: e.target.value})}></textarea>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-[40px] border border-emerald-100 shadow-xl mb-10">
                                    <div className="flex justify-between items-center mb-8">
                                        <h4 className="text-xl font-black italic uppercase tracking-tighter text-gray-800 flex items-center gap-3">
                                            <Pill size={28} className="text-emerald-500" /> Prescriptions
                                        </h4>
                                        <button type="button" onClick={handleAddPrescriptionRow} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2">
                                            <Plus size={16} /> Add 
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {prescriptions.map((p, idx) => (
                                            <div key={idx} className="bg-gray-50/50 p-6 rounded-[28px] border border-gray-100 relative group/row">
                                                <div className="flex flex-wrap lg:flex-nowrap gap-4 items-end">
                                                    <div className="flex-1 min-w-[300px] space-y-2">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Medicine Search</label>
                                                        <div className="relative">
                                                            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                                            <input 
                                                                type="text" 
                                                                placeholder="TYPE TO SEARCH..."
                                                                className="input-field-terminal pl-12 uppercase"
                                                                value={p.temp_search}
                                                                onChange={e => {
                                                                    const val = e.target.value;
                                                                    const np = [...prescriptions];
                                                                    np[idx].temp_search = val;
                                                                    np[idx].show_list = true;
                                                                    setPrescriptions(np);
                                                                    searchMedicines(val, idx);
                                                                }}
                                                            />
                                                            <AnimatePresence>
                                                                {p.show_list && (
                                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                                                                        {loadingMeds ? (
                                                                            <div className="p-4 text-center text-[10px] font-black text-gray-400 animate-pulse">SEARCHING DATABASE...</div>
                                                                        ) : medicines.map(m => (
                                                                            <div key={m.id} onClick={() => {
                                                                                const np = [...prescriptions];
                                                                                np[idx].medicine = m.id.toString();
                                                                                np[idx].temp_search = m.name;
                                                                                np[idx].show_list = false;
                                                                                setPrescriptions(np);
                                                                            }} className="p-4 hover:bg-emerald-50 cursor-pointer border-b border-gray-50 flex justify-between items-center group/item">
                                                                                <div>
                                                                                    <p className="text-[10px] font-black uppercase text-gray-800">{m.name}</p>
                                                                                    <p className="text-[8px] font-bold text-gray-400 uppercase">{m.category}</p>
                                                                                </div>
                                                                                <Plus size={14} className="text-gray-200 group-hover/item:text-emerald-500" />
                                                                            </div>
                                                                        ))}
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </div>

                                                    <div className="w-full lg:w-48 space-y-2">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Dosage / Frequency</label>
                                                        <input type="text" placeholder="1-0-1" className="input-field-terminal text-center"
                                                            value={p.frequency} onChange={e => { const np = [...prescriptions]; np[idx].frequency = e.target.value; setPrescriptions(np); }} />
                                                    </div>

                                                    <div className="w-full lg:w-48 space-y-2">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Duration</label>
                                                        <div className="flex bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                                            <input type="text" placeholder="5" className="w-full text-center font-black outline-none py-4"
                                                                value={p.duration_value} onChange={e => { const np = [...prescriptions]; np[idx].duration_value = e.target.value; setPrescriptions(np); }} />
                                                            <select className="bg-gray-50 px-4 text-[9px] font-black uppercase border-l outline-none"
                                                                value={p.duration_unit} onChange={e => { const np = [...prescriptions]; np[idx].duration_unit = e.target.value; setPrescriptions(np); }}>
                                                                <option>Days</option><option>Weeks</option><option>Months</option><option>SOS</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <button type="button" onClick={() => handleRemovePrescriptionRow(idx)} className="p-4 text-gray-300 hover:text-red-500 transition-all">
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                                <input type="text" placeholder="ADDITIONAL INSTRUCTIONS (E.G. AFTER MEAL, EMPTY STOMACH...)" className="w-full mt-4 bg-transparent border-t border-gray-100 pt-4 font-bold text-gray-400 uppercase text-[9px] tracking-widest outline-none"
                                                    value={p.instructions} onChange={e => { const np = [...prescriptions]; np[idx].instructions = e.target.value; setPrescriptions(np); }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <button type="submit" className="py-6 rounded-[32px] bg-emerald-600 text-white font-black italic uppercase tracking-widest text-xl shadow-2xl hover:bg-emerald-700 active:scale-95 transition-all outline-none">
                                        Save & Finish Visit
                                    </button>
                                    <button type="button" onClick={() => {setPatient(null); setUhid('');}} className="py-6 rounded-[32px] bg-gray-100 text-gray-400 font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all">
                                        Cancel Visit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .card-premium { border-radius: 48px; }
                .input-field-terminal {
                    width: 100%;
                    background-color: white;
                    border: 2px solid #F1F5F9;
                    border-radius: 20px;
                    padding: 1.2rem 1.5rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    outline: none;
                    transition: all 0.3s;
                }
                .input-field-terminal:focus {
                    border-color: #10B981;
                    box-shadow: 0 10px 20px -10px rgba(16, 185, 129, 0.2);
                }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
                #qr-reader { border: none !important; }
                #qr-reader video { border-radius: 32px !important; width: 100% !important; object-fit: cover !important; }
                #qr-reader__camera_permission_button {
                    background: #10B981 !important; color: white !important; padding: 16px 32px !important; border-radius: 16px !important; font-weight: 900 !important; cursor: pointer !important; width: 100% !important; border: none !important;
                }
            `}</style>
        </motion.div>
    );
};

export default Treatment;
