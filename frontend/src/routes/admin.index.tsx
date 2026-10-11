import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Store, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin Overview — AgriVerse" }],
  }),
  component: AdminOverview,
});

function AdminOverview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_farmers: 0,
    total_buyers: 0,
    total_listings: 0,
    total_schemes: 0,
  });
  const [schemes, setSchemes] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const token = sessionStorage.getItem("token") || sessionStorage.getItem("agri-token");

      if (!token) {
        navigate({ to: "/auth/admin" });
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/admin-dashboard/`,
          {
            headers: token ? {
              Authorization: `Token ${token}`,
            } : {},
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const data = await response.json();
        setStats(data);
        const schemeResponse = await fetch(
          `${API_BASE_URL}/schemes/`,
          {
            headers: token ? {
              Authorization: `Token ${token}`,
            } : {},
          }
        );

        const schemeData = await schemeResponse.json();
        setSchemes(schemeData.slice(0, 4));
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, [navigate]);

  return (
    <div className="p-6 space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 text-white">
        <CardContent className="p-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Welcome back, Admin 👋
            </h1>
            <p className="mt-2 text-green-100 text-lg">
              Manage farmers, buyers, crop listings and government schemes efficiently.
            </p>
            <div className="mt-5 flex gap-3">
              <div className="rounded-full bg-white/20 px-4 py-1 text-sm">
                🌱 AgriVerse Admin
              </div>

            </div>
          </div>
          <div className="hidden lg:block text-right">
            <div className="text-green-100 text-sm">
              Dashboard
            </div>
            <div className="text-5xl">
              🌾
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total Farmers"
          value={stats.total_farmers.toString()}
          delta="Live"
          icon={Users}
          tone="primary"
        />
        <Stat
          label="Total Buyers"
          value={stats.total_buyers.toString()}
          delta="Live"
          icon={Users}
          tone="sky"
        />
        <Stat
          label="Total Listings"
          value={stats.total_listings.toString()}
          delta="Live"
          icon={Store}
          tone="sun"
        />
        <Stat
          label="Total Schemes"
          value={stats.total_schemes.toString()}
          delta="Live"
          icon={ShieldCheck}
          tone="earth"
        />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Latest Government Schemes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Recently added government schemes.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {schemes.length > 0 ? (
              schemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3 hover:bg-muted transition"
                >
                  <div>
                    <h3 className="font-semibold text-base">{scheme.title}</h3>
                    <p className="text-sm text-muted-foreground">
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No schemes available.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  delta,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  icon: any;
  tone: "primary" | "sky" | "sun" | "earth";
}) {
  const colors = {
    primary: "bg-green-100 text-green-700",
    sky: "bg-blue-100 text-blue-700",
    sun: "bg-yellow-100 text-yellow-700",
    earth: "bg-orange-100 text-orange-700",
  }[tone];

  return (
    <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-l-4 border-green-600">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div
            className={`h-12 w-12 rounded-xl flex items-center justify-center ${colors}`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium text-green-600">
            {delta}
          </span>
        </div>
        <div className="mt-5">
          <p className="text-sm text-gray-500">
            {label}
          </p>
          <h2 className="text-4xl font-bold mt-2">
            {value}
          </h2>
        </div>
      </CardContent>
    </Card>
  );
}
