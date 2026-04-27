// Pay-per-download paywall (snabb version, ingen backend).
// Återköpsbevis lagras i localStorage. Stripe Payment Link redirectar till /unlocked
// med ?type=cv|letter&id=<id> som overlever Stripe-redirecten via client_reference_id eller fallback.

export const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/5kQ00balu1mUf0X9Vi8N200";
export const UNLOCK_PRICE_SEK = 29;

type UnlockType = "cv" | "letter";

const key = (type: UnlockType, id: string) => `jobblyftet:unlocked:${type}:${id}`;

export const isUnlocked = (type: UnlockType, id: string | null | undefined): boolean => {
  if (!id) return false;
  try {
    return localStorage.getItem(key(type, id)) === "1";
  } catch {
    return false;
  }
};

export const markUnlocked = (type: UnlockType, id: string) => {
  try {
    localStorage.setItem(key(type, id), "1");
  } catch {
    /* ignore */
  }
};

/**
 * Skickar användaren till Stripe Payment Link.
 * Sparar return-info i sessionStorage så att /unlocked vet vad som ska låsas upp
 * när Stripe redirectar tillbaka.
 */
export const startCheckout = (type: UnlockType, id: string) => {
  if (!id) return;
  try {
    sessionStorage.setItem(
      "jobblyftet:pending_unlock",
      JSON.stringify({ type, id, ts: Date.now() }),
    );
  } catch {
    /* ignore */
  }
  // Stripe Payment Link – success redirectar till /unlocked på vår sida (konfigureras i Stripe-dashboarden).
  // client_reference_id skickas med så vi kan se köpet i Stripe.
  const url = new URL(STRIPE_PAYMENT_LINK);
  url.searchParams.set("client_reference_id", `${type}:${id}`);
  window.location.href = url.toString();
};

export const consumePendingUnlock = (): { type: UnlockType; id: string } | null => {
  try {
    const raw = sessionStorage.getItem("jobblyftet:pending_unlock");
    if (!raw) return null;
    sessionStorage.removeItem("jobblyftet:pending_unlock");
    const parsed = JSON.parse(raw);
    if (parsed?.type && parsed?.id) return { type: parsed.type, id: parsed.id };
  } catch {
    /* ignore */
  }
  return null;
};
