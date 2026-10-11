CROPS_DB = [
    # CEREALS & MILLETS
    {
        'crop': 'Wheat',
        'ideal_soil': ['loamy', 'alluvial', 'clay'],
        'ideal_rain_min': 400, 'ideal_rain_max': 600,
        'ideal_temp_min': 15, 'ideal_temp_max': 20,
        'ideal_ph_min': 6.0, 'ideal_ph_max': 7.0,
        'advice': 'Rabi crop. Requires cool weather during vegetative growth and warm weather during maturity.'
    },
    {
        'crop': 'Rice',
        'ideal_soil': ['clay', 'alluvial'],
        'ideal_rain_min': 1000, 'ideal_rain_max': 2000,
        'ideal_temp_min': 20, 'ideal_temp_max': 30,
        'ideal_ph_min': 5.5, 'ideal_ph_max': 6.5,
        'advice': 'Water-intensive crop. Requires standing water during early growth stages.'
    },
    {
        'crop': 'Maize',
        'ideal_soil': ['loamy', 'red', 'alluvial'],
        'ideal_rain_min': 500, 'ideal_rain_max': 800,
        'ideal_temp_min': 21, 'ideal_temp_max': 27,
        'ideal_ph_min': 5.5, 'ideal_ph_max': 7.5,
        'advice': 'Versatile crop, sensitive to waterlogging. Ensure good drainage.'
    },
    {
        'crop': 'Bajra (Pearl Millet)',
        'ideal_soil': ['sandy', 'loamy'],
        'ideal_rain_min': 300, 'ideal_rain_max': 500,
        'ideal_temp_min': 25, 'ideal_temp_max': 35,
        'ideal_ph_min': 6.0, 'ideal_ph_max': 8.0,
        'advice': 'Highly drought tolerant. Ideal for arid and semi-arid regions.'
    },
    {
        'crop': 'Jowar (Sorghum)',
        'ideal_soil': ['black', 'red', 'loamy'],
        'ideal_rain_min': 400, 'ideal_rain_max': 600,
        'ideal_temp_min': 26, 'ideal_temp_max': 33,
        'ideal_ph_min': 5.5, 'ideal_ph_max': 8.5,
        'advice': 'Hardy crop. Can withstand drought and high temperatures.'
    },
    {
        'crop': 'Ragi (Finger Millet)',
        'ideal_soil': ['red', 'loamy', 'sandy'],
        'ideal_rain_min': 700, 'ideal_rain_max': 1200,
        'ideal_temp_min': 20, 'ideal_temp_max': 30,
        'ideal_ph_min': 4.5, 'ideal_ph_max': 7.5,
        'advice': 'Rich in calcium. Grown mostly in southern states as a rainfed crop.'
    },
    {
        'crop': 'Barley',
        'ideal_soil': ['sandy', 'loamy', 'alluvial'],
        'ideal_rain_min': 300, 'ideal_rain_max': 500,
        'ideal_temp_min': 12, 'ideal_temp_max': 18,
        'ideal_ph_min': 6.0, 'ideal_ph_max': 8.0,
        'advice': 'Rabi crop. Requires less water than wheat and tolerates salinity well.'
    },

    # PULSES
    {
        'crop': 'Tur (Pigeon Pea)',
        'ideal_soil': ['red', 'black', 'loamy'],
        'ideal_rain_min': 600, 'ideal_rain_max': 1000,
        'ideal_temp_min': 20, 'ideal_temp_max': 30,
        'ideal_ph_min': 5.0, 'ideal_ph_max': 8.0,
        'advice': 'Deep-rooted crop. Susceptible to waterlogging.'
    },
    {
        'crop': 'Moong (Green Gram)',
        'ideal_soil': ['loamy', 'sandy', 'black'],
        'ideal_rain_min': 400, 'ideal_rain_max': 600,
        'ideal_temp_min': 25, 'ideal_temp_max': 35,
        'ideal_ph_min': 6.5, 'ideal_ph_max': 7.5,
        'advice': 'Short duration crop (60-70 days). Excellent for crop rotation.'
    },
    {
        'crop': 'Urad (Black Gram)',
        'ideal_soil': ['black', 'loamy', 'red'],
        'ideal_rain_min': 400, 'ideal_rain_max': 800,
        'ideal_temp_min': 25, 'ideal_temp_max': 35,
        'ideal_ph_min': 6.5, 'ideal_ph_max': 7.5,
        'advice': 'Kharif/Rabi crop. Improves soil fertility through nitrogen fixation.'
    },
    {
        'crop': 'Chana (Chickpea)',
        'ideal_soil': ['loamy', 'clay', 'black'],
        'ideal_rain_min': 400, 'ideal_rain_max': 600,
        'ideal_temp_min': 20, 'ideal_temp_max': 25,
        'ideal_ph_min': 5.5, 'ideal_ph_max': 8.0,
        'advice': 'Rabi crop. Avoid heavy irrigation during vegetative phase.'
    },
    {
        'crop': 'Masoor (Lentil)',
        'ideal_soil': ['loamy', 'alluvial'],
        'ideal_rain_min': 300, 'ideal_rain_max': 500,
        'ideal_temp_min': 15, 'ideal_temp_max': 20,
        'ideal_ph_min': 6.0, 'ideal_ph_max': 8.0,
        'advice': 'Requires cold climate and is highly susceptible to waterlogging.'
    },

    # OILSEEDS
    {
        'crop': 'Soybean',
        'ideal_soil': ['black', 'loamy'],
        'ideal_rain_min': 600, 'ideal_rain_max': 1000,
        'ideal_temp_min': 20, 'ideal_temp_max': 30,
        'ideal_ph_min': 6.0, 'ideal_ph_max': 7.5,
        'advice': 'Kharif crop. Sow with monsoon onset. Good rotation with wheat.'
    },
    {
        'crop': 'Groundnut',
        'ideal_soil': ['sandy', 'red', 'loamy'],
        'ideal_rain_min': 500, 'ideal_rain_max': 700,
        'ideal_temp_min': 25, 'ideal_temp_max': 30,
        'ideal_ph_min': 6.0, 'ideal_ph_max': 6.5,
        'advice': 'Requires well-drained soil. Yields 15-25 quintals/acre in favorable conditions.'
    },
    {
        'crop': 'Mustard',
        'ideal_soil': ['loamy', 'sandy'],
        'ideal_rain_min': 200, 'ideal_rain_max': 400,
        'ideal_temp_min': 15, 'ideal_temp_max': 25,
        'ideal_ph_min': 6.0, 'ideal_ph_max': 7.5,
        'advice': 'Rabi crop. Very sensitive to frost. Requires minimum irrigation.'
    },
    {
        'crop': 'Sunflower',
        'ideal_soil': ['loamy', 'black', 'sandy'],
        'ideal_rain_min': 500, 'ideal_rain_max': 700,
        'ideal_temp_min': 20, 'ideal_temp_max': 30,
        'ideal_ph_min': 6.5, 'ideal_ph_max': 8.0,
        'advice': 'Day-neutral crop. Can be grown in all three seasons.'
    },
    {
        'crop': 'Sesame (Til)',
        'ideal_soil': ['sandy', 'loamy'],
        'ideal_rain_min': 400, 'ideal_rain_max': 600,
        'ideal_temp_min': 25, 'ideal_temp_max': 35,
        'ideal_ph_min': 5.5, 'ideal_ph_max': 8.0,
        'advice': 'Highly susceptible to waterlogging. Requires excellent drainage.'
    },
    {
        'crop': 'Castor',
        'ideal_soil': ['sandy', 'red', 'loamy'],
        'ideal_rain_min': 400, 'ideal_rain_max': 600,
        'ideal_temp_min': 20, 'ideal_temp_max': 30,
        'ideal_ph_min': 5.0, 'ideal_ph_max': 8.0,
        'advice': 'Deep-rooted and drought-resistant. Takes 140-180 days to mature.'
    },

    # CASH CROPS & FIBERS
    {
        'crop': 'Cotton',
        'ideal_soil': ['black', 'clay'],
        'ideal_rain_min': 700, 'ideal_rain_max': 900,
        'ideal_temp_min': 25, 'ideal_temp_max': 30,
        'ideal_ph_min': 5.8, 'ideal_ph_max': 8.0,
        'advice': 'Ideal for black soil with 700-900mm rainfall. Sow early June, harvest by November.'
    },
    {
        'crop': 'Sugarcane',
        'ideal_soil': ['loamy', 'black', 'clay'],
        'ideal_rain_min': 1500, 'ideal_rain_max': 2500,
        'ideal_temp_min': 25, 'ideal_temp_max': 35,
        'ideal_ph_min': 6.5, 'ideal_ph_max': 7.5,
        'advice': 'Long duration cash crop. Requires heavy fertilization and frequent irrigation.'
    },
    {
        'crop': 'Jute',
        'ideal_soil': ['alluvial', 'loamy'],
        'ideal_rain_min': 1500, 'ideal_rain_max': 2000,
        'ideal_temp_min': 24, 'ideal_temp_max': 35,
        'ideal_ph_min': 6.0, 'ideal_ph_max': 7.5,
        'advice': 'Requires hot and humid climate. Primarily grown in eastern India.'
    },
    {
        'crop': 'Tobacco',
        'ideal_soil': ['sandy', 'red', 'loamy'],
        'ideal_rain_min': 500, 'ideal_rain_max': 1000,
        'ideal_temp_min': 20, 'ideal_temp_max': 30,
        'ideal_ph_min': 5.5, 'ideal_ph_max': 6.5,
        'advice': 'Requires frost-free climate. Highly sensitive to waterlogging.'
    },
    {
        'crop': 'Tea',
        'ideal_soil': ['loamy', 'sandy'],
        'ideal_rain_min': 1500, 'ideal_rain_max': 2500,
        'ideal_temp_min': 20, 'ideal_temp_max': 30,
        'ideal_ph_min': 4.5, 'ideal_ph_max': 5.5,
        'advice': 'Requires acidic soil and well-distributed rainfall. Hill slopes are ideal.'
    },
    {
        'crop': 'Coffee',
        'ideal_soil': ['loamy', 'red'],
        'ideal_rain_min': 1500, 'ideal_rain_max': 2000,
        'ideal_temp_min': 15, 'ideal_temp_max': 28,
        'ideal_ph_min': 5.0, 'ideal_ph_max': 6.5,
        'advice': 'Requires shade trees and protection from direct sunlight and strong winds.'
    },
    {
        'crop': 'Rubber',
        'ideal_soil': ['loamy', 'red'],
        'ideal_rain_min': 2000, 'ideal_rain_max': 3000,
        'ideal_temp_min': 25, 'ideal_temp_max': 35,
        'ideal_ph_min': 4.5, 'ideal_ph_max': 6.0,
        'advice': 'Thrives in hot, humid climates with heavy rainfall.'
    },

    # HORTICULTURE (VEGETABLES)
    {
        'crop': 'Potato',
        'ideal_soil': ['sandy', 'loamy'],
        'ideal_rain_min': 500, 'ideal_rain_max': 700,
        'ideal_temp_min': 15, 'ideal_temp_max': 20,
        'ideal_ph_min': 5.0, 'ideal_ph_max': 6.5,
        'advice': 'Tuber crop. Requires loose soil for optimal tuber expansion.'
    },
    {
        'crop': 'Onion',
        'ideal_soil': ['sandy', 'loamy', 'red'],
        'ideal_rain_min': 350, 'ideal_rain_max': 600,
        'ideal_temp_min': 15, 'ideal_temp_max': 30,
        'ideal_ph_min': 5.8, 'ideal_ph_max': 7.0,
        'advice': 'Requires cool weather during early growth and dry heat for bulb maturity.'
    },
    {
        'crop': 'Tomato',
        'ideal_soil': ['loamy', 'sandy'],
        'ideal_rain_min': 600, 'ideal_rain_max': 800,
        'ideal_temp_min': 21, 'ideal_temp_max': 27,
        'ideal_ph_min': 6.0, 'ideal_ph_max': 7.0,
        'advice': 'Highly sensitive to frost. Ensure staking for better yields.'
    },
    {
        'crop': 'Cabbage',
        'ideal_soil': ['loamy', 'clay'],
        'ideal_rain_min': 500, 'ideal_rain_max': 700,
        'ideal_temp_min': 15, 'ideal_temp_max': 20,
        'ideal_ph_min': 6.0, 'ideal_ph_max': 7.5,
        'advice': 'Requires continuous moisture and cool temperatures for solid head formation.'
    },
    {
        'crop': 'Cauliflower',
        'ideal_soil': ['loamy', 'clay'],
        'ideal_rain_min': 500, 'ideal_rain_max': 700,
        'ideal_temp_min': 15, 'ideal_temp_max': 22,
        'ideal_ph_min': 5.5, 'ideal_ph_max': 6.5,
        'advice': 'Highly sensitive to temperature fluctuations during curd formation.'
    },
    {
        'crop': 'Chili',
        'ideal_soil': ['loamy', 'red', 'black'],
        'ideal_rain_min': 600, 'ideal_rain_max': 1000,
        'ideal_temp_min': 20, 'ideal_temp_max': 30,
        'ideal_ph_min': 6.0, 'ideal_ph_max': 7.0,
        'advice': 'Susceptible to waterlogging. Needs warm and humid weather.'
    },
    {
        'crop': 'Brinjal (Eggplant)',
        'ideal_soil': ['loamy', 'sandy'],
        'ideal_rain_min': 500, 'ideal_rain_max': 700,
        'ideal_temp_min': 25, 'ideal_temp_max': 32,
        'ideal_ph_min': 5.5, 'ideal_ph_max': 6.8,
        'advice': 'Long duration crop. Hardy and tolerates drought better than tomatoes.'
    },
    {
        'crop': 'Okra (Bhindi)',
        'ideal_soil': ['sandy', 'loamy'],
        'ideal_rain_min': 400, 'ideal_rain_max': 600,
        'ideal_temp_min': 25, 'ideal_temp_max': 35,
        'ideal_ph_min': 6.0, 'ideal_ph_max': 7.5,
        'advice': 'Warm season crop. Cannot tolerate frost or extreme cold.'
    },

    # HORTICULTURE (FRUITS)
    {
        'crop': 'Mango',
        'ideal_soil': ['loamy', 'red', 'alluvial'],
        'ideal_rain_min': 750, 'ideal_rain_max': 2500,
        'ideal_temp_min': 24, 'ideal_temp_max': 27,
        'ideal_ph_min': 5.5, 'ideal_ph_max': 7.5,
        'advice': 'Deep-rooted. Avoid areas with high humidity during flowering to prevent disease.'
    },
    {
        'crop': 'Banana',
        'ideal_soil': ['loamy', 'alluvial'],
        'ideal_rain_min': 1500, 'ideal_rain_max': 2500,
        'ideal_temp_min': 15, 'ideal_temp_max': 35,
        'ideal_ph_min': 6.5, 'ideal_ph_max': 7.5,
        'advice': 'Requires abundant water and heavy feeding. Needs protection from strong winds.'
    },
    {
        'crop': 'Papaya',
        'ideal_soil': ['sandy', 'loamy'],
        'ideal_rain_min': 1000, 'ideal_rain_max': 1500,
        'ideal_temp_min': 22, 'ideal_temp_max': 26,
        'ideal_ph_min': 6.0, 'ideal_ph_max': 6.5,
        'advice': 'Highly sensitive to waterlogging; roots will rot within 24 hours of standing water.'
    },
    {
        'crop': 'Grapes',
        'ideal_soil': ['sandy', 'loamy', 'red'],
        'ideal_rain_min': 500, 'ideal_rain_max': 900,
        'ideal_temp_min': 15, 'ideal_temp_max': 40,
        'ideal_ph_min': 6.5, 'ideal_ph_max': 7.5,
        'advice': 'Requires a dry period during ripening. Susceptible to fungal diseases in high humidity.'
    },
    {
        'crop': 'Apple',
        'ideal_soil': ['loamy'],
        'ideal_rain_min': 1000, 'ideal_rain_max': 1250,
        'ideal_temp_min': 10, 'ideal_temp_max': 21,
        'ideal_ph_min': 5.5, 'ideal_ph_max': 6.5,
        'advice': 'Requires chilling hours (winter temperatures below 7°C) for proper fruiting.'
    },
    {
        'crop': 'Guava',
        'ideal_soil': ['alluvial', 'red', 'loamy'],
        'ideal_rain_min': 1000, 'ideal_rain_max': 1500,
        'ideal_temp_min': 23, 'ideal_temp_max': 28,
        'ideal_ph_min': 4.5, 'ideal_ph_max': 8.2,
        'advice': 'Very hardy crop. Can tolerate both drought and temporary waterlogging.'
    },
    {
        'crop': 'Pomegranate',
        'ideal_soil': ['loamy', 'sandy', 'black'],
        'ideal_rain_min': 500, 'ideal_rain_max': 800,
        'ideal_temp_min': 25, 'ideal_temp_max': 38,
        'ideal_ph_min': 6.5, 'ideal_ph_max': 8.0,
        'advice': 'Highly drought-tolerant. Performs best in semi-arid climates.'
    },

    # SPICES & CONDIMENTS
    {
        'crop': 'Turmeric',
        'ideal_soil': ['loamy', 'red', 'alluvial'],
        'ideal_rain_min': 1500, 'ideal_rain_max': 2500,
        'ideal_temp_min': 20, 'ideal_temp_max': 30,
        'ideal_ph_min': 5.0, 'ideal_ph_max': 7.5,
        'advice': 'Requires loose soil for rhizome development and plenty of organic manure.'
    },
    {
        'crop': 'Ginger',
        'ideal_soil': ['loamy', 'sandy'],
        'ideal_rain_min': 1500, 'ideal_rain_max': 3000,
        'ideal_temp_min': 20, 'ideal_temp_max': 32,
        'ideal_ph_min': 5.5, 'ideal_ph_max': 6.5,
        'advice': 'Partial shade crop. Cannot tolerate waterlogging at all.'
    },
    {
        'crop': 'Cardamom',
        'ideal_soil': ['loamy'],
        'ideal_rain_min': 1500, 'ideal_rain_max': 4000,
        'ideal_temp_min': 10, 'ideal_temp_max': 35,
        'ideal_ph_min': 4.5, 'ideal_ph_max': 6.0,
        'advice': 'Grown in high rainfall evergreen forests. Requires 50-60% shade.'
    },
    {
        'crop': 'Black Pepper',
        'ideal_soil': ['red', 'loamy'],
        'ideal_rain_min': 2000, 'ideal_rain_max': 3000,
        'ideal_temp_min': 20, 'ideal_temp_max': 30,
        'ideal_ph_min': 5.5, 'ideal_ph_max': 6.5,
        'advice': 'Requires support trees (standards) for climbing. Highly sensitive to prolonged drought.'
    },
    {
        'crop': 'Coriander',
        'ideal_soil': ['loamy', 'black', 'clay'],
        'ideal_rain_min': 75, 'ideal_rain_max': 100,
        'ideal_temp_min': 15, 'ideal_temp_max': 25,
        'ideal_ph_min': 6.5, 'ideal_ph_max': 7.5,
        'advice': 'Cultivated as a rabi crop. Can be grown with residual soil moisture.'
    },
    {
        'crop': 'Cumin (Jeera)',
        'ideal_soil': ['sandy', 'loamy'],
        'ideal_rain_min': 150, 'ideal_rain_max': 250,
        'ideal_temp_min': 20, 'ideal_temp_max': 30,
        'ideal_ph_min': 7.0, 'ideal_ph_max': 8.5,
        'advice': 'Highly sensitive to high humidity and rain during flowering/seed formation.'
    },
    {
        'crop': 'Garlic',
        'ideal_soil': ['loamy', 'sandy'],
        'ideal_rain_min': 500, 'ideal_rain_max': 700,
        'ideal_temp_min': 13, 'ideal_temp_max': 24,
        'ideal_ph_min': 6.0, 'ideal_ph_max': 7.0,
        'advice': 'Rabi crop. Bulb development is best in warm and dry weather.'
    }
]
