# 🧪 ARURA Testing Strategy & Test Automation Guide

Arura employs comprehensive testing across Unit, Integration, End-to-End (E2E), and Media Playback domains.

---

## 1. Testing Pyramid

```
                /\
               /  \       E2E Browser & Android Instrumentation
              / E2E\      (Playwright CLI / Espresso Compose)
             /------\
            /  Integ \    API Integration & Database Schema Tests
           /----------\   (Supertest / DRF APITestCase / PostgreSQL)
          / Pure Logic \  Unit Tests & State Machine Tests
         /--------------\ (Vitest / node:test / JUnit 5)
```

---

## 2. Running Frontend & Server Unit Tests
```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Run application build
npm run build
```

---

## 3. Running API Tests
```bash
# Verify Health Endpoint
curl -s http://localhost:3000/health | jq .

# Verify Gemini AI Recommender in Bangla
curl -s -X POST http://localhost:3000/api/v1/recommendations/mood \
  -H "Content-Type: application/json" \
  -d '{"prompt": "রোমান্টিক কমেডি নাটক দেখতে চাই", "language": "bn"}' | jq .
```

---

## 4. Android Unit & Media3 Player Tests
```bash
cd android
./gradlew testDebugUnitTest
```
Tests verify:
- ExoPlayer track selector behavior under network speed throttling.
- Room DB migration tests for watchlist and offline downloads.
- ViewModels handling of state updates and pagination flow.

---

## 5. Playwright E2E UI Testing
Playwright tests verify:
- Navigation through all modules: Home, Movies, Series, Bangla Hub, Live TV, Sports, YouTube Shorts, AI Discovery, Library, Admin Panel.
- Modal interactions: Video player, Episode drawer, Profile dialog, Auth modal.
- Bengali to English language switching across the entire UI.
