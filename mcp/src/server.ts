import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { SERVER_NAME, SERVER_VERSION } from "./public-contract";
import { registerResources } from "./resources";
import { registerTools } from "./tools";

export const SERVER_DESCRIPTION =
  "Public, owner-maintained, read-only career evidence. Responses are not independent employment verification. Cite stable item IDs, and do not infer missing information.";

export function createCareerServer(): McpServer {
  const server = new McpServer(
    {
      name: SERVER_NAME,
      version: SERVER_VERSION,
      title: "Selçuk Cihan public career profile",
    },
    {
      instructions: SERVER_DESCRIPTION,
    },
  );
  registerResources(server);
  registerTools(server);
  return server;
}
