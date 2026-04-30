import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/contexts/AuthContext";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { FileText, Loader2 } from "lucide-react";

const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Ange ditt namn").max(100),
  email: z.string().trim().email("Ogiltig e-postadress").max(255),
  password: z.string().min(8, "Lösenord måste vara minst 8 tecken").max(72),
  consent: z.literal(true, { errorMap: () => ({ message: "Du måste godkänna villkoren" }) }),
});
const loginSchema = z.object({
  email: z.string().trim().email("Ogiltig e-postadress").max(255),
  password: z.string().min(1, "Ange lösenord").max(72),
});

const Auth = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(params.get("mode") === "signup" ? "signup" : "signin");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "", consent: false });

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const switchMode = (m: "signin" | "signup") => {
    setMode(m);
    setParams(m === "signup" ? { mode: "signup" } : {});
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const parsed = signupSchema.safeParse(form);
        if (!parsed.success) {
          toast.error(parsed.error.errors[0].message);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: parsed.data.fullName,
              gdpr_consent: true,
            },
          },
        });
        if (error) throw error;
        trackEvent("signup", { metadata: { method: "email" } });
        toast.success("Konto skapat! Du är inloggad.");
        navigate("/");
      } else {
        const parsed = loginSchema.safeParse(form);
        if (!parsed.success) {
          toast.error(parsed.error.errors[0].message);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        trackEvent("login", { metadata: { method: "email" } });
        toast.success("Välkommen tillbaka!");
        navigate("/");
      }
    } catch (err: any) {
      const msg = err?.message || "Något gick fel";
      if (msg.includes("already registered")) toast.error("E-postadressen är redan registrerad");
      else if (msg.includes("Invalid login")) toast.error("Felaktig e-post eller lösenord");
      else toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(result.error.message || "Google-inloggning misslyckades");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    trackEvent("login", { metadata: { method: "google" } });
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-hero">
      <header className="container py-6">
        <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-semibold">
          <FileText className="h-5 w-5 text-primary" />
          Ansökt
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-elegant md:p-10">
            <h1 className="font-display text-3xl tracking-tight">
              {mode === "signup" ? "Skapa ditt konto" : "Välkommen tillbaka"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signup" ? "Börja bygga ditt CV på under 10 minuter." : "Logga in för att fortsätta."}
            </p>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="mt-6 w-full"
              onClick={handleGoogle}
              disabled={loading}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Fortsätt med Google
            </Button>

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
              <div className="h-px flex-1 bg-border" />eller<div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleEmail} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Namn</Label>
                  <Input id="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Anna Andersson" required />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">E-post</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="anna@exempel.se" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Lösenord</Label>
                <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={mode === "signup" ? "Minst 8 tecken" : "Ditt lösenord"} required />
              </div>
              {mode === "signup" && (
                <label className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Checkbox checked={form.consent} onCheckedChange={(v) => setForm({ ...form, consent: !!v })} className="mt-0.5" />
                  <span>
                    Jag godkänner <a href="/anvandarvillkor" className="underline">användarvillkoren</a> och{" "}
                    <a href="/integritetspolicy" className="underline">integritetspolicyn</a>.
                  </span>
                </label>
              )}
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "signup" ? "Skapa konto" : "Logga in"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "signup" ? "Har du redan ett konto?" : "Ny här?"}{" "}
              <button onClick={() => switchMode(mode === "signup" ? "signin" : "signup")} className="font-medium text-primary underline-offset-4 hover:underline">
                {mode === "signup" ? "Logga in" : "Skapa konto"}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
