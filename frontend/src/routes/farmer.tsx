import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Home, Store, FileText, Sprout, TrendingUp, CloudSun, LineChart, LogOut, Cpu } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ---- inlined from src/lib/utils.ts (kept local to this file on purpose) ----
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

// ---- inlined from src/components/site/farmer-nav.tsx (kept local to this file on purpose) ----
const farmerBottomNavItems = [
  { to: "/farmer", label: "Home", icon: Home, exact: true },
  { to: "/farmer/marketplace", label: "Market", icon: Store },
  { to: "/farmer/schemes", label: "Schemes", icon: FileText },
  { to: "/farmer/market-price", label: "Prices", icon: TrendingUp },
  { to: "/farmer/crop-recommendation", label: "Crops", icon: Sprout },
  { to: "/farmer/weather", label: "Weather", icon: CloudSun },
  { to: "/farmer/modern-farming", label: "Modern", icon: Cpu },
];

function FarmerBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t bg-card md:hidden">
      <div className="grid grid-cols-6">
        {farmerBottomNavItems.map((it) => {
          const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
          const Icon = it.icon;
          return (
            <Link key={it.to} to={it.to} className={cn("flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium", active ? "text-primary" : "text-muted-foreground")}>
              <Icon className="h-5 w-5" />
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

const farmerDesktopNavItems = [
  { to: "/farmer", label: "Dashboard", icon: Home, exact: true },
  { to: "/farmer/marketplace", label: "Marketplace", icon: Store },
  { to: "/farmer/schemes", label: "Schemes", icon: FileText },
  { to: "/farmer/market-price", label: "Market Prices", icon: TrendingUp },
  { to: "/farmer/crop-recommendation", label: "Crop Advisor", icon: Sprout },
  { to: "/farmer/weather", label: "Weather", icon: CloudSun },
  { to: "/farmer/modern-farming", label: "Modern Farming", icon: Cpu },
];

function FarmerTopNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="hidden md:block border-b bg-card/60">
      <div className="mx-auto max-w-7xl px-4 flex gap-1 overflow-x-auto">
        {farmerDesktopNavItems.map((it) => {
          const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
          const Icon = it.icon;
          return (
            <Link key={it.to} to={it.to} className={cn("flex items-center gap-2 px-3 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap", active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
              <Icon className="h-4 w-4" /> {it.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/farmer")({ component: FarmerLayout });

function FarmerLayout() {
  const profile = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    const rawProfile = sessionStorage.getItem(AUTH_KEY);
    if (!rawProfile) {
      navigate({ to: "/auth/farmer" });
      return;
    }
    try {
      const p = JSON.parse(rawProfile);
      if (p.role !== "farmer") {
        sessionStorage.clear();
        toast.error("Session mismatch — please log in again.");
        navigate({ to: "/auth/farmer" });
      }
    } catch (e) {
      sessionStorage.clear();
      navigate({ to: "/auth/farmer" });
    }
  }, [navigate]);

  return (
    <div className="flex-1 flex flex-col bg-background">

      <FarmerTopNav />
      <main className="flex-1 pb-20 md:pb-6">
        <Outlet />
      </main>
      <FarmerBottomNav />
    </div>
  );
}
