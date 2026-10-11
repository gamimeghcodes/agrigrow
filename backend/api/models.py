from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
class User(AbstractUser):
    ROLE_CHOICES = (
        ('farmer', 'Farmer'),
        ('buyer', 'Buyer'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='farmer')
    mobile = models.CharField(max_length=15, blank=True, null=True)
    state = models.CharField(max_length=50, blank=True, null=True)
    district = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=20, default='Deactive')
    # Farmer specific
    land_size = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0.0)]) # in acres
    crops = models.JSONField(default=list, blank=True)
    # Buyer specific
    category = models.CharField(max_length=50, blank=True, null=True)

class Listing(models.Model):
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    crop = models.CharField(max_length=100)
    quantity = models.FloatField(validators=[MinValueValidator(0.1)]) # in quintals
    price = models.FloatField(validators=[MinValueValidator(0.0)]) # per quintal
    harvest_date = models.DateField()
    grade = models.CharField(max_length=20, default='A')
    description = models.TextField(blank=True, null=True)
    image_data = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='active')

    def __str__(self):
        return f"{self.crop} by {self.farmer.username}"

class Scheme(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    eligibility = models.JSONField(default=dict, blank=True)
    benefits = models.TextField()
    deadline = models.DateField(blank=True, null=True)
    link = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title
    
class MarketPrice(models.Model):
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    market = models.CharField(max_length=150)

    commodity = models.CharField(max_length=100)
    variety = models.CharField(max_length=100, blank=True)
    grade = models.CharField(max_length=50, blank=True)

    min_price = models.DecimalField(max_digits=10, decimal_places=2)
    max_price = models.DecimalField(max_digits=10, decimal_places=2)
    modal_price = models.DecimalField(max_digits=10, decimal_places=2)

    arrival_date = models.DateField()

    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["commodity", "market"]

    def __str__(self):
        return f"{self.commodity} - {self.market} ({self.state})"
