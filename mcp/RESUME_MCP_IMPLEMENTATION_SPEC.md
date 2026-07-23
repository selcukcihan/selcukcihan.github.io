# Personal Website Career MCP Server

Status: implementation-ready

Audience: coding agent operating in the personal GitHub Pages repository

Source data: the existing résumé YAML using the format defined in this document

MCP project location: `mcp/`

Target runtime: Cloudflare Workers

Target transport: MCP Streamable HTTP

Last reviewed: 2026-07-23

## 1. Assignment

Add a public, read-only career MCP server to the repository that hosts the owner's personal GitHub Pages website.

The implementation must use this boundary:

```text
<personal-pages-repository>/
├── candidate-profile.yaml        # or the existing equivalent résumé YAML path
├── <existing-personal-site-files>
└── mcp/
    └── <complete Cloudflare Worker project>
```

The personal website and MCP server live in the same Git repository but deploy to different platforms:

- GitHub Pages serves the static personal website.
- Cloudflare Workers serves the remote MCP endpoint.

The maintained résumé YAML is the only shared data source. The MCP implementation must be self-contained within the personal-site repository.

The intended production endpoint is:

```text
https://mcp.<OWNER_DOMAIN>/mcp
```

Until a custom domain is confirmed, use:

```text
https://<WORKER_NAME>.<CLOUDFLARE_SUBDOMAIN>.workers.dev/mcp
```

Do not attempt to host the MCP protocol through GitHub Pages. GitHub Pages is static, while remote MCP requires an HTTP runtime that accepts protocol requests at `/mcp`.

## 2. Required agent behavior

Before editing:

1. Read all repository instructions such as `AGENTS.md`, `CONTRIBUTING.md`, and README files.
2. Inspect the actual personal-site repository structure.
3. Locate the maintained résumé YAML.
4. Identify every current consumer of that YAML.
5. Identify the existing Pages deployment workflow.
6. Identify the site's package manager and build commands.
7. Run the existing site build/tests and record the baseline.
8. Review the working tree and preserve unrelated changes.

The agent must:

- Keep the MCP project entirely under `mcp/`, except for optional site documentation changes.
- Preserve the existing website behavior.
- Reuse the existing résumé YAML instead of copying career facts into MCP source files.
- Avoid inventing candidate data.
- Update documentation when behavior changes.
- Commit lockfiles.
- Never commit credentials.

The agent must not:

- Modify or invoke unrelated external tooling.
- Introduce a second manually maintained copy of experience, education, skills, or references.
- Return the source YAML wholesale.
- Assume every YAML field is safe for public MCP exposure.

## 3. Normative language

The words MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY have these meanings:

- MUST/MUST NOT: required for acceptance.
- SHOULD/SHOULD NOT: strong recommendation; deviate only with a documented repository-specific reason.
- MAY: optional.

## 4. Existing résumé YAML contract

Assume the maintained YAML currently has this root structure:

```yaml
schema_version: 1

basics:
  full_name: "..."
  current_title: "..."
  email: "..."
  url: "..."

summary: |
  ...

experience:
  - title: "..."
    company: "..."
    dates: "..."
    url: "..."
    tech: []
    descriptions: []

projects:
  - name: "..."
    dates: "..."
    subtitle: "..."
    url: "..."
    tech: []
    bullets: []

education:
  - institution: "..."
    dates: "..."
    degree: "..."
    field_of_study: []

certifications:
  - name: "..."
    issuer: "..."
    expiration_date: null

skills: []

references:
  - name: "..."
    title: "..."
    contact: "..."
    testimonial: "..."
    fullTestimonial: "..."

generation_preferences:
  max_length: "one_page"
  include_projects: "only_when_helpful"
  tone_preferences: []
```

Notes:

- `projects` may be absent.
- Several optional fields may be absent or `null`.
- `skills` is currently a flat `string[]`.
- `experience[].dates` is a human-readable string.
- Technology values may use different spellings or compound labels.
- The YAML contains candidate contact information and third-party reference information.
- `generation_preferences` is not professional-history data.

The implementation should preserve this compact source format and extend it additively.

## 5. Final architecture

```text
résumé YAML
    │
    ├── existing personal website consumer(s)
    │
    └── mcp/scripts/generate-public-profile.ts
            │
            ├── validate source
            ├── apply explicit allowlist
            ├── normalize IDs/search text
            ├── produce canonical public JSON
            └── produce build metadata
                    │
                    └── mcp/src/generated/*
                              │
                              └── Cloudflare Worker
                                    ├── GET /
                                    ├── GET /health
                                    └── MCP /mcp
```

