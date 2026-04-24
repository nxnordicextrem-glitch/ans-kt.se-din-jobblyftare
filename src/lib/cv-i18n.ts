import { Language } from "@/types/cv";

export const cvLabels: Record<Language, Record<string, string>> = {
  sv: {
    profile: "Profil",
    experience: "Arbetslivserfarenhet",
    education: "Utbildning",
    skills: "Kompetenser",
    languages: "Språk",
    present: "Nu",
    contact: "Kontakt",
  },
  en: {
    profile: "Profile",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    languages: "Languages",
    present: "Present",
    contact: "Contact",
  },
};

export const sectionTitle = (key: string, lang: Language) => cvLabels[lang][key] ?? key;
