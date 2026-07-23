export const SERVER_NAME = "selcuk-cihan-career";
export const SERVER_VERSION = "0.1.0";
export const SCHEMA_VERSION = 1;

export type ItemKind =
  | "experience"
  | "project"
  | "education"
  | "certification"
  | "skill"
  | "testimonial";

export type SectionName =
  | "profile"
  | "experience"
  | "skills"
  | "education"
  | "certifications"
  | "projects"
  | "preferences"
  | "narrative"
  | "testimonials"
  | "metadata";

export interface PublicProfile {
  fullName: string;
  currentTitle: string;
  url: string;
  summary: string;
  email?: string;
}

export interface PublicExperience {
  id: string;
  title: string;
  company: string;
  dates: string;
  url?: string;
  tech: string[];
  descriptions: string[];
}

export interface PublicProject {
  id: string;
  name: string;
  dates: string;
  subtitle: string;
  url?: string;
  tech: string[];
  bullets: string[];
}

export interface PublicEducation {
  id: string;
  institution: string;
  degree: string;
  dates?: string;
  fieldOfStudy: string[];
}

export interface PublicCertification {
  id: string;
  name: string;
  issuer: string;
  expirationDate?: string;
}

export interface PublicSkill {
  id: string;
  label: string;
  evidenceRefs: string[];
}

export interface PublicTestimonial {
  id: string;
  name: string;
  title: string;
  testimonial: string;
}

export interface PublicCareerPreferences {
  opportunityStatus?: "open" | "selectively_open" | "not_looking";
  targetRoles?: string[];
  seniorityLevels?: string[];
  employmentTypes?: Array<
    "full_time" | "part_time" | "contract" | "consulting"
  >;
  workModes?: Array<"remote" | "hybrid" | "onsite">;
  baseTimeZone?: string;
  overlapAvailability?: {
    timeZone?: string;
    startTime?: string;
    endTime?: string;
  };
  commercialTerms?: {
    contractModels?: string[];
    paymentCurrency?: string;
    hourlyRate?: number;
  };
  preferredLocations?: string[];
  preferredTimeZones?: string[];
  domains?: string[];
  industries?: string[];
  companyStages?: string[];
  teamEnvironments?: string[];
  impactPreferences?: string[];
  relocation?: {
    willing?: boolean;
    notes?: string;
  };
  travel?: {
    willingness?: string;
    maximumPercent?: number;
  };
  availability?: {
    earliestStartDate?: string;
    noticePeriod?: string;
  };
  notes?: string;
}

export type PublicCareerNarrative = Record<string, unknown>;

export interface PublicProjection {
  profile: PublicProfile;
  experience: PublicExperience[];
  projects: PublicProject[];
  education: PublicEducation[];
  certifications: PublicCertification[];
  skills: PublicSkill[];
  careerPreferences: PublicCareerPreferences | null;
  careerNarrative: PublicCareerNarrative | null;
  testimonials: PublicTestimonial[];
}

export interface CareerPublicData extends PublicProjection {
  schemaVersion: number;
  serverVersion: string;
  sourceCommit: string;
  dataVersion: string;
}

export interface BuildMetadata {
  schemaVersion: number;
  serverVersion: string;
  sourceCommit: string;
  dataVersion: string;
}

export interface SearchDocument {
  kind: ItemKind | "profile";
  section: SectionName;
  id: string;
  title: string;
  summary: string;
  titleTokens: string[];
  tagTokens: string[];
  bodyTokens: string[];
  evidenceRefs: string[];
}

export interface SearchIndex {
  schemaVersion: number;
  dataVersion: string;
  documents: SearchDocument[];
}

export interface SearchResult {
  kind: SearchDocument["kind"];
  id: string;
  title: string;
  summary: string;
  matchedTerms: string[];
  evidenceRefs: string[];
}
