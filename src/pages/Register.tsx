import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { QrCode, ArrowRight, Home, Info } from 'lucide-react';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import signupAnimation from '../assets/signup_animation.lottie';

const Register = () => {
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
      const payload = { ...formData, role: 'patient' };
      await axios.post('http://127.0.0.1:8000/api/auth/register/', payload);
      setSuccess('Your account was created! Taking you to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Registration failed. Try again.');
      }
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-10 relative flex items-center justify-center p-4 bg-emerald-50/20">
      {/* Back to Home Button */}
      <Link to="/" className="absolute top-8 right-8 flex items-center gap-2 px-6 py-2.5 bg-white shadow-xl rounded-2xl hover:scale-105 transition-all group z-50 border border-emerald-100">
          <Home size={18} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
          <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-800 transition-colors font-['Montserrat']">Home</span>
      </Link>
      
      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-0 overflow-hidden rounded-[48px] shadow-4xl bg-white border border-emerald-100 relative">
        {/* Left Side: Animation */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center p-12 bg-emerald-50/50 border-r border-emerald-100">
            <div className="text-center mb-8">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-emerald-900 mb-2">Patient Area</h3>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.3em] font-['Montserrat']">Your Personal Health Card</p>
            </div>
           <div className="w-full h-[380px] pointer-events-none">
              <DotLottieReact
                src={signupAnimation}
                loop
                autoplay
              />
           </div>
           <div className="mt-8 p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white max-w-sm text-center shadow-xl shadow-emerald-900/5">
                <div className="flex items-center justify-center gap-2 mb-2 text-emerald-600">
                    <Info size={16} /> 
                    <span className="text-[10px] font-black uppercase tracking-widest">Please Note</span>
                </div>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed font-['Montserrat']">
                    Doctors and Receptionists cannot sign up here. Please ask your Hospital Admin to create your staff account.
                </p>
           </div>
        </div>

        {/* Right Side: Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 p-8 md:p-14 overflow-y-auto max-h-[95vh]">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 mb-3 font-['Montserrat']" style={{ textDecoration: 'underline', textDecorationColor: 'rgba(16,185,129,0.15)', textDecorationThickness: '4px', textUnderlineOffset: '8px' }}>
              Create Your Account
            </h2>
            <p className="font-bold text-gray-400 text-[10px] uppercase tracking-[0.4em] pl-1 font-['Montserrat']">Register as a Patient</p>
          </div>

          <AnimatePresence>
            {error && <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 mb-6 rounded-2xl text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 uppercase tracking-widest text-center shadow-sm font-['Montserrat']">{error}</motion.div>}
            {success && <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 mb-6 rounded-2xl text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 uppercase tracking-widest text-center shadow-sm font-['Montserrat']">{success}</motion.div>}
          </AnimatePresence>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1 font-['Montserrat']">Login Details</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Username" required className="input-field-patient" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                  <input type="email" placeholder="Email Address" required className="input-field-patient" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <input type="password" placeholder="Password" required className="input-field-patient" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100">
                <h4 className="text-[10px] font-black uppercase text-emerald-600 tracking-widest pl-1 font-['Montserrat']">Personal Details</h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" required className="input-field-patient" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
                <input type="tel" placeholder="Phone Number" required className="input-field-patient" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5 flex flex-col">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Age</label>
                    <input type="number" placeholder="00" required className="input-field-patient" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                </div>
                <div className="space-y-1.5 flex flex-col">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Gender</label>
                    <select className="input-field-patient" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                        {['Male', 'Female', 'Other'].map(g => <option key={g}>{g}</option>)}
                    </select>
                </div>
                <div className="space-y-1.5 flex flex-col">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-1">Blood</label>
                    <select className="input-field-patient" value={formData.blood_group} onChange={e => setFormData({ ...formData, blood_group: e.target.value })}>
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g}>{g}</option>)}
                    </select>
                </div>
                </div>
            </div>

            <button type="submit" className="w-full mt-6 py-5 bg-emerald-900 text-white rounded-3xl font-black italic uppercase tracking-tighter text-xl shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
              Create Account <ArrowRight size={24} />
            </button>
          </form>

          <div className="mt-10 text-center text-[10px] font-black uppercase tracking-widest text-gray-400 font-['Montserrat']">
            Already have an account? <Link to="/login" className="text-emerald-600 font-bold underline underline-offset-4 ml-1">Sign In</Link>
          </div>
        </motion.div>
      </div>

      <style>{`
        .input-field-patient {
            width: 100%;
            background-color: #F8FAFC;
            border: 2px solid transparent;
            border-radius: 20px;
            padding: 1rem 1.25rem;
            font-weight: 800;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            outline: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 0.7rem;
            font-family: 'Montserrat';
        }
        .input-field-patient:focus {
            background-color: white;
            border-color: #10B981;
            box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.1);
        }
        .shadow-4xl {
            box-shadow: 0 50px 100px -20px rgba(6, 78, 59, 0.15), 0 30px 60px -30px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Register;
