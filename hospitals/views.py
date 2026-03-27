from rest_framework import viewsets, generics, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Hospital, HospitalSettings, DoctorSlot, Medicine, MedicineStock, DoctorSchedule, DoctorLeave
from .serializers import (
    HospitalSerializer, HospitalSettingsSerializer, DoctorSlotSerializer, 
    MedicineSerializer, MedicineStockSerializer, DoctorScheduleSerializer, DoctorLeaveSerializer
)
from rest_framework.pagination import PageNumberPagination


class HospitalViewSet(viewsets.ModelViewSet):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer

    def get_permissions(self):
        if self.action in ['create', 'list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    @action(detail=True, methods=['post'], url_path='approve')
    def approve(self, request, pk=None):
        if request.user.role not in ['admin'] and not request.user.is_superuser:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        hospital = self.get_object()
        hospital.is_verified = True
        hospital.save()
        # Ensure settings exist
        HospitalSettings.objects.get_or_create(hospital=hospital)
        return Response({'status': 'Hospital verified successfully'})

    @action(detail=False, methods=['get', 'patch'], url_path='my-settings')
    def my_settings(self, request):
        if not request.user.hospital:
            return Response({'error': 'No hospital linked to your account'}, status=status.HTTP_400_BAD_REQUEST)
        
        settings, _ = HospitalSettings.objects.get_or_create(hospital=request.user.hospital)
        if request.method == 'PATCH':
            serializer = HospitalSettingsSerializer(settings, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = HospitalSettingsSerializer(settings)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='my-slots')
    def my_slots(self, request):
        if not request.user.hospital:
            return Response({'error': 'No hospital linked to your account'}, status=status.HTTP_400_BAD_REQUEST)
        
        slots = DoctorSlot.objects.filter(hospital=request.user.hospital)
        serializer = DoctorSlotSerializer(slots, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='hospital-slots', permission_classes=[AllowAny])
    def hospital_slots(self, request, pk=None):
        hospital = self.get_object()
        slots = DoctorSlot.objects.filter(hospital=hospital)
        serializer = DoctorSlotSerializer(slots, many=True)
        return Response(serializer.data)


class HospitalSettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = HospitalSettingsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        hospital_id = self.kwargs.get('hospital_pk')
        return HospitalSettings.objects.get(hospital_id=hospital_id)


class DoctorSlotViewSet(viewsets.ModelViewSet):
    queryset = DoctorSlot.objects.all()
    serializer_class = DoctorSlotSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['doctor', 'hospital']

    def get_queryset(self):
        user = self.request.user
        queryset = DoctorSlot.objects.all()
        if user.is_authenticated and user.hospital:
            queryset = queryset.filter(hospital=user.hospital)
        
        doctor_id = self.request.query_params.get('doctor')
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
            
        return queryset

    def perform_create(self, serializer):
        if self.request.user.hospital:
            serializer.save(hospital=self.request.user.hospital)
        else:
            serializer.save()


class DoctorScheduleViewSet(viewsets.ModelViewSet):
    queryset = DoctorSchedule.objects.all()
    serializer_class = DoctorScheduleSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['doctor', 'hospital']

    def get_queryset(self):
        user = self.request.user
        queryset = DoctorSchedule.objects.all()
        
        if user.role == 'doctor':
            queryset = queryset.filter(doctor=user)
        elif user.role in ['hospital_admin', 'receptionist'] and user.hospital:
            queryset = queryset.filter(hospital=user.hospital)

        doctor_id = self.request.query_params.get('doctor')
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
            
        return queryset

    def perform_create(self, serializer):
        if self.request.user.role == 'doctor':
            serializer.save(doctor=self.request.user)
        else:
            serializer.save()


class DoctorLeaveViewSet(viewsets.ModelViewSet):
    queryset = DoctorLeave.objects.all()
    serializer_class = DoctorLeaveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'doctor':
            return DoctorLeave.objects.filter(doctor=user)
        elif user.role in ['hospital_admin', 'admin', 'superuser']:
            return DoctorLeave.objects.all()
        return DoctorLeave.objects.none()

    @action(detail=True, methods=['post'], url_path='approve-leave')
    def approve_leave(self, request, pk=None):
        if request.user.role not in ['hospital_admin', 'admin'] and not request.user.is_superuser:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        leave = self.get_object()
        leave.is_approved = True
        leave.approved_by = request.user
        leave.save()
        return Response({'status': 'Leave request approved successfully'})


class MedicinePagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100


class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all().order_by('name')
    serializer_class = MedicineSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'category', 'generic_name', 'brand_name']
    pagination_class = MedicinePagination

    def perform_create(self, serializer):
        serializer.save(added_by=self.request.user)


class MedicineStockViewSet(viewsets.ModelViewSet):
    queryset = MedicineStock.objects.all()
    serializer_class = MedicineStockSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.hospital:
            return MedicineStock.objects.filter(hospital=user.hospital)
        return MedicineStock.objects.all()
