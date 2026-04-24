// Generate a tailored, human-sounding cover letter + match score using Lovable AI Gateway.
// Auth required (verify_jwt = true by default).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Payload {
  jobAd: string;
  jobTitle?: string;
  company?: string;
  tone: "professionell" | "personlig" | "självsäker" | "kreativ";
  focus: "erfarenhet" | "driv" | "resultat" | "personlighet";
  length: "kort" | "standard" | "djupgående";
  voiceSample?: string;
  cvSummary?: string;
  language: "sv" | "en";
  applicantName?: string;
}

const lengthMap = {
  sv: { kort: "ca 150 ord (3 korta stycken)", standard: "ca 280 ord (4 stycken)", djupgående: "ca 420 ord (5 stycken)" },
  en: { kort: "~150 words (3 short paragraphs)", standard: "~280 words (4 paragraphs)", djupgående: "~420 words (5 paragraphs)" },
};

function buildSystemPrompt(p: Payload): string {
  const isSv = p.language === "sv";
  const len = lengthMap[p.language][p.length];

  if (isSv) {
    return `Du är en erfaren svensk rekryterare och copywriter som hjälper kandidater att skriva personliga brev som faktiskt får svar.

REGLER (mycket viktiga):
- Skriv på SVENSKA, naturligt och mänskligt — som om en riktig person dikterat brevet.
- ALDRIG generiskt AI-språk. Förbjudna fraser: "Jag är glad att kunna ansöka", "Med min mångsidiga bakgrund", "passion för", "synergier", "drivs av att leverera resultat", "Jag är en teamplayer", "Jag tror jag skulle vara en perfekt match".
- Variera meningslängd. Använd korta, vassa meningar mellan längre.
- Var konkret. Använd siffror, exempel och specifika ord från jobbannonsen — men inte slaviskt.
- Visa personlighet, inte fluff. Kandidatens egen röst ska höras.
- Längd: ${len}. Ingen rubrik, ingen "Hej", börja direkt i brevtexten med en stark öppning.
- Avsluta med "Vänliga hälsningar," på egen rad och sedan kandidatens namn på nästa rad${p.applicantName ? ` (${p.applicantName})` : ""}.

TONE: ${p.tone}. FOCUS: ${p.focus}.

Du svarar ENDAST genom att anropa funktionen "deliver_cover_letter".`;
  }

  return `You are a senior Swedish recruiter and copywriter helping candidates write cover letters that actually get replies.

RULES (very important):
- Write in ENGLISH, natural and human — as if a real person dictated it.
- NEVER use generic AI phrases. Banned: "I am excited to apply", "With my diverse background", "passionate about", "synergies", "results-driven", "team player", "perfect match".
- Vary sentence length. Use short, sharp sentences between longer ones.
- Be concrete. Use numbers, examples and specific words from the job ad — but not slavishly.
- Show personality, not fluff. The candidate's own voice must come through.
- Length: ${len}. No subject line, no "Dear ...", start directly with a strong opening line.
- End with "Best regards," on its own line then the candidate's name${p.applicantName ? ` (${p.applicantName})` : ""}.

TONE: ${p.tone}. FOCUS: ${p.focus}.

Respond ONLY by calling the "deliver_cover_letter" function.`;
}

function buildUserPrompt(p: Payload): string {
  const isSv = p.language === "sv";
  return `${isSv ? "JOBBANNONS" : "JOB AD"}:
"""
${p.jobAd}
"""

${p.jobTitle ? `${isSv ? "Tjänst" : "Role"}: ${p.jobTitle}\n` : ""}${p.company ? `${isSv ? "Företag" : "Company"}: ${p.company}\n` : ""}
${isSv ? "KANDIDATENS CV-SAMMANFATTNING" : "CANDIDATE CV SUMMARY"}:
"""
${p.cvSummary || (isSv ? "(ingen tillgänglig)" : "(none provided)")}
"""

${isSv ? "KANDIDATENS RÖSTPROV (skriv i samma stil)" : "CANDIDATE VOICE SAMPLE (write in the same style)"}:
"""
${p.voiceSample || (isSv ? "(inget angivet — använd en naturlig, mänsklig svensk ton)" : "(none — use a natural human tone)")}
"""

${isSv
  ? "Skriv brevet och returnera även en matchningspoäng 0-100 mot annonsen, 3 styrkor och 2 förbättringstips."
  : "Write the letter and also return a 0-100 match score against the ad, 3 strengths and 2 improvement tips."}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const payload = (await req.json()) as Payload;
    if (!payload.jobAd || payload.jobAd.trim().length < 30) {
      return new Response(JSON.stringify({ error: "Klistra in en längre jobbannons (minst 30 tecken)." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY saknas");

    const systemPrompt = buildSystemPrompt(payload);
    const userPrompt = buildUserPrompt(payload);

    const tools = [
      {
        type: "function",
        function: {
          name: "deliver_cover_letter",
          description: "Returnerar det färdiga personliga brevet samt analys.",
          parameters: {
            type: "object",
            properties: {
              letter: { type: "string", description: "Hela brevtexten, redo att klistras in." },
              match_score: { type: "integer", minimum: 0, maximum: 100 },
              strengths: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 4 },
              improvements: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 3 },
              recruiter_take: { type: "string", description: "1-2 meningar — så här uppfattas kandidaten av en rekryterare." },
            },
            required: ["letter", "match_score", "strengths", "improvements", "recruiter_take"],
            additionalProperties: false,
          },
        },
      },
    ];

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "deliver_cover_letter" } },
      }),
    });

    if (aiRes.status === 429) {
      return new Response(JSON.stringify({ error: "För många förfrågningar — vänta en stund och försök igen." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiRes.status === 402) {
      return new Response(JSON.stringify({ error: "AI-krediter slut. Lägg till mer i Lovable Cloud för att fortsätta." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, t);
      return new Response(JSON.stringify({ error: "AI-tjänsten misslyckades." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const json = await aiRes.json();
    const call = json?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) {
      return new Response(JSON.stringify({ error: "Tomt svar från AI." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const args = JSON.parse(call.function.arguments);

    return new Response(JSON.stringify(args), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-cover-letter error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Okänt fel" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
