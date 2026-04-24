import { Star } from "lucide-react";

const testimonials = [
  { name: "Emma L.", role: "Marknadsansvarig", quote: "Fick jobbet jag drömt om på tre veckor. Det personliga brevet kändes faktiskt som mig — inte som en robot." },
  { name: "Jonas P.", role: "Mjukvaruutvecklare", quote: "Bytte från ett trist Word-CV till Jobblyftet och fick svar från fyra av fem företag. Inte en slump." },
  { name: "Sara A.", role: "Sjuksköterska", quote: "Snabbt, snyggt och rakt på sak. Och stödet på svenska gör verkligen skillnad." },
];

export const Testimonials = () => (
  <section className="py-24 md:py-32">
    <div className="container">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">Berättelser</p>
        <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
          Människor som <span className="italic">lyckats</span>.
        </h2>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.name} className="rounded-2xl border border-border/60 bg-card p-8 shadow-soft">
            <div className="flex gap-1 text-accent">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <blockquote className="mt-4 font-display text-lg leading-relaxed text-foreground">"{t.quote}"</blockquote>
            <figcaption className="mt-6 text-sm">
              <div className="font-medium text-foreground">{t.name}</div>
              <div className="text-muted-foreground">{t.role}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);
