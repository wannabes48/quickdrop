from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import Delivery

User = get_user_model()

# Ordered list of status steps for the delivery stepper
TRACKING_STEPS = [
    ('PENDING',    'Order Placed'),
    ('ASSIGNED',   'Courier Assigned'),
    ('PICKED_UP',  'Picked Up'),
    ('IN_TRANSIT', 'In Transit'),
    ('DELIVERED',  'Delivered'),
]

class DeliveryTrackingStepSerializer(serializers.Serializer):
    key = serializers.CharField()
    label = serializers.CharField()
    is_complete = serializers.BooleanField()
    is_current = serializers.BooleanField()


class DeliverySerializer(serializers.ModelSerializer):
    worker_name = serializers.SerializerMethodField()
    customer_name = serializers.SerializerMethodField()
    tracking_steps = serializers.SerializerMethodField()
    assigned_driver_name = serializers.SerializerMethodField()

    class Meta:
        model = Delivery
        fields = [
            'id', 'order_id', 'tracking_id',
            'status', 'payment_status', 'payment_method', 'amount',
            'created_at', 'updated_at', 'pickup_time', 'delivery_time',
            'pickup_location', 'delivery_location',
            'sender_name', 'sender_phone',
            'recipient_name', 'recipient_phone',
            'package_type', 'weight', 'delivery_notes',
            'customer', 'assigned_driver',
            'worker_name', 'customer_name', 'assigned_driver_name',
            'tracking_steps',
        ]
        read_only_fields = ['tracking_id', 'assigned_driver', 'delivery_time', 'tracking_steps']

    def get_worker_name(self, obj):
        if obj.assigned_driver:
            profile = getattr(obj.assigned_driver, 'userprofile', None)
            if profile:
                return f"{profile.first_name} {profile.last_name}".strip()
            return obj.assigned_driver.get_full_name() or obj.assigned_driver.username
        return None

    # alias kept for backwards compatibility
    def get_assigned_driver_name(self, obj):
        return self.get_worker_name(obj)

    def get_customer_name(self, obj):
        if obj.customer:
            profile = getattr(obj.customer, 'userprofile', None)
            if profile:
                return f"{profile.first_name} {profile.last_name}".strip()
            return obj.customer.get_full_name() or obj.customer.username
        return None

    def get_tracking_steps(self, obj):
        """Return a structured step list for the frontend stepper."""
        current_index = next(
            (i for i, (key, _) in enumerate(TRACKING_STEPS) if key == obj.status),
            0
        )
        return [
            {
                'key': key,
                'label': label,
                'is_complete': i < current_index,
                'is_current': i == current_index,
            }
            for i, (key, label) in enumerate(TRACKING_STEPS)
        ]


class JobSerializer(serializers.ModelSerializer):
    """Lightweight serializer for courier job listings."""
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Delivery
        fields = [
            'id', 'order_id', 'tracking_id', 'status', 'payment_method', 'amount',
            'pickup_location', 'delivery_location',
            'sender_name', 'recipient_name', 'package_type', 'weight',
            'customer_name',
        ]
        read_only_fields = ['tracking_id', 'status']

    def get_customer_name(self, obj):
        if obj.customer:
            profile = getattr(obj.customer, 'userprofile', None)
            if profile:
                return f"{profile.first_name} {profile.last_name}".strip()
            return obj.customer.get_full_name() or obj.customer.username
        return None

