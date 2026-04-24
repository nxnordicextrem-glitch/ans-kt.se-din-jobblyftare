const steps = [
  { n: "01", title: "Fyll i dina uppgifter", desc: "Ange erfarenhet, utbildning och kompetenser. Vår editor är gjord för att gå snabbt." },
  { n: "02", title: "Klistra in jobbannonsen", desc: "AI:n analyserar annonsen och skräddarsyr både ditt CV och ditt personliga brev." },
  { n: "03", title: "Ladda ner som PDF", desc: "Pixel-perfekt, ATS-optimerad PDF som du kan skicka direkt — eller dela med en länk." },
];

export const HowItWorks = () => (
  <section id="sa-funkar-det" className="bg-secondary/40 py-24 md:py-32">
    <div className="container">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">Så funkar det</p>
        <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
          Tre steg till ett bättre <span className="italic">CV</span>.
        </h2>
      </div>
      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="relative rounded-2xl bg-card p-8 shadow-soft">
            <div className="font-display text-5xl text-accent">{s.n}</div>
            <h3 className="mt-4 font-display text-2xl">{s.title}</h3>
            <p className="mt-2 text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
