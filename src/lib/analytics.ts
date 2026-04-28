import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "ansokt_session_id";

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export async function trackEvent(
  eventType: string,
  opts: { path?: string; metadata?: Record<string, unknown> } = {}
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("analytics_events").insert({
      event_type: eventType,
      user_id: user?.id ?? null,
      session_id: getSessionId(),
      path: opts.path ?? window.location.pathname,
      metadata: (opts.metadata ?? {}) as never,
    });
  } catch (e) {
    // silent
    console.warn("analytics failed", e);
  }
}
