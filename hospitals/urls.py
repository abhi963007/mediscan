from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HospitalViewSet, HospitalSettingsView, DoctorSlotViewSet, MedicineMasterViewSet

router = DefaultRouter()
router.register(r'', HospitalViewSet, basename='hospital')
router.register(r'doctor-slots', DoctorSlotViewSet, basename='doctorslot')
router.register(r'medicines', MedicineMasterViewSet, basename='medicine')

urlpatterns = [
    path('', include(router.urls)),
    path('<int:hospital_pk>/settings/', HospitalSettingsView.as_view(), name='hospital-settings'),
]
