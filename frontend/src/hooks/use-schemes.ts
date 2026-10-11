import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

export type Scheme = {
  id: number;
  title: string;
  category: string;
  benefits: string;
  eligibility: any;
  description: string;
  match_percentage: number;
  link: string;
  deadline?: string;
};

/**
 * Live government schemes from `/api/schemes/` — the same endpoint used by
 * the farmer schemes page and the admin schemes manager.
 *
 * Shared by the farmer and buyer dashboards so both show real, up-to-date
 * schemes instead of a static, hardcoded list.
 */
export function useSchemes() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSchemes = async () => {
      try {
        const token = sessionStorage.getItem("agri-token");
        const res = await fetch(`${API_BASE_URL}/schemes/`, {
          headers: token ? { Authorization: `Token ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setSchemes(data);
        }
      } catch (err) {
        console.error("Failed to load schemes", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSchemes();
    return () => {
      isMounted = false;
    };
  }, []);

  return { schemes, loading };
}
