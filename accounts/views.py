from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser
from .serializers import RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer, HospitalStaffSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class ProfileView(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class UnapprovedUsersView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_queryset(self):
        if self.request.user.role == 'admin' or self.request.user.is_superuser:
            return CustomUser.objects.filter(is_approved=False)
        return CustomUser.objects.none()

class ApproveUserView(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def update(self, request, *args, **kwargs):
        if request.user.role != 'admin' and not request.user.is_superuser:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        user = self.get_object()
        user.is_approved = True
        user.save()
        return Response({'status': 'Approved', 'user': user.username})

class CreateHospitalStaffView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = HospitalStaffSerializer

    def post(self, request, *args, **kwargs):
        # Only hospital admins can create staff
        if request.user.role != 'hospital_admin':
            return Response({'error': 'Permission denied. Only hospital admins can create staff.'}, status=status.HTTP_403_FORBIDDEN)
        
        # Ensure the hospital admin belongs to a hospital
        if not request.user.hospital:
            return Response({'error': 'Your account is not linked to any hospital.'}, status=status.HTTP_400_BAD_REQUEST)

        return super().post(request, *args, **kwargs)
from rest_framework.views import APIView
from django.db.models import Count, Sum
from hospitals.models import Hospital, MedicineMaster
from patients.models import Patient
from appointments.models import Appointment

class DashboardStatsView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        role = user.role
        stats = {}

        if role == 'admin' or user.is_superuser:
            stats = {
                'total_hospitals': Hospital.objects.count(),
                'pending_hospitals': Hospital.objects.filter(is_verified=False).count(),
                'total_patients': Patient.objects.count(),
                'total_medicines': MedicineMaster.objects.count(),
                'total_users': CustomUser.objects.count()
            }
        elif role == 'hospital_admin':
            hospital = user.hospital
            stats = {
                'doctor_count': CustomUser.objects.filter(hospital=hospital, role='doctor').count(),
                'staff_count': CustomUser.objects.filter(hospital=hospital, role='receptionist').count(),
                'total_appointments': Appointment.objects.filter(hospital=hospital).count(),
                'today_appointments': Appointment.objects.filter(hospital=hospital, appointment_date__date=from_django_utils_timezone_now().date()).count()
            }
        elif role == 'receptionist':
            hospital = user.hospital
            stats = {
                'today_appointments': Appointment.objects.filter(hospital=hospital, appointment_date__date=from_django_utils_timezone_now().date()).count(),
                'pending_checkins': Appointment.objects.filter(hospital=hospital, status='Booked', appointment_date__date=from_django_utils_timezone_now().date()).count()
            }
        elif role == 'doctor':
            stats = {
                'my_appointments_today': Appointment.objects.filter(doctor=user, appointment_date__date=from_django_utils_timezone_now().date()).count(),
                'patients_treated': Appointment.objects.filter(doctor=user, status='Completed').count() # Assuming status completed exists or we add it
            }
        elif role == 'patient':
            stats = {
                'my_appointments': Appointment.objects.filter(patient=user).count(),
                'last_visit': Appointment.objects.filter(patient=user).order_by('-appointment_date').first().appointment_date if Appointment.objects.filter(patient=user).exists() else None
            }

        return Response(stats)

# Helper for timezone now since it's used above
from django.utils import timezone as from_django_utils_timezone_now

