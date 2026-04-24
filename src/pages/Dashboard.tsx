import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, FileText, Trash2, Loader2 } from "lucide-react";
import { sampleCV } from "@/types/cv";

interface CVRow {
  id: string;
  title: string;
  template: string;
  language: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cvs, setCvs] = useState<CVRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cvs")
      .select("id,title,template,language,updated_at")
      .order("updated_at", { ascending: false });
    if (error) toast.error(error.message);
    setCvs((data as CVRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const createNew = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("cvs")
      .insert({ user_id: user.id, title: "Nytt CV", template: "modern", language: "sv", data: sampleCV() as any })
      .select()
      .single();
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate(`/editor/${data.id}`);
  };

  const remove = async (id: string) => {
    if (!confirm("Radera detta CV permanent?")) return;
    const { error } = await supabase.from("cvs").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setCvs((s) => s.filter((c) => c.id !== id));
    toast.success("Borttaget");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl tracking-tight">Mina CV</h1>
            <p className="mt-1 text-muted-foreground">Skapa, redigera och ladda ner dina CV:n.</p>
          </div>
          <Button variant="hero" size="lg" onClick={createNew}>
            <Plus className="h-4 w-4" /> Nytt CV
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : cvs.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border bg-card p-16 text-center">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 font-display text-2xl">Inga CV än</h2>
            <p className="mt-1 text-sm text-muted-foreground">Skapa ditt första CV på under 10 minuter.</p>
            <Button variant="hero" className="mt-6" onClick={createNew}>
              <Plus className="h-4 w-4" /> Skapa mitt första CV
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cvs.map((cv) => (
              <div key={cv.id} className="group rounded-2xl border border-border bg-card p-5 transition-smooth hover:border-primary/30 hover:shadow-elegant">
                <Link to={`/editor/${cv.id}`} className="block">
                  <div className="flex h-32 items-center justify-center rounded-lg bg-gradient-hero">
                    <FileText className="h-10 w-10 text-primary/60" />
                  </div>
                  <div className="mt-4 font-display text-lg text-foreground">{cv.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {cv.template} · {cv.language === "sv" ? "Svenska" : "Engelska"} · uppdaterad {new Date(cv.updated_at).toLocaleDateString("sv-SE")}
                  </div>
                </Link>
                <div className="mt-3 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => remove(cv.id)} className="text-destructive hover:text-destructive">
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

export default Dashboard;
