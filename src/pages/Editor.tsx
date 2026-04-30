import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CVData, CVTemplate, Language, emptyCV, sampleCV } from "@/types/cv";
import { CVEditorForm } from "@/components/cv/CVEditorForm";
import { CVTemplateRenderer, TEMPLATE_INFO } from "@/components/cv/CVTemplateRenderer";
import { CVPdfDocument } from "@/components/cv/CVPdfDocument";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Download, Loader2, Save, FileText } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { LockedPreview } from "@/components/paywall/LockedPreview";
import { UnlockButton } from "@/components/paywall/UnlockButton";
import { isUnlocked } from "@/lib/paywall";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const TEMPLATES: CVTemplate[] = ["modern", "klassisk", "minimal", "kreativ", "executive"];

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cvId, setCvId] = useState<string | null>(id ?? null);
  const [title, setTitle] = useState("Nytt CV");
  const [template, setTemplate] = useState<CVTemplate>("modern");
  const [language, setLanguage] = useState<Language>("sv");
  const [data, setData] = useState<CVData>(() => sampleCV());
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const dirtyRef = useRef(false);

  /* Load existing CV */
  useEffect(() => {
    if (!id || !user) return;
    (async () => {
      const { data: row, error } = await supabase.from("cvs").select("*").eq("id", id).maybeSingle();
      if (error) toast.error(error.message);
      if (row) {
        setTitle(row.title);
        setTemplate(row.template as CVTemplate);
        setLanguage(row.language as Language);
        setData({ ...emptyCV(), ...(row.data as unknown as CVData) });
      }
      setLoading(false);
    })();
  }, [id, user]);

  /* Mark dirty whenever editable state changes */
  useEffect(() => { dirtyRef.current = true; }, [data, title, template, language]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    try {
      if (cvId) {
        const { error } = await supabase
          .from("cvs")
          .update({ title, template, language, data: data as any })
          .eq("id", cvId);
        if (error) throw error;
      } else {
        const { data: row, error } = await supabase
          .from("cvs")
          .insert({ user_id: user.id, title, template, language, data: data as any })
          .select()
          .single();
        if (error) throw error;
        setCvId(row.id);
        navigate(`/editor/${row.id}`, { replace: true });
      }
      dirtyRef.current = false;
      toast.success("Sparat");
    } catch (e: any) {
      toast.error(e.message ?? "Kunde inte spara");
    } finally {
      setSaving(false);
    }
  };

  /* Auto-save 1.5s after last change */
  useEffect(() => {
    if (!user) return;
    const t = setTimeout(() => {
      if (dirtyRef.current) save();
    }, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, title, template, language, user]);

  const { isAdmin } = useIsAdmin();
  const unlocked = isAdmin || isUnlocked("cv", cvId);

  const exportPDF = async () => {
    setExporting(true);
    try {
      const blob = await pdf(
        <CVPdfDocument data={data} template={template} language={language} locked={!unlocked} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(title || "CV").replace(/[^a-z0-9-_ ]/gi, "")}${unlocked ? "" : "-preview"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error("Kunde inte skapa PDF: " + (e.message || ""));
    } finally {
      setExporting(false);
    }
  };

  const previewScale = useMemo(() => 0.78, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="container flex h-16 items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard"><ArrowLeft className="h-4 w-4" /> Mina CV</Link>
          </Button>
          <div className="hidden items-center gap-2 text-muted-foreground md:flex">
            <FileText className="h-4 w-4 text-primary" />
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 w-64 border-transparent bg-transparent text-sm font-medium hover:border-border focus-visible:border-input"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="sv">🇸🇪 Svenska</option>
              <option value="en">🇬🇧 English</option>
            </select>
            <Button variant="outline" size="sm" onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Spara
            </Button>
            {unlocked ? (
              <Button variant="hero" size="sm" onClick={exportPDF} disabled={exporting}>
                {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Ladda ner PDF
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={exportPDF} disabled={exporting}>
                  {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Förhandsvisning
                </Button>
                <UnlockButton type="cv" id={cvId} unlocked={unlocked} onDownload={exportPDF} downloading={exporting} />
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container grid gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* LEFT — form */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Mall</div>
            <div className="grid grid-cols-5 gap-2">
              {TEMPLATES.map((t) => {
                const info = TEMPLATE_INFO.find((i) => i.id === t)!;
                const active = template === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTemplate(t)}
                    className={`rounded-lg border-2 p-2 text-left text-[11px] transition-smooth ${
                      active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="font-medium text-foreground">{info.name}</div>
                    <div className="text-[10px] text-muted-foreground">{info.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <CVEditorForm data={data} onChange={setData} />
        </div>

        {/* RIGHT — live preview */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-border bg-muted/40 p-4">
            <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold uppercase tracking-widest">Live preview</span>
              <span>A4</span>
            </div>
            <div className="overflow-hidden rounded-xl bg-white shadow-elegant">
              {(() => {
                const inner = (
                  <div
                    className="origin-top-left"
                    style={{
                      width: `${100 / previewScale}%`,
                      transform: `scale(${previewScale})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <div style={{ width: "210mm", minHeight: "297mm" }}>
                      <CVTemplateRenderer data={data} template={template} language={language} />
                    </div>
                  </div>
                );
                return unlocked ? inner : <LockedPreview>{inner}</LockedPreview>;
              })()}
              <div style={{ paddingTop: `${(297 / 210) * previewScale * 100 - 100}%` }} aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
