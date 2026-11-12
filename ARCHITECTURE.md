# 🏛️ ARURA System Architecture & Design Specification

## 1. High-Level System Overview

Arura is architected as an event-driven, distributed media platform built for sub-second content discovery, high-throughput video delivery, and low-latency interaction.

```
+---------------------------------------------------------------------------------------+
|                                CLIENT APPLICATION LAYER                               |
|   +---------------------------------------+   +-----------------------------------+   |
|   |         Android Native Client         |   |       Progressive Web Client      |   |
|   |  - Kotlin + Jetpack Compose           |   |  - React 19 + TypeScript          |   |
|   |  - AndroidX Media3 (ExoPlayer)        |   |  - Tailwind CSS (Dark Cinematic)  |   |
|   |  - Room DB (Offline Cache)            |   |  - HTML5 Video / HLS.js           |   |
|   |  - Hilt Dependency Injection          |   |  - Service Workers                |   |
|   +---------------------------------------+   +-----------------------------------+   |
+-------------------------------------------+-------------------------------------------+
                                            | HTTPS / WSS
                                            v
+---------------------------------------------------------------------------------------+
|                           EDGE ROUTING & CLOUDFLARE GATEWAY                           |
|   - Cloudflare Workers (TypeScript)                                                   |
|   - Edge Caching (Cache-Control: public, s-maxage=300)                                |
|   - JWT Signature Verification & Claims Extraction                                    |
|   - Token Bucket Rate Limiting (120 req/min per IP)                                   |
|   - Cloudflare R2 Media Proxy (HLS manifest rewriting, CDN signed cookies)            |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
|                                APPLICATION BACKEND LAYER                              |
|   +---------------------------------------+   +-----------------------------------+   |
|   |        Django REST Framework API      |   |         Celery Task Workers       |   |
|   |  - Versioned Endpoints (/api/v1/*)    |   |  - Video Transcoding & HLS Pack   |   |
|   |  - SimpleJWT Auth & Token Rotation    |   |  - EPG XML Ingestion (Hourly)     |   |
|   |  - Serializers & OpenAPI 3.0 Doc      |   |  - Recommendation Pre-calc        |   |
|   |  - Express Dev Middleware Bridge      |   |  - Push Notifications (FCM)       |   |
|   +---------------------------------------+   +-----------------------------------+   |
+-------------------------------------------+-------------------------------------------+
                                            |
                   +------------------------+------------------------+
                   |                                                 |
                   v                                                 v
+---------------------------------------+         +-------------------------------------+
|        PRIMARY DATA STORE             |         |     CACHE & COORDINATION LAYER      |
|   PostgreSQL 16 Relational Database   |         |   Redis 7 Distributed Cache         |
|   - 10 Normalized Schemas             |         |   - Catalog Memory Cache            |
|   - UUID primary keys                 |         |   - User Token Blacklist            |
|   - Soft Deletion (deleted_at)        |         |   - Live Match Score Pub/Sub        |
|   - B-Tree & GIN Indexes              |         |   - Celery Broker / Result Queue    |
+---------------------------------------+         +-------------------------------------+
```

---

## 2. Media Playback & Delivery Engine (Media3 / ExoPlayer)

Arura uses an enterprise-grade media engine adhering to AndroidX Media3 best practices:

* **Adaptive Bitrate Streaming (ABR)**:
  - HLS manifests (`.m3u8`) with multi-resolution renditions (`1080p`, `720p`, `480p`, `360p`).
  - Smooth track selection based on network throughput estimation.
* **Secondary Stream Failover**:
  - Each item defines a primary `streamUrl` and `fallbackStreamUrl`. If the player encounters `ERROR_CODE_IO_NETWORK_CONNECTION_FAILED`, it triggers automated recovery without interrupting user playback.
* **MediaSession & Background Playback**:
  - Complete integration with Android's system notification center, lock screen controls, and WearOS/Android Auto media sessions.
* **Audio Track & Subtitle Ingestion**:
  - Real-time WebVTT subtitle rendering with Bengali font ligature support.
  - Multi-language audio tracks (`Bangla 5.1`, `English Dolby Atmos`).

---

## 3. Edge Gateway & Cloudflare Workers

The edge gateway sits in front of the application server to provide:
1. **Edge SSL Termination**: TLS 1.3 with 0-RTT resumption.
2. **Rate Limiting**: Protects authentication and heavy search endpoints from brute force and scraper abuse.
3. **Smart Cache Layer**: Caches static catalog metadata (movies, series, channels) at edge locations nearest to Bangladeshi internet exchange nodes (BDIX).
4. **Cloudflare R2 Bucket**: Stores authorized media posters, backdrops, cast avatars, and encrypted video segments.

---

## 4. AI Discovery Engine (Gemini 3.8 Flash)

Arura leverages the official `@google/genai` TypeScript SDK:
* **Model**: `gemini-3.8-flash`
* **Prompt Engineering**: Dynamic system instructions configured with Bengali linguistic nuances and cultural cinema references.
* **Resilience**: In offline or quota-limited scenarios, the recommendation engine falls back seamlessly to rule-based catalog matching without throwing errors.
