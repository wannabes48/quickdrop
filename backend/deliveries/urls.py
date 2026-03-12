from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DeliveryViewSet, JobViewSet, MpesaWebhookView

router = DefaultRouter()
router.register(r'deliveries', DeliveryViewSet, basename='delivery')
router.register(r'jobs', JobViewSet, basename='job')
router.register(r'mpesa', MpesaWebhookView, basename='mpesa')

urlpatterns = [
    path('', include(router.urls)),
]

