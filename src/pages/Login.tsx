import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { QrCode, Home, ArrowLeft } from 'lucide-react';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import loginAnimation from '../assets/login_animation.lottie';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/auth/login/', { username, password });
      
      const pRes = await axios.get('http://127.0.0.1:8000/api/auth/profile/', {
        headers: { Authorization: `Bearer ${res.data.access}` }
      });

      login(res.data.access, pRes.data);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Login failed. Please check your username and password.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Back to Home Button */}
      <Link to="/" className="absolute top-8 right-8 flex items-center gap-2 px-6 py-2.5 bg-white shadow-xl rounded-2xl hover:scale-105 transition-all group z-50">
          <Home size={18} className="text-gray-400 group-hover:text-[var(--color-primary)] transition-colors" />
          <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-800 transition-colors font-['Montserrat']">Home</span>
      </Link>

      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-0 overflow-hidden rounded-[32px] shadow-2xl bg-white/70 backdrop-blur-xl border border-white">
        {/* Left Side: Animation */}
        <div className="hidden md:flex flex-[1.2] items-center justify-center p-8 bg-gray-50/50 relative overflow-hidden">
          <div className="w-full h-[350px]">
             <DotLottieReact
                src={loginAnimation}
                loop
                autoplay
              />
          </div>
        </div>

        {/* Right Side: Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 p-10 md:p-16">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white mb-6 shadow-xl" style={{ backgroundColor: 'var(--color-primary)' }}>
              <QrCode size={32} />
            </div>
            <h2 className="text-3xl italic uppercase tracking-tighter" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--color-primary-dark)' }}>
              MediScan Login
            </h2>
            <p className="text-gray-400 mt-2 text-xs font-black uppercase tracking-widest font-['Montserrat']">Sign In to Your Account</p>
          </div>

          {error && <div className="p-3 mb-6 rounded-xl text-xs font-bold text-white bg-red-600/80 text-center uppercase tracking-widest">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
               <input type="text" placeholder="Username" required
                 className="input-field" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div>
               <input type="password" placeholder="Password" required
                 className="input-field" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary w-full mt-6 py-4 italic uppercase tracking-tighter text-lg">Sign In</button>
          </form>

          <div className="mt-10 text-center text-xs font-black uppercase tracking-widest text-gray-400 font-['Montserrat']">
            Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)' }} className="font-bold underline underline-offset-4">Register Here</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
