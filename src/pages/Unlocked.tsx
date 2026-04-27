import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { CVData, CVTemplate, Language, emptyCV } from "@/types/cv";
import { CVPdfDocument } from "@/components/cv/CVPdfDocument";
import { pdf } from "@react-pdf/renderer";
import { consumePendingUnlock, isUnlocked, markUnlocked } from "@/lib/paywall";

/**
 * Snabb pay-per-download landningssida.
 * Stripe Payment Link redirectar hit efter köp.
 * Vi läser type+id från ?type=&id= eller från sessionStorage (sparat innan checkout)
 * och markerar dokumentet som upplåst i localStorage.
 */
const Unlocked = () => {
  const [params] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [type, setType] = useState<"cv" | "letter" | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [doc, setDoc] = useState<{
    title: string;
    cv?: { data: CVData; template: CVTemplate; language: Language };
    letter?: { content: string; title: string };
  } | null>(null);

  /* Bestäm vilket dokument som ska låsas upp */
  useEffect(() => {
    const qType = params.get("type") as "cv" | "letter" | null;
    const qId = params.get("id");
    if (qType && qId) {
      setType(qType);
      setId(qId);
      markUnlocked(qType, qId);
      return;
    }
    const pending = consumePendingUnlock();
    if (pending) {
      setType(pending.type);
      setId(pending.id);
      markUnlocked(pending.type, pending.id);
    } else {
      setLoading(false);
    }
  }, [params]);

  /* Hämta dokumentet */
  useEffect(() => {
    if (!type || !id || !user) return;
    (async () => {
      try {
        if (type === "cv") {
          const { data: row, error } = await supabase
            .from("cvs")
            .select("title,template,language,data")
            .eq("id", id)
            .maybeSingle();
          if (error) throw error;
          if (row) {
            setDoc({
              title: row.title,
              cv: {
                data: { ...emptyCV(), ...(row.data as unknown as CVData) },
                template: row.template as CVTemplate,
                language: row.language as Language,
              },
            });
          }
        } else {
          const { data: row, error } = await supabase
            .from("cover_letters")
            .select("title,content")
            .eq("id", id)
            .maybeSingle();
          if (error) throw error;
          if (row) setDoc({ title: row.title, letter: { content: row.content, title: row.title } });
        }
      } catch (e: any) {
        toast.error(e.message ?? "Kunde inte hämta dokumentet");
      } finally {
        setLoading(false);
      }
    })();
  }, [type, id, user]);

  const downloadPdf = async () => {
    if (!doc?.cv) return;
    setDownloading(true);
    try {
      const blob = await pdf(
        <CVPdfDocument data={doc.cv.data} template={doc.cv.template} language={doc.cv.language} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(doc.title || "CV").replace(/[^a-z0-9-_ ]/gi, "")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error("Kunde inte skapa PDF: " + (e.message || ""));
    } finally {
      setDownloading(false);
    }
  };

  const downloadTxt = () => {
    if (!doc?.letter) return;
    const blob = new Blob([doc.letter.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(doc.letter.title || "brev").replace(/[^a-z0-9-_ ]/gi, "")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container max-w-2xl py-16">
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-elegant">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Din betalning lyckades 🎉
          </h1>
          <p className="mt-3 text-muted-foreground">
            Tack! Ditt dokument är upplåst — ladda ner den rena versionen nedan.
          </p>

          {doc ? (
            <div className="mt-8 space-y-3">
              <div className="rounded-lg border border-border bg-background p-4 text-left">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {type === "cv" ? "CV" : "Personligt brev"}
                </div>
                <div className="mt-1 font-medium text-foreground">{doc.title}</div>
              </div>

              {type === "cv" ? (
                <Button variant="hero" size="lg" className="w-full" onClick={downloadPdf} disabled={downloading}>
                  {downloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                  Ladda ner ren PDF
                </Button>
              ) : (
                <Button variant="hero" size="lg" className="w-full" onClick={downloadTxt}>
                  <Download className="h-5 w-5" /> Ladda ner brev
                </Button>
              )}

              <Button asChild variant="ghost" className="w-full">
                <Link to={type === "cv" ? `/editor/${id}` : `/letter/${id}`}>
                  <ArrowLeft className="h-4 w-4" /> Tillbaka till editorn
                </Link>
              </Button>
            </div>
          ) : (
            <div className="mt-8 space-y-3">
              <p className="text-sm text-muted-foreground">
                Vi kunde inte hitta vilket dokument som skulle låsas upp. Gå tillbaka till editorn — om du
                har betalat är dokumentet upplåst där.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/dashboard">Till mina CV</Link>
              </Button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Pay-per-download · 29 kr · Säker betalning via Stripe
        </p>
      </div>
    </div>
  );
};

export default Unlocked;
