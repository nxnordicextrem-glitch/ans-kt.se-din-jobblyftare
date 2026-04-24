import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "Är Jobblyftet verkligen gratis att börja med?", a: "Ja. Du kan registrera dig och börja bygga ditt CV utan att betala. Premium krävs först när du vill exportera till PDF eller använda AI-brevet." },
  { q: "Hur låter AI-brevet personligt?", a: "Vår 'Låt som mig'-teknik tränas på dina svar och din ton. Du väljer ton (professionell, personlig, självsäker, kreativ) och fokus, så genererar vi ett brev som speglar dig — inte en mall." },
  { q: "Funkar mina CV med ATS-system?", a: "Alla våra mallar är testade mot vanliga ATS-system (Lever, Greenhouse, Teamtailor m.fl.) och optimerade för att passera dem." },
  { q: "Kan jag avsluta när jag vill?", a: "Ja. Inga bindningstider. Avsluta från ditt konto i ett klick — du behåller åtkomsten resten av månaden." },
  { q: "Var lagras mina uppgifter?", a: "Alla data lagras säkert inom EU och vi följer GDPR till punkt och pricka. Du kan radera ditt konto och all data när du vill." },
  { q: "Kan jag använda Jobblyftet på engelska?", a: "Ja, alla CV och brev kan genereras både på svenska och engelska." },
];

export const FAQ = () => (
  <section id="faq" className="py-24 md:py-32">
    <div className="container max-w-3xl">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">FAQ</p>
        <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
          Vanliga frågor
        </h2>
      </div>
      <Accordion type="single" collapsible className="mt-12">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-border/60">
            <AccordionTrigger className="text-left font-display text-lg hover:no-underline">{f.q}</AccordionTrigger>
            <AccordionContent className="text-base leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);