Core decisions:

| Concern | Decision |
|---|---|
| Repository | Existing personal GitHub Pages repository |
| MCP source location | `mcp/` |
| Career source | Existing résumé YAML |
| Website deployment | Existing GitHub Pages workflow |
| MCP deployment | Cloudflare Worker |
| Remote transport | Streamable HTTP |
| Handler model | Stateless `createMcpHandler()` |
| Authentication | None for the public MVP |
| Runtime storage | None |
| Runtime upstream calls | None |
| Data preparation | Build time |
| Search | Deterministic lexical/tag search |
| Data exposure | Explicit public projection |
| AI inference | None on the server |

## 6. Target repository layout

Adapt filenames to the existing personal-site conventions, but keep the MCP boundary:

```text
<personal-pages-repository>/
├── candidate-profile.yaml
├── <existing-site-source>/
├── <existing-site-package-files>
├── mcp/
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── wrangler.jsonc
│   ├── worker-configuration.d.ts
│   ├── schema/
│   │   └── candidate-profile.schema.json
│   ├── scripts/
│   │   └── generate-public-profile.ts
│   ├── src/
│   │   ├── index.ts
│   │   ├── server.ts
│   │   ├── resources.ts
│   │   ├── tools.ts
│   │   ├── search.ts
│   │   ├── security.ts
│   │   ├── source-contract.ts
│   │   ├── public-contract.ts
│   │   └── generated/
│   │       ├── career-public.json
│   │       └── build-metadata.json
│   └── test/
│       ├── source-validation.test.ts
│       ├── projection.test.ts
│       ├── privacy.test.ts
│       ├── search.test.ts
│       ├── server.test.ts
│       └── worker.test.ts
└── .github/
    └── workflows/
        └── <existing-pages-workflow>.yml
```

Requirements:

- `mcp/package.json` must contain `"private": true`.
- `mcp/` must be an independently installable Node/TypeScript project.
- Do not force the website project to depend on MCP libraries.
- Do not convert the entire site into a monorepo/workspace unless the repository already uses that pattern.
- `mcp/` may read the résumé YAML from its existing repository path during build.
- The deployed Worker must contain only generated public data, not the source YAML.

## 7. Source-path configuration

The coding agent must locate the real YAML file instead of assuming its name.

Preferred behavior:

- If the personal-site repository already contains the YAML, use its existing path.
- If the attached YAML is being introduced to that repository, place it at `candidate-profile.yaml` in the repository root unless the site already has a data convention such as `data/profile.yaml`.
- Store the source path in one build-time constant or package script argument.
- Resolve the path relative to the repository, not the shell caller's arbitrary working directory.

Example:

```json
{
  "scripts": {
    "generate:data": "tsx scripts/generate-public-profile.ts ../candidate-profile.yaml"
  }
}
```

Do not hardcode an absolute local filesystem path into committed source.

## 8. YAML schema and validation

Create `mcp/schema/candidate-profile.schema.json` using JSON Schema draft 2020-12.

The schema must:

- Describe the attached YAML format.
- Use `additionalProperties: false` for validated objects.
- Support optional `projects`.
- Support nullable optional fields.
- Validate email/URL formats conservatively without rejecting currently intentional bare-domain website values.
- Validate new optional fields introduced below.
- Be used only as a format/validation contract, not as a publication allowlist.

Publication safety must remain a separate explicit projection step.

If the personal site already has an authoritative profile schema, reuse it instead of adding a competing schema under `mcp/`.

## 9. Additive YAML extensions

The owner wants the data to describe more than a conventional CV. Add the following optional sections.

### 9.1 Stable IDs

Add optional `id` properties to:

- Experience items.
- Project items.
- Education items.
- Certification items.
- Reference items only if sanitized testimonials become addressable.

ID schema:

```json
{
  "type": "string",
  "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
}
```

Requirements:

- IDs are metadata, not career claims.
- IDs must be unique within each item kind.
- IDs must remain stable when descriptions change.
- IDs must not include contact information.
- Explicit IDs are preferred.
- The build may generate fallback slugs for profiles without IDs.
- Fallback collisions must fail the build.

Do not include specific IDs in this specification. Generate them from the actual source items when implementing.

### 9.2 Career preferences

Add an optional root section:

