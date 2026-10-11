import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search, Eye, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — Admin" }] }),
  component: AdminUsers,
});

function AdminUsers() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [users, setUsers] = useState<any[]>([]);
  const filtered = users.filter(
    (u) =>
      (q === "" || (u.name || u.username || "").toLowerCase().includes(q.toLowerCase())) &&
      (role === "all" || (u.role || "").toLowerCase() === role.toLowerCase())
  );

  const deleteUser = async (id: string | number) => {
    try {
      const token = sessionStorage.getItem("token") || sessionStorage.getItem("agri-token");
      const res = await fetch(`${API_BASE_URL}/admin-users/${id}/`, {
        method: "DELETE",
        headers: token ? {
          Authorization: `Token ${token}`,
        } : {},
      });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
        toast.success("Account and all related records deleted successfully");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete account");
      }
    } catch (err) {
      toast.error("Error deleting user account");
    }
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem("token") || sessionStorage.getItem("agri-token");

        const response = await fetch(
          `${API_BASE_URL}/admin-users/`,
          {
            headers: token ? {
              Authorization: `Token ${token}`,
            } : {},
          }
        );

        const data = await response.json();

        if (response.ok) {
          setUsers(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);
  return (
    <div className="p-6 space-y-4">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-1"><Link to="/admin"><ArrowLeft className="mr-1 h-4 w-4" /> Back to overview</Link></Button>
      <div><h1 className="text-2xl font-bold">User management</h1><p className="text-sm text-muted-foreground">Search, filter, and manage platform users.</p></div>
      <Card>
        <CardContent className="p-4 grid gap-2 sm:grid-cols-[1fr_180px]">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name..." className="pl-9" /></div>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All roles</SelectItem><SelectItem value="Farmer">Farmer</SelectItem><SelectItem value="Buyer">Buyer</SelectItem></SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Location</TableHead>
              <TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(u => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name || u.username}</TableCell>
                  <TableCell><Badge variant="outline">{u.role}</Badge></TableCell>
                  <TableCell>
                    {(u.role || "").toLowerCase() === "admin"
                      ? "Ahmedabad, Gujarat"
                      : [u.district, u.state].filter(Boolean).join(", ") || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.status === "Active" ? "default" : "secondary"}>
                      {u.status || "Deactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {(u.role || "").toLowerCase() === "admin" ? (
                      <span className="text-muted-foreground text-sm pr-3">-</span>
                    ) : (
                      <>
                        <Button size="icon" variant="ghost" title="View details"><Eye className="h-4 w-4" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="hover:bg-destructive/10" title="Delete account">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure you want to delete this account?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. Doing this will remove all details and listings of this user from the entire project.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteUser(u.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
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
