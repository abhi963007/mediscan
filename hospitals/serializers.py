from rest_framework import serializers
from .models import Hospital, HospitalSettings, DoctorSlot, MedicineMaster


class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = '__all__'
        read_only_fields = ('is_verified', 'created_at')


class HospitalSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = HospitalSettings
        fields = '__all__'


class DoctorSlotSerializer(serializers.ModelSerializer):
    doctor_username = serializers.CharField(source='doctor.username', read_only=True)

    class Meta:
        model = DoctorSlot
        fields = '__all__'


class MedicineMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicineMaster
        fields = '__all__'
