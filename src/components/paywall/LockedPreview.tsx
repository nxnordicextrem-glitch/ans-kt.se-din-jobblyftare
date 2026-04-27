import { useEffect, useRef, ReactNode } from "react";
import { Lock } from "lucide-react";

interface Props {
  children: ReactNode;
  /** 0–1 — hur stor del av botten som täcks. Default 0.28 (~28%). */
  coverage?: number;
  watermarkText?: string;
}

/**
 * Visar children men:
 *  - blockerar markering / kopiering / kontextmeny
 *  - lägger en blur+gradient overlay över nedersta ~28%
 *  - ritar en diagonal vattenstämpel över hela ytan
 */
export const LockedPreview = ({
  children,
  coverage = 0.28,
  watermarkText = "Lås upp på Ansökt",
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const block = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    el.addEventListener("copy", block);
    el.addEventListener("cut", block);
    el.addEventListener("contextmenu", block);
    el.addEventListener("dragstart", block);
    return () => {
      el.removeEventListener("copy", block);
      el.removeEventListener("cut", block);
      el.removeEventListener("contextmenu", block);
      el.removeEventListener("dragstart", block);
    };
  }, []);

  const pct = Math.max(10, Math.min(60, coverage * 100));

  return (
    <div
      ref={ref}
      className="relative isolate select-none"
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
      }}
    >
      {children}

      {/* Blur + gradient over nedre delen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
        style={{
          height: `${pct}%`,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          background:
            "linear-gradient(to bottom, hsl(var(--background) / 0) 0%, hsl(var(--background) / 0.55) 35%, hsl(var(--background) / 0.85) 100%)",
        }}
      />

      {/* Diagonal vattenstämpel — repeterad */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-30deg, transparent 0 120px, hsl(var(--foreground) / 0.06) 120px 121px)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-display text-3xl font-semibold uppercase tracking-[0.3em] opacity-20"
            style={{ transform: "rotate(-22deg)", color: "hsl(var(--foreground))" }}
          >
            {watermarkText}
          </span>
        </div>
      </div>

      {/* CTA-badge nere i blur-zonen */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-30 flex justify-center">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-border bg-background/95 px-4 py-2 text-xs font-medium text-foreground shadow-elegant backdrop-blur">
          <Lock className="h-3.5 w-3.5 text-primary" />
          {watermarkText}
        </div>
      </div>
    </div>
  );
};
