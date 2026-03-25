import os

pages = {
    'global_admin': ['AdminOverview.tsx', 'Hospitals.tsx', 'Medicines.tsx'],
    'hospital_admin': ['HospitalOverview.tsx', 'StaffManagement.tsx', 'HospitalSettings.tsx'],
    'receptionist': ['ReceptionistOverview.tsx', 'RegisterPatient.tsx', 'ScanQR.tsx', 'Appointments.tsx'],
    'doctor': ['DoctorOverview.tsx', 'Treatment.tsx', 'Appointments.tsx'],
    'patient': ['PatientOverview.tsx', 'BookAppointment.tsx', 'MyHistory.tsx']
}

template = """import React from 'react';
import { motion } from 'framer-motion';

const {name} = () => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8">
            <h2 className="text-3xl font-black italic uppercase text-gray-800 tracking-tighter mb-4">{name}</h2>
            <div className="card-premium p-6">
                <p className="text-gray-500 font-medium">This module is part of the integrated Global Patient suite and is currently under active deployment.</p>
            </div>
        </motion.div>
    );
};

export default {name};
"""

base_dir = r"C:\Users\Abhi\Desktop\QR-Code\src\pages\dashboard"

for folder, files in pages.items():
    folder_path = os.path.join(base_dir, folder)
    os.makedirs(folder_path, exist_ok=True)
    for file in files:
        name = file.split('.')[0]
        file_path = os.path.join(folder_path, file)
        with open(file_path, 'w') as f:
            f.write(template.replace('{name}', name))

print("All dashboard placeholder pages created successfully.")
