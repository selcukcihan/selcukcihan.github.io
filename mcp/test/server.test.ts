import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { z } from "zod";

import { careerData } from "../src/data";
import { createCareerServer } from "../src/server";
import { actualSource } from "./fixtures";

describe("MCP server contract", () => {
  let client: Client;
  let server: ReturnType<typeof createCareerServer>;

  beforeEach(async () => {
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    client = new Client({ name: "test-client", version: "0.1.0" });
    server = createCareerServer();
    await Promise.all([
      server.connect(serverTransport),
      client.connect(clientTransport),
    ]);
  });

  afterEach(async () => {
    await Promise.all([client.close(), server.close()]);
  });

  it("initializes and lists only available resources", async () => {
    const { resources } = await client.listResources();
    const uris = resources.map(({ uri }) => uri);
    expect(uris).toContain("career://profile");
    expect(uris).toContain("career://metadata");
    expect(uris).not.toContain("career://preferences");
    expect(uris).not.toContain("career://testimonials");
  });

  it("reads every listed resource", async () => {
    const { resources } = await client.listResources();
    const source = actualSource();
    for (const { uri } of resources) {
      const result = await client.readResource({ uri });
      expect(result.contents).toHaveLength(1);
      const serialized = JSON.stringify(result);
      expect(serialized).not.toContain("generation_preferences");
      expect(serialized).not.toContain(source.basics.email);
      for (const reference of source.references) {
        expect(serialized).not.toContain(reference.contact);
        if (reference.fullTestimonial) {
          expect(serialized).not.toContain(reference.fullTestimonial);
        }
      }
    }
  });

  it("lists three closed-world read-only tools", async () => {
    const { tools } = await client.listTools();
    expect(tools.map(({ name }) => name).sort()).toEqual([
      "get_career_item",
      "get_career_section",
      "search_career",
    ]);
    for (const tool of tools) {
      expect(tool.annotations).toMatchObject({
        readOnlyHint: true,
        idempotentHint: true,
        openWorldHint: false,
      });
    }
  });

  it("returns consistent structured and text tool output", async () => {
    const result = await client.callTool({
      name: "get_career_section",
      arguments: { section: "metadata" },
    });
    expect(Array.isArray(result.content)).toBe(true);
    if (!Array.isArray(result.content)) {
      throw new Error("Expected MCP text content array");
    }
    const text = z
      .object({ type: z.literal("text"), text: z.string() })
      .parse(result.content[0]);
    expect(JSON.parse(text.text)).toEqual(result.structuredContent);
  });

  it("clearly rejects unpublished sections", async () => {
    const result = await client.callTool({
      name: "get_career_section",
      arguments: { section: "preferences" },
    });
    expect(result.structuredContent).toMatchObject({
      error: "section_unavailable",
      section: "preferences",
    });
  });

  it("looks up exact IDs and returns bounded not-found results", async () => {
    const known = await client.callTool({
      name: "get_career_item",
      arguments: {
        kind: "experience",
        id: careerData.experience[0]!.id,
      },
    });
    expect(known.structuredContent).toMatchObject({ found: true });

    const missing = await client.callTool({
      name: "get_career_item",
      arguments: { kind: "experience", id: "missing-item" },
    });
    expect(missing.structuredContent).toEqual({
      found: false,
      kind: "experience",
      id: "missing-item",
      dataVersion: careerData.dataVersion,
    });
  });

  it("validates bounded search input", async () => {
    const invalid = await client.callTool({
      name: "search_career",
      arguments: { query: "", limit: 100 },
    });
    expect(invalid.isError).toBe(true);
  });
});
