from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientViewSet, ConsultationViewSet, PrescriptionViewSet, PatientDocumentViewSet

router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'consultations', ConsultationViewSet)
router.register(r'prescriptions', PrescriptionViewSet)
router.register(r'documents', PatientDocumentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
