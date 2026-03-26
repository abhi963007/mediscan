import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { QrCode, UserPlus, FileCheck2, ShieldCheck, Activity, Heart, Shield, Phone, Mail, User, MapPin } from 'lucide-react';

const RegisterPatient = () => {
    const [formData, setFormData] = useState({
        username: '', password: '', email: '', full_name: '',
        phone: '', age: '', gender: 'Male', blood_group: 'O+', role: 'patient',
        address: '', city: '', state: '', pincode: '',
        emergency_contact_phone: '', emergency_contact_relation: '',
        insurance_provider: '', insurance_policy_number: '',
        chronic_diseases: '', current_medications: '', allergies: '',
        smoking_status: 'Never', alcohol_consumption: 'Never'
    });
    
    const [success, setSuccess] = useState<any>(null);
    const [qrUrl, setQrUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/auth/register/', formData);
            setSuccess(res.data);
            
            // In a real app, the registration response should include the profile info.
            // We search for the profile to get the QR code.
            // The registration response should include the profile info.
            // Search for the profile to get the QR code.
            const token = localStorage.getItem('access');
            const uhid = res.data.uhid || res.data.username;
            
            try {
                const patientRes = await axios.get(`http://127.0.0.1:8000/api/patients/patients/?search=${uhid}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const patientData = patientRes.data.results?.[0] || patientRes.data[0];
                if (patientData && patientData.qr_code) {
                    const rawQr = patientData.qr_code;
                    // Only prepend the host if the backend returned a relative path
                    if (rawQr.startsWith('http')) {
                        setQrUrl(rawQr);
                    } else {
                        setQrUrl(`http://127.0.0.1:8000${rawQr}`);
                    }
                }
            } catch (e) {
                console.error('QR fetch error', e);
            }
            setLoading(false);

            setFormData({ 
                username: '', password: '', email: '', full_name: '', phone: '', age: '', gender: 'Male', blood_group: 'O+', role: 'patient',
                address: '', city: '', state: '', pincode: '', emergency_contact_phone: '', emergency_contact_relation: '', 
                insurance_provider: '', insurance_policy_number: '', chronic_diseases: '', current_medications: '', allergies: '',
                smoking_status: 'Never', alcohol_consumption: 'Never'
            });
        } catch (err: any) {
            setLoading(false);
            alert('Failed to register: ' + JSON.stringify(err.response?.data || 'Server Error'));
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-7xl mx-auto pb-32">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h2 className="text-5xl font-black italic uppercase text-gray-900 tracking-tighter leading-none mb-2 font-['Montserrat']">Register New Patient</h2>
                    <p className="font-bold text-gray-300 uppercase tracking-[0.4em] text-[10px] pl-1 font-['Montserrat']">Add a patient to the system</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 font-['Montserrat']">Secure Registration</span>
                </div>
            </div>
            
            <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                    {!success ? (
                        <motion.form 
                            key="registration-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            onSubmit={handleRegister} 
                            className="card-premium p-10 bg-white border-2 border-gray-100 shadow-3xl shadow-gray-200/50 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600"></div>
                            
                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-20 h-20 rounded-[28px] bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner border border-emerald-100 group-hover:scale-110 transition-transform duration-500">
                                    <UserPlus size={40} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 leading-none mb-2">Register Patient</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-['Montserrat']">Create a new health record and digital card</p>
                                </div>
                            </div>

                            <div className="space-y-12">
                                {/* Section: Auth & Basic */}
                                <div className="space-y-6">
                                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 flex items-center gap-3 font-['Montserrat'] pb-4 border-b border-gray-50">
                                        <ShieldCheck size={16} /> 01. Account Details
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2 group/field">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 font-['Montserrat'] group-focus-within/field:text-emerald-500 transition-colors">Username</label>
                                            <div className="relative">
                                                <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                                                <input type="text" placeholder="E.G. ABHI_MEDISCAN" required className="input-field-auth pl-14" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                                            </div>
                                        </div>
                                        <div className="space-y-2 group/field">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 font-['Montserrat'] group-focus-within/field:text-emerald-500 transition-colors">Password</label>
                                            <div className="relative">
                                                <Shield size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                                                <input type="password" placeholder="••••••••" required className="input-field-auth pl-14" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                                            </div>
                                        </div>
                                        <div className="col-span-full space-y-2 group/field">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 font-['Montserrat'] group-focus-within/field:text-emerald-500 transition-colors">Full Name (As per ID)</label>
                                            <input type="text" placeholder="ENTER FULL NAME AS PER LEGAL IDENTIFICATION" required className="input-field-auth font-black italic text-lg tracking-tight uppercase" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Contact & Origin */}
                                <div className="space-y-6">
                                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 flex items-center gap-3 font-['Montserrat'] pb-4 border-b border-gray-50">
                                        <MapPin size={16} /> 02. Contact Information
                                    </h4>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 font-['Montserrat']">Phone Number</label>
                                            <div className="relative">
                                                <Phone size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                                                <input type="tel" placeholder="+91 00000 00000" required className="input-field-auth pl-12" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 font-['Montserrat']">Email Address</label>
                                            <div className="relative">
                                                <Mail size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                                                <input type="email" placeholder="IDENTITY@MEDISCAN.GLOBAL" className="input-field-auth pl-12 font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                            </div>
                                        </div>
                                        <div className="col-span-full space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 font-['Montserrat']">Address</label>
                                            <input type="text" placeholder="STREET, BUILDING, AREA..." className="input-field-auth" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                                        </div>
                                        <div className="grid grid-cols-3 col-span-full gap-4">
                                            <input type="text" placeholder="CITY" className="input-field-auth px-6" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                                            <input type="text" placeholder="STATE" className="input-field-auth px-6" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                                            <input type="text" placeholder="PINCODE" className="input-field-auth px-6" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Clinical & Insurance */}
                                <div className="space-y-6">
                                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 flex items-center gap-3 font-['Montserrat'] pb-4 border-b border-gray-50">
                                        <Heart size={16} /> 03. Medical & Insurance Information
                                    </h4>
                                    <div className="grid md:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Age</label>
                                            <input type="number" required className="input-field-auth px-6 text-center text-lg font-black" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Gender</label>
                                            <select className="input-field-auth px-6 appearance-none bg-gray-50/50 font-black" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                                                {['Male', 'Female', 'Other'].map(g => <option key={g}>{g}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Blood Group</label>
                                            <select className="input-field-auth px-6 appearance-none bg-red-50/50 text-red-600 font-black" value={formData.blood_group} onChange={e => setFormData({...formData, blood_group: e.target.value})}>
                                                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g}>{g}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Smoking Habits</label>
                                            <select className="input-field-auth px-6 appearance-none font-black" value={formData.smoking_status} onChange={e => setFormData({...formData, smoking_status: e.target.value})}>
                                                {['Never', 'Occasional', 'Regular', 'Frequent'].map(s => <option key={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 pt-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 font-['Montserrat']">Insurance Provider</label>
                                            <div className="relative">
                                                <ShieldCheck size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-300" />
                                                <input type="text" placeholder="E.G. TATA AIG / HDFC ERGO" className="input-field-auth pl-12" value={formData.insurance_provider} onChange={e => setFormData({...formData, insurance_provider: e.target.value})} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 font-['Montserrat']">Policy Number</label>
                                            <input type="text" placeholder="EXP: POL-90231-A" className="input-field-auth px-6" value={formData.insurance_policy_number} onChange={e => setFormData({...formData, insurance_policy_number: e.target.value})} />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-7 rounded-[32px] font-black italic uppercase tracking-[0.2em] text-xl shadow-2xl shadow-gray-900/30 hover:bg-black hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-50">
                                    {loading ? (
                                        <div className="w-8 h-8 border-4 border-emerald-500 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <QrCode size={32} className="text-emerald-500" /> CREATE ACCOUNT
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.div 
                            key="registration-success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="card-premium p-16 bg-[#064E3B] text-white flex flex-col items-center justify-center text-center relative overflow-hidden shadow-4xl shadow-emerald-900/40 border-0"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                            <div className="w-24 h-24 bg-white/10 rounded-[40px] flex items-center justify-center mb-8 backdrop-blur-xl border border-white/20 shadow-inner">
                                <FileCheck2 size={48} className="text-emerald-300" />
                            </div>
                            <h4 className="text-5xl font-black italic uppercase tracking-tighter mb-4 leading-none">Account Created!</h4>
                            <p className="font-bold text-emerald-200 uppercase tracking-widest text-sm mb-4">UHID: {success.uhid || success.username}</p>
                            <p className="text-[10px] font-black text-emerald-300/60 uppercase tracking-[0.2em] mb-10 font-['Montserrat']">The digital Health Card & UHID have been sent to the patient's email.</p>
                            
                            <div className="p-10 bg-white rounded-[40px] shadow-2xl flex flex-col items-center relative group">
                                <div className="absolute -inset-4 bg-emerald-500 rounded-[56px] opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"></div>
                                {qrUrl ? (
                                    <img src={qrUrl} alt="Patient QR Code" className="w-64 h-64 object-contain rounded-[32px] relative z-10" />
                                ) : (
                                    <div className="w-64 h-64 bg-gray-50 rounded-[32px] flex items-center justify-center relative z-10">
                                        <QrCode size={120} className="text-gray-200 animate-pulse" />
                                    </div>
                                )}
                                <div className="mt-6 text-center relative z-10">
                                    <span className="text-xs font-black text-emerald-900 uppercase tracking-[0.3em] font-['Montserrat']">Active Digital Card</span>
                                </div>
                            </div>
                            
                            <button onClick={() => { setSuccess(null); setQrUrl(null); }}
                                className="mt-16 bg-white text-emerald-900 border-white hover:bg-emerald-50 px-12 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-3">
                                <UserPlus size={20} /> Register Another Patient
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                .input-field-auth {
                    width: 100%;
                    background-color: #F8FAFC;
                    border: 2px solid transparent;
                    border-radius: 20px;
                    padding: 1.25rem 1.5rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    outline: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-size: 0.8rem;
                }
                .input-field-auth:focus {
                    background-color: white;
                    border-color: #10B981;
                    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.1);
                }
                .card-premium {
                    border-radius: 48px;
                }
            `}</style>
        </motion.div>
    );
};

export default RegisterPatient;
