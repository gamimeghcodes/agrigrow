import { createFileRoute, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, TrendingUp, CloudSun, Store, FileText, LineChart, ShieldCheck, Users } from "lucide-react";
import { useState, useEffect } from "react";

// ---- inlined from src/lib/auth-store.ts (kept local to this file on purpose) ----
type Role = "farmer" | "buyer" | "admin";

type Profile = {
  role: Role;
  name: string;
  mobile?: string;
  state?: string;
  district?: string;
  landSize?: number;
  crops?: string[];
  category?: string;
  income?: string;
};

const AUTH_KEY = "agri-profile";

function getProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(sessionStorage.getItem(AUTH_KEY) ?? "null"); } catch { return null; }
}

function setProfile(p: Profile | null) {
  if (typeof window === "undefined") return;
  if (p) sessionStorage.setItem(AUTH_KEY, JSON.stringify(p));
  else sessionStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event("agri-profile-change"));
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



export const Route = createFileRoute("/")({ component: Landing });

const features = [
  { icon: Sprout, title: "Smart Crop Recommendations", desc: "AI-driven crop suggestions based on your soil, rainfall, and climate.", image: "/crop.jpg" },
  { icon: FileText, title: "Government Scheme Matching", desc: "Instantly find schemes you're eligible for — PM-KISAN, KCC, PMFBY, and more.", image: "/scheme.jpg" },
  { icon: Store, title: "Direct Marketplace", desc: "Sell your produce directly to buyers. No middlemen, better prices.", image: "/marketplace.webp" },
  { icon: LineChart, title: "Market Price Prediction", desc: "Know latest mandi prices. Plan your sales smartly.", image: "/market-price-prediction.webp" },
  { icon: CloudSun, title: "Weather & Alerts", desc: "7-day forecasts, rain predictions, and pest risk alerts.", image: "/weather-alerts.webp" },
];
function Landing() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Sprout className="h-6 w-6" />
          AgriVerse
        </div>
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link to="/role-select">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-farmer.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24 grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Trusted by 50,000+ farmers across India
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">Bringing Innovation <br /> to Your Farming Journey.</h1>
            <p className="mt-4 text-lg text-white/85 max-w-xl">
              AgriVerse brings AI-powered crop advice, government scheme eligibility, and a direct-to-buyer marketplace — all in one app.
            </p>
            <div className="mt-8 flex gap-6 text-sm">
              <div><div className="text-2xl font-bold text-primary">50K+</div><div className="text-white/70">Farmers</div></div>
              <div><div className="text-2xl font-bold text-primary">₹120Cr</div><div className="text-white/70">Traded</div></div>
              <div><div className="text-2xl font-bold text-primary">12</div><div className="text-white/70">States</div></div>
            </div>
          </div>

          <div className="hidden lg:flex justify-end">
            <div className="bg-black/30 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-sm text shadow-xl">
              <h3 className="text-primary font-bold text-xl mb-1">Our Mission</h3>
              <p className="text-white/90 text-md leading-relaxed">
                To empower farmers with innovative tools and technology that enhance productivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold">Everything a modern farmer needs</h2>
          <p className="mt-3 text-muted-foreground">From soil to sale — end-to-end tools built for Indian agriculture.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="overflow-hidden hover:shadow-lift transition-shadow pt-0 gap-0">
              <img src={f.image} alt={f.title} className="h-40 w-full object-cover" loading="lazy" />
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="bg-card/60 border-y">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold">Built for the whole ecosystem</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Sprout,
                title: "Farmer",
                desc: "List produce, get AI advice and government schemes.",
              },
              {
                icon: Users,
                title: "Buyer",
                desc: "Purchase fresh crops directly from farmers.",
              },
              {
                icon: ShieldCheck,
                title: "Admin",
                desc: "Manage users, crop listings and government schemes.",
              },
            ].map((r) => (
              <Card key={r.title}>
                <CardContent className="p-8 text-center">
                  <r.icon className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="mt-5 text-2xl font-bold">{r.title}</h3>
                  <p className="mt-3 text-muted-foreground min-h-[50px]">{r.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
