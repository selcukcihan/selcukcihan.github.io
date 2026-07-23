import { exports } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

function request(
  path: string,
  init?: RequestInit,
): Request<unknown, IncomingRequestCfProperties> {
  return new Request(
    `https://worker.test${path}`,
    init,
  ) as Request<unknown, IncomingRequestCfProperties>;
}

describe("Worker HTTP boundary", () => {
  it("serves the root descriptor for GET and HEAD", async () => {
    const get = await exports.default.fetch(request("/"));
    expect(get.status).toBe(200);
    expect(await get.json()).toMatchObject({
      service: "selcuk-cihan-career",
      endpoint: "/mcp",
      readOnly: true,
    });
    expect(get.headers.get("X-Content-Type-Options")).toBe("nosniff");

    const head = await exports.default.fetch(request("/", { method: "HEAD" }));
    expect(head.status).toBe(200);
    expect(await head.text()).toBe("");
  });

  it("serves content-free health metadata for GET and HEAD", async () => {
    const get = await exports.default.fetch(request("/health"));
    const body = await get.json<Record<string, unknown>>();
    expect(body).toMatchObject({
      status: "ok",
      service: "selcuk-cihan-career",
      schemaVersion: 1,
    });
    expect(JSON.stringify(body)).not.toContain("Senior Software Engineer");

    const head = await exports.default.fetch(
      request("/health", { method: "HEAD" }),
    );
    expect(head.status).toBe(200);
    expect(await head.text()).toBe("");
  });

  it("returns a sanitized 404 for unknown routes", async () => {
    const response = await exports.default.fetch(request("/missing"));
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "not_found" });
  });

  it("allows missing Origin and the exact configured Origin", async () => {
    const nativeClient = await exports.default.fetch(request("/health"));
    expect(nativeClient.status).toBe(200);
    expect(nativeClient.headers.get("Access-Control-Allow-Origin")).toBeNull();

    const browserClient = await exports.default.fetch(
      request("/health", {
        headers: { Origin: "https://selcukcihan.com" },
      }),
    );
    expect(browserClient.status).toBe(200);
    expect(browserClient.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://selcukcihan.com",
    );
  });

  it("rejects non-exact Origins without wildcard CORS", async () => {
    const response = await exports.default.fetch(
      request("/mcp", {
        method: "OPTIONS",
        headers: { Origin: "https://evil-selcukcihan.com" },
      }),
    );
    expect(response.status).toBe(403);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull();
    expect([...response.headers.values()]).not.toContain("*");
  });

  it("handles allowed MCP preflight requests", async () => {
    const response = await exports.default.fetch(
      request("/mcp", {
        method: "OPTIONS",
        headers: { Origin: "https://selcukcihan.com" },
      }),
    );
    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://selcukcihan.com",
    );
    expect(response.headers.get("Access-Control-Allow-Methods")).toContain(
      "POST",
    );
  });

  it("initializes MCP over Streamable HTTP", async () => {
    const response = await exports.default.fetch(
      request("/mcp", {
        method: "POST",
        headers: {
          Accept: "application/json, text/event-stream",
          "Content-Type": "application/json",
          Origin: "https://selcukcihan.com",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "initialize",
          params: {
            protocolVersion: "2025-06-18",
            capabilities: {},
            clientInfo: { name: "worker-test", version: "0.1.0" },
          },
        }),
      }),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toMatch(
      /application\/json|text\/event-stream/,
    );
    expect(await response.text()).toContain("selcuk-cihan-career");
  });

  it("sanitizes unsupported MCP methods", async () => {
    const response = await exports.default.fetch(
      request("/mcp", { method: "PUT" }),
    );
    expect(response.status).toBe(405);
    expect(await response.json()).toEqual({ error: "method_not_allowed" });
  });
});
