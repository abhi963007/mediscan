from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
        ('receptionist', 'Receptionist'),
        ('hospital_admin', 'Hospital Admin'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')
    is_approved = models.BooleanField(default=False)

    # Links doctor / receptionist / hospital_admin to a specific hospital.
    # Null for patients and the global site admin.
    hospital = models.ForeignKey(
        'hospitals.Hospital',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='staff_members',
    )

    def save(self, *args, **kwargs):
        # Auto-approve patients, global admin, and superusers
        if self.role in ['patient', 'admin'] or self.is_superuser:
            self.is_approved = True
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} - {self.role.capitalize()}"
