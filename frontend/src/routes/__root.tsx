import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  useNavigate,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Sprout, LogOut } from "lucide-react";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { API_BASE_URL } from "@/lib/api";

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

function Navbar() {
  const profile = useProfile();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (pathname === "/") return null;

  const logout = async () => {
    const isAdmin = profile?.role === "admin";
    const token = isAdmin ? sessionStorage.getItem("token") : (sessionStorage.getItem("agri-token") || sessionStorage.getItem("token"));
    if (token && API_BASE_URL) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout/`, {
          method: "POST",
          headers: { Authorization: `Token ${token}` },
        });
      } catch (err) {
      }
    }
    if (isAdmin) {
      sessionStorage.removeItem("token");
    } else {
      sessionStorage.removeItem("agri-token");
      sessionStorage.removeItem("token");
    }
    setProfile(null);
    setConfirmOpen(false);
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <Sprout className="h-5 w-5 text-primary" />
          AgriVerse
        </Link>
        <div className="flex items-center gap-2">
          {pathname !== "/role-select" && !pathname.startsWith("/auth/") && (
            profile ? (
              <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sign out</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to log out? You'll be signed out and taken back to the homepage.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={logout}>Log out</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm"><Link to="/role-select">Log in</Link></Button>
                <Button asChild size="sm"><Link to="/role-select">Get Started</Link></Button>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}

type LovableErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type LovableEvents = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: LovableErrorOptions,
  ) => void;
};

declare global {
  interface Window {
    __lovableEvents?: LovableEvents;
  }
}

function reportLovableError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    },
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This page doesn't exist or has moved.</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try refreshing.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Try again</button>
          <a href="/" className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AgriVerse — Smart Agriculture Platform for Indian Farmers" },
      { name: "description", content: "Empowering farmers with AI-driven crop recommendations, market prices, government scheme eligibility, weather alerts, and a direct-to-buyer marketplace." },
      { property: "og:title", content: "AgriVerse — Smart Agriculture Platform" },
      { property: "og:description", content: "AI recommendations, market prices, scheme eligibility, and marketplace for Indian farmers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function Footer() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.includes("/admin/")) return null;
  return (
    <footer className="border-t bg-card mt-auto z-10">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg">
            <Sprout className="h-5 w-5 text-primary" />
            AgriVerse
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Smart agriculture platform for Indian farmers, buyers, and administrators.</p>
        </div>
        <div>
          <div className="font-semibold text-sm mb-2">Platform</div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>Get Started</li>
            <li>About</li>
            <li>Features</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-sm mb-2">Support</div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>Help & FAQ</li>
            <li>Contact: help@agriverse.in</li>
            <li>+91 1800-XXX-XXXX (toll free)</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-sm mb-2">Legal</div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Data Protection</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © 2026 AgriVerse. Prototype for demonstration purposes.
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
        <Footer />
      </div>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
