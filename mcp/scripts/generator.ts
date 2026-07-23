import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Ajv2020, { type ErrorObject, type ValidateFunction } from "ajv/dist/2020.js";
import { parse } from "yaml";

import {
  SCHEMA_VERSION,
  SERVER_VERSION,
  type BuildMetadata,
  type CareerPublicData,
  type PublicCareerNarrative,
  type PublicCareerPreferences,
  type PublicProjection,
  type PublicSkill,
  type SearchIndex,
} from "../src/public-contract";
import { buildSearchDocuments, searchTokens } from "../src/search";
import type {
  SourceCareerNarrative,
  SourceCareerPreferences,
  SourceProfile,
} from "../src/source-contract";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const MCP_DIR = path.dirname(SCRIPT_DIR);
const SCHEMA_PATH = path.join(
  MCP_DIR,
  "schema",
  "candidate-profile.schema.json",
);
const GENERATED_DIR = path.join(MCP_DIR, "src", "generated");
const FORBIDDEN_KEYS = new Set([
  "contact",
  "fullTestimonial",
  "generation_preferences",
  "publication",
]);

export interface GeneratedArtifacts {
  publicData: CareerPublicData;
  searchIndex: SearchIndex;
  metadata: BuildMetadata;
}

function readSchema(): object {
  return JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8")) as object;
}

function validator(): ValidateFunction<SourceProfile> {
  const ajv = new Ajv2020({
    allErrors: true,
    strict: true,
  });
  return ajv.compile<SourceProfile>(readSchema());
}

function formatValidationErrors(errors: ErrorObject[] | null | undefined): string {
  return (errors ?? [])
    .map((error) => `${error.instancePath || "/"} ${error.message ?? "is invalid"}`)
    .join("\n");
}

export function validateSource(value: unknown): SourceProfile {
  const validate = validator();
  if (!validate(value)) {
    throw new Error(`Candidate profile validation failed:\n${formatValidationErrors(validate.errors)}`);
  }
  return value;
}

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function requiredId(explicit: string | undefined, fallback: string, kind: string): string {
  const id = explicit ?? slugify(fallback);
  if (!id) {
    throw new Error(`Could not generate a stable ${kind} ID`);
  }
  return id;
}

function assertUniqueIds(kind: string, ids: string[]): void {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) {
      throw new Error(`Duplicate ${kind} ID: ${id}`);
    }
    seen.add(id);
  }
}

function normalizeWebUrl(value: string): string {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  const url = new URL(withProtocol);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Only HTTP(S) public links are supported");
  }
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

function optionalUrl(value: string | null | undefined): string | undefined {
  return value ? normalizeWebUrl(value) : undefined;
}

function meaningful(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(meaningful);
  if (typeof value === "object") return Object.values(value).some(meaningful);
  return true;
}

function addIfMeaningful(
  target: Record<string, unknown>,
  key: string,
  value: unknown,
): void {
  if (meaningful(value)) {
    target[key] = value;
  }
}

function projectPreferences(
  source: SourceCareerPreferences | undefined,
): PublicCareerPreferences | null {
  if (!source) return null;
  const result: Record<string, unknown> = {};
  addIfMeaningful(result, "opportunityStatus", source.opportunity_status);
  addIfMeaningful(result, "targetRoles", source.target_roles);
  addIfMeaningful(result, "seniorityLevels", source.seniority_levels);
  addIfMeaningful(result, "employmentTypes", source.employment_types);
  addIfMeaningful(result, "workModes", source.work_modes);
  addIfMeaningful(result, "baseTimeZone", source.base_time_zone);
  if (source.overlap_availability) {
    const overlapAvailability: Record<string, unknown> = {};
    addIfMeaningful(
      overlapAvailability,
      "timeZone",
      source.overlap_availability.time_zone,
    );
    addIfMeaningful(
      overlapAvailability,
      "startTime",
      source.overlap_availability.start_time,
    );
    addIfMeaningful(
      overlapAvailability,
      "endTime",
      source.overlap_availability.end_time,
    );
    addIfMeaningful(result, "overlapAvailability", overlapAvailability);
  }
  if (source.commercial_terms) {
    const commercialTerms: Record<string, unknown> = {};
    addIfMeaningful(
      commercialTerms,
      "contractModels",
      source.commercial_terms.contract_models,
    );
    addIfMeaningful(
      commercialTerms,
      "paymentCurrency",
      source.commercial_terms.payment_currency,
    );
    addIfMeaningful(
      commercialTerms,
      "hourlyRate",
      source.commercial_terms.hourly_rate,
    );
    addIfMeaningful(result, "commercialTerms", commercialTerms);
  }
  addIfMeaningful(result, "preferredLocations", source.preferred_locations);
  addIfMeaningful(result, "preferredTimeZones", source.preferred_time_zones);
  addIfMeaningful(result, "domains", source.domains);
  addIfMeaningful(result, "industries", source.industries);
  addIfMeaningful(result, "companyStages", source.company_stages);
  addIfMeaningful(result, "teamEnvironments", source.team_environments);
  addIfMeaningful(result, "impactPreferences", source.impact_preferences);
  if (source.relocation) {
    const relocation: Record<string, unknown> = {};
    addIfMeaningful(relocation, "willing", source.relocation.willing);
    addIfMeaningful(relocation, "notes", source.relocation.notes);
    addIfMeaningful(result, "relocation", relocation);
  }
  if (source.travel) {
    const travel: Record<string, unknown> = {};
    addIfMeaningful(travel, "willingness", source.travel.willingness);
    addIfMeaningful(travel, "maximumPercent", source.travel.maximum_percent);
    addIfMeaningful(result, "travel", travel);
  }
  if (source.availability) {
    const availability: Record<string, unknown> = {};
    addIfMeaningful(
      availability,
      "earliestStartDate",
      source.availability.earliest_start_date,
    );
    addIfMeaningful(availability, "noticePeriod", source.availability.notice_period);
    addIfMeaningful(result, "availability", availability);
  }
  addIfMeaningful(result, "notes", source.notes);
  return meaningful(result) ? result : null;
}

