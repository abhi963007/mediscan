from rest_framework import viewsets, filters
from .models import Patient, Consultation, Prescription
from .serializers import PatientSerializer, ConsultationSerializer, PrescriptionSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['full_name', 'uhid', 'phone']

class ConsultationViewSet(viewsets.ModelViewSet):
    serializer_class = ConsultationSerializer
    queryset = Consultation.objects.all().order_by('-consultation_date')

    def get_queryset(self):
        qs = Consultation.objects.all().order_by('-consultation_date')
        patient = self.request.query_params.get('patient')
        if patient:
            qs = qs.filter(patient__uhid=patient)
        return qs

class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer

