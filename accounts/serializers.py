from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from .models import CustomUser
from patients.models import Patient
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

class UserSerializer(serializers.ModelSerializer):
    hospital_name = serializers.SerializerMethodField()
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'role', 'is_approved', 'hospital', 'hospital_name')
        read_only_fields = ('is_approved',)

    def get_hospital_name(self, obj):
        return obj.hospital.name if obj.hospital else None

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    # Patient specific fields
    full_name = serializers.CharField(required=False, write_only=True)
    phone = serializers.CharField(required=False, write_only=True)
    age = serializers.IntegerField(required=False, write_only=True)
    gender = serializers.CharField(required=False, write_only=True)
    blood_group = serializers.CharField(required=False, write_only=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'password', 'email', 'role', 'full_name', 'phone', 'age', 'gender', 'blood_group', 'hospital')

    def validate_role(self, value):
        if value != 'patient':
            raise serializers.ValidationError("Only patients can self-register. Other roles must be added by a hospital administrator.")
        return value

    def create(self, validated_data):
        role = 'patient' # Force role to patient
        hospital = validated_data.get('hospital', None)
        
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=role,
            hospital=hospital
        )

        if role == 'patient':
            # Patient profile is created by signals or manually here. 
            # In our current setup, we do it here.
            # UHID is generated in Patient.save, but we can ensure it's saved.
            patient = Patient.objects.create(
                user=user,
                full_name=validated_data.get('full_name', ''),
                phone=validated_data.get('phone', ''),
                email=validated_data.get('email', ''),
                age=validated_data.get('age', 0),
                gender=validated_data.get('gender', 'Male'),
                blood_group=validated_data.get('blood_group', 'O+'),
            )

            # Send Email Notification with QR Code
            if user.email:
                try:
                    subject = f"🏥 MediScan Health ID - {patient.full_name} ({patient.uhid})"
                    
                    # HTML Content for better deliverability
                    html_content = f"""
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #064E3B; text-align: center;">Welcome to MediScan</h2>
                        <p>Hello <strong>{patient.full_name}</strong>,</p>
                        <p>Your digital health account has been created successfully. Below is your unique identifier for all clinical visits:</p>
                        
                        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; border: 1px solid #dcfce7;">
                            <span style="font-size: 12px; color: #166534; text-transform: uppercase; letter-spacing: 1px;">Universal Health ID</span><br/>
                            <strong style="font-size: 24px; color: #064E3B; letter-spacing: 2px;">{patient.uhid}</strong>
                        </div>
                        
                        <p><strong>Next Steps:</strong></p>
                        <ul>
                            <li>We have attached your <strong>Digital QR Health Card</strong> to this email.</li>
                            <li>Please present this QR code at any affiliated hospital front desk for instant check-in.</li>
                            <li>Your medical history and prescriptions will be safely linked to this ID.</li>
                        </ul>
                        
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #666; text-align: center;">
                            This is an automated message from MediScan HMS. Please do not reply to this email.
                        </p>
                    </div>
                    """
                    
                    text_content = strip_tags(html_content)
                    
                    email_msg = EmailMultiAlternatives(
                        subject,
                        text_content,
                        settings.DEFAULT_FROM_EMAIL,
                        [user.email],
                    )
                    email_msg.attach_alternative(html_content, "text/html")
                    
                    if patient.qr_code:
                        email_msg.attach_file(patient.qr_code.path)
                    
                    email_msg.send()
                except Exception as e:
                    print(f"Failed to send email: {e}")

        return user

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if hasattr(instance, 'patient_profile') and instance.patient_profile:
            ret['uhid'] = instance.patient_profile.uhid
        return ret

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_approved:
            raise AuthenticationFailed('Your account is pending approval by an administrator.')
        
        data['role'] = self.user.role
        data['username'] = self.user.username
        if self.user.hospital:
            data['hospital_name'] = self.user.hospital.name
        if self.user.role == 'patient' and hasattr(self.user, 'patient_profile'):
            data['uhid'] = self.user.patient_profile.uhid
        return data

class HospitalStaffSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'password', 'email', 'role', 'is_approved', 'hospital')
        read_only_fields = ('is_approved', 'hospital')

    def create(self, validated_data):
        hospital = self.context['request'].user.hospital
        role = validated_data.get('role')
        if role not in ['doctor', 'receptionist']:
            raise serializers.ValidationError("Only doctors and receptionists can be created.")

        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=role,
            hospital=hospital,
            is_approved=True  # Auto approved because hospital admin creates them
        )
        return user
