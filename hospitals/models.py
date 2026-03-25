from django.db import models


class Hospital(models.Model):
    name = models.CharField(max_length=255)
    contact = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    address = models.TextField()
    location = models.CharField(max_length=255)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class HospitalSettings(models.Model):
    hospital = models.OneToOneField(Hospital, on_delete=models.CASCADE, related_name='settings')
    # Online seats available per day for the hospital
    online_seats = models.PositiveIntegerField(default=20)

    def __str__(self):
        return f"Settings for {self.hospital.name}"


class DoctorSlot(models.Model):
    """Stores per-doctor consultation fee and available time slots for a hospital."""
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='doctor_slots')
    doctor = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='slots')
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f"{self.doctor.username} @ {self.hospital.name} ({self.start_time} - {self.end_time})"


class MedicineMaster(models.Model):
    """Global medicine list managed by Admin."""
    name = models.CharField(max_length=255, unique=True)
    category = models.CharField(max_length=100, blank=True)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
