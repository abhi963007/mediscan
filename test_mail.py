import os
import django
from django.conf import settings
from django.core.mail import send_mail

# Mock setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

try:
    print("Testing SMTP connection...")
    send_mail(
        'MediScan SMTP Test',
        'If you receive this, your SMTP settings are correct.',
        settings.DEFAULT_FROM_EMAIL,
        ['mediscan.official.hms@gmail.com'], # send to self
        fail_silently=False,
    )
    print("SUCCESS: Email sent!")
except Exception as e:
    print(f"FAILED: {e}")
