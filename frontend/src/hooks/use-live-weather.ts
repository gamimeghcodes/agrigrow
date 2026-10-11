import { useEffect, useState } from "react";

export type WeatherAlert = {
  type: string;
  severity: "low" | "medium" | "high";
  title: string;
  body: string;
  time: string;
};

export type LiveWeather = {
  current: { temp: string; condition: string };
  alerts: WeatherAlert[];
};

/**
 * Live weather for a location, sourced from Open-Meteo.
 *
 * Tries the browser's geolocation first; if that's unavailable or denied,
 * falls back to geocoding the given `locationQuery` (e.g. a district or
 * state name from the user's profile).
 *
 * Shared by the farmer and buyer dashboards so both show real weather
 * instead of static placeholder data.
 */
export function useLiveWeather(locationQuery: string): LiveWeather {
  const [weather, setWeather] = useState<LiveWeather>({
    current: { temp: "--", condition: "Loading..." },
    alerts: [],
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchWeatherForCoords(latitude: number, longitude: number) {
      try {
        const wRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=precipitation_probability_max,temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        const wData = await wRes.json();
        if (!wData.current_weather) return;

        const current = wData.current_weather;
        const daily = wData.daily;

        let condition = "Clear";
        if (current.weathercode >= 1 && current.weathercode <= 3) condition = "Cloudy";
        if (current.weathercode >= 51 && current.weathercode <= 67) condition = "Rain";
        if (current.weathercode >= 71 && current.weathercode <= 77) condition = "Snow";
        if (current.weathercode >= 95) condition = "Thunderstorm";

        const newAlerts: WeatherAlert[] = [];
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
            current: { temp: Math.round(current.temperature).toString(), condition },
            alerts: newAlerts,
          });
        }
      } catch (err) {
        if (isMounted) setWeather((w) => ({ ...w, current: { temp: "--", condition: "Error" } }));
      }
    }

    async function fetchByLocationString() {
      if (!locationQuery) return;
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationQuery)}&count=1&language=en&format=json`
        );
        const geoData = await geoRes.json();
        if (!geoData.results || geoData.results.length === 0) {
          if (isMounted) setWeather((w) => ({ ...w, current: { temp: "--", condition: "Loc not found" } }));
          return;
        }
        await fetchWeatherForCoords(geoData.results[0].latitude, geoData.results[0].longitude);
      } catch (err) {
        if (isMounted) setWeather((w) => ({ ...w, current: { temp: "--", condition: "Error" } }));
      }
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeatherForCoords(position.coords.latitude, position.coords.longitude),
        () => fetchByLocationString() // Fallback to profile district/state
      );
    } else {
      fetchByLocationString();
    }

    return () => {
      isMounted = false;
    };
  }, [locationQuery]);

  return weather;
}
