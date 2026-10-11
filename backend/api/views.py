from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

from .serializers import UserSerializer, RegisterSerializer, ListingSerializer, SchemeSerializer
from .crop_data import CROPS_DB
from .models import User, Listing, Scheme
from .permissions import IsAdminRole
class AuthViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'], url_path='send-otp')
    def send_otp(self, request):
        mobile = request.data.get('mobile')
        if not mobile:
            return Response({'error': 'Mobile number required'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'OTP sent successfully'})

    @action(detail=False, methods=['post'], url_path='verify-otp')
    def verify_otp(self, request):
        mobile = request.data.get('mobile')
        otp = request.data.get('otp')
        
        if not mobile or not otp:
            return Response({'error': 'Mobile and OTP required'}, status=status.HTTP_400_BAD_REQUEST)
            
        if len(otp) != 6:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=mobile)
            user.status = 'Active'
            user.save(update_fields=['status'])
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'is_registered': True,
                'token': token.key,
                'user': UserSerializer(user).data
            })
        except User.DoesNotExist:
            return Response({
                'is_registered': False,
                'message': 'User not found. Please register.'
            })
        
    @action(detail=False, methods=['post'], url_path='check-user')
    def check_user(self, request):
        username = (request.data.get('username') or '').strip()
        mobile = (request.data.get('mobile') or '').strip()
        
        if username and User.objects.filter(username__iexact=username).exists():
            return Response({'exists': True, 'message': 'User with this username already exists. Please login instead.'})
            
        if mobile and User.objects.filter(mobile=mobile).exists():
            return Response({'exists': True, 'message': 'An account with this mobile number already exists. Please login instead.'})

        return Response({'exists': False})

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        role = request.data.get('role')

        if not username or not password:
            return Response(
                {'error': 'Username and password required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if role and user.role != role:
            return Response(
                {'error': f'This account is not registered as {role}.'},
                status=status.HTTP_403_FORBIDDEN
            )

        user.status = 'Active'
        user.save(update_fields=['status'])

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })

    

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.status = 'Active'
            user.save(update_fields=['status'])
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def logout(self, request):
        if request.user and request.user.is_authenticated:
            request.user.status = 'Deactive'
            request.user.save(update_fields=['status'])
            Token.objects.filter(user=request.user).delete()
        return Response({'message': 'Logged out successfully'})

class ListingViewSet(viewsets.ModelViewSet):
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Listing.objects.all().order_by('-created_at')
        farmer_id = self.request.query_params.get('farmer_id', None)
        my_listings = self.request.query_params.get('my_listings', None)
        if farmer_id is not None:
            queryset = queryset.filter(farmer__id=farmer_id)
        elif my_listings == 'true' and self.request.user.is_authenticated:
            queryset = queryset.filter(farmer=self.request.user)
        return queryset

    def perform_create(self, serializer):
        serializer.save(farmer=self.request.user)

class SchemeViewSet(viewsets.ModelViewSet):
    queryset = Scheme.objects.all()
    serializer_class = SchemeSerializer
    permission_classes = [permissions.AllowAny]

import os

class CropRecommendationViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        import joblib
        import pandas as pd
        
        try:
            # Get features
            N = float(request.data.get('N', 0))
            P = float(request.data.get('P', 0))
            K = float(request.data.get('K', 0))
            temp = float(request.data.get('temp', 0))
            humidity = float(request.data.get('humidity', 0))
            ph = float(request.data.get('ph', 0))
            rainfall = float(request.data.get('rainfall', 0))

            # Load model
            model_path = os.path.join(os.path.dirname(__file__), 'ml', 'crop_model.joblib')
            model = joblib.load(model_path)

            # Predict
            features = pd.DataFrame([[N, P, K, temp, humidity, ph, rainfall]], columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])
            probs = model.predict_proba(features)[0]
            classes = model.classes_

            # Sort probabilities
            sorted_indices = probs.argsort()[::-1][:3]
            
            results = []
            for idx in sorted_indices:
                crop_label = classes[idx]
                score = int(probs[idx] * 100)
                
                # Fetch advice from CROPS_DB if available
                advice = "Great conditions for this crop."
                for c in CROPS_DB:
                    if c['crop'].lower() == crop_label.lower():
                        advice = c['advice']
                        break
                        
                results.append({
                    'crop': crop_label.capitalize(),
                    'score': score,
                    'advice': advice
                })

            return Response(results)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from decouple import config
