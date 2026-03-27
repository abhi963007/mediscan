import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Lock, ShieldCheck, X, CheckCircle2, Loader2, IndianRupee } from 'lucide-react';

interface PaymentGatewayProps {
    amount: string;
    hospitalName: string;
    onSuccess: () => void;
    onClose: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ amount, hospitalName, onSuccess, onClose }) => {
    const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: ''
    });

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('processing');
        
        // Simulate payment gateway delay
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onSuccess();
            }, 2000);
        }, 3000);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-lg rounded-[48px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-gray-100 relative font-['Montserrat']"
            >
                <button onClick={onClose} className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-2xl transition-all z-10">
                    <X size={24} className="text-gray-400" />
                </button>

                <div className="p-10">
                    <AnimatePresence mode="wait">
                        {step === 'details' && (
                            <motion.div key="details" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <div className="mb-10 text-center">
                                    <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-6 shadow-sm border border-blue-100">
                                        <CreditCard size={32} />
                                    </div>
                                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">Checkout</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3">Finalize your visit with {hospitalName}</p>
                                </div>

                                <div className="bg-gray-900 text-white p-8 rounded-[32px] mb-10 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                    <div className="flex justify-between items-start mb-10 relative z-10">
                                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Transaction Value</div>
                                        <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 flex items-center gap-1">
                                             <IndianRupee size={12} className="text-emerald-400" />
                                             <span className="font-black italic text-sm tracking-tighter text-emerald-400">{amount}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1 relative z-10">
                                         <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Security Node</p>
                                         <p className="text-xl font-black italic tracking-widest uppercase">STITCH PAY • MEDISCAN</p>
                                    </div>
                                </div>

                                <form onSubmit={handlePayment} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Card Number</label>
                                        <input 
                                            required type="text" placeholder="•••• •••• •••• ••••" 
                                            value={cardData.number} onChange={e => setCardData({...cardData, number: e.target.value})}
                                            className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl font-black tracking-[0.2em] text-sm focus:border-blue-500 focus:bg-white outline-none transition-all" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Expiry</label>
                                            <input required type="text" placeholder="MM/YY" value={cardData.expiry} onChange={e => setCardData({...cardData, expiry: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl font-black tracking-widest text-sm focus:border-blue-500 focus:bg-white outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">CVV</label>
                                            <input required type="password" placeholder="•••" value={cardData.cvv} onChange={e => setCardData({...cardData, cvv: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl font-black tracking-widest text-sm focus:border-blue-500 focus:bg-white outline-none transition-all" />
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black italic uppercase tracking-[0.15em] shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all text-sm mt-4 flex items-center justify-center gap-3">
                                        <Lock size={18} />
                                        Pay ₹{amount} Securely
                                    </button>
                                </form>

                                <div className="mt-8 flex items-center justify-center gap-4 text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={14} />
                                        <span className="text-[8px] font-black uppercase tracking-widest">PCI-DSS COMPLIANT</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Lock size={14} />
                                        <span className="text-[8px] font-black uppercase tracking-widest">AES-256 ENCRYPTION</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 'processing' && (
                            <motion.div key="processing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center flex flex-col items-center">
                                <div className="relative mb-10 w-32 h-32 flex items-center justify-center">
                                     <Loader2 size={80} className="text-blue-500 animate-spin absolute" />
                                     <div className="w-20 h-20 bg-blue-50 rounded-full animate-pulse"></div>
                                </div>
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 leading-none mb-3">Authorizing</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">Syncing with banking node...</p>
                            </motion.div>
                        )}

                        {step === 'success' && (
                            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center flex flex-col items-center">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="w-32 h-32 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-10 shadow-2xl shadow-emerald-500/40">
                                    <CheckCircle2 size={64} />
                                </motion.div>
                                <h3 className="text-4xl font-black italic uppercase tracking-tighter text-emerald-900 leading-none mb-3 font-['Montserrat']">Payment Verified</h3>
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest font-['Montserrat']">Transaction ID: TXN-{Math.random().toString(36).substring(7).toUpperCase()}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentGateway;
