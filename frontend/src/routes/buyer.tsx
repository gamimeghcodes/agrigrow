import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";

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

export const Route = createFileRoute("/buyer")({ component: BuyerLayout });

function BuyerLayout() {
  const profile = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    const rawProfile = sessionStorage.getItem(AUTH_KEY);
    if (!rawProfile) {
      navigate({ to: "/auth/buyer" });
      return;
    }
    try {
      const p = JSON.parse(rawProfile);
      if (p.role !== "buyer") {
        sessionStorage.clear();
        toast.error("Session mismatch — please log in again.");
        navigate({ to: "/auth/buyer" });
      }
    } catch (e) {
      sessionStorage.clear();
      navigate({ to: "/auth/buyer" });
    }
  }, [navigate]);

  return (
    <div className="flex-1 flex flex-col bg-background">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