import requests
from datetime import datetime

from .models import MarketPrice


class MarketPriceViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=["get"])
    def fetch(self, request):
        state = request.query_params.get("state", "Maharashtra")

        api_key = config("DATA_GOV_API_KEY", default="")
        if api_key:
            try:
                url = (
                    "https://api.data.gov.in/resource/"
                    "9ef84268-d588-465a-a308-a864a43d0070"
                    f"?api-key={api_key}"
                    "&format=json"
                    f"&filters[state]={state}"
                    "&limit=1000"
                )
                response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    records = data.get("records", [])
                    if records:
                        formatted_records = []
                        for item in records:
                            formatted_records.append({
                                "state": item.get("state", ""),
                                "district": item.get("district", ""),
                                "market": item.get("market", ""),
                                "commodity": item.get("commodity", ""),
                                "variety": item.get("variety", ""),
                                "grade": item.get("grade", ""),
                                "arrival_date": item.get("arrival_date", ""),
                                "min_price": float(item.get("min_price") or 0),
                                "max_price": float(item.get("max_price") or 0),
                                "modal_price": float(item.get("modal_price") or 0),
                            })
                        
                        return Response({
                            "count": len(formatted_records),
                            "records": formatted_records,
                            "last_updated": datetime.now().isoformat(),
                        })
            except Exception:
                pass

        queryset = MarketPrice.objects.filter(state=state).order_by(
            "district",
            "market",
            "commodity"
        )

        if not queryset.exists():
            return Response(
                {
                    "records": [],
                    "message": f"No cached data available for {state}."
                },
                status=status.HTTP_200_OK,
            )

        records = []

        for item in queryset:
            records.append(
                {
                    "state": item.state,
                    "district": item.district,
                    "market": item.market,
                    "commodity": item.commodity,
                    "variety": item.variety,
                    "grade": item.grade,
                    "arrival_date": item.arrival_date.strftime("%d/%m/%Y"),
                    "min_price": float(item.min_price),
                    "max_price": float(item.max_price),
                    "modal_price": float(item.modal_price),
                }
            )

        return Response(
            {
                "count": len(records),
                "records": records,
                "last_updated": queryset.first().last_updated,
            }
        )
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated

class AdminDashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminRole]

    def list(self, request):
        return Response({
            "total_farmers": User.objects.filter(role="farmer").count(),
            "total_buyers": User.objects.filter(role="buyer").count(),
            "total_listings": Listing.objects.count(),
            "total_schemes": Scheme.objects.count(),
        })
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class AdminUsersViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminRole]

    def list(self, request):
        users = User.objects.all()

        data = []

        for user in users:
            data.append({
                "id": user.id,
                "username": user.username,
                "name": (user.get_full_name().strip() or user.username),
                "role": user.role,
                "state": user.state or ("Gujarat" if user.role.lower() == "admin" else ""),
                "district": user.district or ("Ahmedabad" if user.role.lower() == "admin" else ""),
                "email": user.email,
                "status": user.status,
            })

        return Response(data)

    def destroy(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
            if user.role.lower() == "admin" or user.is_superuser:
                return Response({"error": "Admin accounts cannot be deleted."}, status=status.HTTP_400_BAD_REQUEST)
            user.delete()
            return Response({"message": "User deleted successfully."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
class RecentActivityViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminRole]

    def list(self, request):

        activity = []

        users = User.objects.order_by("-id")[:5]

        for user in users:
            activity.append({
                "type": "user",
                "message": f"{user.username} registered as {user.role}",
            })

        listings = Listing.objects.order_by("-id")[:5]

        for listing in listings:
            activity.append({
                "type": "listing",
                "message": f"{listing.crop} listed by {listing.farmer.username}",
            })

        schemes = Scheme.objects.order_by("-id")[:5]

        for scheme in schemes:
            activity.append({
                "type": "scheme",
                "message": f"{scheme.title} added",
            })

        activity = activity[:10]

        return Response(activity)