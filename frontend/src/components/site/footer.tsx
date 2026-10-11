import { Sprout } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg">
            <Sprout className="h-5 w-5 text-primary" />
            AgriVerse
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Smart agriculture platform for Indian farmers, buyers, and administrators.
          </p>
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
