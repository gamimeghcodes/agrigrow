import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Search, ExternalLink, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";

const STATES = [
  "Maharashtra", "Karnataka", "Punjab", "Uttar Pradesh", "Gujarat", "Tamil Nadu",
  "Madhya Pradesh", "Rajasthan", "Andhra Pradesh", "West Bengal", "Bihar", "Haryana",
];

type Scheme = {
  id: number;
  title: string;
  category: string;
  benefits: string;
  eligibility: any;
  description: string;
  match_percentage: number;
  link: string;
};

// ---- inlined from src/components/site/ai-processing.tsx (kept local to this file on purpose) ----
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

export const Route = createFileRoute("/farmer/schemes")({
  head: () => ({ meta: [{ title: "Government Schemes — AgriVerse" }] }),
  component: Schemes,
});

type Mode = "idle" | "processing" | "results";

function Schemes() {
  const [mode, setMode] = useState<Mode>("idle");
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const token = sessionStorage.getItem("agri-token");
        const res = await fetch(`${API_BASE_URL}/schemes/`, {
          headers: token ? { "Authorization": `Token ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setSchemes(data);
        }
      } catch (err) {
        toast.error("Failed to fetch schemes");
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  const check = () => {
    setMode("processing");
    setTimeout(() => setMode("results"), 1800);
  };

  const cats = Array.from(new Set(schemes.map((s) => s.eligibility?.category).filter(Boolean)));
  
  const eligible = useMemo(() => {
    return [...schemes].sort((a, b) => b.match_percentage - a.match_percentage).slice(0, 5);
  }, [schemes]);

  const filtered = useMemo(() => schemes.filter((s) =>
    (query === "" || s.title.toLowerCase().includes(query.toLowerCase()) || s.description.toLowerCase().includes(query.toLowerCase()))
    && (stateFilter === "all" || s.eligibility?.states?.includes("All") || s.eligibility?.states?.includes(stateFilter))
    && (catFilter === "all" || s.eligibility?.category === catFilter)
  ), [query, stateFilter, catFilter, schemes]);

  const { groups, sortedCats } = useMemo(() => {
    const groups: Record<string, Scheme[]> = {};
    filtered.forEach(s => {
      const cat = s.eligibility?.category || "General";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(s);
    });
    const sortedCats = Object.keys(groups).sort();
    sortedCats.forEach(c => {
      groups[c].sort((a, b) => a.title.localeCompare(b.title));
    });
    return { groups, sortedCats };
  }, [filtered]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">

      <div>
        <h1 className="text-2xl font-bold">Government Schemes</h1>
        <p className="text-sm text-muted-foreground">Discover schemes you're eligible for and browse the full directory.</p>
      </div>

      <Tabs defaultValue="eligible">
        <TabsList>
          <TabsTrigger value="eligible">My Eligible Schemes</TabsTrigger>
          <TabsTrigger value="directory">Full Directory</TabsTrigger>
        </TabsList>

        <TabsContent value="eligible" className="mt-4 space-y-4">
          {mode === "idle" && (
            <Card>
              <CardContent className="py-10 text-center">
                <div className="inline-block h-14 w-14 rounded-2xl bg-primary/10 grid place-items-center text-primary mb-4"><Sparkles className="h-7 w-7" /></div>
                <h3 className="font-semibold text-lg">Find schemes matched to your profile</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">We'll analyze your land, crops, and income to identify schemes you can apply for.</p>
                <Button className="mt-4" onClick={check}><Sparkles className="mr-1 h-4 w-4" /> Check My Eligible Schemes</Button>
              </CardContent>
            </Card>
          )}
          {mode === "processing" && <Card><CardContent><AIProcessing label="Analyzing your profile against 200+ schemes..." /></CardContent></Card>}
          {mode === "results" && (
            <div className="grid gap-3 md:grid-cols-2">
              {eligible.map((s) => (
                <Card key={s.id} className="hover:shadow-lift transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-lg">{s.title}</div>
                        <Badge variant="secondary" className="mt-1 text-[10px]">{s.eligibility?.category || "General"}</Badge>
                      </div>
                    </div>
                    <div className="mt-3 text-sm font-medium text-primary">{s.benefits}</div>
                    <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <a href={s.link || "#"} target="_blank" rel="noopener noreferrer">Learn More <ExternalLink className="ml-1 h-3 w-3" /></a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="directory" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-4 grid gap-2 sm:grid-cols-[1fr_180px_180px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search schemes..." className="pl-9" />
              </div>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All states</SelectItem>{STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={catFilter} onValueChange={setCatFilter}>
                <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All categories</SelectItem>{cats.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </CardContent>
          </Card>
          <div className="grid gap-6">
            {sortedCats.map((cat) => (
              <div key={cat} className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2 text-primary">{cat} Schemes</h3>
                <div className="grid gap-3">
                  {groups[cat].map((s) => (
                    <Card key={s.id}>
                      <CardContent className="p-5 grid gap-3 sm:grid-cols-[1fr_auto] items-start">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="font-semibold">{s.title}</div>
                            <Badge variant="secondary" className="text-[10px]">{s.eligibility?.category || "General"}</Badge>
                          </div>
                          <div className="text-sm text-primary font-medium mt-1">{s.benefits}</div>
                          <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
                          <div className="text-xs text-muted-foreground mt-1"><span className="font-medium">Eligibility:</span> {s.eligibility?.states?.includes("All") ? "All States" : s.eligibility?.states?.join(", ")} | Up to {s.eligibility?.max_land_size} Acres</div>
                        </div>
                        <Button size="sm" variant="outline" className="shrink-0" asChild>
                          <a href={s.link || "#"} target="_blank" rel="noopener noreferrer">View Details</a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center text-sm text-muted-foreground py-8">No schemes match your filters.</div>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
