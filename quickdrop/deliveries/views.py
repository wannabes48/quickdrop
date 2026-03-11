from django.shortcuts import get_object_or_404
from django.db import models
from django.db.models import Q
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from deliveries.models import Delivery
from deliveries.serializers import DeliverySerializer, JobSerializer

class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all().order_by('-created_at')
    serializer_class = DeliverySerializer

    def perform_create(self, serializer):
        # Add any additional logic needed when creating a delivery
        serializer.save()

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        delivery = self.get_object()
        new_status = request.data.get('status')
        notes = request.data.get('notes', '')

        if not new_status or new_status not in dict(Delivery.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        delivery.status = new_status
        if notes:
            delivery.delivery_notes = notes

        if new_status == 'DELIVERED':
            delivery.delivery_time = timezone.now()
            delivery.save()
            from .tasks import calculate_and_save_earnings
            calculate_and_save_earnings.delay(delivery.id)
            return Response(self.get_serializer(delivery).data)
            
        delivery.save()
        return Response(self.get_serializer(delivery).data)

    @action(detail=True, methods=['get'])
    def tracking_history(self, request, pk=None):
        delivery = self.get_object()
        # Mocking history since no tracking model exists yet
        return Response({
            'tracking_history': [{'status': delivery.status, 'timestamp': delivery.updated_at}]
        })

    @action(detail=True, methods=['get'])
    def payment_status(self, request, pk=None):
        """Lightweight endpoint polled by the PaymentOverlay every 3 seconds."""
        delivery = self.get_object()
        return Response({
            'payment_status': delivery.payment_status,
            'order_id': delivery.order_id,
        })


    @action(detail=False, methods=['get'])
    def stats(self, request):
        total = Delivery.objects.count()
        pending = Delivery.objects.filter(status='PENDING').count()
        in_transit = Delivery.objects.filter(status='IN_TRANSIT').count()
        delivered = Delivery.objects.filter(status='DELIVERED').count()
        failed = Delivery.objects.filter(status='FAILED').count()

        return Response({
            'total_deliveries': total,
            'pending_deliveries': pending,
            'in_transit_deliveries': in_transit,
            'completed_deliveries': delivered,
            'failed_deliveries': failed
        })

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        status_filter = request.query_params.get('status', '')
        
        queryset = self.get_queryset()
        
        if query:
            queryset = queryset.filter(
                models.Q(order_id__icontains=query) |
                models.Q(sender_name__icontains=query) |
                models.Q(recipient_name__icontains=query)
            )
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class JobViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.filter(status='PENDING').order_by('-created_at')
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.action == 'list':
            return self.queryset.filter(worker=None)
        return self.queryset

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        job = self.get_object()
        
        if job.worker is not None:
            return Response(
                {'error': 'Job already assigned'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        job.worker = request.user
        job.status = 'IN_TRANSIT'
        job.save()
        
        return Response({
            'success': True,
            'message': 'Job accepted successfully'
        })

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        job = self.get_object()
        new_status = request.data.get('status')

        if not new_status:
            return Response(
                {'error': 'Status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if job.worker != request.user:
            return Response(
                {'error': 'Not authorized to update this job'},
                status=status.HTTP_403_FORBIDDEN
            )

        if new_status == 'DELIVERED':
            job.status = new_status
            job.delivery_time = timezone.now()
            job.save()
            from .tasks import calculate_and_save_earnings
            calculate_and_save_earnings.delay(job.id)
            return Response({
                'success': True,
                'message': 'Job marked as delivered'
            })

        job.status = new_status
        job.save()
        return Response({
            'success': True,
            'message': 'Job status updated'
        })

class MpesaWebhookView(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def callback(self, request):
        data = request.data
        try:
            body = data.get('Body', {})
            stk_callback = body.get('stkCallback', {})
            result_code = stk_callback.get('ResultCode')
            result_desc = stk_callback.get('ResultDesc')
            
            # Add error handling for user cancellations or insufficient balances
            if result_code != 0:
                print(f"M-Pesa Payment Error: {result_desc} (Code: {result_code})")
                # e.g., result_code 1032 is user cancelled, 1037 timeout, 1 insufficient balance
                if result_code == 1032:
                    return Response({"ResultCode": 0, "ResultDesc": "Acknowledged User Cancelled"}, status=status.HTTP_200_OK)
                elif result_code == 1:
                    return Response({"ResultCode": 0, "ResultDesc": "Acknowledged Insufficient Balance"}, status=status.HTTP_200_OK)
                return Response({"ResultCode": 0, "ResultDesc": "Acknowledged error"}, status=status.HTTP_200_OK)
                
            # Success logic
            callback_metadata = stk_callback.get('CallbackMetadata', {}).get('Item', [])
            receipt_number = next((item.get('Value') for item in callback_metadata if item.get('Name') == 'MpesaReceiptNumber'), None)
            
            return Response({"ResultCode": 0, "ResultDesc": "Success"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
