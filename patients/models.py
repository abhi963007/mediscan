from django.db import models
from django.utils import timezone
from django.conf import settings
import uuid
import qrcode
from io import BytesIO
from django.core.files import File


class Patient(models.Model):
    BLOOD_GROUPS = [
        ('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'), ('O+', 'O+'), ('O-', 'O-'),
    ]
    GENDER_CHOICES = [('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='patient_profile', null=True, blank=True,
    )
    uhid = models.CharField(max_length=20, unique=True, primary_key=True)
    full_name = models.CharField(max_length=255)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    blood_group = models.CharField(max_length=5, choices=BLOOD_GROUPS)
    phone = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, default='')
    emergency_contact = models.CharField(max_length=255, blank=True, default='')
    known_allergies = models.TextField(blank=True, default='')
    medical_history = models.TextField(blank=True, default='')
    qr_code = models.ImageField(upload_to='patient_qrs/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.uhid:
            self.uhid = f"GP-{timezone.now().year}-{uuid.uuid4().hex[:6].upper()}"

        # Generate QR code with UHID
        if not self.qr_code:
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data(self.uhid)
            qr.make(fit=True)
            img = qr.make_image(fill_color="#0F6E56", back_color="white")

            canvas = BytesIO()
            img.save(canvas, format='PNG')
            self.qr_code.save(f'{self.uhid}_qr.png', File(canvas), save=False)

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} ({self.uhid})"


class Consultation(models.Model):
    """A single consultation/treatment record by a doctor for a patient."""
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='consultations')
    doctor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='consultations_given',
    )
    hospital = models.ForeignKey(
        'hospitals.Hospital', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='consultations',
    )
    consultation_date = models.DateTimeField(auto_now_add=True)
    chief_complaint = models.TextField()
    diagnosis = models.CharField(max_length=255)
    notes = models.TextField(blank=True, default='')

    # Vitals
    bp = models.CharField(max_length=20, verbose_name="Blood Pressure", blank=True, default='')
    pulse = models.PositiveIntegerField(default=0)
    temp = models.DecimalField(max_digits=4, decimal_places=1, verbose_name="Temperature (°F)", default=98.6)
    spo2 = models.PositiveIntegerField(verbose_name="Oxygen Saturation (%)", default=98)

    def __str__(self):
        return f"{self.patient.full_name} - Dr.{self.doctor.username} - {self.consultation_date.date()}"


class Prescription(models.Model):
    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE, related_name='prescriptions')
    medicine_name = models.CharField(max_length=255)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    duration = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.medicine_name} for {self.consultation.patient.full_name}"
