import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Building2, Users, Pill, Activity, ShieldAlert, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminOverview = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/auth/dashboard-stats/');
                setStats(res.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleNetworkAudit = async () => {
        try {
            const token = localStorage.getItem('access');
            const resHospitals = await axios.get('http://127.0.0.1:8000/api/hospitals/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const hospitals = resHospitals.data || [];

            const doc = new jsPDF();
            
            // Header Section
            doc.setFillColor(34, 197, 94); // Primary Green
            doc.rect(0, 0, 210, 40, 'F');
            doc.setFontSize(24);
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.text("MEDISCAN: SUMMARY REPORT", 20, 25);
            
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 32);
            
            // Stats Snapshot
            doc.setTextColor(0,0,0);
            doc.setFontSize(14);
            doc.text("OVERALL STATS", 20, 55);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text(`Total Hospitals: ${stats?.total_hospitals || 0}`, 20, 65);
            doc.text(`Total Patients: ${stats?.total_patients || 0}`, 20, 72);
            doc.text(`Total Medicines: ${stats?.total_medicines || 0}`, 20, 79);
            doc.text(`System Status: 100% (Working Fine)`, 20, 86);
            
            // Hospital List Table
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text("REGISTERED HOSPITALS LIST", 20, 105);
            
            autoTable(doc, {
                startY: 110,
                head: [['ID', 'Hospital Name', 'Category', 'Verified']],
                body: hospitals.map((h: any) => [
                    h.id, 
                    h.name, 
                    h.category || 'General', 
                    h.is_verified ? 'YES' : 'PENDING'
                ]),
                theme: 'striped',
                headStyles: { fillColor: [31, 41, 55] },
                alternateRowStyles: { fillColor: [249, 250, 251] }
            });

            doc.save("Mediscan_System_Report.pdf");
        } catch (err) {
            alert('Audit Generation Failed. Database offline.');
        }
    };

    const handleExportLedger = async () => {
        try {
            const token = localStorage.getItem('access');
            const res = await axios.get('http://127.0.0.1:8000/api/hospitals/medicines/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Basic CSV conversion
            const medicines = res.data.results || [];
            const header = "ID,Name,Category\n";
            const csv = header + medicines.map((m: any) => `${m.id},${m.name},${m.category}`).join("\n");
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', 'mediscan_global_medicines.csv');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (err) {
            alert('Failed to export ledger. Please check connections.');
        }
    };

    if (loading) return <div className="p-8 font-black uppercase tracking-widest text-gray-400">Loading Data...</div>;

    const cards = [
        { title: 'Total Hospitals', value: stats?.total_hospitals || 0, icon: <Building2 />, color: 'bg-blue-500', sub: 'Verified in system' },
        { title: 'Pending Approval', value: stats?.pending_hospitals || 0, icon: <ShieldAlert />, color: 'bg-orange-500', sub: 'Action required' },
        { title: 'Total Patients', value: stats?.total_patients || 0, icon: <Users />, color: 'bg-green-500', sub: 'All registered patients' },
        { title: 'Total Medicines', value: stats?.total_medicines || 0, icon: <Pill />, color: 'bg-purple-500', sub: 'Medicines in database' },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8">
            <h2 className="text-4xl font-black italic uppercase text-gray-800 tracking-tighter mb-2">Global Overview</h2>
            <p className="font-bold tracking-widest text-xs text-gray-400 uppercase mb-10 pl-1 font-['Montserrat']">Check status and stats for all hospitals</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {cards.map((card, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-premium p-6 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col justify-between"
                    >
                        <div className="flex justify-between items-start">
                            <div className={`${card.color} text-white p-3 rounded-2xl shadow-lg`}>
                                {card.icon}
                            </div>
                            <span className="text-4xl font-black italic tracking-tighter text-gray-900">{card.value}</span>
                        </div>
                        <div className="mt-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{card.title}</h4>
                            <p className="text-[10px] font-bold text-gray-500 uppercase font-['Montserrat']">{card.sub}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
                <div className="card-premium p-8 bg-gray-50 border-dashed border-2 border-gray-200 flex flex-col items-center justify-center text-center">
                    <Activity size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-xl font-black uppercase italic text-gray-400 tracking-tighter">System Status</h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest max-w-xs mt-2 font-['Montserrat']">All servers are working fine. Real-time monitoring is on.</p>
                </div>
                
                <div className="card-premium p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-black uppercase italic text-gray-800 tracking-tighter mb-4">Actions</h3>
                    <div className="space-y-4">
                        <button onClick={handleNetworkAudit} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-colors shadow-lg active:scale-95">Get Summary Report</button>
                        <button onClick={handleExportLedger} className="w-full py-4 border-2 border-gray-100 text-gray-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-50 transition-colors active:scale-95">Get Medicine List</button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminOverview;
