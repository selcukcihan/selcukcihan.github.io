import type {
  CareerPublicData,
  PublicProjection,
  SearchDocument,
  SearchIndex,
  SearchResult,
  SectionName,
} from "./public-contract";

const ALIAS_GROUPS = [
  ["gcp", "google", "cloud", "google-cloud"],
  ["datadog", "data-dog"],
  ["net", "dotnet", "microsoft", "microsoft-net"],
  ["node", "node.js", "nodejs"],
] as const;

const ALIAS_LOOKUP = new Map<string, readonly string[]>();
for (const group of ALIAS_GROUPS) {
  for (const term of group) {
    ALIAS_LOOKUP.set(term, group);
  }
}

function normalizeText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function baseTokens(value: string): string[] {
  return normalizeText(value).match(/[a-z0-9]+(?:\.[a-z0-9]+)*/g) ?? [];
}

export function searchTokens(value: string): string[] {
  const tokens = new Set(baseTokens(value));
  const normalizedPhrase = baseTokens(value).join("-");
  if (normalizedPhrase) {
    tokens.add(normalizedPhrase);
  }

  for (const token of [...tokens]) {
    const aliases = ALIAS_LOOKUP.get(token);
    if (aliases) {
      for (const alias of aliases) {
        tokens.add(alias);
      }
    }
  }
  return [...tokens].sort();
}

function flattenPublicValues(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return [String(value)];
  }
  if (Array.isArray(value)) {
    return value.flatMap(flattenPublicValues);
  }
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(flattenPublicValues);
  }
  return [];
}

function document(input: {
  kind: SearchDocument["kind"];
  section: SectionName;
  id: string;
  title: string;
  summary: string;
  titleText?: string;
  tagText?: string[];
  bodyText?: string[];
  evidenceRefs: string[];
}): SearchDocument {
  return {
    kind: input.kind,
    section: input.section,
    id: input.id,
    title: input.title,
    summary: input.summary.slice(0, 280),
    titleTokens: searchTokens(input.titleText ?? input.title),
    tagTokens: searchTokens((input.tagText ?? []).join(" ")),
    bodyTokens: searchTokens((input.bodyText ?? []).join(" ")),
    evidenceRefs: input.evidenceRefs,
  };
}

