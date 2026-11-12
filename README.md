# 🎬 ARURA — Premium All-in-One Entertainment Streaming Platform

[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web-blueviolet.svg)](#)
[![Primary Language](https://img.shields.io/badge/Language-Bangla%20(Default)%20%7C%20English-00D6A3.svg)](#)
[![API Version](https://img.shields.io/badge/API-DRF%20v1%20OpenAPI-7C4DFF.svg)](#)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](#)

**ARURA (আরুরা)** is a production-grade, next-generation streaming platform designed specifically for Bengali and global entertainment enthusiasts. It brings together Movies, TV Series, Bangla Natok & Telefilms, 24/7 Live Television with Electronic Program Guide (EPG), Live Sports scoreboards & streaming, YouTube Shorts, and high-fidelity YouTube Music Mode, powered by a native **AndroidX Media3 ExoPlayer engine** and **Gemini 3.8 Flash AI mood recommendations**.

---

## 🌟 Key Application Pillars

### 1. 🎭 Bangla Entertainment Hub (বাংলা হাব)
* **Dedicated Curations**: Bangla Natok, Telefilms, Web Series, and Classic/Blockbuster Bangla Cinema.
* **Celebrity Categorization**: Instant 1-tap filtering for stars like Afran Nisho, Mosharraf Karim, Chanchal Chowdhury, Mehazabien Chowdhury, Ziaul Faruq Apurba, and Siam Ahmed.
* **Authentic Metadata**: Native Bengali typography (Hind Siliguri) with English translation toggles.

### 2. 📺 24/7 Live Television & EPG
* **Real-time Channels**: Channel i, Somoy TV, NTV, ATN Bangla, T Sports, Nagorik TV.
* **Interactive EPG (Electronic Program Guide)**: Live timeline highlighting the current broadcast, progress bar, and upcoming shows with automatic refresh.

### 3. 🏏 Live Sports Center
* **Live Match Scorecards**: Real-time score updates, overs, wickets, and match commentary (BPL Cricket, English Premier League, UEFA).
* **Multi-Camera & Stadium Feeds**: Dedicated low-latency streaming sources with team flags and venue stats.

### 4. 📱 YouTube Integration & Shorts
* **Vertical Shorts Player**: TikTok/Reels-style smooth vertical feed with like/comment count simulation.
* **YouTube Music Mode**: Background audio player with vinyl disc animation, lyrics preview, and playlist queue.

### 5. 🤖 Gemini 3.8 Flash AI Discovery Engine
* **Natural Bengali Prompts**: "আজকে ছুটির দিনে মন খারাপ, একটা রোমান্টিক কমেডি নাটক সাজেস্ট করো"
* **Smart Content Mapping**: Semantic understanding that maps viewer feelings into catalog media items with real-time justification.

### 6. 🛡️ Professional Responsive Admin Panel
* **Live Dashboard Metrics**: Active viewers, total content, system uptime, and streaming bandwidth.
* **Catalog Management**: Add, update, delete movies, series, episodes, genres, and streaming sources.
* **Live Sports Control**: Real-time scoreboard score updates directly pushable to live viewers.
* **Security & Audit Logs**: Traceable administrative actions and API latency tracking.

---

## 🏗️ Technology Architecture

```
                                  ┌─────────────────────────────┐
                                  │   Android App (Compose)     │
                                  │   Web SPA (React 19 + Vite) │
                                  └──────────────┬──────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │  Cloudflare Workers Gateway │
                                  │  (Rate Limit / JWT / Cache) │
                                  └──────────────┬──────────────┘
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        ▼                                                 ▼
        ┌───────────────────────────────┐                 ┌───────────────────────────────┐
        │   Django REST Framework API   │                 │   Gemini 3.8 Flash AI Engine  │
        │   (v1 OpenAPI / Python 3.11)  │                 │   (Mood Discovery in Bangla)  │
        └───────────────┬───────────────┘                 └───────────────────────────────┘
                        │
       ┌────────────────┼────────────────┐
       ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ PostgreSQL 16│ │   Redis 7    │ │ Celery Tasks │
│  (Relational)│ │ (Cache/Rate) │ │(Transcoding) │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: v20+
* **Python**: 3.11+ (for Django backend)
* **PostgreSQL**: 16+
* **Redis**: 7+

### 1. Clone & Setup Frontend / Edge Server
```bash
git clone https://github.com/ayanislam/arura-streaming.git
cd arura-streaming

# Install dependencies
npm install

# Start development fullstack server
npm run dev
```
The application will launch on `http://localhost:3000`.

### 2. Run with Docker Compose (Recommended for Full Stack)
```bash
docker-compose up --build
```
This boots up:
* **Web & API Gateway**: `http://localhost:3000`
* **PostgreSQL 16**: `localhost:5432` (`arura_db`)
* **Redis 7**: `localhost:6379`
* **Celery Background Worker**: Ingests EPG and metadata sync

---

## 📡 Core API Endpoints (`/api/v1/`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Production health check & telemetry |
| `POST` | `/api/v1/auth/login` | JWT access & refresh token login |
| `POST` | `/api/v1/auth/register` | New subscriber account registration |
| `POST` | `/api/v1/auth/google` | Google SSO authentication flow |
| `GET` | `/api/v1/movies` | Movies catalog with genre filtering |
| `GET` | `/api/v1/series` | TV & Web series with episodes |
| `GET` | `/api/v1/live-tv` | 24/7 channels with EPG schedules |
| `GET` | `/api/v1/sports` | Live matches and tournament fixtures |
| `POST` | `/api/v1/recommendations/mood` | Gemini AI mood-based content finder |
| `GET` | `/api/v1/admin/dashboard` | Admin analytics, metrics & audit logs |
| `GET` | `/api/v1/openapi.json` | Complete OpenAPI 3.0 specification |

---

## 📖 Complete Documentation Index

1. [📐 Architecture Deep Dive](ARCHITECTURE.md)
2. [🔌 API Documentation](API_DOCUMENTATION.md)
3. [🗄️ Database Schema & DDL](DATABASE_SCHEMA.md)
4. [📱 Android Setup & Guidelines](ANDROID_SETUP.md)
5. [🐍 Backend & DRF Setup](BACKEND_SETUP.md)
6. [☁️ Cloudflare Workers & R2 Setup](CLOUDFLARE_SETUP.md)
7. [🚢 Production Deployment Guide](DEPLOYMENT.md)
8. [🔒 Security Architecture](SECURITY.md)
9. [🧪 Testing Strategy](TESTING.md)
10. [🤝 Contribution Guidelines](CONTRIBUTING.md)

---

## 📄 License
© 2026 Arura Entertainment Networks. All rights reserved.
