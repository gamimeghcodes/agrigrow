import { createFileRoute, useNavigate, Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Phone, Sprout, LogOut, ArrowLeft } from "lucide-react";
import { STATES, DISTRICTS } from "@/lib/india-data";
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

function getProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(AUTH_KEY) ?? "null"); } catch { return null; }
}

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


export const Route = createFileRoute("/auth/buyer")({
  head: () => ({ meta: [{ title: "Buyer login — AgriVerse" }] }),
  component: BuyerAuth,
});

type Mode = "login" | "signup";

function BuyerAuth() {
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<"credentials" | "profile">("credentials");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
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
        body: JSON.stringify({ username, password, role: "buyer" })
      });
      const data = await res.json();
      
      if (!res.ok) {
        toast.error("User does not exist, please sign up first.");
        return;
      }

      sessionStorage.setItem("agri-token", data.token);
      setProfile(data.user);
      toast.success(`Welcome back!`);
      navigate({ to: "/buyer" });
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

  const finish = async () => {
    try {
      const profile = {
        role: "buyer" as const, name: name || "Buyer", mobile, username, password, state, district
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
        toast.success("Welcome to AgriVerse!");
        navigate({ to: "/buyer" });
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
          backgroundImage: "url('/buyer-auth-bg.webp')",
        }}
      />
      {/* Overlay to ensure form readability */}
      <div className="absolute inset-0 -z-10 bg-black/40 backdrop-blur-[2px]" />

      <Link
        to="/role-select"
        className="fixed left-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border bg-card/90 shadow-sm backdrop-blur transition-colors hover:bg-accent"
        aria-label="Back"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>

      <main className="flex-1 grid place-items-center px-4 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-sky/20 grid place-items-center text-sky mb-2"><ShoppingBag className="h-5 w-5" /></div>
            <CardTitle>{mode === "login" ? "Buyer login" : "Buyer sign up"}</CardTitle>
            <CardDescription>
              {mode === "login" ? "Log in with your registered mobile number." : "Quick sign-up with your mobile number."}
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
                  <Input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                </div>
                <Button className="w-full" disabled={!username || !password} onClick={handleLogin}>
                  Log In
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  New here? <button type="button" className="text-sky font-medium hover:underline" onClick={() => switchMode("signup")}>Create an account</button>
                </p>
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
                  <Input type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                </div>
                <Button className="w-full" disabled={mobile.length !== 10 || !username || !password} onClick={proceedToProfile}>
                  Next
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Already registered? <button type="button" className="text-sky font-medium hover:underline" onClick={() => switchMode("login")}>Log in</button>
                </p>
              </>
            )}

            {step === "profile" && (<>
              <div className="space-y-2"><Label>Business Name / Full Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Green Bazaar Traders" autoComplete="off" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2"><Label>State</Label>
                  <Select value={state} onValueChange={(v) => { setState(v); setDistrict(""); }}>
                    <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                    <SelectContent>{STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>City / District</Label>
                  <Select value={district} onValueChange={setDistrict} disabled={!state}>
                    <SelectTrigger><SelectValue placeholder="Select District" /></SelectTrigger>
                    <SelectContent>{(DISTRICTS[state] ?? []).map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full mt-2" disabled={!name || !state || !district} onClick={finish}>Complete Registration</Button>
            </>)}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
