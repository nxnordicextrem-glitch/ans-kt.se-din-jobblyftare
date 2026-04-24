import { Brain, FileCheck2, Sparkles, Languages, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI som låter som dig",
    desc: "Vår 'Låt som mig'-teknik analyserar din ton och skriver brev som speglar din personlighet — inte generisk AI-text.",
  },
  {
    icon: FileCheck2,
    title: "ATS-optimerade mallar",
    desc: "Alla mallar är testade mot rekryteringssystemen som filtrerar bort 75 % av alla CV. Ditt kommer fram.",
  },
  {
    icon: Sparkles,
    title: "Matchningsscore mot jobbet",
    desc: "Klistra in jobbannonsen och se direkt hur väl ditt CV matchar — med konkreta förbättringsförslag.",
  },
  {
    icon: Zap,
    title: "Live preview & enkel editor",
    desc: "Drag & drop-gränssnitt, redigera på en sida, se resultatet direkt. Inget krångel.",
  },
  {
    icon: Languages,
    title: "Svenska & engelska",
    desc: "Skapa CV:t på svenska och växla till engelska med ett klick. Perfekt för internationella roller.",
  },
  {
    icon: Shield,
    title: "GDPR & svensk lagring",
    desc: "Dina uppgifter lagras säkert inom EU. Radera ditt konto när du vill — utan frågor.",
  },
];

export const Features = () => (
  <section id="funktioner" className="py-24 md:py-32">
    <div className="container">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">Funktioner</p>
        <h2 className="mt-3 font-display text-4xl tracking-tight text-foreground md:text-5xl">
          Allt du behöver för att <span className="italic">få jobbet</span>.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Inte bara ett verktyg — en partner som hjälper dig genom varje steg av jobbansökan.
        </p>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="group rounded-2xl border border-border/60 bg-card p-7 transition-smooth hover:border-primary/30 hover:shadow-elegant"
          >
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary transition-smooth group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
