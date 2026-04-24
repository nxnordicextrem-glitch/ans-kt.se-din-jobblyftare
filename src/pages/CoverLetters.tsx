import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Mail, Trash2, Loader2 } from "lucide-react";

interface Row {
  id: string;
  title: string;
  language: string;
  job_title: string | null;
  company: string | null;
  match_score: number | null;
  updated_at: string;
}

const CoverLetters = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cover_letters")
      .select("id,title,language,job_title,company,match_score,updated_at")
      .order("updated_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data as Row[]) || []);
    setLoading(false);
  };

  useEffect(() => { if (user) load(); }, [user]);

  const createNew = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("cover_letters")
      .insert({ user_id: user.id })
      .select()
      .single();
    if (error) return toast.error(error.message);
    navigate(`/letter/${data.id}`);
  };

  const remove = async (id: string) => {
    if (!confirm("Radera detta brev permanent?")) return;
    const { error } = await supabase.from("cover_letters").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setItems((s) => s.filter((c) => c.id !== id));
    toast.success("Borttaget");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl tracking-tight">Personliga brev</h1>
            <p className="mt-1 text-muted-foreground">AI-skrivna brev anpassade efter jobbannonsen — och din röst.</p>
          </div>
          <Button variant="hero" size="lg" onClick={createNew}>
            <Plus className="h-4 w-4" /> Nytt brev
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : items.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border bg-card p-16 text-center">
            <Mail className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 font-display text-2xl">Inga brev än</h2>
            <p className="mt-1 text-sm text-muted-foreground">Klistra in en jobbannons så skriver vår AI ett vassare brev åt dig.</p>
            <Button variant="hero" className="mt-6" onClick={createNew}>
              <Plus className="h-4 w-4" /> Skapa mitt första brev
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it) => (
              <div key={it.id} className="group rounded-2xl border border-border bg-card p-5 transition-smooth hover:border-primary/30 hover:shadow-elegant">
                <Link to={`/letter/${it.id}`} className="block">
                  <div className="flex h-32 items-center justify-center rounded-lg bg-gradient-hero">
                    <Mail className="h-10 w-10 text-primary/60" />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-2">
                    <div className="font-display text-lg text-foreground line-clamp-1">{it.title}</div>
                    {typeof it.match_score === "number" && (
                      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {it.match_score}%
                      </span>
                    )}
                  </div>
                  <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {it.job_title || "—"}{it.company ? ` · ${it.company}` : ""} · {new Date(it.updated_at).toLocaleDateString("sv-SE")}
                  </div>
                </Link>
                <div className="mt-3 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => remove(it.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CoverLetters;
