import fs from "node:fs";
import path from "node:path";

import { parse } from "yaml";

import type {
  CareerExperience,
  Certification,
  Education,
  ProfileData,
  Testimonial,
} from "@/app/types/data";

type CandidateProfile = {
  basics: {
    full_name: string;
    current_title: string;
    email: string;
    url: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    dates: string;
    url?: string;
    tech?: string[];
    descriptions?: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field_of_study?: string[];
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
  }>;
  references: Array<{
    name: string;
    title: string;
    testimonial: string;
    fullTestimonial?: string;
  }>;
};

export type PortfolioData = {
  profileData: ProfileData;
  testimonials: Testimonial[];
  careerExperiences: CareerExperience[];
  education: Education[];
  certifications: Certification[];
};

const profileImage = "/profile.png";

const socialLinks = [
  {
    platform: "GitHub",
    url: "https://github.com/selcukcihan",
    icon: "Github",
  },
  {
    platform: "LinkedIn",
    url: "https://linkedin.com/in/selcukcihan",
    icon: "Linkedin",
  },
  {
    platform: "Twitter",
    url: "https://twitter.com/scihan",
    icon: "Twitter",
  },
  {
    platform: "Substack",
    url: "https://defter.selcukcihan.com",
    icon: "BookOpen",
  },
];

const certificationUi: Record<string, Omit<Certification, "name" | "issuer">> = {
  "AWS Certified Solutions Architect - Professional": {
    level: "Professional",
    issued: "2022",
    expires: "2025",
    imageUrl: "/architect.png?height=64&width=64",
    url: "https://www.credly.com/badges/f2b93002-0754-4e37-8d31-031d2d520ee3",
  },
};

function loadCandidateProfile(): CandidateProfile {
  const filePath = path.join(process.cwd(), "candidate-profile.yaml");
  return parse(fs.readFileSync(filePath, "utf8")) as CandidateProfile;
}

function splitSummary(summary: string): string[] {
  return summary
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function websiteName(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "");
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitTitleAndCompany(value: string): { title: string; company: string } {
  const [title, ...companyParts] = value.split(",");
  return {
    title: title.trim(),
    company: companyParts.join(",").trim(),
  };
}

export function getPortfolioData(): PortfolioData {
  const candidate = loadCandidateProfile();

  return {
    profileData: {
      name: candidate.basics.full_name,
      title: candidate.basics.current_title,
      bio: splitSummary(candidate.summary),
      image: profileImage,
      socials: [
        {
          platform: "Resume",
          url: "/resume/selcukcihan.pdf",
          icon: "FileText",
        },
        {
          platform: "Email",
          url: `mailto:${candidate.basics.email}`,
          icon: "Mail",
        },
        ...socialLinks,
      ],
    },
    testimonials: candidate.references.map((reference) => {
      const { title, company } = splitTitleAndCompany(reference.title);

      return {
        id: slugify(reference.name),
        quote: reference.testimonial,
        author: reference.name,
        title,
        company,
        fullTestimonial: reference.fullTestimonial ?? "",
      };
    }),
    careerExperiences: candidate.experience.map((experience) => ({
      company: experience.company,
      website: experience.url
        ? {
            name: websiteName(experience.url),
            url: experience.url,
          }
        : undefined,
      role: experience.title,
      period: experience.dates,
      description: "",
      achievements: experience.descriptions ?? [],
      tech: experience.tech ?? [],
    })),
    education: candidate.education.map((education) => ({
      degree: education.degree,
      university: education.institution,
      year: "",
      details: education.field_of_study?.join(", "),
    })),
    certifications: candidate.certifications.map((certification) => ({
      name: certification.name,
      issuer: certification.issuer,
      ...(certificationUi[certification.name] ?? {
        level: "",
        issued: "",
        expires: "",
        imageUrl: "",
        url: "",
      }),
    })),
  };
}
