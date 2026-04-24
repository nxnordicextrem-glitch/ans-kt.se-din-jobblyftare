import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Download, Loader2, Save, Sparkles, Mail, Wand2 } from "lucide-react";

type Tone = "professionell" | "personlig" | "självsäker" | "kreativ";
type Focus = "erfarenhet" | "driv" | "resultat" | "personlighet";
type LengthOpt = "kort" | "standard" | "djupgående";
type Lang = "sv" | "en";

const TONES: { id: Tone; label: string; desc: string }[] = [
  { id: "professionell", label: "Professionell", desc: "Tydlig, korrekt, affärsmässig" },
  { id: "personlig", label: "Personlig", desc: "Varm och äkta" },
  { id: "självsäker", label: "Självsäker", desc: "Direkt, raka besked" },
  { id: "kreativ", label: "Kreativ", desc: "Lekfull och oväntad" },
];
const FOCUSES: { id: Focus; label: string }[] = [
  { id: "erfarenhet", label: "Erfarenhet" },
  { id: "driv", label: "Driv & motivation" },
  { id: "resultat", label: "Resultat & siffror" },
  { id: "personlighet", label: "Personlighet" },
];
const LENGTHS: { id: LengthOpt; label: string }[] = [
  { id: "kort", label: "Kort" },
  { id: "standard", label: "Standard" },
  { id: "djupgående", label: "Djupgående" },
];

interface CVOption { id: string; title: string; data: any; }

interface Feedback {
  match_score: number;
  strengths: string[];
  improvements: string[];
  recruiter_take: string;
}

const LetterEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [title, setTitle] = useState("Nytt personligt brev");
  const [language, setLanguage] = useState<Lang>("sv");
  const [jobAd, setJobAd] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [tone, setTone] = useState<Tone>("personlig");
  const [focus, setFocus] = useState<Focus>("driv");
  const [lengthOpt, setLengthOpt] = useState<LengthOpt>("standard");
  const [voiceSample, setVoiceSample] = useState("");
  const [cvId, setCvId] = useState<string | "">("");
  const [content, setContent] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const [cvOptions, setCvOptions] = useState<CVOption[]>([]);
  const dirtyRef = useRef(false);

  useEffect(() => {
    (async () => {
      if (!id || !user) return;
      const [{ data: row, error }, { data: cvs }] = await Promise.all([
        supabase.from("cover_letters").select("*").eq("id", id).maybeSingle(),
        supabase.from("cvs").select("id,title,data"),
      ]);
      if (error) toast.error(error.message);
      if (row) {
        setTitle(row.title);
        setLanguage(row.language as Lang);
        setJobAd(row.job_ad);
        setJobTitle(row.job_title ?? "");
        setCompany(row.company ?? "");
        setTone(row.tone as Tone);
        setFocus(row.focus as Focus);
        setLengthOpt(row.length as LengthOpt);
        setVoiceSample(row.voice_sample);
        setCvId(row.cv_id ?? "");
        setContent(row.content);
        setFeedback((row.match_feedback as unknown as Feedback) ?? null);
      }
      setCvOptions((cvs as CVOption[]) || []);
      setLoading(false);
    })();
  }, [id, user]);

  useEffect(() => { dirtyRef.current = true; }, [
    title, language, jobAd, jobTitle, company, tone, focus, lengthOpt, voiceSample, cvId, content,
  ]);

  const save = async () => {
    if (!user || !id) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("cover_letters").update({
        title, language, job_ad: jobAd, job_title: jobTitle || null, company: company || null,
        tone, focus, length: lengthOpt, voice_sample: voiceSample, cv_id: cvId || null,
        content, match_feedback: feedback as any, match_score: feedback?.match_score ?? null,
      }).eq("id", id);
      if (error) throw error;
      dirtyRef.current = false;
      toast.success("Sparat");
    } catch (e: any) {
      toast.error(e.message ?? "Kunde inte spara");
    } finally { setSaving(false); }
  };

  // Auto-save 1.5s after last change
  useEffect(() => {
    const t = setTimeout(() => { if (dirtyRef.current) save(); }, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, language, jobAd, jobTitle, company, tone, focus, lengthOpt, voiceSample, cvId, content, feedback]);

  const buildCvSummary = (): string => {
    const cv = cvOptions.find((c) => c.id === cvId)?.data;
    if (!cv) return "";
    const p = cv.personal || {};
    const exp = (cv.experience || []).slice(0, 4).map((e: any) =>
      `- ${e.role} hos ${e.company} (${e.startDate}–${e.endDate})${e.bullets?.length ? ": " + e.bullets.slice(0, 3).join("; ") : ""}`,
    ).join("\n");
    const skills = (cv.skills || []).map((s: any) => s.name).slice(0, 12).join(", ");
    return `Namn: ${p.fullName}\nTitel: ${p.title}\nSammanfattning: ${p.summary}\n\nErfarenhet:\n${exp}\n\nFärdigheter: ${skills}`;
  };

  const generate = async () => {
    if (jobAd.trim().length < 30) {
      toast.error("Klistra in en längre jobbannons först (minst 30 tecken).");
      return;
    }
    setGenerating(true);
    try {
      const cv = cvOptions.find((c) => c.id === cvId)?.data;
      const applicantName = cv?.personal?.fullName;
      const { data, error } = await supabase.functions.invoke("generate-cover-letter", {
        body: {
          jobAd, jobTitle, company, tone, focus, length: lengthOpt,
          voiceSample, cvSummary: buildCvSummary(), language, applicantName,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);

      setContent(data.letter);
      setFeedback({
        match_score: data.match_score,
        strengths: data.strengths,
        improvements: data.improvements,
        recruiter_take: data.recruiter_take,
      });
      if (title === "Nytt personligt brev" && (jobTitle || company)) {
        setTitle([jobTitle, company].filter(Boolean).join(" – ") || title);
      }
      toast.success("Brev genererat");
    } catch (e: any) {
      toast.error(e.message ?? "Kunde inte generera brev");
    } finally { setGenerating(false); }
  };

  const exportTxt = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${(title || "brev").replace(/[^a-z0-9-_ ]/gi, "")}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="container flex h-16 items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/letters"><ArrowLeft className="h-4 w-4" /> Mina brev</Link>
          </Button>
          <div className="hidden items-center gap-2 text-muted-foreground md:flex">
            <Mail className="h-4 w-4 text-primary" />
            <Input
              value={title} onChange={(e) => setTitle(e.target.value)}
              className="h-9 w-72 border-transparent bg-transparent text-sm font-medium hover:border-border focus-visible:border-input"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <select
              value={language} onChange={(e) => setLanguage(e.target.value as Lang)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="sv">🇸🇪 Svenska</option>
              <option value="en">🇬🇧 English</option>
            </select>
            <Button variant="outline" size="sm" onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Spara
            </Button>
            <Button variant="hero" size="sm" onClick={exportTxt} disabled={!content}>
              <Download className="h-4 w-4" /> Ladda ner
            </Button>
          </div>
        </div>
      </header>

      <div className="container grid gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* LEFT — controls */}
        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Jobbannons</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="jt">Tjänst</Label>
                <Input id="jt" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Senior Frontend Developer" />
              </div>
              <div>
                <Label htmlFor="co">Företag</Label>
                <Input id="co" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Spotify" />
              </div>
            </div>
            <div className="mt-3">
              <Label htmlFor="ad">Klistra in hela annonsen</Label>
              <Textarea id="ad" value={jobAd} onChange={(e) => setJobAd(e.target.value)}
                rows={8} placeholder="Klistra in jobbannonsen här — ju mer text desto bättre matchning." />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Ton</div>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map((t) => (
                <button key={t.id} onClick={() => setTone(t.id)}
                  className={`rounded-lg border-2 p-3 text-left text-sm transition-smooth ${tone === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                  <div className="font-medium text-foreground">{t.label}</div>
                  <div className="text-xs text-muted-foreground">{t.desc}</div>
                </button>
              ))}
            </div>

            <div className="mb-3 mt-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Fokus</div>
            <div className="flex flex-wrap gap-2">
              {FOCUSES.map((f) => (
                <button key={f.id} onClick={() => setFocus(f.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-smooth ${focus === f.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40"}`}>
                  {f.label}
                </button>
              ))}
            </div>

            <div className="mb-3 mt-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Längd</div>
            <div className="flex flex-wrap gap-2">
              {LENGTHS.map((l) => (
                <button key={l.id} onClick={() => setLengthOpt(l.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-smooth ${lengthOpt === l.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40"}`}>
                  {l.label}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Låt som mig</div>
              <span className="text-[11px] text-muted-foreground">Frivilligt — gör brevet personligt</span>
            </div>
            <Textarea
              className="mt-2" rows={4} value={voiceSample}
              onChange={(e) => setVoiceSample(e.target.value)}
              placeholder="Klistra in 3–4 meningar du själv skrivit (mejl, LinkedIn-post, sms). AI:n speglar din stil."
            />

            <div className="mt-4">
              <Label>Använd CV som underlag</Label>
              <select
                value={cvId} onChange={(e) => setCvId(e.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Inget kopplat</option>
                {cvOptions.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
          </section>

          <Button variant="hero" size="lg" className="w-full" onClick={generate} disabled={generating}>
            {generating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            {content ? "Generera nytt brev" : "Generera mitt brev"}
          </Button>
        </div>

        {/* RIGHT — letter + feedback */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {feedback && (
            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-4">
                <div className="relative grid h-20 w-20 place-items-center">
                  <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--primary))" strokeWidth="3"
                      strokeDasharray={`${feedback.match_score}, 100`} strokeLinecap="round" />
                  </svg>
                  <span className="font-display text-xl font-semibold">{feedback.match_score}%</span>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Matchning mot annons</div>
                  <p className="mt-1 text-sm italic text-foreground">"{feedback.recruiter_take}"</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-primary">Styrkor</div>
                  <ul className="mt-1 space-y-1 text-sm text-foreground">
                    {feedback.strengths.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Att stärka</div>
                  <ul className="mt-1 space-y-1 text-sm text-foreground">
                    {feedback.improvements.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-border bg-white shadow-elegant">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Brev</div>
              {content && (
                <button
                  onClick={() => { navigator.clipboard.writeText(content); toast.success("Kopierat"); }}
                  className="text-xs text-primary hover:underline"
                >Kopiera text</button>
              )}
            </div>
            {content ? (
              <Textarea
                value={content} onChange={(e) => setContent(e.target.value)}
                className="min-h-[520px] resize-y border-0 bg-transparent p-6 font-serif text-[15px] leading-relaxed focus-visible:ring-0"
              />
            ) : (
              <div className="grid min-h-[520px] place-items-center p-10 text-center">
                <div>
                  <Wand2 className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-3 font-display text-xl">Inget brev än</h3>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Klistra in jobbannonsen, välj ton & fokus, och klicka <em>Generera mitt brev</em>. Det tar 5–15 sekunder.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default LetterEditor;
