# 🔒 ARURA Security Architecture & Hardening Guidelines

Security is designed as a foundational layer in Arura across authentication, streaming token authorization, database operations, and edge networking.

---

## 1. Authentication & Token Security
* **JWT Access / Refresh Token Rotation**:
  - Access tokens have a short lifespan (15–60 minutes).
  - Refresh tokens are single-use; each refresh issues a new refresh token and invalidates the previous one in Redis.
* **No Plaintext Passwords**:
  - Passwords are encrypted using Argon2 or PBKDF2 with SHA-256 and high work factor.
* **Session & Device Revocation**:
  - Users can inspect and revoke active sessions across Android and Web devices.

---

## 2. API & Network Hardening
* **CORS Restrictions**:
  - Whitelists only approved domains; rejects wildcards (`*`) for authenticated endpoints.
* **Rate Limiting**:
  - Token-bucket rate limiting applied at the Cloudflare edge layer and Node/Express middleware layer (`120 req/min`).
* **Input Validation & Sanitization**:
  - Strict parameter type checking to protect against SQL Injection, NoSQL Injection, and XSS.
* **Security Headers**:
  - `Content-Security-Policy`: Restricts script and media execution origins.
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Content-Type-Options: nosniff`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`

---

## 3. Media Stream Protection & DRM
* **Signed Streaming URLs**:
  - Video manifests (`.m3u8`) and segments are generated with cryptographic expiration signatures (HMAC SHA-256).
* **DRM Ready**:
  - Architecture supports Widevine Modular DRM (Android) and FairPlay (iOS/Safari) via standard key exchange endpoints.
* **YouTube Playback Compliance**:
  - Uses official YouTube embeds and permitted APIs without stream extraction or terms violation.

---

## 4. Role-Based Access Control (RBAC)
* **Superadmin / Admin**: Access to `/api/v1/admin/*`, content modification, live score updates, audit log inspection.
* **Moderator**: Content updates and metadata correction.
* **VIP Subscriber**: Unrestricted access to 1080p Full HD streams, Dolby Atmos audio, and offline downloads.
* **Standard Subscriber**: Free catalog access with standard definition streaming.
