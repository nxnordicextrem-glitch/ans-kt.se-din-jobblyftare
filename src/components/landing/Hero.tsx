import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-cv.jpg";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="container relative grid gap-12 py-20 md:py-28 lg:grid-cols-2 lg:gap-16 lg:py-36">
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            AI som faktiskt låter som dig
          </div>
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Sveriges smartaste väg till <span className="italic text-primary">drömjobbet</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Bygg ett professionellt CV och ett personligt brev som faktiskt sticker ut — på under 10 minuter. Driven av AI, designad för människor.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="hero" size="xl">
              <Link to="/auth?mode=signup">
                Skapa ditt CV gratis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <a href="#sa-funkar-det">Se hur det funkar</a>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" />ATS-optimerade mallar</div>
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" />GDPR-säkrad</div>
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" />Inga bindningstider</div>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-primary opacity-10 blur-3xl" />
          <img
            src={heroImage}
            alt="Professionellt CV skapat med Ansökt"
            width={1280}
            height={1280}
            className="relative w-full max-w-md rounded-2xl shadow-elegant"
          />
        </div>
      </div>
    </section>
  );
};
