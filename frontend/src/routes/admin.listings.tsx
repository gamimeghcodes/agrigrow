import { createFileRoute, Link } from "@tanstack/react-router";
import { useState , useEffect} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";

export const Route = createFileRoute("/admin/listings")({
  head: () => ({ meta: [{ title: "Listings — Admin" }] }),
  component: AdminListings,
});

function AdminListings() {
  type Mod = "Pending" | "Approved" | "Flagged" | "Rejected";

  const [rows, setRows] = useState<any[]>([]);

  const deleteListing = async (id: number) => {
    try {
      const token = sessionStorage.getItem("token") || sessionStorage.getItem("agri-token");
      const response = await fetch(`${API_BASE_URL}/listings/${id}/`, {
        method: "DELETE",
        headers: token ? { Authorization: `Token ${token}` } : {},
      });

      if (response.ok) {
        setRows((prev) => prev.filter((row) => row.id !== id));
        toast.success("Listing deleted successfully");
      } else {
        toast.error("Failed to delete listing");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while deleting listing");
    }
  };

  useEffect(() => {
  const fetchListings = async () => {
    try {
      const token = sessionStorage.getItem("token") || sessionStorage.getItem("agri-token");

      const response = await fetch(
        `${API_BASE_URL}/listings/`,
        {
          headers: token ? {
            Authorization: `Token ${token}`,
          } : {},
        }
      );

      const data = await response.json();

      if (response.ok) {
        const formatted = data.map((item: any) => ({
          id: item.id,
          crop: item.crop,
          farmer: item.farmer_name,
          location: item.farmer_location,
          quantity: item.quantity,
          price: item.price,
          grade: item.grade,
          image: item.image_data,
          status: item.status,
          moderation: "Approved",
        }));

        setRows(formatted);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchListings();
}, []);
  return (
    <div className="p-6 space-y-4">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-1"><Link to="/admin"><ArrowLeft className="mr-1 h-4 w-4" /> Back to overview</Link></Button>
      <div><h1 className="text-2xl font-bold">Marketplace moderation</h1><p className="text-sm text-muted-foreground">Review produce listings.</p></div>
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Crop</TableHead><TableHead>Farmer</TableHead><TableHead>Location</TableHead>
              <TableHead>Qty</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {rows.map(l => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.image} {l.crop}</TableCell>
                  <TableCell>{l.farmer}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{l.location}</TableCell>
                  <TableCell>{l.quantity} q</TableCell>
                  <TableCell>₹{l.price}</TableCell>
                  <TableCell>
                    <Badge variant={l.moderation === "Approved" ? "default" : l.moderation === "Flagged" ? "destructive" : "secondary"}>{l.moderation}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => deleteListing(l.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
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
