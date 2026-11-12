# ☁️ ARURA Cloudflare Workers & R2 Setup Guide

Cloudflare Workers acts as an edge API gateway, protecting the backend origin, terminating TLS, caching static media metadata, and routing asset downloads via Cloudflare R2.

---

## 1. Cloudflare Workers Gateway (`cloudflare/workers/api-gateway.ts`)

### Key Responsibilities:
1. **Edge Rate Limiting**:
   - 120 requests/minute per client IP.
   - 15 requests/minute on `/api/v1/auth/login` to prevent credential stuffing.
2. **CORS Enforcement**:
   - Restricts API requests to authorized origins (`https://arura.tv`, `https://app.arura.tv`, `http://localhost:3000`).
3. **Response Caching**:
   - Caches `GET /api/v1/movies`, `GET /api/v1/series`, and `GET /api/v1/live-tv` for 300 seconds at Cloudflare edge PoPs (Point of Presence).
4. **Cloudflare R2 Media Proxy**:
   - Directly streams authorized media thumbnails, poster artwork, and video segments from the `arura-media-assets` R2 bucket.

---

## 2. Wrangler Configuration (`wrangler.toml`)

```toml
name = "arura-api-gateway"
main = "cloudflare/workers/api-gateway.ts"
compatibility_date = "2024-01-01"

[vars]
BACKEND_ORIGIN = "https://api-origin.arura.tv"
ENVIRONMENT = "production"

[[r2_buckets]]
binding = "ARURA_MEDIA_BUCKET"
bucket_name = "arura-media-assets"

[triggers]
crons = ["0 * * * *"] # hourly cache invalidation
```

---

## 3. Deploying to Cloudflare

```bash
# Install Wrangler CLI
npm install -g wrangler

# Authenticate with Cloudflare
wrangler login

# Deploy Worker to Edge
wrangler deploy
```
