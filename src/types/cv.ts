export type CVTemplate = "klassisk" | "modern" | "minimal" | "kreativ" | "executive";
export type Language = "sv" | "en";

export interface CVPersonal {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  summary: string;
}

export interface CVExperience {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  bullets: string[];
}

export interface CVEducation {
  id: string;
  degree: string;
  school: string;
  location?: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface CVSkill {
  id: string;
  name: string;
  level?: number; // 1-5
}

export interface CVLanguage {
  id: string;
  name: string;
  level: string; // "Modersmål" | "Flytande" | "Konversation" | "Grundläggande"
}

export interface CVData {
  personal: CVPersonal;
  experience: CVExperience[];
  education: CVEducation[];
  skills: CVSkill[];
  languages: CVLanguage[];
  sectionOrder: string[]; // ['experience', 'education', 'skills', 'languages']
  accentColor?: string; // hsl string
}

export const emptyCV = (): CVData => ({
  personal: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  sectionOrder: ["experience", "education", "skills", "languages"],
  accentColor: "#1a4d3e",
});

export const sampleCV = (): CVData => ({
  personal: {
    fullName: "Anna Andersson",
    title: "Senior Produktdesigner",
    email: "anna@exempel.se",
    phone: "+46 70 123 45 67",
    location: "Stockholm, Sverige",
    website: "annaandersson.se",
    linkedin: "linkedin.com/in/annaandersson",
    summary:
      "Erfaren produktdesigner med 8+ års erfarenhet av att bygga digitala upplevelser för B2B SaaS. Kombinerar strategisk tänkande med pixel-perfekt utförande.",
  },
  experience: [
    {
      id: "e1",
      role: "Lead Product Designer",
      company: "Klarna",
      location: "Stockholm",
      startDate: "Jan 2022",
      endDate: "Nu",
      current: true,
      bullets: [
        "Ledde redesign av checkout-flödet vilket ökade konvertering med 18%.",
        "Byggde och underhöll designsystem som används av 40+ produktteam.",
        "Mentorerade 5 juniora designers genom strukturerade utvecklingsplaner.",
      ],
    },
    {
      id: "e2",
      role: "Product Designer",
      company: "Spotify",
      location: "Stockholm",
      startDate: "Aug 2019",
      endDate: "Dec 2021",
      bullets: [
        "Designade nya artist-tools använda av över 8 miljoner artister globalt.",
        "Genomförde 30+ användarstudier och översatte insikter till feature-roadmaps.",
      ],
    },
  ],
  education: [
    {
      id: "ed1",
      degree: "MSc Interaction Design",
      school: "Kungliga Tekniska Högskolan",
      location: "Stockholm",
      startDate: "2017",
      endDate: "2019",
      description: "Examensarbete om AI-drivna designsystem.",
    },
  ],
  skills: [
    { id: "s1", name: "Figma", level: 5 },
    { id: "s2", name: "Designsystem", level: 5 },
    { id: "s3", name: "Användartestning", level: 4 },
    { id: "s4", name: "Prototyping", level: 5 },
    { id: "s5", name: "HTML/CSS", level: 4 },
  ],
  languages: [
    { id: "l1", name: "Svenska", level: "Modersmål" },
    { id: "l2", name: "Engelska", level: "Flytande" },
    { id: "l3", name: "Tyska", level: "Konversation" },
  ],
  sectionOrder: ["experience", "education", "skills", "languages"],
  accentColor: "#1a4d3e",
});
