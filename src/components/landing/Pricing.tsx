import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const features = [
  "Obegränsat antal CV:n",
  "AI-genererade personliga brev",
  "Alla professionella mallar",
  "Matchningsscore mot jobbannonser",
  "PDF-export i hög kvalitet",
  "Svenska & engelska",
  "Prioriterad support",
  "Inga bindningstider",
];

export const Pricing = () => (
  <section id="priser" className="bg-secondary/40 py-24 md:py-32">
    <div className="container">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">Priser</p>
        <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
          Ett enkelt pris. <span className="italic">Inga överraskningar.</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">Avsluta när du vill. Moms inkluderad.</p>
      </div>
      <div className="mx-auto mt-14 max-w-md">
        <div className="overflow-hidden rounded-3xl border border-primary/20 bg-card shadow-elegant">
          <div className="bg-gradient-primary p-8 text-primary-foreground">
            <div className="text-sm uppercase tracking-widest opacity-80">Premium</div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-6xl">90 kr</span>
              <span className="text-primary-foreground/70">/månad</span>
            </div>
            <p className="mt-2 text-sm text-primary-foreground/80">Inkl. moms · Avsluta när du vill</p>
          </div>
          <div className="p-8">
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <Button asChild variant="hero" size="lg" className="mt-8 w-full">
              <Link to="/auth?mode=signup">Starta gratis</Link>
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Inget kreditkort krävs för att börja</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
