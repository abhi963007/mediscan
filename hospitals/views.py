from rest_framework import viewsets, generics, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Hospital, HospitalSettings, DoctorSlot, MedicineMaster
from .serializers import HospitalSerializer, HospitalSettingsSerializer, DoctorSlotSerializer, MedicineMasterSerializer


class HospitalViewSet(viewsets.ModelViewSet):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer

    def get_permissions(self):
        if self.action == 'create':
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


class MedicineMasterViewSet(viewsets.ModelViewSet):
    queryset = MedicineMaster.objects.all()
    serializer_class = MedicineMasterSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'category']
