import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { QrCode } from 'lucide-react';

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
        setError('Login failed. Check your credentials.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--color-background)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-premium max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-[14px] mx-auto flex items-center justify-center text-white mb-4" style={{ backgroundColor: 'var(--color-primary)' }}>
            <QrCode size={24} />
          </div>
          <h2 className="text-2xl italic uppercase tracking-tighter" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--color-primary-dark)' }}>
            MediScan Login
          </h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">Access your healthcare dashboard</p>
        </div>

        {error && <div className="p-3 mb-6 rounded-lg text-sm font-bold text-white bg-red-600/80 text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
             <input type="text" placeholder="Username" required
               className="input-field" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
             <input type="password" placeholder="Password" required
               className="input-field" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary w-full mt-4 py-3">Sign In</button>
        </form>

        <div className="mt-6 text-center text-sm font-medium text-gray-500">
          Not registered? <Link to="/register" style={{ color: 'var(--color-primary)' }} className="font-bold uppercase tracking-tight">Create Account</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
