import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { careerData, careerSearchIndex } from "./data";
import type { ItemKind, SectionName } from "./public-contract";
import {
  availableSections,
  sectionData,
  sectionPayload,
} from "./resources";
import { searchCareer } from "./search";

const sectionSchema = z.enum([
  "profile",
  "experience",
  "skills",
  "education",
  "certifications",
  "projects",
  "preferences",
  "narrative",
  "testimonials",
  "metadata",
]);
const searchSectionSchema = z.enum([
  "profile",
  "experience",
  "skills",
  "education",
  "certifications",
  "projects",
  "preferences",
  "narrative",
  "testimonials",
]);
const itemKindSchema = z.enum([
  "experience",
  "project",
  "education",
  "certification",
  "skill",
  "testimonial",
]);
const annotations = {
  readOnlyHint: true,
  idempotentHint: true,
  openWorldHint: false,
} as const;

function toolResult(structuredContent: Record<string, unknown>) {
  return {
    structuredContent,
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(structuredContent),
      },
    ],
  };
}

function itemsForKind(kind: ItemKind): Array<{ id: string }> {
  switch (kind) {
    case "experience":
      return careerData.experience;
    case "project":
      return careerData.projects;
    case "education":
      return careerData.education;
    case "certification":
      return careerData.certifications;
    case "skill":
      return careerData.skills;
    case "testimonial":
      return careerData.testimonials;
  }
}

function evidenceRefsForItem(kind: ItemKind, item: { id: string }): string[] {
  if (kind === "skill") {
    const skill = careerData.skills.find(({ id }) => id === item.id);
    return skill?.evidenceRefs ?? [];
  }
  return [`${kind}:${item.id}`];
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "get_career_section",
    {
      title: "Get career section",
      description:
        "Returns one available public career section. Raw source YAML is never returned.",
      inputSchema: z.object({ section: sectionSchema }),
      outputSchema: z.object({
        schemaVersion: z.number().optional(),
        dataVersion: z.string(),
        sourceCommit: z.string().optional(),
        section: z.string(),
        data: z.unknown().optional(),
        error: z.literal("section_unavailable").optional(),
        message: z.string().optional(),
      }),
      annotations,
    },
    ({ section }) => {
      if (!availableSections().includes(section)) {
        return toolResult({
          error: "section_unavailable",
          section,
          message: "That public section is not published or contains no data.",
          dataVersion: careerData.dataVersion,
        });
      }
      return toolResult(sectionPayload(section));
    },
  );

  server.registerTool(
    "get_career_item",
    {
      title: "Get career item",
      description:
        "Returns an exact public career item by stable ID with evidence references.",
      inputSchema: z.object({
        kind: itemKindSchema,
        id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(160),
      }),
      outputSchema: z.object({
        found: z.boolean(),
        kind: itemKindSchema,
        id: z.string(),
        item: z.unknown().optional(),
        evidenceRefs: z.array(z.string()).optional(),
        dataVersion: z.string(),
      }),
      annotations,
    },
    ({ kind, id }) => {
      const item = itemsForKind(kind).find((candidate) => candidate.id === id);
      if (!item) {
        return toolResult({
          found: false,
          kind,
          id,
          dataVersion: careerData.dataVersion,
        });
      }
      return toolResult({
        found: true,
        kind,
        id,
        item,
        evidenceRefs: evidenceRefsForItem(kind, item),
        dataVersion: careerData.dataVersion,
      });
    },
  );

  server.registerTool(
    "search_career",
    {
      title: "Search career evidence",
      description:
        "Deterministic lexical and technology-alias search over public career data only.",
      inputSchema: z.object({
        query: z.string().trim().min(1).max(200),
        sections: z.array(searchSectionSchema).max(9).optional(),
        limit: z.number().int().min(1).max(20).default(10),
      }),
      outputSchema: z.object({
        query: z.string(),
        results: z.array(
          z.object({
            kind: z.string(),
            id: z.string(),
            title: z.string(),
            summary: z.string(),
            matchedTerms: z.array(z.string()),
            evidenceRefs: z.array(z.string()),
          }),
        ),
        dataVersion: z.string(),
      }),
      annotations,
    },
    ({ query, sections, limit }) =>
      toolResult({
        query,
        results: searchCareer(
          careerSearchIndex,
          query,
          sections as SectionName[] | undefined,
          limit,
        ),
        dataVersion: careerData.dataVersion,
      }),
  );
}

export function getSectionForTests(section: SectionName): unknown {
  return sectionData(section);
}
