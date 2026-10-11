import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Pencil, ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";

export type BackendListing = {
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
  farmer: number;
};

function getProfile() {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(sessionStorage.getItem("agri-profile") ?? "null"); } catch { return null; }
}

export const Route = createFileRoute("/farmer/marketplace/")({
  head: () => ({ meta: [{ title: "My Marketplace — AgriVerse" }] }),
  component: Marketplace,
});

function Marketplace() {
  const [listings, setListings] = useState<BackendListing[]>([]);
  const [query, setQuery] = useState("");
  const profile = getProfile();
  
  useEffect(() => {
    const fetchListings = async () => {
      const token = sessionStorage.getItem("agri-token");
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/listings/?my_listings=true`, {
          headers: { "Authorization": `Token ${token}` }
        });
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

  const remove = async (id: number) => {
    const token = sessionStorage.getItem("agri-token");
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/listings/${id}/`, {
        method: "DELETE",
        headers: { "Authorization": `Token ${token}` }
      });
      if (res.ok) {
        setListings((l) => l.filter((x) => x.id !== id));
        toast.success("Listing removed");
      } else {
        toast.error("Failed to remove listing");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const filtered = listings.filter((l) => l.crop.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold truncate">Smart Marketplace</h1>
          <p className="text-sm text-muted-foreground">Manage your produce listings.</p>
        </div>
        <Button asChild className="shrink-0"><Link to="/farmer/marketplace/new"><Plus className="mr-1 h-4 w-4" /> Add Listing</Link></Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your listings by crop name..."
          className="pl-9"
        />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">My listings</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filtered.map((l) => (
              <div key={l.id} className="p-4 grid grid-cols-[auto_minmax(0,1fr)_auto] gap-4 items-center">
                <div className="h-14 w-14 rounded-xl bg-muted grid place-items-center text-3xl shrink-0 overflow-hidden">
                  {l.image_data?.startsWith("data:") ? (
                    <img src={l.image_data} alt={l.crop} className="h-full w-full object-cover" />
                  ) : (
                    l.image_data || "🌱"
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-lg">{l.crop}</div>
                  <div className="text-sm text-muted-foreground mt-0.5 truncate flex items-center gap-2">
                    <span>{l.quantity} quintals</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                    <span>Grade {l.grade}</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                    <span>₹{l.price}/q</span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(l.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                {listings.length === 0 ? "No listings yet." : "No listings match your search."}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
