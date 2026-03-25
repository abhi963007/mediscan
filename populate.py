import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from accounts.models import CustomUser
from hospitals.models import Hospital, HospitalSettings, DoctorSlot, MedicineMaster
from patients.models import Patient

# 1. Create Global Admin
if not CustomUser.objects.filter(username='admin').exists():
    CustomUser.objects.create_superuser('admin', 'admin@mediscan.local', 'admin', role='admin')
    print("Created Global Admin (admin / admin)")

# 2. Add Global Medicines
meds = ['Paracetamol 500mg', 'Amoxicillin 250mg', 'Azithromycin 500mg', 'Cough Syrup', 'Ibuprofen 400mg']
for m in meds:
    MedicineMaster.objects.get_or_create(name=m, defaults={'category': 'General'})
print(f"Created {len(meds)} Medicines")

# 3. Create a Hospital
hospital, created = Hospital.objects.get_or_create(
    email='apollo@mediscan.local',
    defaults={
        'name': 'Apollo Hospital',
        'contact': '1800-456-7890',
        'address': 'Kochi, Kerala',
        'location': 'Kerala',
        'is_verified': True
    }
)
HospitalSettings.objects.get_or_create(hospital=hospital, defaults={'online_seats': 50})
if created:
    print(f"Created Hospital: {hospital.name}")

# 4. Create Hospital Admin
if not CustomUser.objects.filter(username='hadmin').exists():
    CustomUser.objects.create_user(
        'hadmin', 'hadmin@mediscan.local', 'hadmin', 
        role='hospital_admin', hospital=hospital, is_approved=True
    )
    print("Created Hospital Admin (hadmin / hadmin)")

# 5. Create Doctor
if not CustomUser.objects.filter(username='doctor_ajay').exists():
    doc = CustomUser.objects.create_user(
        'doctor_ajay', 'ajay@mediscan.local', 'doctor', 
        role='doctor', hospital=hospital, is_approved=True
    )
    DoctorSlot.objects.create(hospital=hospital, doctor=doc, consultation_fee=500.00, start_time="09:00:00", end_time="17:00:00")
    print("Created Doctor (doctor_ajay / doctor)")

# 6. Create Receptionist
if not CustomUser.objects.filter(username='recep').exists():
    CustomUser.objects.create_user(
        'recep', 'recep@mediscan.local', 'recep', 
        role='receptionist', hospital=hospital, is_approved=True
    )
    print("Created Receptionist (recep / recep)")

# 7. Create Patient
if not CustomUser.objects.filter(username='patient1').exists():
    pat_user = CustomUser.objects.create_user(
        'patient1', 'pat@mediscan.local', 'patient', 
        role='patient', is_approved=True
    )
    Patient.objects.create(
        user=pat_user, full_name="John Doe", age=30, gender="Male", 
        blood_group="O+", phone="9876543210"
    )
    print("Created Patient (patient1 / patient)")

print("Population complete.")
