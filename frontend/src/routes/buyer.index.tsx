import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Heart, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";
import { buildWhatsAppLink } from "@/lib/whatsapp";

// ---- inlined from src/lib/mock-data.ts (kept local to this file on purpose) ----
// Mock data for the Smart Agriculture Platform prototype

const AUTH_KEY = "agri-profile";
type Profile = { role: "farmer" | "buyer" | "admin", username: string, name: string, mobile?: string, state?: string, district?: string };
function getProfile(): Profile | null {
  try { return JSON.parse(sessionStorage.getItem(AUTH_KEY) ?? "null"); } catch { return null; }
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

const STATES = [
  "Maharashtra", "Karnataka", "Punjab", "Uttar Pradesh", "Gujarat", "Tamil Nadu",
  "Madhya Pradesh", "Rajasthan", "Andhra Pradesh", "West Bengal", "Bihar", "Haryana",
];

const CROPS = [
  "Wheat", "Rice", "Cotton", "Sugarcane", "Soybean", "Groundnut",
  "Onion", "Tomato", "Potato", "Maize", "Bajra", "Jowar", "Pulses", "Mustard",
];

type BackendListing = {
  id: number;
  crop: string;
  quantity: number;
  price: number;
  grade: string;
  harvest_date: string;
  description: string;
  image_data: string;
  status: string;
  farmer_name: string;
  farmer_location: string;
  farmer_mobile: string | null;
};

export const Route = createFileRoute("/buyer/")({
  head: () => ({ meta: [{ title: "Browse Produce — AgriVerse" }] }),
  component: BuyerBrowse,
});

function BuyerBrowse() {
  const profile = useProfile();
  const name = profile?.name || profile?.username || "Buyer";
  const [q, setQ] = useState("");
  const [crop, setCrop] = useState("all");
  const [state, setState] = useState("all");
  const [listings, setListings] = useState<BackendListing[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/listings/`);
        if (res.ok) {
          const data = await res.json();
          setListings(data);
        }
      } catch (err) {
        console.error("Failed to load listings", err);
      }
    };
    fetchListings();
  }, []);

  const filtered = useMemo(() => listings.filter(l =>
    l.status.toLowerCase() === "active"
    && (q === "" || l.crop.toLowerCase().includes(q.toLowerCase()) || l.farmer_name.toLowerCase().includes(q.toLowerCase()))
    && (crop === "all" || l.crop.toLowerCase() === crop.toLowerCase())
    && (state === "all" || l.farmer_location.toLowerCase().includes(state.toLowerCase()))
  ), [q, crop, state, listings]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hi, {name}! 👋</h1>
        <h2 className="text-xl font-semibold mt-2">
          Browse Fresh Produce
        </h2>
        <p className="text-sm text-muted-foreground">
          Direct from verified farmers across India.
        </p>
      </div>

      <Card>
        <CardContent className="p-4 grid gap-2 sm:grid-cols-[1fr_160px_160px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search crop or farmer..." className="pl-9" />
          </div>
          <Select value={crop} onValueChange={setCrop}>
            <SelectTrigger><SelectValue placeholder="Crop" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All crops</SelectItem>{CROPS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All states</SelectItem>{STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((l) => (
          <Card key={l.id} className="hover:shadow-lift transition-shadow overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-accent/30 to-primary/10 grid place-items-center overflow-hidden">
              {l.image_data?.startsWith("data:") ? (
                <img src={l.image_data} alt={l.crop} className="h-full w-full object-cover" />
              ) : (
                <span className="text-7xl">{l.image_data || "🌱"}</span>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold text-lg hover:underline"><Link to="/buyer/listing/$id" params={{ id: l.id.toString() }}>{l.crop}</Link></div>
                  <div className="text-sm text-muted-foreground truncate">by {l.farmer_name}</div>
                </div>
                <Badge variant="outline" className="shrink-0 text-[10px]">Grade {l.grade}</Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {l.farmer_location}</div>
              <div className="mt-3 flex items-baseline justify-between">
                <div><span className="text-xl font-bold">₹{l.price}</span><span className="text-xs text-muted-foreground">/quintal</span></div>
                <div className="text-xs text-muted-foreground">{l.quantity} q available</div>
              </div>
              {(() => {
                const waLink = buildWhatsAppLink(l.farmer_mobile, l.farmer_name, l.crop);
                return waLink ? (
                  <Button asChild size="sm" className="w-full mt-3 bg-[#25D366] hover:bg-[#1ebd5a] text-white">
                    <a href={waLink} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-1 h-3 w-3" /> Contact via WhatsApp</a>
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="w-full mt-3" disabled>
                    <MessageCircle className="mr-1 h-3 w-3" /> No contact number on file
                  </Button>
                );
              })()}
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <div className="col-span-full text-center text-sm text-muted-foreground py-12">No listings match your filters.</div>}
      </div>
    </div>
  );
}
