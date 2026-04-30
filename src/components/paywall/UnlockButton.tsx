import { Button } from "@/components/ui/button";
import { Lock, Unlock, Loader2 } from "lucide-react";
import { startCheckout, UNLOCK_PRICE_SEK } from "@/lib/paywall";
import { useState } from "react";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface Props {
  type: "cv" | "letter";
  id: string | null;
  unlocked: boolean;
  onDownload: () => void | Promise<void>;
  downloading?: boolean;
}

export const UnlockButton = ({ type, id, unlocked, onDownload, downloading }: Props) => {
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useIsAdmin();

  if (unlocked || isAdmin) {
    return (
      <Button variant="hero" size="sm" onClick={onDownload} disabled={downloading}>
        {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unlock className="h-4 w-4" />}
        Ladda ner PDF
      </Button>
    );
  }

  return (
    <Button
      variant="hero"
      size="sm"
      onClick={() => {
        if (!id) return;
        setLoading(true);
        startCheckout(type, id);
      }}
      disabled={!id || loading}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
      Lås upp för {UNLOCK_PRICE_SEK} kr
    </Button>
  );
};
