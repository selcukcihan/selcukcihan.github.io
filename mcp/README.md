# Public career MCP server

This directory is an independently installable Cloudflare Worker project. It
publishes a read-only, owner-maintained projection of
[`../candidate-profile.yaml`](../candidate-profile.yaml) over MCP Streamable
HTTP.

The source YAML is validated at build time, explicitly projected into public
DTOs, and bundled without raw source data. Email and short testimonials require
explicit opt-in. Reference contacts, long testimonials,
`generation_preferences`, and raw YAML are never published.

## Local development

Requires Node.js 22.18 or newer.

```bash
npm ci
npm run generate:data
npm run types
npm run check
npm run dev
```

The local endpoints are:

- `http://127.0.0.1:8787/` — service descriptor
- `http://127.0.0.1:8787/health` — version and provenance metadata
- `http://127.0.0.1:8787/mcp` — MCP Streamable HTTP endpoint

Connect MCP Inspector to `http://127.0.0.1:8787/mcp`, then list and read the
resources and call:

- `get_career_section`
- `get_career_item`
- `search_career`

## Public contract

The server is public and read-only. It provides factual career evidence, not
independent employment verification. Clients should cite stable item IDs and
must not infer missing information.

Example questions:

- Summarize this person's distributed-systems experience and cite item IDs.
- Find public evidence of TypeScript and Python experience.
- Which roles demonstrate platform or cloud engineering?
- Compare requirements with the available evidence, separating direct evidence,
  inference, and missing information.

## Deployment

MCP deployment is intentionally manual and runs from the owner's local
machine. There is no MCP deployment workflow and no Cloudflare API credential
is stored in GitHub.

### First-time setup

From the repository root:

```bash
cd mcp
npm ci
npx wrangler login
npx wrangler whoami
```

`wrangler login` opens Cloudflare's browser authorization flow. The resulting
local Wrangler session is used for deployments; no API key or repository secret
is required.

### Deploy a revision

Deploy only from a clean, reviewed revision so the generated metadata can
identify the exact Git commit:

```bash
git status --short
cd mcp
npm ci
npm run deploy
```

`npm run deploy` regenerates the sanitized public profile, runs type checks,
linting, unit and Worker tests, performs a Wrangler dry run, and then deploys
the Worker. If validation fails, deployment does not run.

The canonical deployed endpoint is:

```text
https://mcp.selcukcihan.com/mcp
```

After deployment, verify the health metadata and MCP contract:

```bash
curl --fail --silent --show-error \
  https://mcp.selcukcihan.com/health

MCP_URL=https://mcp.selcukcihan.com/mcp \
  npm run smoke:remote
```

The health response's `sourceCommit` should match:

```bash
git rev-parse HEAD
```

To inspect versions or roll back:

```bash
npx wrangler versions list
npx wrangler rollback <VERSION_ID>
```

Wrangler manages the custom domain and its certificate. The original
`https://selcuk-cihan-career-mcp.selcukcihan.workers.dev/mcp` endpoint remains
enabled as a fallback while `workers_dev` is `true`. Never commit Wrangler
authentication data, Cloudflare credentials, `.dev.vars`, or generated public
JSON.
