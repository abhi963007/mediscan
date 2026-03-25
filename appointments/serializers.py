from rest_framework import serializers
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    patient_username = serializers.CharField(source='patient.username', read_only=True)
    doctor_username = serializers.CharField(source='doctor.username', read_only=True)
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('patient', 'created_at')

    def create(self, validated_data):
        validated_data['patient'] = self.context['request'].user
        return super().create(validated_data)
