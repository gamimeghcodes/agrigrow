from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AuthViewSet,
    ListingViewSet,
    SchemeViewSet,
    CropRecommendationViewSet,
    MarketPriceViewSet,
    AdminDashboardViewSet,
    AdminUsersViewSet,
)
from .views import RecentActivityViewSet
router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'listings', ListingViewSet, basename='listings')
router.register(r'schemes', SchemeViewSet)
router.register(r'crop-recommend', CropRecommendationViewSet, basename='crop-recommend')
router.register(r'market-prices', MarketPriceViewSet, basename='market-prices')
router.register(r'admin-dashboard', AdminDashboardViewSet, basename='admin-dashboard')
router.register(r'admin-users', AdminUsersViewSet, basename='admin-users')
router.register(
    r"recent-activity",
    RecentActivityViewSet,
    basename="recent-activity",
)
urlpatterns = [
    path('', include(router.urls)),
]
