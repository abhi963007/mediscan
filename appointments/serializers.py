from rest_framework import serializers
from .models import Appointment, AppointmentQueue


class AppointmentQueueSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='appointment.patient.full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.get_full_name', read_only=True)

    class Meta:
        model = AppointmentQueue
        fields = '__all__'


class AppointmentSerializer(serializers.ModelSerializer):
    patient_username = serializers.CharField(source='patient.username', read_only=True)
    patient_full_name = serializers.CharField(source='patient.patient_profile.full_name', read_only=True)
    doctor_username = serializers.CharField(source='doctor.username', read_only=True)
    doctor_full_name = serializers.CharField(source='doctor.get_full_name', read_only=True)
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)
    queue = AppointmentQueueSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'appointment_id')

    def create(self, validated_data):
        # If no patient is provided (e.g. patient booking for themselves), use current user
        if 'patient' not in validated_data:
            validated_data['patient'] = self.context['request'].user
        
        # Set booked_by to current user
        validated_data['booked_by'] = self.context['request'].user
        
        return super().create(validated_data)
