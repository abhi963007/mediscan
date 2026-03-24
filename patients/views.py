from rest_framework import viewsets, filters
from rest_framework.response import Response
from .models import Patient, Consultation, Prescription
from .serializers import PatientSerializer, ConsultationSerializer, PrescriptionSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['full_name', 'uhid', 'phone']

class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all().order_by('-consultation_date')
    serializer_class = ConsultationSerializer

class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
