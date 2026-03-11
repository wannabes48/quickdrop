from celery import shared_task
from django.db import transaction
from .models import Delivery
from users.models import Earnings

@shared_task
def calculate_and_save_earnings(delivery_id):
    try:
        delivery = Delivery.objects.get(id=delivery_id)
        if delivery.status != 'DELIVERED':
            return "Delivery not completed"
            
        with transaction.atomic():
            # Check if earnings already calculated for this delivery to prevent duplicates
            if Earnings.objects.filter(delivery=delivery).exists():
                return "Earnings already calculated"
                
            worker = delivery.assigned_driver
            if not worker:
                return "No worker assigned"
                
            # Calculation logic: base amount or percentage of delivery.amount
            # For this example, let's say worker earns 80% of the delivery amount
            earning_amount = float(delivery.amount) * 0.8
            
            Earnings.objects.create(
                worker=worker,
                delivery=delivery,
                amount=earning_amount,
                earning_type='DELIVERY',
                description=f'Earnings for delivery {delivery.order_id}'
            )
            return f"Earnings calculated for delivery {delivery_id}"
    except Delivery.DoesNotExist:
        return "Delivery not found"
