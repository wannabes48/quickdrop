from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q, Avg, Sum
from django.db import transaction
from django.utils import timezone
from .forms import UserRegisterForm
from .models import UserProfile, Earnings
from deliveries.models import Delivery
import json
from decimal import Decimal
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_http_methods

def api_root(request):
    """Basic root endpoint to confirm API is running"""
    return JsonResponse({"message": "QuickDrop API is running. Access the frontend at http://localhost:5173", "status": "ok"})

def get_csrf(request):
    """Endpoint for React frontend to fetch a CSRF token"""
    return JsonResponse({'csrfToken': get_token(request)})

def api_current_user(request):
    """Endpoint for React frontend to fetch the authenticated user session"""
    if request.user.is_authenticated:
        try:
            profile = request.user.userprofile
            return JsonResponse({
                'isAuthenticated': True,
                'user': {
                    'id': request.user.id,
                    'username': request.user.username,
                    'email': request.user.email,
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name,
                    'role': profile.user_type, # 'customer' or 'worker'
                    'vehicle_type': dict(UserProfile.VEHICLE_TYPE_CHOICES).get(profile.vehicle_type, '') if profile.vehicle_type else None,
                    'phone': profile.phone_number,
                    'address': profile.address
                }
            })
        except Exception as e:
            return JsonResponse({'isAuthenticated': False, 'error': str(e)}, status=500)
    else:
        return JsonResponse({'isAuthenticated': False}, status=401)

@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body) if request.content_type == 'application/json' else request.POST
            form = UserRegisterForm(data)
            if form.is_valid():
                try:
                    with transaction.atomic():
                        # Create User instance
                        user = form.save()
                        user.email = form.cleaned_data['email']
                        user.first_name = form.cleaned_data['first_name']
                        user.last_name = form.cleaned_data['last_name']
                        user.save()

                        # Update or create UserProfile
                        profile = UserProfile(user=user)
                        profile.first_name = form.cleaned_data['first_name']
                        profile.last_name = form.cleaned_data['last_name']
                        profile.phone_number = form.cleaned_data['phone_number']
                        profile.address = form.cleaned_data['address']
                        profile.user_type = form.cleaned_data['user_type']
                        if form.cleaned_data['user_type'] == 'worker':
                            profile.vehicle_type = form.cleaned_data['vehicle_type']
                        profile.save()

                        # Log the user in
                        login(request, user)
                        return JsonResponse({"message": "Registration successful"})
                except Exception as e:
                    return JsonResponse({"error": str(e)}, status=500)
            else:
                errors = {field: error[0] for field, error in form.errors.items()}
                return JsonResponse({"error": "Validation failed", "errors": errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid request format"}, status=400)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
def user_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body) if request.content_type == 'application/json' else request.POST
            username = data.get('username', '')
            password = data.get('password', '')
            remember_me = data.get('remember_me', False)

            if not username or not password:
                return JsonResponse({"error": "Username and password are required."}, status=400)

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                if not remember_me:
                    request.session.set_expiry(0)
                return JsonResponse({}, status=200)
            else:
                return JsonResponse({"error": "Invalid credentials"}, status=401)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)

@login_required
@require_http_methods(["POST"])
def user_logout(request):
    logout(request)
    return JsonResponse({"success": "You have been logged out successfully."})

@login_required
@require_http_methods(["POST"])
@csrf_protect
def update_profile(request):
    try:
        data = json.loads(request.body)
        user = request.user

        # Update basic info
        if 'email' in data:
            try:
                validate_email(data['email'])
                if User.objects.exclude(pk=user.pk).filter(email=data['email']).exists():
                    return JsonResponse({'error': 'Email already in use'}, status=400)
                user.email = data['email']
            except ValidationError:
                return JsonResponse({'error': 'Invalid email format'}, status=400)

        if 'first_name' in data:
            user.first_name = data['first_name']
            user.userprofile.first_name = data['first_name']

        if 'last_name' in data:
            user.last_name = data['last_name']
            user.userprofile.last_name = data['last_name']

        # Update profile info
        profile = user.userprofile
        if 'phone_number' in data:
            profile.phone_number = data['phone_number']

        if 'address' in data:
            profile.address = data['address']

        if 'vehicle_type' in data and profile.user_type == 'worker':
            profile.vehicle_type = data['vehicle_type']

        # Save changes
        user.save()
        profile.save()

        return JsonResponse({'success': 'Profile updated successfully'})
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
