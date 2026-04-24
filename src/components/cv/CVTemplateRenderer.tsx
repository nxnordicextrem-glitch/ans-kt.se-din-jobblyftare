import { CVData, CVTemplate, Language } from "@/types/cv";
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";
import { sectionTitle } from "@/lib/cv-i18n";

interface Props {
  data: CVData;
  template: CVTemplate;
  language: Language;
}

/* ===== Helpers ===== */
const Bullets = ({ items }: { items: string[] }) => (
  <ul className="mt-1 space-y-1 text-[13px] leading-relaxed text-neutral-700">
    {items.filter(Boolean).map((b, i) => (
      <li key={i} className="flex gap-2">
        <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-neutral-500" />
        <span>{b}</span>
      </li>
    ))}
  </ul>
);

const SkillBar = ({ level = 0 }: { level?: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} className={`h-1.5 w-4 rounded-sm ${n <= level ? "bg-neutral-800" : "bg-neutral-200"}`} />
    ))}
  </div>
);

/* ===== Templates ===== */

const Modern = ({ data, language: lang }: { data: CVData; language: Language }) => {
  const accent = data.accentColor || "#1a4d3e";
  const renderSection = (key: string) => {
    if (key === "experience" && data.experience.length)
      return (
        <section key={key}>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: accent }}>
            {sectionTitle("experience", lang)}
          </h2>
          <div className="space-y-4">
            {data.experience.map((e) => (
              <div key={e.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <div className="text-[14px] font-semibold text-neutral-900">{e.role}</div>
                    <div className="text-[13px] text-neutral-700">{e.company}{e.location ? ` · ${e.location}` : ""}</div>
                  </div>
                  <div className="text-[12px] text-neutral-500 whitespace-nowrap">
                    {e.startDate} – {e.current ? sectionTitle("present", lang) : e.endDate}
                  </div>
                </div>
                <Bullets items={e.bullets} />
              </div>
            ))}
          </div>
        </section>
      );
    if (key === "education" && data.education.length)
      return (
        <section key={key}>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: accent }}>
            {sectionTitle("education", lang)}
          </h2>
          <div className="space-y-3">
            {data.education.map((e) => (
              <div key={e.id} className="flex items-baseline justify-between gap-3">
                <div>
                  <div className="text-[14px] font-semibold text-neutral-900">{e.degree}</div>
                  <div className="text-[13px] text-neutral-700">{e.school}{e.location ? ` · ${e.location}` : ""}</div>
                  {e.description && <div className="mt-1 text-[12px] text-neutral-600">{e.description}</div>}
                </div>
                <div className="text-[12px] text-neutral-500 whitespace-nowrap">{e.startDate} – {e.endDate}</div>
              </div>
            ))}
          </div>
        </section>
      );
    return null;
  };

  return (
    <div className="grid grid-cols-[200px_1fr] bg-white text-neutral-900" style={{ minHeight: "100%" }}>
      <aside className="p-7 text-white" style={{ background: accent }}>
        <h1 className="font-display text-2xl leading-tight">{data.personal.fullName || "Ditt namn"}</h1>
        <p className="mt-1 text-[13px] opacity-90">{data.personal.title}</p>

        <div className="mt-6 space-y-1.5 text-[12px] opacity-90">
          {data.personal.email && <div className="flex items-start gap-2"><Mail className="mt-0.5 h-3 w-3 shrink-0" /><span className="break-all">{data.personal.email}</span></div>}
          {data.personal.phone && <div className="flex items-start gap-2"><Phone className="mt-0.5 h-3 w-3 shrink-0" />{data.personal.phone}</div>}
          {data.personal.location && <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-3 w-3 shrink-0" />{data.personal.location}</div>}
          {data.personal.website && <div className="flex items-start gap-2"><Globe className="mt-0.5 h-3 w-3 shrink-0" /><span className="break-all">{data.personal.website}</span></div>}
          {data.personal.linkedin && <div className="flex items-start gap-2"><Linkedin className="mt-0.5 h-3 w-3 shrink-0" /><span className="break-all">{data.personal.linkedin}</span></div>}
        </div>

        {!!data.skills.length && (
          <div className="mt-7">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-80">{sectionTitle("skills", lang)}</h3>
            <div className="mt-3 space-y-2">
              {data.skills.map((s) => (
                <div key={s.id}>
                  <div className="text-[12px]">{s.name}</div>
                  {s.level ? <div className="mt-1"><SkillBarLight level={s.level} /></div> : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {!!data.languages.length && (
          <div className="mt-7">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-80">{sectionTitle("languages", lang)}</h3>
            <div className="mt-3 space-y-1 text-[12px]">
              {data.languages.map((l) => (
                <div key={l.id} className="flex justify-between gap-2"><span>{l.name}</span><span className="opacity-80">{l.level}</span></div>
              ))}
            </div>
          </div>
        )}
      </aside>

      <main className="p-8 space-y-6">
        {data.personal.summary && (
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: accent }}>{sectionTitle("profile", lang)}</h2>
            <p className="text-[13px] leading-relaxed text-neutral-700">{data.personal.summary}</p>
          </section>
        )}
        {data.sectionOrder.map(renderSection)}
      </main>
    </div>
  );
};

const SkillBarLight = ({ level }: { level: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} className={`h-1 w-3 rounded-sm ${n <= level ? "bg-white" : "bg-white/30"}`} />
    ))}
  </div>
);

const Klassisk = ({ data, language: lang }: { data: CVData; language: Language }) => (
  <div className="bg-white p-10 text-neutral-900" style={{ minHeight: "100%" }}>
    <header className="border-b border-neutral-300 pb-5 text-center">
      <h1 className="font-display text-3xl tracking-tight">{data.personal.fullName || "Ditt namn"}</h1>
      <p className="mt-1 text-[13px] uppercase tracking-[0.2em] text-neutral-600">{data.personal.title}</p>
      <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[12px] text-neutral-600">
        {data.personal.email && <span>{data.personal.email}</span>}
        {data.personal.phone && <span>· {data.personal.phone}</span>}
        {data.personal.location && <span>· {data.personal.location}</span>}
        {data.personal.linkedin && <span>· {data.personal.linkedin}</span>}
      </div>
    </header>

    <div className="mt-6 space-y-6">
      {data.personal.summary && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">{sectionTitle("profile", lang)}</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-neutral-800">{data.personal.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section>
          <h2 className="border-b border-neutral-200 pb-1 text-xs font-bold uppercase tracking-[0.2em]">{sectionTitle("experience", lang)}</h2>
          <div className="mt-3 space-y-4">
            {data.experience.map((e) => (
              <div key={e.id}>
                <div className="flex justify-between gap-3">
                  <div className="text-[14px] font-semibold">{e.role}, {e.company}</div>
                  <div className="text-[12px] text-neutral-600 whitespace-nowrap">{e.startDate} – {e.current ? sectionTitle("present", lang) : e.endDate}</div>
                </div>
                {e.location && <div className="text-[12px] italic text-neutral-600">{e.location}</div>}
                <Bullets items={e.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section>
          <h2 className="border-b border-neutral-200 pb-1 text-xs font-bold uppercase tracking-[0.2em]">{sectionTitle("education", lang)}</h2>
          <div className="mt-3 space-y-3">
            {data.education.map((e) => (
              <div key={e.id} className="flex justify-between gap-3">
                <div>
                  <div className="text-[14px] font-semibold">{e.degree}</div>
                  <div className="text-[12px] italic text-neutral-700">{e.school}{e.location ? `, ${e.location}` : ""}</div>
                </div>
                <div className="text-[12px] text-neutral-600 whitespace-nowrap">{e.startDate} – {e.endDate}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {data.skills.length > 0 && (
          <section>
            <h2 className="border-b border-neutral-200 pb-1 text-xs font-bold uppercase tracking-[0.2em]">{sectionTitle("skills", lang)}</h2>
            <ul className="mt-3 space-y-1 text-[13px]">
              {data.skills.map((s) => <li key={s.id}>{s.name}</li>)}
            </ul>
          </section>
        )}
        {data.languages.length > 0 && (
          <section>
            <h2 className="border-b border-neutral-200 pb-1 text-xs font-bold uppercase tracking-[0.2em]">{sectionTitle("languages", lang)}</h2>
            <ul className="mt-3 space-y-1 text-[13px]">
              {data.languages.map((l) => <li key={l.id}>{l.name} — <span className="text-neutral-600">{l.level}</span></li>)}
            </ul>
          </section>
        )}
      </div>
    </div>
  </div>
);

const Minimal = ({ data, language: lang }: { data: CVData; language: Language }) => (
  <div className="bg-white p-12 text-neutral-900" style={{ minHeight: "100%" }}>
    <header>
      <h1 className="font-display text-4xl tracking-tight">{data.personal.fullName || "Ditt namn"}</h1>
      <p className="mt-2 text-[14px] text-neutral-500">{data.personal.title}</p>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-neutral-600">
        {data.personal.email && <span>{data.personal.email}</span>}
        {data.personal.phone && <span>{data.personal.phone}</span>}
        {data.personal.location && <span>{data.personal.location}</span>}
      </div>
    </header>

    <div className="mt-10 space-y-9">
      {data.personal.summary && <p className="max-w-2xl text-[14px] leading-relaxed text-neutral-700">{data.personal.summary}</p>}

      {data.experience.length > 0 && (
        <section>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.25em] text-neutral-400">{sectionTitle("experience", lang)}</h2>
          <div className="mt-4 space-y-5">
            {data.experience.map((e) => (
              <div key={e.id} className="grid grid-cols-[110px_1fr] gap-6">
                <div className="text-[12px] text-neutral-500">{e.startDate}<br />{e.current ? sectionTitle("present", lang) : e.endDate}</div>
                <div>
                  <div className="text-[14px] font-medium">{e.role}</div>
                  <div className="text-[12px] text-neutral-500">{e.company}{e.location ? ` · ${e.location}` : ""}</div>
                  <Bullets items={e.bullets} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.25em] text-neutral-400">{sectionTitle("education", lang)}</h2>
          <div className="mt-4 space-y-3">
            {data.education.map((e) => (
              <div key={e.id} className="grid grid-cols-[110px_1fr] gap-6">
                <div className="text-[12px] text-neutral-500">{e.startDate} – {e.endDate}</div>
                <div>
                  <div className="text-[14px] font-medium">{e.degree}</div>
                  <div className="text-[12px] text-neutral-500">{e.school}{e.location ? ` · ${e.location}` : ""}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-10">
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-[11px] font-medium uppercase tracking-[0.25em] text-neutral-400">{sectionTitle("skills", lang)}</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-neutral-700">{data.skills.map((s) => s.name).join("  ·  ")}</p>
          </section>
        )}
        {data.languages.length > 0 && (
          <section>
            <h2 className="text-[11px] font-medium uppercase tracking-[0.25em] text-neutral-400">{sectionTitle("languages", lang)}</h2>
            <ul className="mt-3 space-y-1 text-[13px]">
              {data.languages.map((l) => <li key={l.id}><span className="text-neutral-700">{l.name}</span> <span className="text-neutral-400">— {l.level}</span></li>)}
            </ul>
          </section>
        )}
      </div>
    </div>
  </div>
);

const Kreativ = ({ data, language: lang }: { data: CVData; language: Language }) => {
  const accent = data.accentColor || "#1a4d3e";
  return (
    <div className="bg-[#fcfbf8] p-10 text-neutral-900" style={{ minHeight: "100%" }}>
      <header className="rounded-2xl p-7 text-white" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}>
        <p className="text-[11px] uppercase tracking-[0.3em] opacity-80">{data.personal.title}</p>
        <h1 className="mt-1 font-display text-4xl">{data.personal.fullName || "Ditt namn"}</h1>
        {data.personal.summary && <p className="mt-3 max-w-xl text-[13px] leading-relaxed opacity-90">{data.personal.summary}</p>}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] opacity-90">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>· {data.personal.phone}</span>}
          {data.personal.location && <span>· {data.personal.location}</span>}
          {data.personal.linkedin && <span>· {data.personal.linkedin}</span>}
        </div>
      </header>

      <div className="mt-7 grid grid-cols-[1fr_180px] gap-7">
        <div className="space-y-6">
          {data.experience.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>{sectionTitle("experience", lang)}</h2>
              <div className="mt-3 space-y-4">
                {data.experience.map((e) => (
                  <div key={e.id} className="rounded-xl border border-neutral-200 bg-white p-4">
                    <div className="flex justify-between gap-3">
                      <div className="text-[14px] font-semibold">{e.role}</div>
                      <div className="text-[12px] text-neutral-500 whitespace-nowrap">{e.startDate} – {e.current ? sectionTitle("present", lang) : e.endDate}</div>
                    </div>
                    <div className="text-[12px] text-neutral-600">{e.company}{e.location ? ` · ${e.location}` : ""}</div>
                    <Bullets items={e.bullets} />
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.education.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>{sectionTitle("education", lang)}</h2>
              <div className="mt-3 space-y-2">
                {data.education.map((e) => (
                  <div key={e.id} className="rounded-xl border border-neutral-200 bg-white p-3 text-[13px]">
                    <div className="font-semibold">{e.degree}</div>
                    <div className="text-[12px] text-neutral-600">{e.school} · {e.startDate}–{e.endDate}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          {!!data.skills.length && (
            <section>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>{sectionTitle("skills", lang)}</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {data.skills.map((s) => (
                  <span key={s.id} className="rounded-full border border-neutral-300 bg-white px-2.5 py-1 text-[11px]">{s.name}</span>
                ))}
              </div>
            </section>
          )}
          {!!data.languages.length && (
            <section>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>{sectionTitle("languages", lang)}</h3>
              <ul className="mt-3 space-y-1 text-[12px]">
                {data.languages.map((l) => <li key={l.id}><span className="font-medium">{l.name}</span> <span className="text-neutral-500">— {l.level}</span></li>)}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};

const Executive = ({ data, language: lang }: { data: CVData; language: Language }) => {
  const accent = data.accentColor || "#1a4d3e";
  return (
    <div className="bg-white p-12 text-neutral-900" style={{ minHeight: "100%" }}>
      <header className="border-b-2 pb-5" style={{ borderColor: accent }}>
        <h1 className="font-display text-4xl tracking-tight" style={{ color: accent }}>{data.personal.fullName || "Ditt namn"}</h1>
        <p className="mt-1 text-[14px] font-medium uppercase tracking-[0.18em] text-neutral-700">{data.personal.title}</p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-neutral-600">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
          {data.personal.linkedin && <span>{data.personal.linkedin}</span>}
        </div>
      </header>

      <div className="mt-7 space-y-6">
        {data.personal.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: accent }}>{sectionTitle("profile", lang)}</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-neutral-800">{data.personal.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: accent }}>{sectionTitle("experience", lang)}</h2>
            <div className="mt-3 space-y-5">
              {data.experience.map((e) => (
                <div key={e.id} className="grid grid-cols-[1fr_140px] gap-4">
                  <div>
                    <div className="text-[15px] font-bold">{e.role}</div>
                    <div className="text-[13px] font-medium text-neutral-700">{e.company}{e.location ? ` · ${e.location}` : ""}</div>
                    <Bullets items={e.bullets} />
                  </div>
                  <div className="text-right text-[12px] font-medium text-neutral-600">{e.startDate} – {e.current ? sectionTitle("present", lang) : e.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: accent }}>{sectionTitle("education", lang)}</h2>
            <div className="mt-3 space-y-2">
              {data.education.map((e) => (
                <div key={e.id} className="flex justify-between gap-3 text-[13px]">
                  <div><span className="font-semibold">{e.degree}</span>, {e.school}</div>
                  <div className="text-neutral-600">{e.startDate} – {e.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-10">
          {data.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: accent }}>{sectionTitle("skills", lang)}</h2>
              <div className="mt-3 space-y-2">
                {data.skills.map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-[13px]">
                    <span>{s.name}</span>
                    {s.level ? <SkillBar level={s.level} /> : null}
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.languages.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: accent }}>{sectionTitle("languages", lang)}</h2>
              <ul className="mt-3 space-y-1 text-[13px]">
                {data.languages.map((l) => <li key={l.id} className="flex justify-between"><span>{l.name}</span><span className="text-neutral-600">{l.level}</span></li>)}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export const CVTemplateRenderer = ({ data, template, language }: Props) => {
  switch (template) {
    case "klassisk": return <Klassisk data={data} language={language} />;
    case "minimal": return <Minimal data={data} language={language} />;
    case "kreativ": return <Kreativ data={data} language={language} />;
    case "executive": return <Executive data={data} language={language} />;
    case "modern":
    default:
      return <Modern data={data} language={language} />;
  }
};

export const TEMPLATE_INFO: { id: CVTemplate; name: string; desc: string }[] = [
  { id: "modern", name: "Modern", desc: "Tvåkolumn med färgad sidebar" },
  { id: "klassisk", name: "Klassisk", desc: "Centrerad, traditionell" },
  { id: "minimal", name: "Minimal", desc: "Mycket whitespace, Apple-stil" },
  { id: "kreativ", name: "Kreativ", desc: "Färgad header, kortlayout" },
  { id: "executive", name: "Executive", desc: "Senior, kraftfull layout" },
];