```yaml
career_preferences:
  opportunity_status: null
  target_roles: []
  seniority_levels: []
  employment_types: []
  work_modes: []
  preferred_locations: []
  preferred_time_zones: []
  domains: []
  industries: []
  company_stages: []
  team_environments: []
  impact_preferences: []
  relocation:
    willing: null
    notes: null
  travel:
    willingness: null
    maximum_percent: null
  availability:
    earliest_start_date: null
    notice_period: null
  notes: null
```

Recommended controlled values:

- `opportunity_status`: `open`, `selectively_open`, `not_looking`
- `employment_types`: `full_time`, `part_time`, `contract`, `consulting`
- `work_modes`: `remote`, `hybrid`, `onsite`

Do not populate any value without owner input.

### 9.3 Career narrative

Add an optional root section:

```yaml
career_narrative:
  current_focus: null
  next_role: null
  strengths: []
  professional_themes: []
  preferred_problem_types: []
  leadership_style: null
  collaboration_style: null
```

This section is owner-authored. Do not infer it from résumé bullets or testimonials.

### 9.4 MCP publication preferences

Add an optional root section:

```yaml
publication:
  mcp:
    enabled: true
    include_email: false
    include_short_testimonials: false
```

Defaults:

- MCP build is enabled when explicitly invoked.
- Candidate email is excluded.
- Testimonials are excluded.
- Reference contacts are always excluded.
- Long-form testimonials are always excluded in the MVP.

No configuration flag may expose raw YAML.

### 9.5 Preserve existing compact structures

Do not migrate these during the MVP:

- `skills: string[]`
- Human-readable `dates` strings
- `experience[].descriptions`
- `projects[].bullets`
- Existing `fullTestimonial` spelling

Normalize them only in generated MCP data:

- Generate stable normalized skill identifiers.
- Split compound skill labels on `/` for search indexing.
- Preserve original display labels.
- Parse start/end years only when unambiguous.
- Preserve original date text.

## 10. Public projection

The MCP generator must build a new public DTO by selecting named properties.

Never cast the source YAML object directly to the public type.

Never use a root-level object spread such as:

```typescript
const publicData = { ...sourceProfile };
```

### 10.1 Included by default

Include:

```text
schema_version
basics.full_name
basics.current_title
basics.url
summary

experience[].id
experience[].title
experience[].company
experience[].dates
experience[].url
experience[].tech
experience[].descriptions

projects[].id
projects[].name
projects[].dates
projects[].subtitle
projects[].url
projects[].tech
projects[].bullets

education[].id
education[].institution
education[].dates
education[].degree
education[].field_of_study

certifications[].id
certifications[].name
certifications[].issuer
certifications[].expiration_date

skills[]
career_preferences
career_narrative
```

### 10.2 Conditionally included

Include `basics.email` only when:

```text
publication.mcp.include_email == true
```

Include sanitized short testimonials only when:

```text
publication.mcp.include_short_testimonials == true
```

A sanitized testimonial may contain only:

```text
reference.id
reference.name
reference.title
reference.testimonial
```

### 10.3 Always excluded

Never expose or index:

```text
references[].contact
references[].fullTestimonial
generation_preferences
publication
raw YAML
source filesystem paths
build credentials
```

`generation_preferences` is rendering metadata rather than professional-history data.

### 10.4 Fail-closed guarantees

- Unknown future YAML properties remain excluded.
- Adding a property to the JSON Schema does not publish it.
- Search documents are created only from the sanitized DTO.
- Empty optional fields should normally be omitted.
- The Worker bundle must not contain excluded values.

## 11. Generated data contract

Generate canonical JSON similar to:

```json
{
  "schemaVersion": 1,
  "serverVersion": "0.1.0",
  "sourceCommit": "<full-git-commit-sha>",
  "dataVersion": "<sha256-of-canonical-public-data>",
  "profile": {},
  "experience": [],
  "projects": [],
  "education": [],
  "certifications": [],
  "skills": [],
  "careerPreferences": null,
  "careerNarrative": null
}
```

Requirements:

- Use the full Git SHA in production.
- Use `"development"` when Git metadata is unavailable locally.
- Hash only canonical public content.
- Do not include build time in the data hash.
- Identical input must produce byte-stable canonical output where practical.
- Sort generated collections deterministically without changing intended résumé chronology.
- Normally gitignore generated JSON.
- Regenerate during local development, testing, and CI.

## 12. Build-time generator

Implement `mcp/scripts/generate-public-profile.ts`.

It must:

