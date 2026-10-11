import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";


function AIProcessing({ label = "Analyzing your data..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative">
        <div className="h-20 w-20 rounded-full bg-primary/10 animate-pulse" />
        <Loader2 className="absolute inset-0 m-auto h-10 w-10 text-primary animate-spin" />
      </div>
      <div className="text-center">
        <div className="font-semibold">{label}</div>
        <div className="text-sm text-muted-foreground mt-1">Our AI is processing your inputs</div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/farmer/crop-recommendation")({
  head: () => ({ meta: [{ title: "Crop Recommendation — AgriVerse" }] }),
  component: CropRec,
});

type Recommendation = { crop: string; score: number; advice: string; };

function CropRec() {
  const [f, setF] = useState({ N: "90", P: "42", K: "43", avg_temperature: "20.8", humidity: "82", soil_ph: "6.5", rainfall: "202" });
  const [mode, setMode] = useState<"idle" | "processing" | "results">("idle");
  const [results, setResults] = useState<Recommendation[]>([]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMode("processing");
    try {
        const payload = {
            N: f.N,
            P: f.P,
            K: f.K,
            rainfall: f.rainfall,
            temp: f.avg_temperature,
            humidity: f.humidity,
            ph: f.soil_ph
        };
        const res = await fetch(`${API_BASE_URL}/crop-recommend/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            const data = await res.json();
            setResults(Array.isArray(data) ? data : data.recommendations || []);
            setMode("results");
        } else {
            toast.error("Failed to fetch recommendation");
            setMode("idle");
        }
    } catch (err) {
        toast.error("Network error");
        setMode("idle");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">

      <div>
        <h1 className="text-2xl font-bold">Smart Crop Recommendation</h1>
        <p className="text-sm text-muted-foreground">Get AI-powered crop suggestions based on your local conditions.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Enter your field conditions</CardTitle><CardDescription>All fields required for best results.</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Nitrogen (N)</Label><Input type="number" min="0" max="200" step="any" required value={f.N} onChange={(e) => setF({ ...f, N: e.target.value })} /></div>
            <div className="space-y-2"><Label>Phosphorous (P)</Label><Input type="number" min="0" max="200" step="any" required value={f.P} onChange={(e) => setF({ ...f, P: e.target.value })} /></div>
            <div className="space-y-2"><Label>Potassium (K)</Label><Input type="number" min="0" max="200" step="any" required value={f.K} onChange={(e) => setF({ ...f, K: e.target.value })} /></div>
            <div className="space-y-2"><Label>Avg Temperature (°C)</Label><Input type="number" min="-20" max="60" step="any" required value={f.avg_temperature} onChange={(e) => setF({ ...f, avg_temperature: e.target.value })} /></div>
            <div className="space-y-2"><Label>Humidity (%)</Label><Input type="number" min="0" max="100" step="any" required value={f.humidity} onChange={(e) => setF({ ...f, humidity: e.target.value })} /></div>
            <div className="space-y-2"><Label>Soil pH</Label><Input type="number" min="0" max="14" step="0.1" required value={f.soil_ph} onChange={(e) => setF({ ...f, soil_ph: e.target.value })} /></div>
            <div className="space-y-2"><Label>Rainfall (mm/year)</Label><Input type="number" min="0" max="15000" step="any" required value={f.rainfall} onChange={(e) => setF({ ...f, rainfall: e.target.value })} /></div>
            <div className="sm:col-span-2">
              <Button type="submit" className="w-full sm:w-auto"><Sprout className="mr-1 h-4 w-4" /> Get Recommendation</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {mode === "processing" && <Card><CardContent><AIProcessing label="Matching crops to your soil profile..." /></CardContent></Card>}
      {mode === "results" && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">The best suitable crop for you</h2>
          <div className="grid gap-3 max-w-md">
            {results.slice(0, 1).map((c, i) => (
              <Card key={c.crop} className="border-primary/40 shadow-lift">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-lg">{c.crop}</div>
                    {i === 0 && <span className="text-[10px] font-bold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">Best</span>}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Suitability</span><span className="font-semibold text-foreground">{c.score}%</span>
                  </div>
                  <Progress value={c.score} className="mt-1 h-2" />
                  <p className="text-xs text-muted-foreground mt-3">{c.advice}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
