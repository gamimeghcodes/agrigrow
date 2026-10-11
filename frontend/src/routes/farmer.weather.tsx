import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer, AlertTriangle, ArrowLeft } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Route = createFileRoute("/farmer/weather")({
  head: () => ({ meta: [{ title: "Weather & Alerts — AgriVerse" }] }),
  component: Weather,
});

const iconMap: Record<string, any> = { sun: Sun, cloud: Cloud, rain: CloudRain };
const alertStyles: Record<string, string> = {
  rain: "bg-sky/10 border-sky/30 text-sky",
  heat: "bg-destructive/10 border-destructive/30 text-destructive",
  cold: "bg-blue-500/10 border-blue-500/30 text-blue-500",
  clear: "bg-green-500/10 border-green-500/30 text-green-500",
};

type Profile = { district?: string; state?: string; };
function getProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(sessionStorage.getItem("agri-profile") ?? "null"); } catch { return null; }
}

function useProfile() {
  const [profile, setP] = useState<Profile | null>(() => getProfile());
  useEffect(() => {
    const h = () => setP(getProfile());
    window.addEventListener("agri-profile-change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("agri-profile-change", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return profile;
}

type Alert = { type: string, severity: "low" | "medium" | "high", title: string, body: string, time: string };
type ForecastDay = { day: string; temp: number; min: number; icon: string; rain: number; date: string; };

function useRealWeather(locationQuery: string) {
  const [weather, setWeather] = useState({
    current: { temp: "--", condition: "Loading...", humidity: "--", wind: "--", rainChance: "--", location: locationQuery || "Unknown" },
    forecast: [] as ForecastDay[],
    alerts: [] as Alert[],
    loading: true
  });
  
  useEffect(() => {
    let isMounted = true;

    async function fetchWeatherForCoords(latitude: number, longitude: number, locationName: string) {
      try {
        const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m&daily=precipitation_probability_max,temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`);
        const wData = await wRes.json();
        if (!wData.current_weather) return;
        
        const current = wData.current_weather;
        const daily = wData.daily;
        const hourly = wData.hourly;
        
        // Find current hour humidity
        const currentHourIndex = hourly.time.findIndex((t: string) => new Date(t).getTime() > Date.now()) || 0;
        const humidity = hourly.relative_humidity_2m[Math.max(0, currentHourIndex - 1)];

        const getCond = (code: number) => {
          if (code >= 1 && code <= 3) return { text: "Cloudy", icon: "cloud" };
          if (code >= 51 && code <= 67) return { text: "Rain", icon: "rain" };
          if (code >= 71 && code <= 77) return { text: "Snow", icon: "cloud" };
          if (code >= 95) return { text: "Thunderstorm", icon: "rain" };
          return { text: "Clear", icon: "sun" };
        };

        const cond = getCond(current.weathercode);
        
        const forecast: ForecastDay[] = [];
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        for(let i=0; i<7; i++) {
            const date = new Date(daily.time[i]);
            forecast.push({
                day: days[date.getDay()],
                date: daily.time[i],
                temp: Math.round(daily.temperature_2m_max[i]),
                min: Math.round(daily.temperature_2m_min[i]),
                icon: getCond(daily.weathercode[i]).icon,
                rain: daily.precipitation_probability_max[i]
            });
        }

        const newAlerts: Alert[] = [];
        const maxTemp = daily.temperature_2m_max?.[0] || 0;
        const minTemp = daily.temperature_2m_min?.[0] || 0;
        const maxRainProb = daily.precipitation_probability_max?.[0] || 0;
        
        if (maxTemp > 35) {
          newAlerts.push({ type: "heat", severity: "high", title: "Heat Advisory", body: `Temperatures expected to reach ${maxTemp}°C today. Ensure adequate irrigation.`, time: "Just now" });
        } else if (minTemp < 10) {
          newAlerts.push({ type: "cold", severity: "medium", title: "Cold Warning", body: `Temperatures dropping to ${minTemp}°C. Protect sensitive crops.`, time: "Just now" });
        }
        
        if (maxRainProb > 60) {
          newAlerts.push({ type: "rain", severity: "high", title: "Heavy Rain Expected", body: `There is a ${maxRainProb}% chance of heavy rain today. Delay pesticide spraying.`, time: "Just now" });
        } else if (maxRainProb > 30) {
          newAlerts.push({ type: "rain", severity: "medium", title: "Possible Showers", body: `There is a ${maxRainProb}% chance of rain. Monitor field conditions.`, time: "Just now" });
        }
        
        if (newAlerts.length === 0) {
          newAlerts.push({ type: "clear", severity: "low", title: "Optimal Conditions", body: "Weather is looking good for routine field operations today.", time: "Just now" });
        }
        
        if (isMounted) {
          setWeather({
            current: { 
                temp: Math.round(current.temperature).toString(), 
                condition: cond.text,
                humidity: humidity.toString(),
                wind: Math.round(current.windspeed).toString(),
                rainChance: maxRainProb.toString(),
                location: locationName
            },
            forecast,
            alerts: newAlerts,
            loading: false
          });
        }
      } catch (err) {
        if (isMounted) setWeather(w => ({ ...w, current: { ...w.current, temp: "--", condition: "Error" }, loading: false }));
      }
    }

    async function fetchByLocationString() {
      if (!locationQuery) {
        if (isMounted) setWeather(w => ({ ...w, loading: false }));
        return;
      }
      try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationQuery)}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();
        if (!geoData.results || geoData.results.length === 0) {
          if (isMounted) setWeather(w => ({ ...w, current: { ...w.current, temp: "--", condition: "Loc not found" }, loading: false }));
          return;
        }
        const loc = geoData.results[0];
        await fetchWeatherForCoords(loc.latitude, loc.longitude, loc.name);
      } catch (err) {
        if (isMounted) setWeather(w => ({ ...w, current: { ...w.current, temp: "--", condition: "Error" }, loading: false }));
      }
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                // Reverse geocode to get city name
                const revRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
                const revData = await revRes.json();
                fetchWeatherForCoords(position.coords.latitude, position.coords.longitude, revData.city || revData.locality || "Current Location");
            } catch (e) {
                fetchWeatherForCoords(position.coords.latitude, position.coords.longitude, "Current Location");
            }
        },
        (error) => fetchByLocationString()
      );
    } else {
      fetchByLocationString();
    }

    return () => { isMounted = false; };
  }, [locationQuery]);
  
  return weather;
}

function Weather() {
  const profile = useProfile();
  const weather = useRealWeather(profile?.district || profile?.state || "Delhi");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">

      <div>
        <h1 className="text-2xl font-bold">Weather & Alerts</h1>
        <p className="text-sm text-muted-foreground">Real-time forecasts and smart farming alerts.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
        <Card className="bg-gradient-to-br from-sky/10 to-primary/10">
          <CardContent className="p-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Today · {weather.current.location}</div>
                <div className="mt-2 text-6xl font-extrabold">{weather.current.temp}°<span className="text-2xl text-muted-foreground">C</span></div>
                <div className="text-lg font-medium mt-1">{weather.current.condition}</div>
              </div>
              <Cloud className="h-20 w-20 text-sky shrink-0" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <Stat icon={Droplets} label="Humidity" value={`${weather.current.humidity}%`} />
              <Stat icon={Wind} label="Wind" value={`${weather.current.wind} km/h`} />
              <Stat icon={CloudRain} label="Rain" value={`${weather.current.rainChance}%`} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><CloudRain className="h-4 w-4 text-sky" /> Rain probability (7d)</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0">
            {weather.loading ? (
                <div className="h-[180px] w-full bg-muted/20 animate-pulse rounded-md" />
            ) : (
                <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={weather.forecast} margin={{ left: -20 }}>
                    <defs>
                    <linearGradient id="rainG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--sky)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--sky)" stopOpacity={0.02} />
                    </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip />
                    <Area type="monotone" dataKey="rain" stroke="var(--sky)" fill="url(#rainG)" strokeWidth={2} />
                </AreaChart>
                </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">7-day forecast</CardTitle></CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
            {weather.loading ? (
                Array.from({length: 7}).map((_, i) => <div key={i} className="h-24 rounded-xl bg-muted/20 animate-pulse" />)
            ) : weather.forecast.map((d) => {
              const Icon = iconMap[d.icon] ?? Cloud;
              return (
                <div key={d.day} className="rounded-xl border p-3 text-center bg-card">
                  <div className="text-xs font-semibold">{d.day}</div>
                  <Icon className="h-7 w-7 mx-auto my-2 text-sky" />
                  <div className="text-sm font-bold">{d.temp}°</div>
                  <div className="text-[10px] text-muted-foreground">{d.min}° · {d.rain}%</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-primary" /> Smart alerts</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {weather.loading ? (
             <div className="h-20 rounded-xl bg-muted/20 animate-pulse" />
          ) : weather.alerts.map((a) => (
            <div key={a.title} className={cn("rounded-xl border p-4", alertStyles[a.type] || alertStyles.clear)}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <div className="font-semibold">{a.title}</div>
              </div>
              <p className="text-sm mt-1 text-foreground/80">{a.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-card/70 backdrop-blur border p-2 text-center">
      <Icon className="h-4 w-4 mx-auto text-muted-foreground" />
      <div className="text-[10px] text-muted-foreground mt-1">{label}</div>
      <div className="font-semibold text-sm">{value}</div>
    </div>
  );
}
