import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import os

# We synthesize a dataset for crop recommendation using standard ranges
# N, P, K, temperature, humidity, ph, rainfall
CROPS = [
    {"label": "Rice", "N": [60, 99], "P": [35, 60], "K": [35, 45], "temperature": [20, 27], "humidity": [80, 85], "ph": [5, 7.5], "rainfall": [150, 300], "advice": "Ensure fields are well-flooded, especially during the vegetative stage."},
    {"label": "Maize", "N": [60, 100], "P": [35, 60], "K": [15, 25], "temperature": [18, 27], "humidity": [55, 75], "ph": [5.5, 7.5], "rainfall": [60, 110], "advice": "Use nitrogen-rich fertilizers and ensure good drainage to prevent waterlogging."},
    {"label": "Cotton", "N": [90, 140], "P": [35, 60], "K": [15, 25], "temperature": [22, 30], "humidity": [75, 85], "ph": [5.8, 8], "rainfall": [60, 110], "advice": "Monitor for bollworms and ensure deep soil preparation before sowing."},
    {"label": "Wheat", "N": [60, 120], "P": [35, 60], "K": [15, 25], "temperature": [15, 25], "humidity": [50, 70], "ph": [6.0, 7.5], "rainfall": [40, 60], "advice": "Apply appropriate weed control methods early in the growth cycle."},
    {"label": "Sugarcane", "N": [100, 150], "P": [40, 70], "K": [40, 60], "temperature": [25, 35], "humidity": [75, 90], "ph": [6.5, 7.5], "rainfall": [150, 300], "advice": "Requires continuous water supply. Implement drip irrigation for better yield."},
    {"label": "Potato", "N": [80, 120], "P": [40, 60], "K": [40, 60], "temperature": [15, 20], "humidity": [80, 95], "ph": [5.5, 6.5], "rainfall": [60, 100], "advice": "Earthing up is crucial to protect the tubers from sunlight exposure."},
    {"label": "Tomato", "N": [40, 80], "P": [40, 60], "K": [20, 40], "temperature": [20, 25], "humidity": [60, 80], "ph": [6.0, 7.0], "rainfall": [60, 100], "advice": "Provide structural support and maintain consistent soil moisture."},
    {"label": "Onion", "N": [20, 40], "P": [20, 40], "K": [20, 40], "temperature": [15, 25], "humidity": [65, 75], "ph": [6.5, 7.5], "rainfall": [40, 60], "advice": "Stop irrigation a few weeks before harvest to allow bulbs to mature."},
    {"label": "Soybean", "N": [20, 60], "P": [40, 70], "K": [20, 40], "temperature": [20, 30], "humidity": [60, 70], "ph": [6.0, 7.0], "rainfall": [50, 100], "advice": "Inoculate seeds with Rhizobium for better nitrogen fixation."},
    {"label": "Groundnut", "N": [10, 30], "P": [40, 60], "K": [20, 40], "temperature": [25, 30], "humidity": [50, 65], "ph": [6.0, 7.0], "rainfall": [50, 100], "advice": "Avoid water stress during the pegging and pod development stages."},
]

def synthesize_data(num_samples_per_crop=500):
    data = []
    np.random.seed(42)
    for crop in CROPS:
        for _ in range(num_samples_per_crop):
            data.append({
                "N": np.random.uniform(crop["N"][0], crop["N"][1]),
                "P": np.random.uniform(crop["P"][0], crop["P"][1]),
                "K": np.random.uniform(crop["K"][0], crop["K"][1]),
                "temperature": np.random.uniform(crop["temperature"][0], crop["temperature"][1]),
                "humidity": np.random.uniform(crop["humidity"][0], crop["humidity"][1]),
                "ph": np.random.uniform(crop["ph"][0], crop["ph"][1]),
                "rainfall": np.random.uniform(crop["rainfall"][0], crop["rainfall"][1]),
                "label": crop["label"],
                "advice": crop["advice"]
            })
    return pd.DataFrame(data)

def train_and_save_model():
    print("Synthesizing dataset...")
    df = synthesize_data()
    
    X = df.drop(["label", "advice"], axis=1)
    y = df["label"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForestClassifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    accuracy = model.score(X_test, y_test)
    print(f"Model accuracy: {accuracy * 100:.2f}%")
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, "crop_model.joblib")
    
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_and_save_model()
