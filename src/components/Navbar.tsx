import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { FileText } from "lucide-react";

export const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
          <FileText className="h-5 w-5 text-primary" />
          Jobblyftet
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#funktioner" className="text-sm text-muted-foreground transition-smooth hover:text-foreground">Funktioner</a>
          <a href="#sa-funkar-det" className="text-sm text-muted-foreground transition-smooth hover:text-foreground">Så funkar det</a>
          <a href="#priser" className="text-sm text-muted-foreground transition-smooth hover:text-foreground">Priser</a>
          <a href="#faq" className="text-sm text-muted-foreground transition-smooth hover:text-foreground">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={signOut}>Logga ut</Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/auth">Logga in</Link>
              </Button>
              <Button asChild size="sm" variant="hero">
                <Link to="/auth?mode=signup">Kom igång</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
