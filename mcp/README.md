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

GitHub Actions validates pull requests and deploys `main`. Configure:

- Secret `CLOUDFLARE_API_TOKEN` with least-privilege Workers deployment access.
- Secret `CLOUDFLARE_ACCOUNT_ID`.
- Repository variable `MCP_URL` containing the deployed endpoint, including
  `/mcp`, for the post-deployment smoke test.

The initial deployment uses the Worker name `selcuk-cihan-career-mcp` on
`workers.dev`. A custom domain is intentionally not configured until its DNS
record is confirmed.

Run a manual remote smoke test with:

```bash
MCP_URL=https://<worker-subdomain>/mcp npm run smoke:remote
```

Never commit Cloudflare credentials, `.dev.vars`, or generated public JSON.
