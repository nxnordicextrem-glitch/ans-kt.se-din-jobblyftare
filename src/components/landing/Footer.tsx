import { FileText } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-border/60 bg-card/40">
    <div className="container py-14">
      <div className="grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display text-xl font-semibold">
            <FileText className="h-5 w-5 text-primary" />
            Jobblyftet
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Sveriges smartaste väg till drömjobbet. Byggd för människor — driven av AI.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Produkt</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="#funktioner" className="hover:text-foreground">Funktioner</a></li>
            <li><a href="#priser" className="hover:text-foreground">Priser</a></li>
            <li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Juridik</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="/integritetspolicy" className="hover:text-foreground">Integritetspolicy</a></li>
            <li><a href="/anvandarvillkor" className="hover:text-foreground">Användarvillkor</a></li>
            <li><a href="mailto:hej@jobblyftet.se" className="hover:text-foreground">Kontakt</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
        <p>© {new Date().getFullYear()} Jobblyftet. Alla rättigheter förbehållna.</p>
        <p>Gjord med omsorg i Sverige 🇸🇪</p>
      </div>
    </div>
  </footer>
);