function projectNarrative(
  source: SourceCareerNarrative | undefined,
): PublicCareerNarrative | null {
  if (!source) return null;
  const result: Record<string, unknown> = {};
  addIfMeaningful(result, "currentFocus", source.current_focus);
  addIfMeaningful(result, "nextRole", source.next_role);
  addIfMeaningful(result, "strengths", source.strengths);
  addIfMeaningful(result, "professionalThemes", source.professional_themes);
  addIfMeaningful(
    result,
    "preferredProblemTypes",
    source.preferred_problem_types,
  );
  addIfMeaningful(result, "leadershipStyle", source.leadership_style);
  addIfMeaningful(result, "collaborationStyle", source.collaboration_style);
  return meaningful(result) ? result : null;
}

function skillEvidence(
  skillId: string,
  skillLabel: string,
  experience: PublicProjection["experience"],
  projects: PublicProjection["projects"],
): string[] {
  const skillTerms = new Set(searchTokens(skillLabel));
  const evidence = [
    `skill:${skillId}`,
    ...experience
      .filter((item) =>
        item.tech.some((label) =>
          searchTokens(label).some((term) => skillTerms.has(term)),
        ),
      )
      .map((item) => `experience:${item.id}`),
    ...projects
      .filter((item) =>
        item.tech.some((label) =>
          searchTokens(label).some((term) => skillTerms.has(term)),
        ),
      )
      .map((item) => `project:${item.id}`),
  ];
  return [...new Set(evidence)];
}

export function projectPublicProfile(source: SourceProfile): PublicProjection {
  const includeEmail = source.publication?.mcp.include_email === true;
  const includeTestimonials =
    source.publication?.mcp.include_short_testimonials === true;

  const experience = source.experience.map((item) => {
    const url = optionalUrl(item.url);
    return {
      id: requiredId(item.id, `${item.company}-${item.title}`, "experience"),
      title: item.title,
      company: item.company,
      dates: item.dates,
      ...(url ? { url } : {}),
      tech: item.tech ? [...item.tech] : [],
      descriptions: item.descriptions ? [...item.descriptions] : [],
    };
  });
  assertUniqueIds("experience", experience.map(({ id }) => id));

  const projects = (source.projects ?? []).map((item) => {
    const url = optionalUrl(item.url);
    return {
      id: requiredId(item.id, item.name, "project"),
      name: item.name,
      dates: item.dates,
      subtitle: item.subtitle,
      ...(url ? { url } : {}),
      tech: item.tech ? [...item.tech] : [],
      bullets: item.bullets ? [...item.bullets] : [],
    };
  });
  assertUniqueIds("project", projects.map(({ id }) => id));

  const education = source.education.map((item) => ({
    id: requiredId(
      item.id,
      `${item.institution}-${item.degree}`,
      "education",
    ),
    institution: item.institution,
    degree: item.degree,
    ...(item.dates ? { dates: item.dates } : {}),
    fieldOfStudy: item.field_of_study ? [...item.field_of_study] : [],
  }));
  assertUniqueIds("education", education.map(({ id }) => id));

  const certifications = source.certifications.map((item) => ({
    id: requiredId(item.id, `${item.issuer}-${item.name}`, "certification"),
    name: item.name,
    issuer: item.issuer,
    ...(item.expiration_date
      ? { expirationDate: item.expiration_date }
      : {}),
  }));
  assertUniqueIds("certification", certifications.map(({ id }) => id));

  const skillIds = source.skills.map((label) => requiredId(undefined, label, "skill"));
  assertUniqueIds("skill", skillIds);
  const skills: PublicSkill[] = source.skills.map((label, index) => ({
    id: skillIds[index]!,
    label,
    evidenceRefs: skillEvidence(skillIds[index]!, label, experience, projects),
  }));

  const testimonials = includeTestimonials
    ? source.references.map((item) => ({
        id: requiredId(item.id, item.name, "testimonial"),
        name: item.name,
        title: item.title,
        testimonial: item.testimonial,
      }))
    : [];
  assertUniqueIds("testimonial", testimonials.map(({ id }) => id));

  return {
    profile: {
      fullName: source.basics.full_name,
      currentTitle: source.basics.current_title,
      url: normalizeWebUrl(source.basics.url),
      summary: source.summary.trim(),
      ...(includeEmail ? { email: source.basics.email } : {}),
    },
    experience,
    projects,
    education,
    certifications,
    skills,
    careerPreferences: projectPreferences(source.career_preferences),
    careerNarrative: projectNarrative(source.career_narrative),
    testimonials,
  };
}

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stableValue);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nested]) => [key, stableValue(nested)]),
    );
  }
  return value;
}

