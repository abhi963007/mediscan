from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Appointment
from .serializers import AppointmentSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    queryset = Appointment.objects.all()  # Required for basename auto-detection
    filter_backends = [filters.SearchFilter]
    search_fields = ['patient__username', 'doctor__username', 'hospital__name']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return Appointment.objects.filter(patient=user).order_by('-appointment_date')
        elif user.role == 'doctor':
            return Appointment.objects.filter(doctor=user).order_by('-appointment_date')
        elif user.role in ['receptionist', 'hospital_admin']:
            return Appointment.objects.filter(hospital=user.hospital).order_by('-appointment_date')
        # global admin sees all
        return Appointment.objects.all().order_by('-appointment_date')


    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel(self, request, pk=None):
        appt = self.get_object()
        if appt.patient != request.user and request.user.role not in ['admin', 'receptionist']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        appt.status = 'cancelled'
        appt.save()
        return Response({'status': 'Appointment cancelled'})

    @action(detail=True, methods=['post'], url_path='pay')
    def pay(self, request, pk=None):
        appt = self.get_object()
        appt.payment_status = 'paid'
        appt.save()
        return Response({'status': 'Payment recorded'})

    @action(detail=False, methods=['get'], url_path='available-slots')
    def available_slots(self, request):
        """Returns booked slot count per date for a doctor in a hospital."""
        doctor_id = request.query_params.get('doctor')
        hospital_id = request.query_params.get('hospital')
        date = request.query_params.get('date')
        if not all([doctor_id, hospital_id, date]):
            return Response({'error': 'Provide doctor, hospital, date params'}, status=400)
        booked = Appointment.objects.filter(
            doctor_id=doctor_id,
            hospital_id=hospital_id,
            appointment_date=date
        ).exclude(status='cancelled').count()
        return Response({'date': date, 'booked_count': booked})
