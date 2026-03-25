from rest_framework import serializers
from .models import Patient, Consultation, Prescription

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'
        read_only_fields = ('consultation',)

class ConsultationSerializer(serializers.ModelSerializer):
    prescriptions = PrescriptionSerializer(many=True, read_only=True)
    doctor_name = serializers.CharField(source='doctor.username', read_only=True)
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)

    class Meta:
        model = Consultation
        fields = '__all__'
        read_only_fields = ('doctor', 'hospital')
        
    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        validated_data['doctor'] = user
        validated_data['hospital'] = getattr(user, 'hospital', None)
        return super().create(validated_data)

class PatientSerializer(serializers.ModelSerializer):
    consultations = ConsultationSerializer(many=True, read_only=True)

    class Meta:
        model = Patient
        fields = '__all__'