1. Read the real YAML file.
2. Parse it with `yaml`.
3. Validate it against the source schema with AJV draft 2020-12 in strict mode.
4. Report validation failures with JSON-pointer paths.
5. Validate explicit and generated ID uniqueness.
6. Apply the public allowlist.
7. Normalize links safely.
8. Generate deterministic search documents.
9. Scan output for forbidden keys and privacy sentinels.
10. Compute the public data hash.
11. Write public data and build metadata.

It must not:

- Call a model.
- Call an external API.
- Download résumé data.
- Modify the source YAML.
- Generate or rewrite career prose.

## 13. Search behavior

The current format includes compound and variant technology names. Improve discovery without changing display content.

Example aliases:

```text
GCP <-> Google Cloud
DataDog <-> Datadog
Microsoft .Net <-> Microsoft .NET <-> .NET
Java/Scala -> Java, Scala
SQL/NoSQL -> SQL, NoSQL
REST/GraphQL -> REST, GraphQL
Node.js -> Node, Node.js
```

Requirements:

- Return original source labels.
- Use normalized tokens only for indexing.
- Keep aliases in a small explicit tested table.
- Do not infer technologies not supported by the source.
- Index:
  - Profile headline and summary.
  - Experience titles, companies, tech, and descriptions.
  - Project names, subtitles, tech, and bullets.
  - Education.
  - Certifications.
  - Skills.
  - Career preferences.
  - Career narrative.
- Do not index excluded reference fields.
- Exact title/skill/technology matches rank above generic body matches.
- Sort deterministically by score, item kind, and stable ID.
- Bound snippets and result counts.

## 14. MCP contract

### 14.1 Server identity

Recommended identity:

```text
selcuk-cihan-career
```

Recommended private package name:

```text
@scihan/career-mcp
```

The coding agent may adjust these only to match the owner's naming conventions.

The description must state:

- The data is public and owner-maintained.
- The server is read-only.
- Responses are not independent employment verification.
- Clients should cite stable item IDs.
- Missing information must not be inferred.

### 14.2 Resources

Register resources only when corresponding public data exists:

| URI | MIME type | Content |
|---|---|---|
| `career://index` | `application/json` | Available resources and counts |
| `career://profile` | `application/json` | Public basics and summary |
| `career://experience` | `application/json` | Experience including technologies |
| `career://skills` | `application/json` | Skills and evidence references |
| `career://education` | `application/json` | Education |
| `career://certifications` | `application/json` | Certifications |
| `career://projects` | `application/json` | Only if projects exist |
| `career://preferences` | `application/json` | Only if preferences contain values |
| `career://narrative` | `application/json` | Only if narrative contains values |
| `career://testimonials` | `application/json` | Only after explicit opt-in |
| `career://metadata` | `application/json` | Schema/data/server/source versions |

Do not register `career://references`. The only optional reference-derived resource is sanitized short testimonials.

Use a consistent wrapper:

```json
{
  "schemaVersion": 1,
  "dataVersion": "<hash>",
  "sourceCommit": "<sha>",
  "section": "experience",
  "data": []
}
```

Use `McpServer.registerResource()`.

Do not use deprecated `.resource()` shorthand.

### 14.3 Tool: `get_career_section`

Input:

```json
{
  "section": "profile | experience | skills | education | certifications | projects | preferences | narrative | testimonials | metadata"
}
```

Behavior:

- Return a registered public section.
- Reject unpublished or unavailable sections clearly.
- Never return source YAML.

### 14.4 Tool: `get_career_item`

Input:

```json
{
  "kind": "experience | project | education | certification | skill | testimonial",
  "id": "stable-id"
}
```

Behavior:

- Match exact IDs.
- Return the item and public evidence references.
- Return a bounded not-found result.
- Never guess a different item.

### 14.5 Tool: `search_career`

Input:

```json
{
  "query": "serverless observability Python",
  "sections": ["experience", "skills"],
  "limit": 10
}
```

Validation:

- `query`: trimmed string, 1–200 characters.
- `sections`: optional supported-section array.
- `limit`: integer 1–20, default 10.

Output:

```json
{
  "query": "serverless observability Python",
  "results": [
    {
      "kind": "experience",
      "id": "stable-experience-id",
      "title": "Public factual title",
      "summary": "Bounded factual excerpt",
      "matchedTerms": ["serverless", "observability", "Python"],
      "evidenceRefs": ["experience:stable-experience-id"]
    }
  ],
  "dataVersion": "<hash>"
}
```

Requirements:

- Search only public projected data.
- No embeddings.
- No Workers AI.
- No external search.
- No LLM call.
- No subjective fit score.
- No rewriting of source claims.

### 14.6 Tool annotations and results