export function buildSearchDocuments(
  data: PublicProjection,
): SearchDocument[] {
  const documents: SearchDocument[] = [
    document({
      kind: "profile",
      section: "profile",
      id: "profile",
      title: `${data.profile.fullName} — ${data.profile.currentTitle}`,
      summary: data.profile.summary,
      titleText: `${data.profile.fullName} ${data.profile.currentTitle}`,
      bodyText: [data.profile.summary],
      evidenceRefs: ["profile:profile"],
    }),
  ];

  for (const item of data.experience) {
    documents.push(
      document({
        kind: "experience",
        section: "experience",
        id: item.id,
        title: `${item.title} at ${item.company}`,
        summary: item.descriptions.join(" "),
        titleText: `${item.title} ${item.company}`,
        tagText: item.tech,
        bodyText: [item.dates, ...item.descriptions],
        evidenceRefs: [`experience:${item.id}`],
      }),
    );
  }

  for (const item of data.projects) {
    documents.push(
      document({
        kind: "project",
        section: "projects",
        id: item.id,
        title: item.name,
        summary: [item.subtitle, ...item.bullets].join(" "),
        tagText: item.tech,
        bodyText: [item.dates, item.subtitle, ...item.bullets],
        evidenceRefs: [`project:${item.id}`],
      }),
    );
  }

  for (const item of data.education) {
    documents.push(
      document({
        kind: "education",
        section: "education",
        id: item.id,
        title: `${item.degree} — ${item.institution}`,
        summary: item.fieldOfStudy.join(", "),
        titleText: `${item.degree} ${item.institution}`,
        tagText: item.fieldOfStudy,
        bodyText: item.dates ? [item.dates] : [],
        evidenceRefs: [`education:${item.id}`],
      }),
    );
  }

  for (const item of data.certifications) {
    documents.push(
      document({
        kind: "certification",
        section: "certifications",
        id: item.id,
        title: item.name,
        summary: item.issuer,
        titleText: `${item.name} ${item.issuer}`,
        bodyText: item.expirationDate ? [item.expirationDate] : [],
        evidenceRefs: [`certification:${item.id}`],
      }),
    );
  }

  for (const item of data.skills) {
    documents.push(
      document({
        kind: "skill",
        section: "skills",
        id: item.id,
        title: item.label,
        summary: `Published skill: ${item.label}`,
        tagText: [item.label],
        evidenceRefs: item.evidenceRefs,
      }),
    );
  }

  if (data.careerPreferences) {
    documents.push(
      document({
        kind: "profile",
        section: "preferences",
        id: "preferences",
        title: "Career preferences",
        summary: flattenPublicValues(data.careerPreferences).join(", "),
        tagText: flattenPublicValues(data.careerPreferences),
        evidenceRefs: ["preferences:preferences"],
      }),
    );
  }

  if (data.careerNarrative) {
    documents.push(
      document({
        kind: "profile",
        section: "narrative",
        id: "narrative",
        title: "Career narrative",
        summary: flattenPublicValues(data.careerNarrative).join(" "),
        bodyText: flattenPublicValues(data.careerNarrative),
        evidenceRefs: ["narrative:narrative"],
      }),
    );
  }

  for (const item of data.testimonials) {
    documents.push(
      document({
        kind: "testimonial",
        section: "testimonials",
        id: item.id,
        title: `${item.name} — ${item.title}`,
        summary: item.testimonial,
        titleText: `${item.name} ${item.title}`,
        bodyText: [item.testimonial],
        evidenceRefs: [`testimonial:${item.id}`],
      }),
    );
  }

  return documents;
}

interface RankedResult {
  result: SearchResult;
  score: number;
}

export function searchCareer(
  index: SearchIndex,
  query: string,
  sections: SectionName[] | undefined,
  limit: number,
): SearchResult[] {
  const queryTerms = baseTokens(query);
  const allowed = sections ? new Set(sections) : null;
  const ranked: RankedResult[] = [];

  for (const item of index.documents) {
    if (allowed && !allowed.has(item.section)) {
      continue;
    }

    const title = new Set(item.titleTokens);
    const tags = new Set(item.tagTokens);
    const body = new Set(item.bodyTokens);
    const matchedTerms: string[] = [];
    let score = 0;

    for (const term of queryTerms) {
      const expanded = searchTokens(term);
      const titleMatch = expanded.some((candidate) => title.has(candidate));
      const tagMatch = expanded.some((candidate) => tags.has(candidate));
      const bodyMatch = expanded.some((candidate) => body.has(candidate));
      if (titleMatch || tagMatch || bodyMatch) {
        matchedTerms.push(term);
        score += titleMatch ? 12 : 0;
        score += tagMatch ? 10 : 0;
        score += bodyMatch ? 3 : 0;
      }
    }

    if (score > 0) {
      ranked.push({
        score,
        result: {
          kind: item.kind,
          id: item.id,
          title: item.title,
          summary: item.summary.slice(0, 280),
          matchedTerms: [...new Set(matchedTerms)],
          evidenceRefs: item.evidenceRefs,
        },
      });
    }
  }

  return ranked
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.result.kind.localeCompare(right.result.kind) ||
        left.result.id.localeCompare(right.result.id),
    )
    .slice(0, limit)
    .map(({ result }) => result);
}

export function createSearchIndex(
  data: CareerPublicData,
): SearchIndex {
  return {
    schemaVersion: data.schemaVersion,
    dataVersion: data.dataVersion,
    documents: buildSearchDocuments(data),
  };
}
