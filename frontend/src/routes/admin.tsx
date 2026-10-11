import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Users, FileText, Store, Menu, Sprout, LogOut } from "lucide-react";
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

const items = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/listings", label: "Listings", icon: Store },
  { to: "/admin/schemes", label: "Schemes", icon: FileText },
];

export const Route = createFileRoute("/admin")({ component: AdminLayout });

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const profile = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    const rawProfile = sessionStorage.getItem(AUTH_KEY);
    if (!rawProfile) {
      navigate({ to: "/auth/admin" });
      return;
    }
    try {
      const p = JSON.parse(rawProfile);
      if (p.role !== "admin") {
        sessionStorage.clear();
        toast.error("Session mismatch — please log in again.");
        navigate({ to: "/auth/admin" });
      }
    } catch (e) {
      sessionStorage.clear();
      navigate({ to: "/auth/admin" });
    }
  }, [navigate]);

  return (
    <div className="flex-1 flex flex-col bg-background">

      <div className="flex-1 grid md:grid-cols-[220px_1fr]">
        <aside className={cn("border-r bg-card md:block", open ? "block" : "hidden")}>
          <nav className="p-3 space-y-1 sticky top-14">
            {items.map((it) => {
              const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
              const Icon = it.icon;
              return (
                <Link key={it.to} to={it.to} onClick={() => setOpen(false)} className={cn("flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium", active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground")}>
                  <Icon className="h-4 w-4" /> {it.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0">
          <div className="md:hidden border-b p-2">
            <Button variant="ghost" size="sm" onClick={() => setOpen(!open)}><Menu className="h-4 w-4 mr-1" /> Menu</Button>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