Every tool must declare:

```typescript
annotations: {
  readOnlyHint: true,
  idempotentHint: true,
  openWorldHint: false
}
```

Use:

- `McpServer.registerTool()`
- Zod input schemas
- Output schemas where practical
- `structuredContent`
- JSON text fallback

Do not use deprecated `.tool()` shorthand.

### 14.7 Optional prompts

Prompts are deferred until resources and tools are stable.

Possible later prompts:

- `prepare_candidate_interview`
- `build_requirements_evidence_matrix`
- `draft_factual_candidate_summary`

Prompts must require evidence IDs and distinguish facts, inference, and missing data.

## 15. Cloudflare Worker implementation

### 15.1 Dependencies

`mcp/package.json` should normally contain:

Runtime:

```text
agents
@modelcontextprotocol/sdk
zod
```

Development/build:

```text
@cloudflare/workers-types
@cloudflare/vitest-pool-workers
ajv
typescript
vitest
wrangler
yaml
```

Add a TypeScript script runner only if necessary.

Install current mutually compatible versions and commit `mcp/package-lock.json`.

Versions observed when the architecture was prepared:

```text
wrangler: 4.113.0
@cloudflare/workers-types: 5.20260723.1
@modelcontextprotocol/sdk: 1.29.0
agents: 0.18.0
```

Re-check current versions during implementation.

### 15.2 Current handler pattern

Use:

```typescript
import { createMcpHandler } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
```

Create a new server per request:

```typescript
function createCareerServer(): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION
  });

  registerResources(server);
  registerTools(server);
  return server;
}
```

The Worker entry point must:

1. Handle `/` and `/health`.
2. Validate Origin.
3. Create a new MCP server for each MCP request.
4. Delegate `/mcp` to `createMcpHandler()`.
5. Add safe response headers.
6. Sanitize boundary errors.

Do not use:

- `McpAgent`
- Durable Objects
- `serveSSE()`
- legacy HTTP+SSE
- one globally connected server
- mutable request state at module scope

An immutable imported generated-data constant at module scope is acceptable.

### 15.3 HTTP routes

| Route | Methods | Behavior |
|---|---|---|
| `/` | `GET`, `HEAD` | Small service descriptor and personal-site link |
| `/health` | `GET`, `HEAD` | Version/build metadata |
| `/mcp` | MCP-required methods | Streamable HTTP |
| Other | any | `404` |

Health response:

```json
{
  "status": "ok",
  "service": "selcuk-cihan-career",
  "serverVersion": "0.1.0",
  "schemaVersion": 1,
  "dataVersion": "<hash>",
  "sourceCommit": "<sha>"
}
```

Do not include résumé content in `/health`.

### 15.4 Origin validation and CORS

The MCP Streamable HTTP specification requires Origin validation.

Implement:

- Allow a missing `Origin` for native MCP clients.
- If present, require an exact allowlist match.
- Reject invalid origins with `403`.
- Never use suffix/substring matching.
- Never use wildcard production CORS.
- Allow localhost only in local development.
- Apply equivalent behavior to `OPTIONS`.

Worker variables:

```json
{
  "PUBLIC_SITE_URL": "https://<PERSONAL_SITE>",
  "ALLOWED_ORIGINS": [
    "https://<PERSONAL_SITE>"
  ]
}
```

Discover the actual site origin from the personal repository or request it from the owner. Do not guess.

### 15.5 Logging

Log only operational metadata:

- Event.
- Route.
- Method.
- Status.
- Duration.
- Server/data version.

Never log:

- Request bodies.
- Tool arguments.
- Search queries.
- Career data.
- Contact information.
- Testimonials.
- Headers or cookies.

### 15.6 Error and async behavior

- Await, return, intentionally void, or `ctx.waitUntil()` every Promise.
- Do not destructure `ctx.waitUntil`.
- Do not use `ctx.passThroughOnException()`.
- Do not return stack traces or filesystem paths.
- Return protocol-correct bounded errors.
- Bound all inputs and outputs.

## 16. Wrangler configuration

