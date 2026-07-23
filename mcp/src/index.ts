import { createMcpHandler } from "agents/mcp";

import { careerData } from "./data";
import { SERVER_NAME } from "./public-contract";
import {
  hasRejectedOrigin,
  jsonResponse,
  validateOrigin,
  withSafeHeaders,
} from "./security";
import { createCareerServer, SERVER_DESCRIPTION } from "./server";

function routeName(pathname: string): string {
  if (pathname === "/") return "root";
  if (pathname === "/health") return "health";
  if (pathname === "/mcp") return "mcp";
  return "not_found";
}

function descriptor(env: Env): Record<string, unknown> {
  return {
    service: SERVER_NAME,
    description: SERVER_DESCRIPTION,
    protocol: "MCP Streamable HTTP",
    endpoint: "/mcp",
    personalSite: env.PUBLIC_SITE_URL,
    readOnly: true,
    dataVersion: careerData.dataVersion,
  };
}

function health(): Record<string, unknown> {
  return {
    status: "ok",
    service: SERVER_NAME,
    serverVersion: careerData.serverVersion,
    schemaVersion: careerData.schemaVersion,
    dataVersion: careerData.dataVersion,
    sourceCommit: careerData.sourceCommit,
  };
}

function headResponse(response: Response): Response {
  return new Response(null, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

async function handleRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);
  const allowedOrigin = validateOrigin(request, env);

  if (hasRejectedOrigin(request, env)) {
    return withSafeHeaders(
      jsonResponse({ error: "origin_not_allowed" }, { status: 403 }),
      null,
    );
  }

  if (request.method === "OPTIONS") {
    if (url.pathname !== "/mcp") {
      return withSafeHeaders(
        jsonResponse({ error: "not_found" }, { status: 404 }),
        allowedOrigin,
      );
    }
    const response = new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Headers":
          "content-type, mcp-protocol-version, mcp-session-id",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Max-Age": "86400",
      },
    });
    return withSafeHeaders(response, allowedOrigin);
  }

  if (url.pathname === "/" && (request.method === "GET" || request.method === "HEAD")) {
    const response = withSafeHeaders(jsonResponse(descriptor(env)), allowedOrigin);
    return request.method === "HEAD" ? headResponse(response) : response;
  }

  if (
    url.pathname === "/health" &&
    (request.method === "GET" || request.method === "HEAD")
  ) {
    const response = withSafeHeaders(jsonResponse(health()), allowedOrigin);
    return request.method === "HEAD" ? headResponse(response) : response;
  }

  if (url.pathname === "/mcp") {
    if (!["GET", "POST", "DELETE"].includes(request.method)) {
      return withSafeHeaders(
        jsonResponse({ error: "method_not_allowed" }, { status: 405 }),
        allowedOrigin,
      );
    }
    const server = createCareerServer();
    const response = await createMcpHandler(server, { route: "/mcp" })(
      request,
      env,
      ctx,
    );
    return withSafeHeaders(response, allowedOrigin);
  }

  return withSafeHeaders(
    jsonResponse({ error: "not_found" }, { status: 404 }),
    allowedOrigin,
  );
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const startedAt = Date.now();
    const route = routeName(new URL(request.url).pathname);
    let response: Response;
    try {
      response = await handleRequest(request, env, ctx);
    } catch {
      response = withSafeHeaders(
        jsonResponse({ error: "internal_server_error" }, { status: 500 }),
        validateOrigin(request, env),
      );
    }
    console.log(
      JSON.stringify({
        event: "request",
        route,
        method: request.method,
        status: response.status,
        durationMs: Date.now() - startedAt,
        serverVersion: careerData.serverVersion,
        dataVersion: careerData.dataVersion,
      }),
    );
    return response;
  },
} satisfies ExportedHandler<Env>;
