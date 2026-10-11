import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Package, ArrowLeft, Phone, MessageCircle, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { buildWhatsAppLink } from "@/lib/whatsapp";

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

export const Route = createFileRoute("/buyer/listing/$id")({
  head: () => ({ meta: [{ title: "Listing — AgriVerse" }] }),
  component: ListingDetail,
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <div className="text-lg font-semibold">Listing not found</div>
      <Button asChild className="mt-4"><Link to="/buyer">Back to browse</Link></Button>
    </div>
  ),
});

function ListingDetail() {
  const { id } = Route.useParams();
  const [listing, setListing] = useState<BackendListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/listings/${id}/`);
        if (res.status === 404) {
          if (isMounted) setNotFoundState(true);
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch listing");
        const data = await res.json();
        if (isMounted) setListing(data);
      } catch (err) {
        console.error("Failed to load listing", err);
        if (isMounted) setNotFoundState(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchListing();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFoundState || !listing) {
    throw notFound();
  }

  const l = listing;
  const imageContent = l.image_data?.startsWith("data:") ? (
    <img src={l.image_data} alt={l.crop} className="h-full w-full object-cover" />
  ) : (
    <span className="text-[120px]">{l.image_data || "🌱"}</span>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-4">
      <Button asChild variant="ghost" size="sm"><Link to="/buyer"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link></Button>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-accent/30 to-primary/10 grid place-items-center overflow-hidden">{imageContent}</div>
        </Card>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">Grade {l.grade}</Badge>
              <Badge>{l.status}</Badge>
            </div>
            <h1 className="text-3xl font-bold mt-2">{l.crop}</h1>
            <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> {l.farmer_location}</div>
          </div>
          <div className="text-4xl font-extrabold">₹{l.price.toLocaleString("en-IN")}<span className="text-base font-medium text-muted-foreground">/quintal</span></div>
          <div className="grid grid-cols-2 gap-3">
            <Card><CardContent className="p-3"><div className="text-xs text-muted-foreground flex items-center gap-1"><Package className="h-3 w-3" /> Quantity</div><div className="font-semibold">{l.quantity} quintals</div></CardContent></Card>
            <Card><CardContent className="p-3"><div className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Harvest</div><div className="font-semibold">{l.harvest_date}</div></CardContent></Card>
          </div>
          {l.description && (
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Description</div>
                <div className="text-sm mt-1">{l.description}</div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">Farmer</div>
              <div className="flex items-center gap-3 mt-2">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold">{l.farmer_name.charAt(0)}</div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{l.farmer_name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" /> Contact via WhatsApp below</div>
                </div>
              </div>
            </CardContent>
          </Card>
          {(() => {
            const waLink = buildWhatsAppLink(l.farmer_mobile, l.farmer_name, l.crop);
            return waLink ? (
              <Button asChild size="lg" className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white">
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" /> Contact via WhatsApp
                </a>
              </Button>
            ) : (
              <Button size="lg" variant="outline" className="w-full" disabled>
                <MessageCircle className="mr-2 h-5 w-5" /> Farmer has no contact number on file
              </Button>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