Create `mcp/wrangler.jsonc`:

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "selcuk-cihan-career-mcp",
  "main": "src/index.ts",
  "compatibility_date": "2026-07-23",
  "compatibility_flags": ["nodejs_compat"],
  "workers_dev": true,
  "observability": {
    "enabled": true,
    "head_sampling_rate": 0.1
  },
  "vars": {
    "PUBLIC_SITE_URL": "https://<PERSONAL_SITE>",
    "ALLOWED_ORIGINS": [
      "https://<PERSONAL_SITE>"
    ]
  }
}
```

Requirements:

- Use the actual implementation date if later.
- Use `nodejs_compat` with a current compatibility date.
- Generate `Env` with `wrangler types`.
- Do not hand-write `Env`.
- No storage binding.
- No AI binding.
- No Durable Object or migration.
- No runtime secret for the MVP.

After confirming a Cloudflare-managed custom domain:

```jsonc
{
  "workers_dev": false,
  "routes": [
    {
      "pattern": "mcp.<OWNER_DOMAIN>",
      "custom_domain": true
    }
  ]
}
```

Do not overwrite an existing DNS record.

## 17. MCP package scripts

Provide scripts equivalent to:

```text
generate:data      Validate YAML and generate sanitized data
typecheck          TypeScript check without emit
lint               Lint, including no-floating-promises
test               Unit and Worker integration tests
dev                Generate data and run wrangler dev
check              Generate, typecheck, lint, test, dry-run bundle
deploy             Run check and deploy
smoke:remote       Test the deployed MCP endpoint
```

Use current Wrangler commands:

```bash
npx wrangler types
npx wrangler types --check
npx wrangler dev
npx wrangler deploy --dry-run
npx wrangler deploy
npx wrangler tail
npx wrangler deployments list
npx wrangler rollback
```

Do not use the obsolete/nonexistent `wrangler check` command.

## 18. Testing

### 18.1 Site regression checks

Run the personal site's existing:

- Dependency installation command.
- Data validation.
- Unit tests.
- Static build.
- Link/content checks.

Adding optional YAML fields must not break the existing site.

If the site renders the YAML directly, verify the rendered résumé is unchanged except for explicitly added UI.

### 18.2 Source validation tests

Test:

- The actual résumé YAML validates.
- `projects` may be absent.
- New optional sections may be absent.
- Stable IDs follow the slug pattern.
- IDs are unique.
- Unknown source fields fail strict schema validation.
- Existing flat skills remain valid.
- Existing date strings remain valid.
- Empty preferences/narrative do not break generation.

### 18.3 Privacy tests

Use unique sentinel values in test fixtures for:

- `references[].contact`
- `references[].fullTestimonial`
- `generation_preferences`
- An unknown source field

Assert sentinels never appear in:

- Generated public JSON.
- Search documents.
- Resource output.
- Tool output.
- Worker bundle where inspectable.

Also test:

- Email excluded by default.
- Email included only after explicit opt-in.
- Testimonials excluded by default.
- Sanitized short testimonials contain no contact or full text.

### 18.4 Search tests

Test:

- GCP and Google Cloud aliases.
- Datadog capitalization variants.
- `.Net`/`.NET` variants.
- Compound skill labels such as `Java/Scala`.
- Compound API labels such as `REST/GraphQL`.
- Exact technology matches outrank body matches.
- Excluded reference data cannot be searched.
- Section filters.
- Result limits.
- Stable ordering.

### 18.5 MCP tests

Using `@cloudflare/vitest-pool-workers` and/or an MCP SDK client, test:

- Initialization.
- Resource listing.
- Reading all listed resources.
- Empty optional resources are not listed.
- Tool listing.
- Read-only/idempotent/closed-world annotations.
- Input validation.
- Structured/text output consistency.
- Exact ID lookup.
- Bounded not-found errors.
- No state mutation.

### 18.6 HTTP tests

Test:

- `GET /`
- `HEAD /`
- `GET /health`
- `HEAD /health`
- Unknown route `404`
- `/mcp` Streamable HTTP
- Allowed Origin
- Missing Origin
- Rejected Origin
- No wildcard production CORS
- Sanitized errors

### 18.7 End-to-end verification

Before deployment:

1. Run `npm run dev` inside `mcp/`.
2. Connect with the latest MCP Inspector.
3. List/read resources.
4. List/call tools.
5. Verify metadata.
6. Confirm excluded data is unavailable.

After deployment:

- Initialize with an MCP SDK client.
- List resources/tools.
- Read `career://metadata`.
- Search a known public term.
- Verify `sourceCommit`.
- Connect from at least one intended real MCP client.

## 19. Deployment policy

### 19.1 Preserve Pages CI/CD

Keep the existing GitHub Pages workflow and site build behavior unless a site change requires a small compatible update.

The Pages deployment remains independent from the MCP server.

### 19.2 Deploy the MCP manually

Do not add a GitHub Actions workflow for the MCP server. Do not store Cloudflare API credentials in GitHub.