export function canonicalJson(value: unknown): string {
  return JSON.stringify(stableValue(value));
}

function sourceCommit(): string {
  const githubSha = process.env.GITHUB_SHA;
  if (githubSha && /^[a-f0-9]{40}$/i.test(githubSha)) {
    return githubSha.toLowerCase();
  }
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: path.dirname(MCP_DIR),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "development";
  }
}

function assertNoForbiddenKeys(value: unknown, currentPath = "$"): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      assertNoForbiddenKeys(item, `${currentPath}[${index}]`),
    );
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, nested] of Object.entries(value)) {
    if (FORBIDDEN_KEYS.has(key)) {
      throw new Error(`Forbidden key in public output at ${currentPath}.${key}`);
    }
    assertNoForbiddenKeys(nested, `${currentPath}.${key}`);
  }
}

function assertPrivacySentinels(source: SourceProfile, serialized: string): void {
  const sentinels = [
    ...source.references.map(({ contact }) => contact),
    ...source.references.flatMap(({ fullTestimonial }) =>
      fullTestimonial ? [fullTestimonial] : [],
    ),
    canonicalJson(source.generation_preferences),
  ];
  for (const sentinel of sentinels) {
    if (sentinel && serialized.includes(sentinel)) {
      throw new Error("Private source value found in generated public output");
    }
  }
}

export function generateArtifacts(
  sourceValue: unknown,
  commit = sourceCommit(),
): GeneratedArtifacts {
  const source = validateSource(sourceValue);
  const projection = projectPublicProfile(source);
  const dataVersion = createHash("sha256")
    .update(canonicalJson(projection))
    .digest("hex");
  const publicData: CareerPublicData = {
    schemaVersion: SCHEMA_VERSION,
    serverVersion: SERVER_VERSION,
    sourceCommit: commit,
    dataVersion,
    ...projection,
  };
  const searchIndex: SearchIndex = {
    schemaVersion: SCHEMA_VERSION,
    dataVersion,
    documents: buildSearchDocuments(projection),
  };
  const metadata: BuildMetadata = {
    schemaVersion: SCHEMA_VERSION,
    serverVersion: SERVER_VERSION,
    sourceCommit: commit,
    dataVersion,
  };

  assertNoForbiddenKeys(publicData);
  assertNoForbiddenKeys(searchIndex);
  assertPrivacySentinels(
    source,
    `${canonicalJson(publicData)}${canonicalJson(searchIndex)}`,
  );
  return { publicData, searchIndex, metadata };
}

export function resolveSourcePath(argument: string | undefined): string {
  const relativePath = argument ?? "../candidate-profile.yaml";
  return path.resolve(MCP_DIR, relativePath);
}

export function generateFromFile(sourceArgument: string | undefined): GeneratedArtifacts {
  const sourcePath = resolveSourcePath(sourceArgument);
  const parsed = parse(fs.readFileSync(sourcePath, "utf8")) as unknown;
  return generateArtifacts(parsed);
}

export function writeArtifacts(artifacts: GeneratedArtifacts): void {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
  const files: Array<[string, unknown]> = [
    ["career-public.json", artifacts.publicData],
    ["search-index.json", artifacts.searchIndex],
    ["build-metadata.json", artifacts.metadata],
  ];
  for (const [filename, value] of files) {
    fs.writeFileSync(
      path.join(GENERATED_DIR, filename),
      `${JSON.stringify(stableValue(value), null, 2)}\n`,
      "utf8",
    );
  }
}
