import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { QrCode, ArrowRight } from 'lucide-react';

const Register = () => {
  const [role, setRole] = useState<'patient' | 'doctor' | 'receptionist'>('patient');
  const [formData, setFormData] = useState({
    username: '', password: '', email: '',
    full_name: '', phone: '', age: '', gender: 'Male', blood_group: 'O+'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (role !== 'patient') {
        const payload = { username: formData.username, password: formData.password, email: formData.email, role: role };
        await axios.post('http://127.0.0.1:8000/api/auth/register/', payload);
        setSuccess('Registration successful! Please wait for admin approval before logging in.');
      } else {
        const payload = { ...formData, role: 'patient' };
        await axios.post('http://127.0.0.1:8000/api/auth/register/', payload);
        navigate('/login');
      }
    } catch (err: any) {
      if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Registration failed. Try again.');
      }
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-10" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card-premium flex-1">
          <div className="mb-8">
            <h2 className="text-3xl italic uppercase tracking-tighter" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--color-primary-dark)', textDecoration: 'underline', textDecorationColor: 'rgba(15,110,86,0.15)', textDecorationThickness: '4px', textUnderlineOffset: '8px' }}>
              Create Account
            </h2>
            <p className="font-medium mt-2 text-gray-400">Join the MediScan ecosystem.</p>
          </div>

          <div className="flex gap-2 mb-6 bg-gray-50 p-2 rounded-2xl">
            {['patient', 'doctor', 'receptionist'].map((r) => (
              <button key={r} onClick={() => setRole(r as any)}
                className="flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                style={{
                  backgroundColor: role === r ? 'var(--color-primary)' : 'transparent',
                  color: role === r ? '#fff' : 'var(--color-primary-dark)',
                  boxShadow: role === r ? '0 4px 12px rgba(15,110,86,0.2)' : 'none'
                }}>
                {r}
              </button>
            ))}
          </div>

          {error && <div className="p-3 mb-4 rounded-lg text-sm font-bold text-white bg-red-600/80">{error}</div>}
          {success && <div className="p-3 mb-4 rounded-lg text-sm font-bold text-white bg-green-600/80">{success}</div>}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Username" required className="input-field" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
              <input type="email" placeholder="Email Address" required className="input-field" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <input type="password" placeholder="Password" required className="input-field w-full" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />

            <AnimatePresence>
              {role === 'patient' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-4 border-t border-gray-100 overflow-hidden">
                  <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Patient Details</h4>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Full Name" required className="input-field" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
                    <input type="tel" placeholder="Phone Number" required className="input-field" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <input type="number" placeholder="Age" required className="input-field" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                    <select className="input-field appearance-none" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                      {['Male', 'Female', 'Other'].map(g => <option key={g}>{g}</option>)}
                    </select>
                    <select className="input-field appearance-none" value={formData.blood_group} onChange={e => setFormData({ ...formData, blood_group: e.target.value })}>
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" className="btn-primary w-full mt-6 py-4 text-base italic uppercase tracking-tighter">
              Register <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-gray-500">
            Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)' }} className="font-bold uppercase tracking-tight">Sign In</Link>
          </div>
        </motion.div>
        
        <div className="hidden md:flex flex-1 flex-col justify-center p-8 text-center relative overflow-hidden rounded-[32px]" style={{ backgroundColor: 'var(--color-primary-dark)' }}>
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
           <div className="relative z-10 space-y-6 text-white text-center flex flex-col items-center">
             <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-white/10 mb-4">
               <QrCode size={40} className="text-white" />
             </div>
             <h3 className="text-4xl italic uppercase tracking-tighter shadow-sm font-display font-black">
               Your Identity,<br/> Encrypted.
             </h3>
             <p className="text-white/70 max-w-sm">
               Experience seamless check-ins, instant prescriptions, and completely paperless medical storage in one scan.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
