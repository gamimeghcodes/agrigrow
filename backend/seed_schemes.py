import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Scheme

schemes = [
    {
        "title": "PM-KISAN",
        # "category" is not in Scheme model, wait, let me check Scheme model fields again. 
        # Ah, Scheme model fields: title, description, eligibility, benefits, deadline, link.
        # It does NOT have category.
        # Let's add category to the model if it's not there, but wait, I can just put it in eligibility json!
        "description": "Direct income support of ₹6,000 per year in three equal installments to eligible farmer families.",
        "benefits": "₹6,000/year direct benefit",
        "eligibility": {
            "category": "Income Support",
            "states": ["All"],
            "max_land_size": 5.0,
            "crops": ["All"]
        },
        "link": "https://pmkisan.gov.in/",
    },
    {
        "title": "PMFBY (Crop Insurance)",
        "description": "Pradhan Mantri Fasal Bima Yojana provides comprehensive crop insurance against natural calamities.",
        "benefits": "Subsidised premium, full sum insured",
        "eligibility": {
            "category": "Insurance",
            "states": ["All"],
            "max_land_size": 999.0,
            "crops": ["All"]
        },
        "link": "https://pmfby.gov.in/",
    },
    {
        "title": "Kisan Credit Card (KCC)",
        "description": "Short-term credit for cultivation, post-harvest expenses, and farm maintenance.",
        "benefits": "Credit up to ₹3 lakh at 4% interest",
        "eligibility": {
            "category": "Credit",
            "states": ["All"],
            "max_land_size": 999.0,
            "crops": ["All"]
        },
        "link": "https://sbi.co.in/web/agri-rural/agriculture-banking/crop-loan/kisan-credit-card",
    },
    {
        "title": "Soil Health Card Scheme",
        "description": "Provides soil nutrient status and fertilizer recommendations for each holding.",
        "benefits": "Free soil testing every 2 years",
        "eligibility": {
            "category": "Advisory",
            "states": ["All"],
            "max_land_size": 999.0,
            "crops": ["All"]
        },
        "link": "https://soilhealth.dac.gov.in/",
    },
    {
        "title": "PM Krishi Sinchai Yojana",
        "description": "Har Khet Ko Pani — expanding irrigation coverage and improving water use efficiency.",
        "benefits": "Up to 55% subsidy on micro-irrigation",
        "eligibility": {
            "category": "Irrigation",
            "states": ["All"],
            "max_land_size": 999.0,
            "crops": ["All"]
        },
        "link": "https://pmksy.gov.in/",
    },
    {
        "title": "e-NAM",
        "description": "National Agriculture Market — online trading platform for agricultural commodities.",
        "benefits": "Better price discovery, pan-India market",
        "eligibility": {
            "category": "Marketing",
            "states": ["All"],
            "max_land_size": 999.0,
            "crops": ["All"]
        },
        "link": "https://www.enam.gov.in/web/",
    },
    {
        "title": "Maharashtra Mahatma Jotirao Phule Shetkari Karjmukti",
        "description": "Debt waiver scheme exclusively for Maharashtra farmers having outstanding crop loans.",
        "benefits": "Debt waiver up to ₹2 Lakhs",
        "eligibility": {
            "category": "Credit",
            "states": ["Maharashtra"],
            "max_land_size": 5.0,
            "crops": ["All"]
        },
        "link": "https://mjpsky.maharashtra.gov.in/",
    }
]

def seed():
    if Scheme.objects.count() == 0:
        for s in schemes:
            Scheme.objects.create(**s)
        print("Seeded successfully!")
    else:
        print("Schemes already seeded.")

if __name__ == '__main__':
    seed()
