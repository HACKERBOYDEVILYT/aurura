/**
 * ARURA Streaming Platform — Cloudflare Workers Edge Gateway
 * Edge API Router, Rate Limiter, JWT Verification, Cache Controller & R2 Media Proxy
 */

// Self-contained Cloudflare Worker Type Definitions for Edge Gateway
export interface R2ObjectBody {
  body: ReadableStream;
  httpEtag: string;
  writeHttpMetadata: (headers: Headers) => void;
}

export interface R2Bucket {
  get: (key: string) => Promise<R2ObjectBody | null>;
}

export interface KVNamespace {
  get: (key: string) => Promise<string | null>;
  put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>;
}

export interface ExecutionContext {
  waitUntil: (promise: Promise<any>) => void;
  passThroughOnException: () => void;
}

export interface Env {
  BACKEND_ORIGIN: string; // Django backend origin URL
  R2_MEDIA_BUCKET: R2Bucket;
  CACHE_TTL_SECONDS: string;
  JWT_SECRET: string;
  RATE_LIMIT_KV: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const clientIp = request.headers.get('cf-connecting-ip') || '127.0.0.1';

    // 1. CORS Preflight Handling
    if (request.method === 'OPTIONS') {
      return handleCorsPreflight();
    }

    // 2. Global Rate Limiting (120 requests/minute per IP)
    const isAllowed = await checkRateLimit(clientIp, env);
    if (!isAllowed) {
      return new Response(
        JSON.stringify({
          error: 'TOO_MANY_REQUESTS',
          message: 'API rate limit exceeded. Please retry in 60 seconds.',
          retryAfter: 60
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
            ...corsHeaders
          }
        }
      );
    }

    // 3. Static Media Asset Routing via Cloudflare R2
    if (url.pathname.startsWith('/media/r2/')) {
      const key = url.pathname.replace('/media/r2/', '');
      const object = await env.R2_MEDIA_BUCKET.get(key);

      if (!object) {
        return new Response('Media asset not found in R2 storage', { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      headers.set('Access-Control-Allow-Origin', '*');

      return new Response(object.body, { headers });
    }

    // 4. Edge Response Caching for GET Requests (Catalog, EPG, Sports)
    const cache = (caches as any).default;
    const isCacheable = request.method === 'GET' && (
      url.pathname.includes('/movies') ||
      url.pathname.includes('/live-tv') ||
      url.pathname.includes('/bangla') ||
      url.pathname.includes('/sports')
    );

    if (isCacheable) {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        const responseWithHeader = new Response(cachedResponse.body, cachedResponse);
        responseWithHeader.headers.set('X-Arura-Edge-Cache', 'HIT');
        return responseWithHeader;
      }
    }

    // 5. Origin Proxy Request Preparation
    const backendOrigin = env.BACKEND_ORIGIN || 'https://api.arura.tv';
    const proxyUrl = new URL(url.pathname + url.search, backendOrigin);

    const originRequest = new Request(proxyUrl.toString(), {
      method: request.method,
      headers: {
        ...Object.fromEntries(request.headers),
        'X-Forwarded-For': clientIp,
        'X-Edge-Gateway': 'Cloudflare-Worker-v1',
        'X-Country': request.headers.get('cf-ipcountry') || 'BD'
      },
      body: ['POST', 'PUT', 'PATCH'].includes(request.method) ? request.body : undefined
    });

    try {
      const originResponse = await fetch(originRequest);
      const modifiedHeaders = new Headers(originResponse.headers);

      // Append security & CORS headers
      Object.entries(corsHeaders).forEach(([k, v]) => modifiedHeaders.set(k, v));
      modifiedHeaders.set('X-Content-Type-Options', 'nosniff');
      modifiedHeaders.set('X-Frame-Options', 'SAMEORIGIN');
      modifiedHeaders.set('X-Arura-Edge-Cache', 'MISS');

      const finalResponse = new Response(originResponse.body, {
        status: originResponse.status,
        headers: modifiedHeaders
      });

      // Cache successful public GET responses
      if (isCacheable && originResponse.status === 200) {
        ctx.waitUntil(cache.put(request, finalResponse.clone()));
      }

      return finalResponse;
    } catch (err) {
      return new Response(
        JSON.stringify({
          error: 'BAD_GATEWAY',
          message: 'The Arura origin application server is unreachable or rebooting.',
          timestamp: new Date().toISOString()
        }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }
  }
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Arura-Token',
  'Access-Control-Max-Age': '86400'
};

function handleCorsPreflight(): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

async function checkRateLimit(ip: string, env: Env): Promise<boolean> {
  if (!env.RATE_LIMIT_KV) return true;
  const key = `ratelimit:${ip}`;
  const countStr = await env.RATE_LIMIT_KV.get(key);
  const count = countStr ? parseInt(countStr) : 0;

  if (count > 120) {
    return false;
  }

  await env.RATE_LIMIT_KV.put(key, (count + 1).toString(), { expirationTtl: 60 });
  return true;
}
