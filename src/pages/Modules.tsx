import React from 'react';
import { motion } from 'framer-motion';
import { Building2, UserCog, Users, Settings, Calendar, Scan, Stethoscope, ArrowLeft, HeartPulse, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const moduleList = [
    {
        icon: <Building2 size={56} strokeWidth={1.5} />,
        title: 'Hospital Registration & Setup',
        desc: 'Easily add a hospital to the system, check its details, and manage the list of available medicines.',
        tag: 'ADMIN'
    },
    {
        icon: <UserCog size={56} strokeWidth={1.5} />,
        title: 'Doctor Account Setup',
        desc: 'Create doctor accounts and give them the right access to see their patients and manage appointments.',
        tag: 'DOCTORS'
    },
    {
        icon: <Users size={56} strokeWidth={1.5} />,
        title: 'Staff Account Setup',
        desc: 'Manage all hospital staff including receptionists, each with their own secure login.',
        tag: 'STAFF'
    },
    {
        icon: <Settings size={56} strokeWidth={1.5} />,
        title: 'Hospital Settings',
        desc: 'Set consultation fees, working hours, and how many patients can book online each day.',
        tag: 'SETTINGS'
    },
    {
        icon: <Calendar size={56} strokeWidth={1.5} />,
        title: 'Book an Appointment',
        desc: 'Patients can search for hospitals, see available time slots, and book a doctor visit online.',
        tag: 'PATIENTS'
    },
    {
        icon: <Scan size={56} strokeWidth={1.5} />,
        title: 'QR Code Check-in',
        desc: 'Patients scan their QR card at the hospital to check in quickly without any paperwork.',
        tag: 'FRONT DESK'
    },
    {
        icon: <Stethoscope size={56} strokeWidth={1.5} />,
        title: 'Doctor Treatment Room',
        desc: 'Doctors can view a patient\'s full visit history, prescriptions, and health notes all in one screen.',
        tag: 'DOCTORS'
    },
];

const Modules = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center py-24 px-6 md:px-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-50/30 rounded-full blur-[160px] -z-10" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-green-50/30 rounded-full blur-[160px] -z-10" />

            <div className="max-w-6xl w-full">
                <Link to="/" className="inline-flex items-center gap-2 mb-16 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-all group font-['Montserrat']">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                </Link>

                <div className="mb-24 flex flex-col items-center text-center">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-6 bg-gray-50 px-5 py-2 rounded-full border border-gray-100 shadow-sm">
                        <Activity className="text-[var(--color-primary)]" size={14} />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 font-['Montserrat']">How It Works</span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-6xl md:text-[5.5rem] font-black italic uppercase tracking-tighter text-gray-900 leading-[0.85] mb-8">
                        Core <span className="text-[var(--color-primary)]">Modules</span>
                    </motion.h1>
                    <p className="text-xl font-medium text-gray-500 max-w-2xl leading-relaxed font-['Montserrat']">
                        Explore the 7 main tools that make MediScan work — designed to be fast, safe, and easy to use.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-8">
                    {moduleList.map((m, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 30 }} 
                            whileInView={{ opacity: 1, y: 0 }} 
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative bg-white rounded-[48px] p-2 pr-12 border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-[var(--color-primary)]/10 transition-all hover:-translate-y-2 flex flex-col md:flex-row items-center gap-10"
                        >
                            <div className="md:w-48 py-10 px-6 bg-gray-50 rounded-[40px] flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all shadow-inner border border-gray-100">
                                {m.icon}
                            </div>

                            <div className="flex-1 py-6 md:py-0 text-center md:text-left">
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-3 inline-block px-3 py-1 bg-green-50 rounded-full border border-green-100 font-['Montserrat']">{m.tag}</span>
                                <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-gray-900 mb-4 group-hover:text-[var(--color-primary)] transition-colors leading-none">
                                    {m.title}
                                </h3>
                                <p className="text-lg font-medium text-gray-500 leading-relaxed max-w-2xl font-['Montserrat']">
                                    {m.desc}
                                </p>
                            </div>

                            <div className="hidden md:flex flex-col items-center">
                                <div className="text-[2rem] font-black italic text-gray-100 tracking-tighter leading-none group-hover:text-[var(--color-primary)]/10 transition-colors uppercase">
                                    {String(i + 1).padStart(2, '0')}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Decorative Icon */}
            <div className="absolute top-20 left-[-100px] opacity-[0.02] -rotate-12 pointer-events-none">
                <HeartPulse size={500} />
            </div>
        </div>
    );
};

export default Modules;
