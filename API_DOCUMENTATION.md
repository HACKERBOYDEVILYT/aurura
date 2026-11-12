# 🔌 ARURA API Specification (v1 RESTful & OpenAPI 3.0)

All endpoints conform to DRF conventions, standard HTTP response codes, and consistent envelope structures.

**Base URL**: `/api/v1`  
**OpenAPI JSON Specification**: `GET /api/v1/openapi.json`

---

## 1. Authentication Endpoints (`/api/v1/auth/`)

### `POST /auth/register`
Creates a new subscriber profile.
* **Request Body**:
```json
{
  "email": "user@example.com",
  "name": "আয়ান ইসলাম",
  "password": "SecurePassword123!"
}
```
* **Response (201 Created)**:
```json
{
  "status": "success",
  "message": "User registered successfully",
  "user": {
    "id": "usr-8a7bc",
    "email": "user@example.com",
    "name": "আয়ান ইসলাম",
    "role": "subscriber",
    "plan": "VIP Premium"
  },
  "tokens": {
    "access": "arura_jwt_acc_...",
    "refresh": "arura_jwt_ref_...",
    "expiresIn": 3600
  }
}
```

### `POST /auth/login`
Authenticates a user and issues rotated JWT tokens.
* **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

### `POST /auth/refresh`
Rotates the refresh token and returns a fresh short-lived access token.

### `POST /auth/google`
Validates Google OAuth ID token and creates or provisions a session.

---

## 2. Movies & Series Endpoints

### `GET /movies`
Retrieves paginated movie catalog.
* **Query Parameters**:
  - `genre`: Filter by genre (e.g. `Action`, `Drama`, `Crime`)
  - `page`: Page index (default: `1`)
  - `limit`: Page size (default: `20`)
  - `search`: Keyword search across Bangla and English titles

### `GET /movies/:id`
Retrieves full details for a movie including cast, crew, audio tracks, and streaming URLs.

### `GET /series`
Retrieves all TV and Web series.

### `GET /series/:id`
Retrieves series metadata with all seasons and ordered episode listings.

---

## 3. Live Television & EPG

### `GET /live-tv`
Lists all active live channels grouped by category (`Entertainment`, `News`, `Sports`, `Bangla`, `Islamic`, `Kids`).

### `GET /live-tv/:id/epg`
Returns the 24-hour Electronic Program Guide timeline for the designated channel.

---

## 4. Live Sports

### `GET /sports`
Returns current live matches, upcoming fixtures, and scorecards.

### `POST /sports/:id/score` *(Admin Only)*
Broadcasts updated match scores and commentary in real time.
* **Request Body**:
```json
{
  "scoreA": "184/4 (20 ov)",
  "scoreB": "142/6 (16.2 ov)"
}
```

---

## 5. Bangla Hub (`/api/v1/bangla/`)

### `GET /bangla`
Retrieves curated Bangladeshi content including Natok, Telefilms, Web Series, and Star categories.

---

## 6. AI Discovery Engine (`/api/v1/recommendations/mood`)

### `POST /recommendations/mood`
Generates context-aware streaming recommendations using Gemini 3.8 Flash.
* **Request Body**:
```json
{
  "prompt": "বৃষ্টির দিনে একটু মন ভালো করা বাংলা কমেডি নাটক দেখতে চাই",
  "language": "bn"
}
```
* **Response (200 OK)**:
```json
{
  "status": "success",
  "mood": "বৃষ্টির দিনে মন ভালো করা",
  "explanation": "আপনার বৃষ্টির দিনের মেজাজ ফুরফুরে করতে মোশাররফ করিম এবং আফরান নিশোর এই নাটকগুলো সেরা বিনোদন দেবে।",
  "recommendations": [
    {
      "id": "bn-natok-1",
      "title": "যমজ",
      "titleEn": "Jomoj",
      "matchReason": "চমৎকার কমেডি এবং খাঁটি দেশি বিনোদন"
    }
  ]
}
```

---

## 7. Administrative APIs (`/api/v1/admin/`)

* `GET /admin/dashboard`: Aggregate platform statistics (active streams, user base, bandwidth, API latency).
* `GET /admin/audit-logs`: Comprehensive audit history of catalog modifications.
* `GET /admin/api-logs`: Latency metrics and HTTP status breakdown for observability.