The owner deploys from a locally authenticated Wrangler session. The documented deployment flow must:

1. Start from a clean, reviewed Git revision.
2. Install dependencies in `mcp/` using its lockfile.
3. Run the complete local validation suite and Wrangler dry run.
4. Deploy with `wrangler deploy`.
5. Run the remote health and MCP smoke tests.
6. Verify the deployed `sourceCommit` matches the intended local Git commit.
7. Document version inspection and rollback commands.

Use `wrangler login` for the owner's local browser-based authorization. No API key is required by this repository.

### 19.3 Coordinating site and MCP data manually

If the personal website is generated from the same YAML:

- A YAML change may trigger the existing Pages build, but the owner must deploy the MCP manually.
- Both deployments should expose or record the intended source commit.
- Perfect transactionality is not required, but provenance must be clear.

If the website does not consume the YAML:

- Deploy the MCP manually after relevant YAML changes.
- Do not force an unnecessary Pages build.

## 20. Personal-site integration

Add a small MCP section to the personal site after the endpoint is available.

Include:

- “Use my professional profile with an AI assistant.”
- Canonical MCP endpoint.
- Public/read-only privacy statement.
- Connection instructions.
- Example questions.
- Source repository link if desired.
- Content updated date or source commit.

Example questions:

```text
Summarize this person's distributed-systems experience and cite item IDs.

Find public evidence of TypeScript and Python experience.

Which roles demonstrate platform or cloud engineering?

Compare these requirements with the available career evidence. Separate direct evidence, inference, and missing information.

Prepare interview questions grounded in published experience.
```

Do not imply that visiting `/mcp` directly in a browser displays a résumé. It is a protocol endpoint.

## 21. Versioning

Maintain:

| Version | Source | Meaning |
|---|---|---|
| MCP server version | `mcp/package.json` | Tools/resources contract |
| Profile schema version | YAML `schema_version` | Source format |
| Data version | SHA-256 | Exact public projection |
| Source commit | Git SHA | Repository provenance |

Rules:

- Optional YAML additions may remain schema version 1.
- Breaking source changes require a schema-version decision.
- Breaking MCP changes require an MCP semantic-version decision.
- Career content edits do not require an MCP major version.
- Keep resource URIs and tool names stable.
- Prefer additive migrations.

## 22. Git policy

Commit:

- MCP source/configuration.
- `mcp/package-lock.json`.
- Source schema.
- Owner-approved YAML additions.
- Tests.
- Manual deployment documentation.
- Personal-site MCP documentation.

Normally ignore:

- `mcp/node_modules/`
- `mcp/.wrangler/`
- `mcp/src/generated/`
- `.dev.vars`
- `.env*`
- Inspector logs.
- Deployment output.

Never commit:

- Cloudflare credentials.
- Private candidate data.
- New reference contact details.
- Generated artifacts containing excluded data.

Before committing:

1. Review status and diff.
2. Preserve unrelated user changes.
3. Run all relevant site and MCP checks.
4. Confirm no sensitive data leakage.
5. Use a specific commit message.

Suggested commit:

```text
add public career MCP server
```

## 23. Security checklist

- [ ] Server is read-only.
- [ ] Public DTO is explicit.
- [ ] Raw YAML is never returned.
- [ ] Unknown YAML fields remain excluded.
- [ ] Candidate email is opt-in.
- [ ] Testimonials are opt-in.
- [ ] Reference contacts are never exposed.
- [ ] Long testimonials are never exposed.
- [ ] `generation_preferences` is excluded.
- [ ] Tool inputs are bounded.
- [ ] Tool outputs are bounded.
- [ ] Origin is exactly validated.
- [ ] Production CORS is not wildcard.
- [ ] No request body/tool argument logging.
- [ ] No write tools.
- [ ] No runtime external fetch.
- [ ] No runtime model call.
- [ ] No runtime storage.
- [ ] No mutable request state.
- [ ] No floating Promises.
- [ ] No hard-coded credentials.
- [ ] HTTPS is used.

If private capabilities are added later, protect them with OAuth and a separately reviewed boundary.

## 24. Implementation sequence

### Phase 1: repository and YAML integration

- Inspect personal-site repository.
- Locate the real YAML.
- Identify current consumers.
- Run baseline site validation/build.
- Add or reuse a strict schema.
- Add optional stable IDs/preferences/narrative/publication fields.
- Populate only metadata IDs unless the owner supplies preference values.
- Confirm the site remains working.

### Phase 2: create `mcp/`

