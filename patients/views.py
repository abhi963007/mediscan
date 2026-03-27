from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Patient, Consultation, Prescription, PatientDocument
from .serializers import PatientSerializer, ConsultationSerializer, PrescriptionSerializer, PatientDocumentSerializer


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['full_name', 'uhid', 'phone']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient' and hasattr(user, 'patient_profile'):
            return Patient.objects.filter(uhid=user.patient_profile.uhid)
        return Patient.objects.all()

    def perform_destroy(self, instance):
        user = instance.user
        instance.delete()
        if user:
            user.delete()


class ConsultationViewSet(viewsets.ModelViewSet):
    serializer_class = ConsultationSerializer
    queryset = Consultation.objects.all().order_by('-consultation_date')

    def get_queryset(self):
        user = self.request.user
        qs = Consultation.objects.all().order_by('-consultation_date')
        
        # Patients only see their own consultations
        if user.role == 'patient' and hasattr(user, 'patient_profile'):
            qs = qs.filter(patient=user.patient_profile)
        # Doctors see consultations they conducted
        elif user.role == 'doctor':
            qs = qs.filter(doctor=user)
        # Staff see consultations for their hospital
        elif user.hospital:
            qs = qs.filter(hospital=user.hospital)

        patient_uhid = self.request.query_params.get('patient')
        if patient_uhid:
            qs = qs.filter(patient__uhid=patient_uhid)
        return qs


class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Prescription.objects.all().order_by('-prescribed_date')
        if user.role == 'patient' and hasattr(user, 'patient_profile'):
            qs = qs.filter(consultation__patient=user.patient_profile)
        elif user.role == 'doctor':
            qs = qs.filter(consultation__doctor=user)
        return qs


class PatientDocumentViewSet(viewsets.ModelViewSet):
    queryset = PatientDocument.objects.all()
    serializer_class = PatientDocumentSerializer

    def get_queryset(self):
        user = self.request.user
        qs = PatientDocument.objects.all().order_by('-upload_date')
        if user.role == 'patient' and hasattr(user, 'patient_profile'):
            qs = qs.filter(patient=user.patient_profile)
        return qs
