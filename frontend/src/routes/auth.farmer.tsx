import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sprout, Phone, ArrowLeft, Eye, EyeOff } from "lucide-react";
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
const AUTH_USERS_KEY = "agri-users";

function setProfile(p: Profile | null) {
  if (typeof window === "undefined") return;
  if (p) sessionStorage.setItem(AUTH_KEY, JSON.stringify(p));
  else sessionStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event("agri-profile-change"));
}

function getRegisteredUsers(): Profile[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(AUTH_USERS_KEY) ?? "[]"); } catch { return []; }
}

// Saves/updates a user record so they can log back in later without re-registering.
function saveRegisteredUser(p: Profile) {
  if (typeof window === "undefined") return;
  const users = getRegisteredUsers().filter((u) => !(u.mobile === p.mobile && u.role === p.role));
  users.push(p);
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function findRegisteredUser(mobile: string, role: Role): Profile | null {
  return getRegisteredUsers().find((u) => u.mobile === mobile && u.role === role) ?? null;
}

import { STATES, DISTRICTS } from "../lib/india-data";

const CROPS = [
  "Wheat", "Rice", "Cotton", "Sugarcane", "Soybean", "Groundnut",
  "Onion", "Tomato", "Potato", "Maize", "Bajra", "Jowar", "Pulses", "Mustard",
];

export const Route = createFileRoute("/auth/farmer")({
  head: () => ({ meta: [{ title: "Farmer login — AgriVerse" }] }),
  component: FarmerAuth,
});

type Mode = "login" | "signup";
type Step = "credentials" | "profile";

function FarmerAuth() {
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>("credentials");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", state: "", district: "", landSize: 0, crop: "", category: "Small", income: "Below ₹2 lakh" });
  const navigate = useNavigate();

  const switchMode = (m: Mode) => {
    setMode(m);
    setStep("credentials");
  };

  const validatePassword = (pwd: string) => {
    const minLength = pwd.length >= 8;
    const hasAlphabet = /[a-zA-Z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);
    return minLength && hasAlphabet && hasUpper && hasNumber && hasSpecial;
  };

  const handleLogin = async () => {
    if (!validatePassword(password)) {
      toast.error("Password must be at least 8 characters and include an uppercase letter, a number, and a special character.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role: "farmer" })
      });
      const data = await res.json();
      
      if (!res.ok) {
        toast.error("User does not exist, please sign up first.");
        return;
      }

      sessionStorage.setItem("agri-token", data.token);
      setProfile(data.user);
      toast.success(`Welcome back!`);
      navigate({ to: "/farmer" });
    } catch (e: any) {
      toast.error(e.message || "Network error");
    }
  };

  const proceedToProfile = async () => {
    if (!mobile || !username || !password) {
      toast.error("Please fill all fields.");
      return;
    }
    if (!validatePassword(password)) {
      toast.error("Password must be at least 8 characters and include an uppercase letter, a number, and a special character.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/auth/check-user/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, mobile }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.exists) {
          toast.error(data.message || "User already exists. Please login instead.");
          return;
        }
      }
    } catch (e: any) {
      toast.error(e.message || "Network error while checking user.");
      return;
    }
    setStep("profile");
  };

  const submitProfile = async () => {
    try {
      const profile = {
        role: "farmer" as const, name: form.name, mobile, state: form.state, district: form.district,
        land_size: form.landSize, crops: [form.crop], category: form.category, username, password
      };
      const res = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem("agri-token", data.token);
        setProfile(data.user);
        toast.success("Profile created! Welcome to AgriVerse.");
        navigate({ to: "/farmer" });
      } else {
        const err = await res.json();
        toast.error("Failed to register: " + JSON.stringify(err));
      }
    } catch (e: any) {
      toast.error(e.message || "Network error");
    }
  };

  return (
    <div className="relative isolate flex-1 flex flex-col overflow-hidden">
      {/* Background Image Layer */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: "url('/pexels-photo-8703373.avif')", // Replace with your image
        }}
      />
      {/* Overlay to ensure form readability */}
      <div className="absolute inset-0 -z-10 bg-black/40 backdrop-blur-[2px]" />


      <main className="flex-1 grid place-items-center px-4 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary mb-2">
              <Sprout className="h-5 w-5" />
            </div>
            <CardTitle>{mode === "login" ? "Farmer login" : "Farmer sign up"}</CardTitle>
            <CardDescription>
              {step === "credentials" && mode === "login" && "Enter your credentials to log in."}
              {step === "credentials" && mode === "signup" && "Enter your details to create an account."}
              {step === "profile" && "Complete your profile to get personalized recommendations."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === "credentials" && (
              <Tabs value={mode} onValueChange={(v) => switchMode(v as Mode)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Log in</TabsTrigger>
                  <TabsTrigger value="signup">Sign up</TabsTrigger>
                </TabsList>
              </Tabs>
            )}
            {step === "credentials" && mode === "login" && (
              <>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="off" />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button className="w-full" disabled={!username || !password} onClick={handleLogin}>
                  Log In
                </Button>
              </>
            )}
            {step === "credentials" && mode === "signup" && (
              <>
                <div className="space-y-2">
                  <Label>Mobile number</Label>
                  <div className="flex gap-2">
                    <div className="grid place-items-center px-3 rounded-md border bg-muted text-sm">+91</div>
                    <Input type="tel" maxLength={10} placeholder="98765 43210" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))} autoComplete="off" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input type="text" placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="off" />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button className="w-full" disabled={mobile.length !== 10 || !username || !password} onClick={proceedToProfile}>
                  Next
                </Button>
              </>
            )}
            {step === "profile" && (
              <div className="space-y-3">
                <div className="space-y-2"><Label>Full name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ramesh Patil" autoComplete="off" /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2"><Label>State</Label>
                    <Select value={form.state} onValueChange={(v) => setForm({ ...form, state: v, district: "" })}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>District</Label>
                    <Select value={form.district} onValueChange={(v) => setForm({ ...form, district: v })} disabled={!form.state}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{(DISTRICTS[form.state] ?? []).map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2"><Label>Land (acres)</Label><Input type="number" min="0" max="10000" step="any" required value={form.landSize || ""} onChange={(e) => setForm({ ...form, landSize: Number(e.target.value) })} /></div>
                  <div className="space-y-2"><Label>Main crop</Label>
                    <Select value={form.crop} onValueChange={(v) => setForm({ ...form, crop: v })}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{CROPS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2"><Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Marginal">Marginal (&lt;1 ha)</SelectItem>
                        <SelectItem value="Small">Small (1–2 ha)</SelectItem>
                        <SelectItem value="Semi-medium">Semi-medium (2–4 ha)</SelectItem>
                        <SelectItem value="Medium">Medium (4–10 ha)</SelectItem>
                        <SelectItem value="Large">Large (&gt;10 ha)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Annual income</Label>
                    <Select value={form.income} onValueChange={(v) => setForm({ ...form, income: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Below ₹2 lakh">Below ₹2 lakh</SelectItem>
                        <SelectItem value="₹2–5 lakh">₹2–5 lakh</SelectItem>
                        <SelectItem value="₹5–10 lakh">₹5–10 lakh</SelectItem>
                        <SelectItem value="Above ₹10 lakh">Above ₹10 lakh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full" onClick={submitProfile} disabled={!form.name || !form.state || !form.district || !form.crop}>
                  Complete Setup
                </Button>
              </div>
            )}
            {step === "credentials" && (
              <p className="text-center text-sm text-muted-foreground">
                {mode === "login" ? (
                  <>New here? <button type="button" className="text-primary font-medium hover:underline" onClick={() => switchMode("signup")}>Create an account</button></>
                ) : (
                  <>Already registered? <button type="button" className="text-primary font-medium hover:underline" onClick={() => switchMode("login")}>Log in</button></>
                )}
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
