export type Nullable<T> = T | null;

export interface SourceBasics {
  full_name: string;
  current_title: string;
  email: string;
  url: string;
}

export interface SourceExperience {
  id?: string;
  title: string;
  company: string;
  dates: string;
  url?: Nullable<string>;
  tech?: string[];
  descriptions?: string[];
}

export interface SourceProject {
  id?: string;
  name: string;
  dates: string;
  subtitle: string;
  url?: Nullable<string>;
  tech?: string[];
  bullets?: string[];
}

export interface SourceEducation {
  id?: string;
  institution: string;
  dates?: Nullable<string>;
  degree: string;
  field_of_study?: string[];
}

export interface SourceCertification {
  id?: string;
  name: string;
  issuer: string;
  expiration_date?: Nullable<string>;
}

export interface SourceReference {
  id?: string;
  name: string;
  title: string;
  contact: string;
  testimonial: string;
  fullTestimonial?: Nullable<string>;
}

export interface SourceCareerPreferences {
  opportunity_status?: Nullable<"open" | "selectively_open" | "not_looking">;
  target_roles?: string[];
  seniority_levels?: string[];
  employment_types?: Array<
    "full_time" | "part_time" | "contract" | "consulting"
  >;
  work_modes?: Array<"remote" | "hybrid" | "onsite">;
  preferred_locations?: string[];
  preferred_time_zones?: string[];
  domains?: string[];
  industries?: string[];
  company_stages?: string[];
  team_environments?: string[];
  impact_preferences?: string[];
  relocation?: {
    willing?: Nullable<boolean>;
    notes?: Nullable<string>;
  };
  travel?: {
    willingness?: Nullable<string>;
    maximum_percent?: Nullable<number>;
  };
  availability?: {
    earliest_start_date?: Nullable<string>;
    notice_period?: Nullable<string>;
  };
  notes?: Nullable<string>;
}

export interface SourceCareerNarrative {
  current_focus?: Nullable<string>;
  next_role?: Nullable<string>;
  strengths?: string[];
  professional_themes?: string[];
  preferred_problem_types?: string[];
  leadership_style?: Nullable<string>;
  collaboration_style?: Nullable<string>;
}

export interface SourceProfile {
  schema_version: 1;
  basics: SourceBasics;
  summary: string;
  experience: SourceExperience[];
  projects?: SourceProject[];
  education: SourceEducation[];
  certifications: SourceCertification[];
  skills: string[];
  references: SourceReference[];
  generation_preferences: {
    max_length: string;
    include_projects: string;
    tone_preferences: string[];
  };
  career_preferences?: SourceCareerPreferences;
  career_narrative?: SourceCareerNarrative;
  publication?: {
    mcp: {
      enabled?: boolean;
      include_email?: boolean;
      include_short_testimonials?: boolean;
    };
  };
}
