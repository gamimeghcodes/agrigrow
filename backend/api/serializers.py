from rest_framework import serializers
from .models import User, Listing, Scheme

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'mobile', 'state', 'district', 'land_size', 'crops', 'category', 'name']

    def get_name(self, obj):
        return obj.get_full_name().strip() or obj.username

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'mobile', 'state', 'district', 'name']

    def create(self, validated_data):
        name = validated_data.pop('name', '')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'farmer'),
            mobile=validated_data.get('mobile', ''),
            state=validated_data.get('state', ''),
            district=validated_data.get('district', ''),
            first_name=name
        )
        return user

class ListingSerializer(serializers.ModelSerializer):
    farmer_name = serializers.ReadOnlyField(source='farmer.username')
    farmer_location = serializers.SerializerMethodField()
    farmer_mobile = serializers.ReadOnlyField(source='farmer.mobile')

    class Meta:
        model = Listing
        fields = '__all__'
        read_only_fields = ('farmer', 'created_at')

    def get_farmer_location(self, obj):
        if obj.farmer.district and obj.farmer.state:
            return f"{obj.farmer.district}, {obj.farmer.state}"
        return obj.farmer.state or obj.farmer.district or "Unknown location"

class SchemeSerializer(serializers.ModelSerializer):
    match_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Scheme
        fields = '__all__'

    def get_match_percentage(self, obj):
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            return 0
            
        user = request.user
        eligibility = obj.eligibility
        
        # Start with a base percentage
        score = 0
        
        # 1. State match (40%)
        states = eligibility.get('states', ['All'])
        if 'All' in states or user.state in states:
            score += 40
            
        # 2. Land size match (30%)
        max_land_size = eligibility.get('max_land_size', 999.0)
        if user.land_size is not None and user.land_size <= max_land_size:
            score += 30
        elif user.land_size is None:
            # Give partial if unknown
            score += 15
            
        # 3. Crops match (30%)
        required_crops = eligibility.get('crops', ['All'])
        if 'All' in required_crops:
            score += 30
        else:
            user_crops = user.crops if isinstance(user.crops, list) else []
            # if user has any of the required crops
            if any(c in required_crops for c in user_crops):
                score += 30
                
        return score
