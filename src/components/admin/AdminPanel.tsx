import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users, Eye, Download, LogIn } from "lucide-react";

interface EventRow {
  id: string;
  event_type: string;
  path: string | null;
  user_id: string | null;
  session_id: string | null;
  created_at: string;
  metadata: any;
}

interface Stats {
  total: number;
  logins: number;
  downloads: number;
  pageViews: number;
  uniqueSessions: number;
  uniqueUsers: number;
  topPaths: { path: string; count: number }[];
  recent: EventRow[];
}

export const AdminPanel = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("analytics_events")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(1000);
      if (cancelled) return;
      if (error) {
        setLoading(false);
        return;
      }
      const events = (data as EventRow[]) || [];
      const pathCounts = new Map<string, number>();
      events
        .filter((e) => e.event_type === "page_view" && e.path)
        .forEach((e) => pathCounts.set(e.path!, (pathCounts.get(e.path!) || 0) + 1));
      const topPaths = [...pathCounts.entries()]
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      setStats({
        total: events.length,
        logins: events.filter((e) => e.event_type === "login").length,
        downloads: events.filter((e) => e.event_type === "download").length,
        pageViews: events.filter((e) => e.event_type === "page_view").length,
        uniqueSessions: new Set(events.map((e) => e.session_id).filter(Boolean)).size,
        uniqueUsers: new Set(events.map((e) => e.user_id).filter(Boolean)).size,
        topPaths,
        recent: events.slice(0, 15),
      });
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [days]);

  return (
    <div className="mb-10 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Admin
          </div>
          <h2 className="mt-2 font-display text-2xl tracking-tight">Statistik</h2>
          <p className="text-sm text-muted-foreground">Endast synlig för administratörer.</p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value={1}>Senaste 24h</option>
          <option value={7}>Senaste 7 dagar</option>
          <option value={30}>Senaste 30 dagar</option>
          <option value={90}>Senaste 90 dagar</option>
        </select>
      </div>

      {loading || !stats ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} label="Unika besökare" value={stats.uniqueSessions} />
            <StatCard icon={LogIn} label="Inloggningar" value={stats.logins} />
            <StatCard icon={Eye} label="Sidvisningar" value={stats.pageViews} />
            <StatCard icon={Download} label="Nedladdningar" value={stats.downloads} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display text-lg">Populäraste sidor</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {stats.topPaths.length === 0 && <li className="text-muted-foreground">Ingen data än.</li>}
                {stats.topPaths.map((p) => (
                  <li key={p.path} className="flex items-center justify-between gap-3">
                    <span className="truncate font-mono text-xs text-foreground">{p.path}</span>
                    <span className="text-muted-foreground">{p.count}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display text-lg">Senaste händelser</h3>
              <ul className="mt-3 space-y-2 text-xs">
                {stats.recent.map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-3 border-b border-border/50 pb-1.5 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">{e.event_type}</span>
                      {e.path && <span className="truncate font-mono text-muted-foreground">{e.path}</span>}
                    </div>
                    <span className="shrink-0 text-muted-foreground">
                      {new Date(e.created_at).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: number }) => (
  <div className="rounded-2xl border border-border bg-card p-4">
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Icon className="h-4 w-4" /> {label}
    </div>
    <div className="mt-2 font-display text-3xl">{value}</div>
  </div>
);
