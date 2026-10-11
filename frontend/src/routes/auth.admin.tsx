import { createFileRoute, useNavigate, Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Sprout, LogOut, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";

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

export const Route = createFileRoute("/auth/admin")({
  head: () => ({ meta: [{ title: "Admin login — AgriVerse" }] }),
  component: AdminAuth,
});

function AdminAuth() {
  const [u, setU] = useState("admin");
  const [p, setP] = useState("");
  const navigate = useNavigate();
const login = async () => {
  if (!u || !p) {
    toast.error("Please enter username and password");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: u,
        password: p,
        role: "admin",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error || "Login failed");
      return;
    }

    // Save token
    console.log("Before:", sessionStorage.getItem("token"));

sessionStorage.setItem("token", data.token);

console.log("Saved:", sessionStorage.getItem("token"));

    // Save admin profile
    setProfile({
      role: "admin",
      name: data.user.username,
    });

    toast.success("Welcome Admin!");

    navigate({ to: "/admin" });

  } catch (error: any) {
    toast.error(error.message || "Unable to connect to the server.");
  }
};
  return (
    <div className="relative isolate flex-1 flex flex-col overflow-hidden">
      {/* Background Image Layer */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: "url('/admin_auth_bg.png')",
        }}
      />
      {/* Overlay to ensure form readability */}
      <div className="absolute inset-0 -z-10 bg-black/60 backdrop-blur-[2px]" />
      <main className="flex-1 grid place-items-center px-4 py-10">
        <div className="w-full max-w-md space-y-3">
          <Button asChild variant="ghost" size="sm" className="-ml-2"><Link to="/role-select"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link></Button>
          <Card className="w-full">
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-earth/20 grid place-items-center text-earth mb-2"><ShieldCheck className="h-5 w-5" /></div>
            <CardTitle>Admin login</CardTitle>
            <CardDescription>Restricted access. Demo credentials pre-filled.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Username</Label><Input value={u} onChange={(e) => setU(e.target.value)} /></div>
            <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="any password" value={p} onChange={(e) => setP(e.target.value)} /></div>
            <Button className="w-full" onClick={login} disabled={!u || !p}>Sign in</Button>
          </CardContent>
        </Card>
        </div>
      </main>
    </div>
  );
}