- Add private package.
- Add TypeScript and Wrangler configuration.
- Add source/public contracts.
- Add build-time generator.
- Add lockfile and ignore rules.

### Phase 3: projection and search

- Validate YAML.
- Build explicit public DTO.
- Add conditional contact/testimonial behavior.
- Add IDs and aliases.
- Add deterministic search.
- Add privacy sentinel tests.

### Phase 4: Worker and MCP

- Register resources.
- Register three tools.
- Implement `/`, `/health`, and `/mcp`.
- Add Origin/CORS checks.
- Add safe logging/errors.
- Use stateless `createMcpHandler()`.

### Phase 5: verification

- Run site regression checks.
- Run MCP tests.
- Generate Worker types.
- Run Wrangler dry run.
- Test with Inspector and a real client.

### Phase 6: deployment and site documentation

- Document the local Wrangler deployment and rollback procedure.
- Deploy manually to `workers.dev`.
- Run smoke test.
- Configure custom domain after confirmation.
- Add connection instructions to personal site.
- Commit only after validation.

## 25. Definition of done

- [ ] MCP implementation lives under `mcp/` in the personal Pages repository.
- [ ] The MCP project is self-contained within the personal-site repository.
- [ ] Existing résumé YAML remains the source of truth.
- [ ] Existing personal site still builds and deploys.
- [ ] Optional preference/narrative fields are supported without invented data.
- [ ] Stable IDs exist or have collision-safe deterministic fallbacks.
- [ ] `mcp/` is a private package.
- [ ] Data is validated and projected at build time.
- [ ] Raw YAML is never served.
- [ ] Email and testimonials are opt-in.
- [ ] Reference contacts, full testimonials, and rendering preferences cannot leak.
- [ ] Search uses public profile, experience tech/descriptions, projects, education, certifications, skills, preferences, and narrative.
- [ ] Required resources work.
- [ ] `get_career_section`, `get_career_item`, and `search_career` work.
- [ ] Tools are deterministic, read-only, and schema-validated.
- [ ] Worker uses `createMcpHandler()` and Streamable HTTP.
- [ ] No Durable Object, database, AI binding, or runtime upstream fetch exists.
- [ ] Origin/CORS tests pass.
- [ ] Privacy/search/MCP/Worker tests pass.
- [ ] `wrangler deploy --dry-run` succeeds.
- [ ] MCP Inspector connects locally.
- [ ] Production deployment succeeds from the owner's locally authenticated Wrangler session.
- [ ] Remote smoke test passes.
- [ ] Personal site contains accurate MCP connection instructions.
- [ ] Both deployments are traceable to Git commits.
- [ ] No secrets are committed.

## 26. Owner decisions that must not be guessed

- Actual target roles.
- Opportunity status.
- Seniority targets.
- Employment types.
- Work modes.
- Preferred locations and time zones.
- Desired industries/domains/company stages.
- Availability.
- Relocation/travel preferences.
- Whether candidate email should be exposed.
- Whether sanitized short testimonials should be exposed.
- Production custom domain.
- Cloudflare credentials.

Complete all safe implementation work while leaving unspecified values empty.

## 27. Explicitly deferred

Do not add during MVP:

- Subjective role-fit scoring.
- Model-backed evidence matching.
- Embeddings.
- Vectorize.
- Workers AI.
- D1.
- KV.
- R2.
- Durable Objects.
- OAuth.
- Private reference access.
- Long-form testimonial resources.
- Contact/write tools.
- MCP Registry publication.
- A website redesign unrelated to MCP.

## 28. Current primary references

Re-check current documentation during implementation:

- MCP server concepts: <https://modelcontextprotocol.io/docs/learn/server-concepts>
- MCP Streamable HTTP transport: <https://modelcontextprotocol.io/specification/2025-06-18/basic/transports>
- Cloudflare remote MCP guide: <https://developers.cloudflare.com/agents/model-context-protocol/guides/remote-mcp-server/>
- Cloudflare `createMcpHandler`: <https://developers.cloudflare.com/agents/model-context-protocol/apis/handler-api/>
- Cloudflare MCP transport: <https://developers.cloudflare.com/agents/model-context-protocol/protocol/transport/>
- Cloudflare Workers best practices: <https://developers.cloudflare.com/workers/best-practices/workers-best-practices/>
- Wrangler configuration: <https://developers.cloudflare.com/workers/wrangler/configuration/>
- Worker custom domains: <https://developers.cloudflare.com/workers/configuration/routing/custom-domains/>
- GitHub Pages overview: <https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages>
