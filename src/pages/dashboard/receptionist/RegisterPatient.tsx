import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { QrCode, UserPlus, FileCheck2 } from 'lucide-react';

const RegisterPatient = () => {
    const [formData, setFormData] = useState({
        username: '', password: '', email: '', full_name: '',
        phone: '', age: '', gender: 'Male', blood_group: 'O+', role: 'patient'
    });
    
    const [success, setSuccess] = useState<any>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/auth/register/', formData);
            setSuccess(res.data);
            setFormData({ username: '', password: '', email: '', full_name: '', phone: '', age: '', gender: 'Male', blood_group: 'O+', role: 'patient' });
        } catch (err: any) {
            alert('Failed to register patient: ' + JSON.stringify(err.response?.data));
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8">
            <h2 className="text-3xl font-black italic uppercase text-gray-800 tracking-tighter mb-8">Patient Visit Desk</h2>
            
            <div className="grid lg:grid-cols-2 gap-10">
                <form onSubmit={handleRegister} className="card-premium p-8 grid md:grid-cols-2 gap-4">
                    <div className="col-span-full mb-6">
                        <div className="w-16 h-16 rounded-[20px] bg-green-50 text-green-700 font-display flex items-center justify-center mb-4">
                            <UserPlus size={32} />
                        </div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">New Registration</h3>
                        <p className="text-sm font-medium text-gray-500">Provide QR-Code card and add details.</p>
                    </div>

                    <input type="text" placeholder="Username" required className="input-field" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                    <input type="password" placeholder="Temporary Password" required className="input-field" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                    <input type="text" placeholder="Full Legal Name" required className="input-field col-span-full" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
                    
                    <input type="tel" placeholder="Mobile Number" required className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    <input type="email" placeholder="Email Address (Optional)" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    
                    <div className="grid grid-cols-3 gap-4 col-span-full">
                        <input type="number" placeholder="Age" required className="input-field px-4 rounded-2xl" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                        <select className="input-field px-4 rounded-2xl appearance-none" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                            {['Male', 'Female', 'Other'].map(g => <option key={g}>{g}</option>)}
                        </select>
                        <select className="input-field px-4 rounded-2xl appearance-none" value={formData.blood_group} onChange={e => setFormData({...formData, blood_group: e.target.value})}>
                            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g}>{g}</option>)}
                        </select>
                    </div>

                    <button type="submit" className="col-span-full btn-primary py-4 mt-6 text-lg italic uppercase font-black tracking-widest flex items-center justify-center gap-3">
                        <QrCode size={24} /> Issue Global QR-Card
                    </button>
                </form>

                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-[40px] border border-gray-100 p-10 text-center relative overflow-hidden">
                    {success ? (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center z-10">
                            <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-green-500/40">
                                <FileCheck2 size={40} />
                            </div>
                            <h4 className="text-3xl font-black italic uppercase text-green-700 tracking-tighter mb-2">QR Generated</h4>
                            <p className="font-bold text-gray-500 uppercase tracking-widest text-sm mb-6">UHID: {success.uhid || success.username}</p>
                            
                            <div className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center">
                                {/* Normally fetch the actual QR image here dynamically. Since it's local, we use a placeholder styling */}
                                <div className="w-48 h-48 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                                    <QrCode size={64} className="text-gray-400" />
                                </div>
                                <span className="font-display font-bold text-gray-600 tracking-widest uppercase">E-Card Ready</span>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="z-10 opacity-50 flex flex-col items-center">
                            <QrCode size={120} className="text-gray-300" />
                            <h4 className="text-2xl font-black italic uppercase text-gray-400 tracking-tighter mt-8">Awaiting Input</h4>
                            <p className="font-medium text-gray-500 mt-2 max-w-xs">Fill the registry form to generate the encrypted Global Patient identifier.</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default RegisterPatient;
