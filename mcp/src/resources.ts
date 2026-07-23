import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { careerData } from "./data";
import type { SectionName } from "./public-contract";

const SECTION_URIS: Record<SectionName, string> = {
  profile: "career://profile",
  experience: "career://experience",
  skills: "career://skills",
  education: "career://education",
  certifications: "career://certifications",
  projects: "career://projects",
  preferences: "career://preferences",
  narrative: "career://narrative",
  testimonials: "career://testimonials",
  metadata: "career://metadata",
};

function hasSection(section: SectionName): boolean {
  switch (section) {
    case "profile":
    case "metadata":
      return true;
    case "experience":
      return careerData.experience.length > 0;
    case "skills":
      return careerData.skills.length > 0;
    case "education":
      return careerData.education.length > 0;
    case "certifications":
      return careerData.certifications.length > 0;
    case "projects":
      return careerData.projects.length > 0;
    case "preferences":
      return careerData.careerPreferences !== null;
    case "narrative":
      return careerData.careerNarrative !== null;
    case "testimonials":
      return careerData.testimonials.length > 0;
  }
}

export function availableSections(): SectionName[] {
  return (Object.keys(SECTION_URIS) as SectionName[]).filter(hasSection);
}

export function sectionData(section: SectionName): unknown {
  switch (section) {
    case "profile":
      return careerData.profile;
    case "experience":
      return careerData.experience;
    case "skills":
      return careerData.skills;
    case "education":
      return careerData.education;
    case "certifications":
      return careerData.certifications;
    case "projects":
      return careerData.projects;
    case "preferences":
      return careerData.careerPreferences;
    case "narrative":
      return careerData.careerNarrative;
    case "testimonials":
      return careerData.testimonials;
    case "metadata":
      return {
        schemaVersion: careerData.schemaVersion,
        dataVersion: careerData.dataVersion,
        serverVersion: careerData.serverVersion,
        sourceCommit: careerData.sourceCommit,
      };
  }
}

export function sectionPayload(section: SectionName): Record<string, unknown> {
  return {
    schemaVersion: careerData.schemaVersion,
    dataVersion: careerData.dataVersion,
    sourceCommit: careerData.sourceCommit,
    section,
    data: sectionData(section),
  };
}

function indexPayload(): Record<string, unknown> {
  const sections = availableSections();
  return {
    schemaVersion: careerData.schemaVersion,
    dataVersion: careerData.dataVersion,
    sourceCommit: careerData.sourceCommit,
    section: "index",
    data: {
      resources: [
        "career://index",
        ...sections.map((section) => SECTION_URIS[section]),
      ],
      counts: {
        experience: careerData.experience.length,
        projects: careerData.projects.length,
        education: careerData.education.length,
        certifications: careerData.certifications.length,
        skills: careerData.skills.length,
        testimonials: careerData.testimonials.length,
      },
    },
  };
}

function resourceResponse(uri: URL, payload: Record<string, unknown>) {
  return {
    contents: [
      {
        uri: uri.toString(),
        mimeType: "application/json",
        text: JSON.stringify(payload),
      },
    ],
  };
}

export function registerResources(server: McpServer): void {
  server.registerResource(
    "career-index",
    "career://index",
    {
      title: "Career resource index",
      description: "Available public career resources and item counts.",
      mimeType: "application/json",
    },
    (uri) => resourceResponse(uri, indexPayload()),
  );

  for (const section of availableSections()) {
    server.registerResource(
      `career-${section}`,
      SECTION_URIS[section],
      {
        title: `Career ${section}`,
        description: `Public, owner-maintained ${section} career data.`,
        mimeType: "application/json",
      },
      (uri) => resourceResponse(uri, sectionPayload(section)),
    );
  }
}
