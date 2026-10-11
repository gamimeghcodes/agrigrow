import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

export type MarketPriceRecord = {
  state: string;
  district: string;
  market: string;
  commodity: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  arrival_date: string;
};

// Used only when VITE_DATA_GOV_API_KEY isn't configured, so dashboards show
// something representative instead of an empty widget. Mirrors the same
// fallback already used on the farmer market-price page.
function mockRecordsFor(state: string): MarketPriceRecord[] {
  const today = new Date().toLocaleDateString("en-GB");
  return [
    { state, district: "Pune", market: "Pune APMC", commodity: "Tomato", min_price: 1500, max_price: 2200, modal_price: 1800, arrival_date: today },
    { state, district: "Pune", market: "Pune APMC", commodity: "Onion", min_price: 1200, max_price: 1600, modal_price: 1400, arrival_date: today },
    { state, district: "Nashik", market: "Lasalgaon APMC", commodity: "Wheat", min_price: 2100, max_price: 2300, modal_price: 2250, arrival_date: today },
  ];
}

/**
 * Live mandi (market) prices for a given state, from the same backend
 * endpoint (`/market-prices/fetch/`) that the farmer market-price page uses.
 *
 * Shared by the farmer and buyer dashboards so both show real prices
 * instead of a static, hardcoded snapshot. Falls back to representative
 * mock data (clearly a fallback, not passed off as live) if
 * VITE_DATA_GOV_API_KEY isn't configured, so the widget isn't empty during
 * local development.
 */
export function useMarketPrices(state?: string) {
  const [records, setRecords] = useState<MarketPriceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    if (!state) return;
    let isMounted = true;

    const fetchPrices = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = import.meta.env.VITE_DATA_GOV_API_KEY;
        if (!apiKey || apiKey.trim() === "") {
          await new Promise((r) => setTimeout(r, 300));
          if (isMounted) {
            setRecords(mockRecordsFor(state));
            setIsMock(true);
          }
          return;
        }

        const res = await fetch(
          `${API_BASE_URL}/market-prices/fetch/?state=${encodeURIComponent(state)}`
        );
        if (!res.ok) throw new Error("Failed to fetch market prices");
        const data = await res.json();
        if (isMounted) {
          setRecords(data.records || []);
          setIsMock(false);
        }
      } catch (err) {
        if (isMounted) setError("Unable to load live market prices right now.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPrices();
    return () => {
      isMounted = false;
    };
  }, [state]);

  return { records, loading, error, isMock };
}
