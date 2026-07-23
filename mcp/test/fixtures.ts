import fs from "node:fs";
import path from "node:path";

import { parse } from "yaml";

import type { SourceProfile } from "../src/source-contract";

export function actualSource(): SourceProfile {
  const sourcePath = path.resolve(import.meta.dirname, "../../candidate-profile.yaml");
  return parse(fs.readFileSync(sourcePath, "utf8")) as SourceProfile;
}

export function sentinelSource(): SourceProfile {
  return {
    schema_version: 1,
    basics: {
      full_name: "Example Candidate",
      current_title: "Software Engineer",
      email: "private-candidate-email@example.invalid",
      url: "example.com",
    },
    summary: "Builds reliable public systems.",
    experience: [
      {
        id: "example-role",
        title: "Software Engineer",
        company: "Example Company",
        dates: "2020 - 2024",
        tech: ["GCP", "Java/Scala", "REST/GraphQL"],
        descriptions: ["Improved public service observability with Datadog."],
      },
    ],
    education: [
      {
        id: "example-education",
        institution: "Example University",
        degree: "BS Computer Science",
      },
    ],
    certifications: [
      {
        id: "example-certification",
        name: "Example Certification",
        issuer: "Example Issuer",
      },
    ],
    skills: ["Microsoft .Net", "Node.js"],
    references: [
      {
        name: "Reference Person",
        title: "Manager",
        contact: "CONTACT_SENTINEL_7f23a9",
        testimonial: "SHORT_TESTIMONIAL_SENTINEL_49cd11",
        fullTestimonial: "FULL_TESTIMONIAL_SENTINEL_b61e07",
      },
    ],
    generation_preferences: {
      max_length: "GENERATION_SENTINEL_124a81",
      include_projects: "only_when_helpful",
      tone_preferences: ["direct"],
    },
  };
}
