import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Sprout, ShoppingBag, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";


export const Route = createFileRoute("/role-select")({
  head: () => ({ meta: [{ title: "Choose your role — AgriVerse" }] }),
  component: RoleSelect,
});

const roles = [
  { to: "/auth/farmer", icon: Sprout, title: "I'm a Farmer", desc: "Sell produce, get AI crop advice, check government schemes, and track weather.", color: "primary" },
  { to: "/auth/buyer", icon: ShoppingBag, title: "I'm a Buyer", desc: "Source fresh produce directly from verified farmers across India.", color: "sky" },
  { to: "/auth/admin", icon: ShieldCheck, title: "I'm an Admin", desc: "Manage agricultural schemes, oversee listings, and administer platform operations.", color: "earth" },
];

function RoleSelect() {
  return (
    <div className="flex-1 flex flex-col">
      <Link
        to="/"
        className="fixed left-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border bg-card/90 shadow-sm backdrop-blur transition-colors hover:bg-accent"
        aria-label="Back"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>
      <main className="relative flex-1 flex flex-col overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/role.webp')" }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative flex-1 mx-auto max-w-5xl w-full px-4 py-12 sm:py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Welcome to AgriVerse</h1>
            <p className="mt-3 text-white/85">Pick the role that best describes you. You can always switch later.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {roles.map((r) => (
              <Link key={r.to} to={r.to} className="group">
                <Card className="h-full bg-card/95 backdrop-blur hover:shadow-lift hover:border-primary/40 transition-all">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 grid place-items-center text-primary">
                      <r.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-semibold text-lg">{r.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 flex-1">{r.desc}</p>
                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                      Continue <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}