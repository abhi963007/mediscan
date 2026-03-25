import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { QrCode, ArrowRight, Home } from 'lucide-react';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import signupAnimation from '../assets/signup_animation.lottie';

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
    <div className="min-h-screen py-10 px-4 md:px-10 relative flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Back to Home Button */}
      <Link to="/" className="absolute top-8 right-8 flex items-center gap-2 px-6 py-2.5 bg-white shadow-xl rounded-2xl hover:scale-105 transition-all group z-50">
          <Home size={18} className="text-gray-400 group-hover:text-[var(--color-primary)] transition-colors" />
          <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-800 transition-colors">Home</span>
      </Link>
      
      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-0 overflow-hidden rounded-[40px] shadow-2xl bg-white/70 backdrop-blur-xl border border-white">
        {/* Left Side: Animation */}
        <div className="hidden md:flex flex-1 items-center justify-center p-8 bg-gray-50/50">
           <div className="w-full h-full scale-110 transform">
              <DotLottieReact
                src={signupAnimation}
                loop
                autoplay
              />
           </div>
        </div>

        {/* Right Side: Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 p-6 md:p-12 overflow-y-auto max-h-[95vh]">
          <div className="mb-6">
            <h2 className="text-3xl italic uppercase tracking-tighter" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--color-primary-dark)', textDecoration: 'underline', textDecorationColor: 'rgba(15,110,86,0.15)', textDecorationThickness: '4px', textUnderlineOffset: '8px' }}>
              Create Account
            </h2>
            <p className="font-bold mt-2 text-gray-400 text-[10px] uppercase tracking-widest pl-1">Join the MediScan ecosystem.</p>
          </div>

          <div className="flex gap-2 mb-6 bg-gray-50 p-1.5 rounded-2xl">
            {['patient', 'doctor', 'receptionist'].map((r) => (
              <button key={r} onClick={() => setRole(r as any)}
                className="flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                style={{
                  backgroundColor: role === r ? 'var(--color-primary)' : 'transparent',
                  color: role === r ? '#fff' : 'var(--color-primary-dark)',
                  boxShadow: role === r ? '0 4px 12px rgba(15,110,86,0.2)' : 'none'
                }}>
                {r}
              </button>
            ))}
          </div>

          {error && <div className="p-2 mb-4 rounded-xl text-[10px] font-bold text-white bg-red-600/80 uppercase tracking-widest text-center">{error}</div>}
          {success && <div className="p-2 mb-4 rounded-xl text-[10px] font-bold text-white bg-green-600/80 uppercase tracking-widest text-center">{success}</div>}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Username" required className="input-field py-2" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
              <input type="email" placeholder="Email Address" required className="input-field py-2" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <input type="password" placeholder="Password" required className="input-field w-full py-2" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />

            <AnimatePresence>
              {role === 'patient' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-4 border-t border-gray-100 overflow-hidden">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1 font-bold">Patient Details</h4>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Full Name" required className="input-field py-2" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
                    <input type="tel" placeholder="Phone Number" required className="input-field py-2" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <input type="number" placeholder="Age" required className="input-field py-2" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                    <select className="input-field py-2 appearance-none" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                      {['Male', 'Female', 'Other'].map(g => <option key={g}>{g}</option>)}
                    </select>
                    <select className="input-field py-2 appearance-none" value={formData.blood_group} onChange={e => setFormData({ ...formData, blood_group: e.target.value })}>
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" className="btn-primary w-full mt-4 py-3 text-base italic uppercase tracking-tighter">
              Register <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
            Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)' }} className="font-bold underline underline-offset-4">Sign In</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
