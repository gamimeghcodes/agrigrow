import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Store, FileText, Sprout, TrendingUp, CloudSun, LineChart, MapPin, ArrowRight, Cpu,
} from "lucide-react";
import { useLiveWeather } from "@/hooks/use-live-weather";

type Role = "farmer" | "buyer" | "admin";

type Profile = {
  id?: number;
  role: Role;
  name?: string;
  username?: string;
  mobile?: string;
  state?: string;
  district?: string;
  land_size?: number;
  crops?: string[];
  category?: string;
  income?: string;
};

const AUTH_KEY = "agri-profile";

function getProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(sessionStorage.getItem(AUTH_KEY) ?? "null"); } catch { return null; }
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



export const Route = createFileRoute("/farmer/")({
  head: () => ({ meta: [{ title: "Farmer Dashboard — AgriVerse" }] }),
  component: FarmerDashboard,
});

const tiles = [
  { to: "/farmer/marketplace", icon: Store, title: "Marketplace", desc: "Sell your produce" },
  { to: "/farmer/market-price", icon: LineChart, title: "Market Prices", desc: "Live mandi rates" },
  { to: "/farmer/schemes", icon: FileText, title: "Govt Schemes", desc: "Check eligibility" },
  { to: "/farmer/crop-recommendation", icon: Sprout, title: "Crop Advisor", desc: "AI recommendations" },
  { to: "/farmer/weather", icon: CloudSun, title: "Weather", desc: "Forecasts & alerts" },
  { to: "/farmer/modern-farming", icon: Cpu, title: "Modern Farming", desc: "New techniques" },
];

function FarmerDashboard() {
  const profile = useProfile();
  const name = profile?.name || profile?.username || "Farmer";
  const realWeather = useLiveWeather(profile?.district || profile?.state || "Delhi");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/30 p-5 sm:p-6 border">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-14 w-14 shrink-0 rounded-full bg-primary text-primary-foreground grid place-items-center text-xl font-bold">
              {name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Namaste 🙏</div>
              <div className="text-xl font-bold truncate">{name}</div>

            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch rounded-xl border bg-card shadow-sm overflow-hidden shrink-0">
            <div className="p-4 sm:min-w-[160px]">
              <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wide">Today's weather</Badge>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-2xl font-bold">{realWeather.current.temp}°C</span>
                <CloudSun className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{realWeather.current.condition}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr] items-start">
        <div className="rounded-2xl border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-bold mb-4">Explore tools</h2>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
            {tiles.map((t) => (
              <Link key={t.to} to={t.to}>
                <Card className="h-full hover:shadow-lift hover:border-primary/40 transition-all group">
                  <CardContent className="p-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary mb-3">
                      <t.icon className="h-5 w-5" />
                    </div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{t.desc}</div>
                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
                      Open <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-bold mb-4">Recent alerts</h2>
          <div className="space-y-3">
            {realWeather.alerts.map((a) => (
              <div key={a.title} className="rounded-xl border p-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge
                    className={
                      a.severity === "high"
                        ? "shrink-0"
                        : "shrink-0 bg-earth/15 text-earth hover:bg-earth/15 border-transparent"
                    }
                    variant={a.severity === "high" ? "destructive" : "secondary"}
                  >
                    {a.severity}
                  </Badge>
                  <span className="text-xs text-muted-foreground shrink-0">{a.time}</span>
                </div>
                <div className="font-semibold text-sm mt-2">{a.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{a.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
