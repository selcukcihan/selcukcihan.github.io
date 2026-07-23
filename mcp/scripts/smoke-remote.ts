import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const endpoint = process.env.MCP_URL;
if (!endpoint) {
  throw new Error("Set MCP_URL to the deployed /mcp endpoint");
}

const client = new Client({
  name: "career-mcp-smoke",
  version: "0.1.0",
});
const transport = new StreamableHTTPClientTransport(new URL(endpoint));

try {
  await client.connect(transport);
  const [resources, tools, metadata, search] = await Promise.all([
    client.listResources(),
    client.listTools(),
    client.readResource({ uri: "career://metadata" }),
    client.callTool({
      name: "search_career",
      arguments: { query: "distributed systems", limit: 3 },
    }),
  ]);
  if (resources.resources.length === 0 || tools.tools.length !== 3) {
    throw new Error("Remote MCP contract is incomplete");
  }
  process.stdout.write(
    `${JSON.stringify({
      endpoint,
      resources: resources.resources.length,
      tools: tools.tools.map(({ name }) => name),
      metadata: metadata.contents,
      search: search.structuredContent,
    })}\n`,
  );
} finally {
  await transport.close();
}
