import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";

export const Route = createFileRoute("/admin/schemes")({
  head: () => ({ meta: [{ title: "Schemes — Admin" }] }),
  component: AdminSchemes,
});

function AdminSchemes() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const token = sessionStorage.getItem("token") || sessionStorage.getItem("agri-token");
        const response = await fetch(`${API_BASE_URL}/schemes/`, {
          headers: token ? { Authorization: `Token ${token}` } : {},
        });
        const data = await response.json();
        if (response.ok) {
          setRows(
            data.map((item: any) => ({
              id: item.id,
              name: item.title,
              category: item.eligibility?.category || "General",
              benefit: item.benefits,
              eligibility: Array.isArray(item.eligibility?.states) ? item.eligibility.states.join(", ") : "All",
              description: item.description,
              deadline: item.deadline,
            }))
          );
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSchemes();
  }, []);

  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", category: "", benefit: "", eligibility: "", description: "" });

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token") || sessionStorage.getItem("agri-token");
      const payload = {
        title: f.name,
        description: f.description,
        benefits: f.benefit,
        eligibility: {
          category: f.category || "General",
          states: f.eligibility ? f.eligibility.split(",").map(s => s.trim()).filter(Boolean) : ["All"],
          max_land_size: 999.0,
          crops: ["All"]
        },
        link: "https://agricoop.nic.in/"
      };

      const res = await fetch(`${API_BASE_URL}/schemes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Token ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const item = await res.json();
        setRows(r => [
          ...r,
          {
            id: item.id,
            name: item.title,
            category: item.eligibility?.category || "General",
            benefit: item.benefits,
            eligibility: Array.isArray(item.eligibility?.states) ? item.eligibility.states.join(", ") : "All",
            description: item.description,
            deadline: item.deadline,
          }
        ]);
        setOpen(false);
        setF({ name: "", category: "", benefit: "", eligibility: "", description: "" });
        toast.success("Scheme successfully added across the entire platform!");
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error("Failed to save scheme: " + JSON.stringify(err));
      }
    } catch (error) {
      toast.error("Network error while adding scheme");
    }
  };

  const remove = async (id: string | number) => {
    try {
      const token = sessionStorage.getItem("token") || sessionStorage.getItem("agri-token");
      const res = await fetch(`${API_BASE_URL}/schemes/${id}/`, {
        method: "DELETE",
        headers: token ? { Authorization: `Token ${token}` } : {}
      });

      if (res.ok || res.status === 204 || res.status === 404) {
        setRows(r => r.filter(x => x.id !== id));
        toast.success("Scheme permanently deleted from project!");
      } else {
        toast.error("Failed to delete scheme from server");
      }
    } catch (error) {
      toast.error("Network error while deleting scheme");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-1"><Link to="/admin"><ArrowLeft className="mr-1 h-4 w-4" /> Back to overview</Link></Button>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0"><h1 className="text-2xl font-bold">Scheme management</h1><p className="text-sm text-muted-foreground">Add, edit, or remove government schemes.</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="shrink-0"><Plus className="mr-1 h-4 w-4" /> Add Scheme</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add scheme</DialogTitle></DialogHeader>
            <form onSubmit={add} className="space-y-3">
              <div className="space-y-2"><Label>Name</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2"><Label>Category</Label><Input value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Benefit</Label><Input value={f.benefit} onChange={(e) => setF({ ...f, benefit: e.target.value })} required /></div>
              </div>
              <div className="space-y-2"><Label>Eligibility (States)</Label><Input value={f.eligibility} placeholder="All or Maharashtra, Gujarat" onChange={(e) => setF({ ...f, eligibility: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} required /></div>
              <DialogFooter><Button type="submit">Add Scheme</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Benefit</TableHead>
                <TableHead>Eligibility</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell><Badge variant="secondary">{s.category}</Badge></TableCell>
                  <TableCell>{s.benefit}</TableCell>
                  <TableCell>{s.eligibility}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => remove(s.id)}
                      title="Delete scheme"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
