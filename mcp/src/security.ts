const SAFE_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store",
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

function isLoopback(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

function configuredOrigins(env: Env): string[] {
  return Array.isArray(env.ALLOWED_ORIGINS)
    ? env.ALLOWED_ORIGINS
    : [env.ALLOWED_ORIGINS];
}

export function validateOrigin(request: Request, env: Env): string | null {
  const origin = request.headers.get("Origin");
  if (!origin) return null;
  if (configuredOrigins(env).includes(origin)) return origin;

  try {
    const requestUrl = new URL(request.url);
    const originUrl = new URL(origin);
    if (
      isLoopback(requestUrl.hostname) &&
      isLoopback(originUrl.hostname) &&
      (originUrl.protocol === "http:" || originUrl.protocol === "https:")
    ) {
      return origin;
    }
  } catch {
    return null;
  }
  return null;
}

export function hasRejectedOrigin(request: Request, env: Env): boolean {
  return request.headers.has("Origin") && validateOrigin(request, env) === null;
}

export function withSafeHeaders(
  response: Response,
  allowedOrigin: string | null,
): Response {
  const safeResponse = new Response(response.body, response);
  for (const [key, value] of Object.entries(SAFE_HEADERS)) {
    safeResponse.headers.set(key, value);
  }
  safeResponse.headers.delete("Access-Control-Allow-Origin");
  safeResponse.headers.delete("Access-Control-Allow-Credentials");
  if (allowedOrigin) {
    safeResponse.headers.set("Access-Control-Allow-Origin", allowedOrigin);
    safeResponse.headers.append("Vary", "Origin");
  }
  return safeResponse;
}

export function jsonResponse(
  value: Record<string, unknown>,
  init: ResponseInit = {},
): Response {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(value), { ...init, headers });
}
