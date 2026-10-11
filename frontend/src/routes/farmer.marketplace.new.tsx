import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";



export const Route = createFileRoute("/farmer/marketplace/new")({
  head: () => ({ meta: [{ title: "Add Produce Listing — AgriVerse" }] }),
  component: NewListing,
});

function NewListing() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [crop, setCrop] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [grade, setGrade] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const pickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop || !quantity || !price || !grade || !harvestDate) {
      toast.error("Please fill in all required fields (Crop, Quantity, Price, Grade, Harvest Date).");
      return;
    }
    
    const emojiMap: Record<string, string> = { Wheat: "🌾", Rice: "🍚", Cotton: "🧺", Onion: "🧅", Tomato: "🍅", Potato: "🥔", Maize: "🌽", Soybean: "🫘", Groundnut: "🥜", Sugarcane: "🎋" };
    const defaultImage = Object.entries(emojiMap).find(([k]) => crop.toLowerCase().includes(k.toLowerCase()))?.[1] || "🌱";

    const token = sessionStorage.getItem("agri-token");
    if (!token) {
      toast.error("You must be logged in to add a listing.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/listings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`
        },
        body: JSON.stringify({
          crop,
          quantity: Number(quantity),
          price: Number(price),
          grade,
          harvest_date: harvestDate,
          description,
          image_data: image || defaultImage
        })
      });

      if (res.ok) {
        toast.success("Listing added successfully");
        navigate({ to: "/farmer/marketplace" });
      } else {
        const err = await res.json();
        toast.error("Failed to add listing: " + JSON.stringify(err));
      }
    } catch (err) {
      toast.error("Network error when adding listing.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Button asChild variant="ghost" size="sm" className="mb-3"><Link to="/farmer/marketplace"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link></Button>
      <Card>
        <CardHeader>
          <CardTitle>Add produce listing</CardTitle>
          <CardDescription>Reach buyers directly — no middlemen fees.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Crop Name <span className="text-destructive">*</span></Label>
                <Input value={crop} onChange={(e) => setCrop(e.target.value)} placeholder="e.g. Fresh Wheat" required />
              </div>
              <div className="space-y-2">
                <Label>Quality Grade <span className="text-destructive">*</span></Label>
                <Select value={grade} onValueChange={setGrade} required>
                  <SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Grade A (Premium)</SelectItem>
                    <SelectItem value="B">Grade B (Standard)</SelectItem>
                    <SelectItem value="C">Grade C (Fair Average Quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantity (Quintals) <span className="text-destructive">*</span></Label>
                <Input type="number" min="1" max="10000" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 50" required />
              </div>
              <div className="space-y-2">
                <Label>Expected Price per Quintal (₹) <span className="text-destructive">*</span></Label>
                <Input type="number" min="0" max="1000000" step="any" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 2450" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Harvest Date <span className="text-destructive">*</span></Label>
              <Input type="date" value={harvestDate} onChange={(e) => setHarvestDate(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Add any details like organically grown, moisture content, variety, or delivery terms..." />
            </div>

            <div className="space-y-2">
              <Label>Produce Image (Optional)</Label>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={pickImage} />
              {image ? (
                <div className="relative h-40 w-full overflow-hidden rounded-xl border">
                  <img src={image} alt="Listing preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImage(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-background/90 border shadow-sm hover:bg-accent"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed rounded-xl p-6 text-center bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <div className="text-sm mt-2">Tap to upload a photo of your produce</div>
                  <div className="text-xs text-muted-foreground">JPG, PNG up to 5MB</div>
                </button>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" type="button" asChild><Link to="/farmer/marketplace">Cancel</Link></Button>
              <Button type="submit">Publish Listing</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
