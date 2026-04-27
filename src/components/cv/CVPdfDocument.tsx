import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { CVData, CVTemplate, Language } from "@/types/cv";
import { sectionTitle } from "@/lib/cv-i18n";

// Use Helvetica (built-in) for max compatibility
Font.registerHyphenationCallback((word) => [word]);

const base = StyleSheet.create({
  page: { padding: 0, fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a" },
  h1: { fontSize: 22, fontFamily: "Helvetica-Bold" },
  h2: { fontSize: 9, fontFamily: "Helvetica-Bold", letterSpacing: 1.6, textTransform: "uppercase" },
  meta: { fontSize: 9, color: "#666" },
  text: { fontSize: 10, lineHeight: 1.45, color: "#333" },
  small: { fontSize: 9, color: "#555" },
  bullet: { flexDirection: "row", marginTop: 2 },
  bulletDot: { width: 8, fontSize: 10, color: "#666" },
  bulletText: { flex: 1, fontSize: 10, lineHeight: 1.45, color: "#333" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  section: { marginTop: 14 },
  divider: { height: 1, backgroundColor: "#ddd", marginTop: 4 },
});

const Bullets = ({ items }: { items: string[] }) => (
  <View style={{ marginTop: 4 }}>
    {items.filter(Boolean).map((b, i) => (
      <View key={i} style={base.bullet}>
        <Text style={base.bulletDot}>•</Text>
        <Text style={base.bulletText}>{b}</Text>
      </View>
    ))}
  </View>
);

/* ========== MODERN ========== */
const ModernPDF = ({ data, language: lang }: { data: CVData; language: Language }) => {
  const accent = data.accentColor || "#1a4d3e";
  return (
    <Page size="A4" style={base.page}>
      <View style={{ flexDirection: "row", flex: 1 }}>
        <View style={{ width: 170, backgroundColor: accent, padding: 22, color: "#fff" }}>
          <Text style={{ fontSize: 18, fontFamily: "Helvetica-Bold", color: "#fff" }}>{data.personal.fullName || " "}</Text>
          <Text style={{ fontSize: 10, color: "#fff", opacity: 0.9, marginTop: 2 }}>{data.personal.title}</Text>

          <View style={{ marginTop: 18 }}>
            {data.personal.email && <Text style={{ fontSize: 9, color: "#fff", opacity: 0.9, marginBottom: 3 }}>{data.personal.email}</Text>}
            {data.personal.phone && <Text style={{ fontSize: 9, color: "#fff", opacity: 0.9, marginBottom: 3 }}>{data.personal.phone}</Text>}
            {data.personal.location && <Text style={{ fontSize: 9, color: "#fff", opacity: 0.9, marginBottom: 3 }}>{data.personal.location}</Text>}
            {data.personal.website && <Text style={{ fontSize: 9, color: "#fff", opacity: 0.9, marginBottom: 3 }}>{data.personal.website}</Text>}
            {data.personal.linkedin && <Text style={{ fontSize: 9, color: "#fff", opacity: 0.9, marginBottom: 3 }}>{data.personal.linkedin}</Text>}
          </View>

          {!!data.skills.length && (
            <View style={{ marginTop: 22 }}>
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", letterSpacing: 1.4, color: "#fff", opacity: 0.8 }}>{sectionTitle("skills", lang).toUpperCase()}</Text>
              {data.skills.map((s) => (
                <Text key={s.id} style={{ fontSize: 10, color: "#fff", marginTop: 4 }}>{s.name}</Text>
              ))}
            </View>
          )}

          {!!data.languages.length && (
            <View style={{ marginTop: 22 }}>
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", letterSpacing: 1.4, color: "#fff", opacity: 0.8 }}>{sectionTitle("languages", lang).toUpperCase()}</Text>
              {data.languages.map((l) => (
                <View key={l.id} style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
                  <Text style={{ fontSize: 10, color: "#fff" }}>{l.name}</Text>
                  <Text style={{ fontSize: 9, color: "#fff", opacity: 0.85 }}>{l.level}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ flex: 1, padding: 28 }}>
          {data.personal.summary ? (
            <View>
              <Text style={[base.h2, { color: accent }]}>{sectionTitle("profile", lang).toUpperCase()}</Text>
              <Text style={[base.text, { marginTop: 6 }]}>{data.personal.summary}</Text>
            </View>
          ) : null}

          {data.experience.length > 0 && (
            <View style={base.section}>
              <Text style={[base.h2, { color: accent }]}>{sectionTitle("experience", lang).toUpperCase()}</Text>
              {data.experience.map((e) => (
                <View key={e.id} style={{ marginTop: 10 }}>
                  <View style={base.row}>
                    <View>
                      <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold" }}>{e.role}</Text>
                      <Text style={base.small}>{e.company}{e.location ? ` · ${e.location}` : ""}</Text>
                    </View>
                    <Text style={base.meta}>{e.startDate} – {e.current ? sectionTitle("present", lang) : e.endDate}</Text>
                  </View>
                  <Bullets items={e.bullets} />
                </View>
              ))}
            </View>
          )}

          {data.education.length > 0 && (
            <View style={base.section}>
              <Text style={[base.h2, { color: accent }]}>{sectionTitle("education", lang).toUpperCase()}</Text>
              {data.education.map((e) => (
                <View key={e.id} style={{ marginTop: 8 }}>
                  <View style={base.row}>
                    <View>
                      <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold" }}>{e.degree}</Text>
                      <Text style={base.small}>{e.school}{e.location ? ` · ${e.location}` : ""}</Text>
                      {e.description ? <Text style={[base.small, { marginTop: 2 }]}>{e.description}</Text> : null}
                    </View>
                    <Text style={base.meta}>{e.startDate} – {e.endDate}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </Page>
  );
};

/* ========== KLASSISK / MINIMAL / EXECUTIVE / KREATIV (single column) ========== */
const SimplePDF = ({
  data,
  language: lang,
  variant,
}: {
  data: CVData;
  language: Language;
  variant: "klassisk" | "minimal" | "executive" | "kreativ";
}) => {
  const accent = data.accentColor || "#1a4d3e";
  const heading = variant === "klassisk"
    ? { textAlign: "center" as const, color: "#1a1a1a" }
    : variant === "minimal"
    ? { color: "#1a1a1a" }
    : variant === "executive"
    ? { color: accent }
    : { color: "#fff" };

  return (
    <Page size="A4" style={[base.page, { padding: 36 }]}>
      {variant === "kreativ" ? (
        <View style={{ backgroundColor: accent, padding: 22, borderRadius: 8 }}>
          <Text style={{ fontSize: 9, color: "#fff", opacity: 0.85, letterSpacing: 1.6 }}>{(data.personal.title || "").toUpperCase()}</Text>
          <Text style={[base.h1, heading, { marginTop: 4, fontSize: 24 }]}>{data.personal.fullName || " "}</Text>
          {data.personal.summary ? <Text style={{ fontSize: 10, color: "#fff", opacity: 0.92, marginTop: 6, lineHeight: 1.45 }}>{data.personal.summary}</Text> : null}
          <Text style={{ fontSize: 9, color: "#fff", opacity: 0.9, marginTop: 8 }}>
            {[data.personal.email, data.personal.phone, data.personal.location, data.personal.linkedin].filter(Boolean).join("  ·  ")}
          </Text>
        </View>
      ) : (
        <View style={variant === "executive" ? { borderBottomWidth: 2, borderBottomColor: accent, paddingBottom: 10 } : variant === "klassisk" ? { borderBottomWidth: 1, borderBottomColor: "#ccc", paddingBottom: 12, alignItems: "center" } : {}}>
          <Text style={[base.h1, heading]}>{data.personal.fullName || " "}</Text>
          <Text style={{ fontSize: 10, color: "#555", marginTop: 2, letterSpacing: variant === "klassisk" ? 1.4 : 0, textTransform: variant === "klassisk" ? "uppercase" : "none" }}>{data.personal.title}</Text>
          <Text style={{ fontSize: 9, color: "#666", marginTop: 6 }}>
            {[data.personal.email, data.personal.phone, data.personal.location, data.personal.linkedin].filter(Boolean).join("  ·  ")}
          </Text>
        </View>
      )}

      {data.personal.summary && variant !== "kreativ" && (
        <View style={base.section}>
          <Text style={[base.h2, { color: variant === "executive" ? accent : "#111" }]}>{sectionTitle("profile", lang).toUpperCase()}</Text>
          <Text style={[base.text, { marginTop: 6 }]}>{data.personal.summary}</Text>
        </View>
      )}

      {data.experience.length > 0 && (
        <View style={base.section}>
          <Text style={[base.h2, { color: variant === "executive" || variant === "kreativ" ? accent : "#111" }]}>{sectionTitle("experience", lang).toUpperCase()}</Text>
          {data.experience.map((e) => (
            <View key={e.id} style={{ marginTop: 8 }}>
              <View style={base.row}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold" }}>{e.role}{variant === "klassisk" ? `, ${e.company}` : ""}</Text>
                  {variant !== "klassisk" && <Text style={base.small}>{e.company}{e.location ? ` · ${e.location}` : ""}</Text>}
                </View>
                <Text style={base.meta}>{e.startDate} – {e.current ? sectionTitle("present", lang) : e.endDate}</Text>
              </View>
              <Bullets items={e.bullets} />
            </View>
          ))}
        </View>
      )}

      {data.education.length > 0 && (
        <View style={base.section}>
          <Text style={[base.h2, { color: variant === "executive" || variant === "kreativ" ? accent : "#111" }]}>{sectionTitle("education", lang).toUpperCase()}</Text>
          {data.education.map((e) => (
            <View key={e.id} style={[base.row, { marginTop: 6 }]}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold" }}>{e.degree}</Text>
                <Text style={base.small}>{e.school}{e.location ? ` · ${e.location}` : ""}</Text>
              </View>
              <Text style={base.meta}>{e.startDate} – {e.endDate}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={[base.section, { flexDirection: "row", gap: 30 }]}>
        {data.skills.length > 0 && (
          <View style={{ flex: 1 }}>
            <Text style={[base.h2, { color: variant === "executive" || variant === "kreativ" ? accent : "#111" }]}>{sectionTitle("skills", lang).toUpperCase()}</Text>
            <View style={{ marginTop: 6 }}>
              {data.skills.map((s) => <Text key={s.id} style={[base.text, { marginTop: 2 }]}>{s.name}</Text>)}
            </View>
          </View>
        )}
        {data.languages.length > 0 && (
          <View style={{ flex: 1 }}>
            <Text style={[base.h2, { color: variant === "executive" || variant === "kreativ" ? accent : "#111" }]}>{sectionTitle("languages", lang).toUpperCase()}</Text>
            <View style={{ marginTop: 6 }}>
              {data.languages.map((l) => (
                <View key={l.id} style={[base.row, { marginTop: 2 }]}>
                  <Text style={base.text}>{l.name}</Text>
                  <Text style={base.small}>{l.level}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </Page>
  );
};

/* ========== LOCKED OVERLAY (gratis-version) ========== */
const LockedOverlay = () => (
  <View
    fixed
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: "none",
    }}
  >
    {/* Grå "blur"-zon nederst (ca 28%) */}
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "28%",
        backgroundColor: "#ffffff",
        opacity: 0.82,
      }}
    />
    {/* Diagonal vattenstämpel */}
    <View
      style={{
        position: "absolute",
        top: "42%",
        left: 0,
        right: 0,
        alignItems: "center",
        transform: "rotate(-22deg)",
      }}
    >
      <Text
        style={{
          fontSize: 36,
          fontFamily: "Helvetica-Bold",
          color: "#000",
          opacity: 0.12,
          letterSpacing: 6,
        }}
      >
        LÅS UPP PÅ JOBBLYFTET
      </Text>
    </View>
    {/* Banner längst ner */}
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#1a4d3e",
        paddingVertical: 10,
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: "#fff", letterSpacing: 1 }}>
        LÅS UPP HELA DOKUMENTET PÅ JOBBLYFTET — 29 KR
      </Text>
    </View>
  </View>
);

export const CVPdfDocument = ({
  data,
  template,
  language,
  locked = false,
}: {
  data: CVData;
  template: CVTemplate;
  language: Language;
  locked?: boolean;
}) => (
  <Document title={data.personal.fullName || "CV"}>
    {template === "modern" ? (
      <ModernPDF data={data} language={language} />
    ) : (
      <SimplePDF data={data} language={language} variant={template} />
    )}
    {/* Overlay läggs på sista sidan via fixed View i samma Page — re-renderar hela dokumentet med overlay */}
    {locked && (
      <></>
    )}
  </Document>
);
