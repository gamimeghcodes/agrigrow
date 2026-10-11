export const WEATHER = {
  current: { temp: 32, humidity: 68, wind: 12, condition: "Partly Cloudy", rainChance: 40 },
  forecast: [
    { day: "Mon", temp: 32, min: 25, icon: "cloud", rain: 40 },
    { day: "Tue", temp: 34, min: 26, icon: "sun", rain: 10 },
    { day: "Wed", temp: 30, min: 24, icon: "rain", rain: 85 },
    { day: "Thu", temp: 28, min: 23, icon: "rain", rain: 90 },
    { day: "Fri", temp: 29, min: 24, icon: "cloud", rain: 55 },
    { day: "Sat", temp: 31, min: 25, icon: "sun", rain: 20 },
    { day: "Sun", temp: 33, min: 26, icon: "sun", rain: 15 },
  ],
  alerts: [
    {
      type: "rain",
      severity: "high",
      title: "Heavy Rain Warning",
      body: "Expected 80mm rainfall on Wed–Thu. Delay pesticide spraying.",
      time: "2h ago",
    },
    {
      type: "irrigation",
      severity: "medium",
      title: "Irrigation Reminder",
      body: "Soil moisture low. Consider irrigation before Wednesday's rain if soil is dry.",
      time: "5h ago",
    },
    {
      type: "pest",
      severity: "medium",
      title: "Pest Risk: Aphids",
      body: "Humidity + temperature favor aphid outbreak on cotton. Monitor closely.",
      time: "1d ago",
    },
    {
      type: "heat",
      severity: "low",
      title: "Heat Advisory",
      body: "Weekend temperatures may reach 33°C. Ensure adequate irrigation.",
      time: "2d ago",
    },
  ],
};

export type MarketPrice = {
  commodity: string;
  currentPrice: number;
  predictedPrice: number;
  unit: string;
  history: { month: string; price: number }[];
  prediction: { month: string; price: number }[];
};

const genHistory = (base: number): { month: string; price: number }[] => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  return months.map((m, i) => ({
    month: m,
    price: Math.round(base + Math.sin(i) * base * 0.08 + i * base * 0.01),
  }));
};

export const MARKET_PRICES: MarketPrice[] = [
  {
    commodity: "Wheat",
    currentPrice: 2500,
    predictedPrice: 2800,
    unit: "quintal",
    history: genHistory(2400),
    prediction: [
      { month: "Aug", price: 2650 },
      { month: "Sep", price: 2800 },
    ],
  },
  {
    commodity: "Cotton",
    currentPrice: 7200,
    predictedPrice: 7500,
    unit: "quintal",
    history: genHistory(7000),
    prediction: [
      { month: "Aug", price: 7350 },
      { month: "Sep", price: 7500 },
    ],
  },
  {
    commodity: "Onion",
    currentPrice: 1800,
    predictedPrice: 2100,
    unit: "quintal",
    history: genHistory(1750),
    prediction: [
      { month: "Aug", price: 1950 },
      { month: "Sep", price: 2100 },
    ],
  },
  {
    commodity: "Rice",
    currentPrice: 2100,
    predictedPrice: 2050,
    unit: "quintal",
    history: genHistory(2080),
    prediction: [
      { month: "Aug", price: 2080 },
      { month: "Sep", price: 2050 },
    ],
  },
  {
    commodity: "Soybean",
    currentPrice: 4600,
    predictedPrice: 4900,
    unit: "quintal",
    history: genHistory(4500),
    prediction: [
      { month: "Aug", price: 4750 },
      { month: "Sep", price: 4900 },
    ],
  },
  {
    commodity: "Tomato",
    currentPrice: 2200,
    predictedPrice: 1900,
    unit: "quintal",
    history: genHistory(2100),
    prediction: [
      { month: "Aug", price: 2050 },
      { month: "Sep", price: 1900 },
    ],
  },
];
