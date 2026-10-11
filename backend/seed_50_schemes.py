import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Scheme

# Core real schemes
core_schemes = [
    {
        "title": "PM-KISAN",
        "description": "Direct income support of ₹6,000 per year in three equal installments to eligible farmer families.",
        "benefits": "₹6,000/year direct benefit",
        "eligibility": {"category": "Income Support", "states": ["All"], "max_land_size": 5.0, "crops": ["All"]},
        "link": "https://pmkisan.gov.in/",
    },
    {
        "title": "PMFBY (Crop Insurance)",
        "description": "Pradhan Mantri Fasal Bima Yojana provides comprehensive crop insurance against natural calamities.",
        "benefits": "Subsidised premium, full sum insured",
        "eligibility": {"category": "Insurance", "states": ["All"], "max_land_size": 999.0, "crops": ["All"]},
        "link": "https://pmfby.gov.in/",
    },
    {
        "title": "Kisan Credit Card (KCC)",
        "description": "Short-term credit for cultivation, post-harvest expenses, and farm maintenance.",
        "benefits": "Credit up to ₹3 lakh at 4% interest",
        "eligibility": {"category": "Credit", "states": ["All"], "max_land_size": 999.0, "crops": ["All"]},
        "link": "https://sbi.co.in/web/agri-rural/agriculture-banking/crop-loan/kisan-credit-card",
    },
    {
        "title": "Soil Health Card Scheme",
        "description": "Provides soil nutrient status and fertilizer recommendations for each holding.",
        "benefits": "Free soil testing every 2 years",
        "eligibility": {"category": "Advisory", "states": ["All"], "max_land_size": 999.0, "crops": ["All"]},
        "link": "https://soilhealth.dac.gov.in/",
    },
    {
        "title": "PM Krishi Sinchai Yojana",
        "description": "Har Khet Ko Pani — expanding irrigation coverage and improving water use efficiency.",
        "benefits": "Up to 55% subsidy on micro-irrigation",
        "eligibility": {"category": "Irrigation", "states": ["All"], "max_land_size": 999.0, "crops": ["All"]},
        "link": "https://pmksy.gov.in/",
    },
    {
        "title": "e-NAM",
        "description": "National Agriculture Market — online trading platform for agricultural commodities.",
        "benefits": "Better price discovery, pan-India market",
        "eligibility": {"category": "Marketing", "states": ["All"], "max_land_size": 999.0, "crops": ["All"]},
        "link": "https://www.enam.gov.in/web/",
    },
    {
        "title": "Maharashtra Mahatma Jotirao Phule Shetkari Karjmukti",
        "description": "Debt waiver scheme exclusively for Maharashtra farmers having outstanding crop loans.",
        "benefits": "Debt waiver up to ₹2 Lakhs",
        "eligibility": {"category": "Credit", "states": ["Maharashtra"], "max_land_size": 5.0, "crops": ["All"]},
        "link": "https://mjpsky.maharashtra.gov.in/",
    },
    {
        "title": "Paramparagat Krishi Vikas Yojana (PKVY)",
        "description": "Promotes organic farming through cluster approach and PGS certification.",
        "benefits": "₹50,000/ha subsidy for 3 years",
        "eligibility": {"category": "Organic Farming", "states": ["All"], "max_land_size": 999.0, "crops": ["All"]},
        "link": "https://pgsindia-ncof.gov.in/",
    },
    {
        "title": "National Mission on Sustainable Agriculture (NMSA)",
        "description": "Focuses on promoting sustainable agriculture practices especially in rainfed areas.",
        "benefits": "Financial aid for sustainable practices",
        "eligibility": {"category": "Advisory", "states": ["All"], "max_land_size": 999.0, "crops": ["All"]},
        "link": "https://nmsa.dac.gov.in/",
    },
    {
        "title": "PM-KUSUM (Solar Pumps)",
        "description": "Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan for setting up solar pumps.",
        "benefits": "60% subsidy on solar pumps",
        "eligibility": {"category": "Machinery", "states": ["All"], "max_land_size": 999.0, "crops": ["All"]},
        "link": "https://pmkusum.mnre.gov.in/",
    },
]

# Generate more schemes programmatically to reach 55+
states_list = [
    "Maharashtra", "Karnataka", "Punjab", "Uttar Pradesh", "Gujarat", "Tamil Nadu",
    "Madhya Pradesh", "Rajasthan", "Andhra Pradesh", "West Bengal", "Bihar", "Haryana"
]

crops_list = ["Wheat", "Rice", "Cotton", "Sugarcane", "Soybean", "Groundnut", "Onion", "Tomato", "Potato", "Maize"]
categories = ["Subsidies", "Machinery", "Irrigation", "Insurance", "Credit", "Processing", "Organic Farming", "Marketing"]

generated_schemes = []

adjectives = ["State", "Regional", "Chief Minister's", "Special", "Rural", "Agri-Tech", "Green"]
nouns = ["Development", "Support", "Subsidy", "Assistance", "Empowerment", "Growth", "Welfare"]

# Generate 45 state-specific and crop-specific schemes
for i in range(45):
    state = random.choice(states_list)
    crop = random.choice(crops_list)
    category = random.choice(categories)
    adj = random.choice(adjectives)
    noun = random.choice(nouns)
    
    is_state_specific = random.random() > 0.3
    is_crop_specific = random.random() > 0.5
    
    title_parts = [state if is_state_specific else "National", adj, crop if is_crop_specific else "Kisan", noun, "Scheme", f"Phase {random.randint(1,4)}"]
    title = " ".join(title_parts)
    
    description = f"A targeted initiative focusing on enhancing {category.lower()} for farmers."
    if is_state_specific:
        description += f" Exclusively available for residents of {state}."
    if is_crop_specific:
        description += f" Designed specifically for {crop} cultivators."
        
    benefit_val = random.choice(["₹10,000 grant", "50% equipment subsidy", "Interest free loan", "Free seeds & fertilizers", "Premium coverage"])
    
    eligibility = {
        "category": category,
        "states": [state] if is_state_specific else ["All"],
        "max_land_size": random.choice([2.5, 5.0, 10.0, 999.0]),
        "crops": [crop] if is_crop_specific else ["All"]
    }
    
    generated_schemes.append({
        "title": title,
        "description": description,
        "benefits": benefit_val,
        "eligibility": eligibility,
        "link": "https://agricoop.nic.in/"
    })

all_schemes = core_schemes + generated_schemes

def seed():
    print("Clearing existing schemes...")
    Scheme.objects.all().delete()
    
    print(f"Seeding {len(all_schemes)} schemes...")
    for s in all_schemes:
        Scheme.objects.create(**s)
    print("Seeding complete!")

if __name__ == '__main__':
    seed()
