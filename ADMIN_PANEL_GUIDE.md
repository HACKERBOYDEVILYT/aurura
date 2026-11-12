# 🎛️ ARURA Master Control Center — Admin Panel Documentation

## 1. Overview
The **Arura Master Control Center** is a dark cinematic administrative interface designed to govern the entire Arura streaming ecosystem across Android and Web.

* **Design Palette**:
  - Background: `#090B10`
  - Sidebar: `#11141D`
  - Surface: `#171B26`
  - Primary Accent: `#7C4DFF`
  - Secondary Accent: `#00D6A3`
  - Text: `#FFFFFF` / Secondary Text: `#A0A6B5`
* **Default Language**: Bengali (বাংলা) with 1-click English toggle.
* **Access URL**: Accessible via the Shield button in the top navigation bar or `/api/v1/admin/dashboard`.

---

## 2. 17 Master Control Modules

| Module ID | Tab Name | Key Features |
|---|---|---|
| `dashboard` | ড্যাশবোর্ড (Dashboard) | Real-time DAU telemetry, 8 metric cards, streaming hours chart, cache hit rate (98.4%), CSV export |
| `movies` | সিনেমা (Movies) | Full CRUD, publish/unpublish, HLS stream URLs, genre tags, age ratings, poster art, preview player |
| `series` | সিরিজ ও পর্ব (Series) | Multi-season management, episode ordering, durations, thumbnail and video source assignment |
| `bangla` | বাংলা হাব (Bangla Hub) | Dedicated curation for Natok, Telefilms, Web Series; celebrity chips (Nisho, Chanchal, Karim, Mehazabien) |
| `livetv` | লাইভ টিভি ও EPG | 24/7 channels, ongoing & upcoming program guides, real-time HLS feed latency ping checks |
| `sports` | লাইভ স্পোর্টস | BPL Cricket & EPL football tournament manager, live match score broadcast editor |
| `streaming` | স্ট্রিমিং সোর্স | Multi-CDN HLS/DASH sources, automatic failovers, quality renditions (4K, 1080p), ping latency SLAs |
| `users` | ব্যবহারকারী (Users) | User directory, VIP vs Free status, account suspension/activation toggle, role promotions |
| `roles` | RBAC ও ভূমিকা | 8 administrative roles (SUPER_ADMIN, ADMIN, CONTENT_MANAGER, STREAM_MANAGER, etc.) and permission matrix |
| `subscriptions` | সাবস্ক্রিপশন প্ল্যান | Pricing tiers in BDT (Free, VIP Monthly 199 BDT, VIP Annual 1499 BDT), multi-screen limits |
| `payments` | পেমেন্ট ও রিফান্ড | bKash, Nagad, Rocket, Card transaction inspection, server-side verified refund initiation |
| `ai` | Gemini AI ইঞ্জিন | Model selector (`gemini-3.8-flash`), temperature slider, Bengali system prompt, token quota tracker |
| `youtube` | ইউটিউব ও মিউজিক | Official channel discovery monitor, Shorts vertical feeds, 320kbps background music mode, quota meter |
| `notifications` | নোটিফিকেশন সেন্টার | Push notification broadcaster, target audience segmentation (All, VIP, Sports Fans), open rate tracking |
| `settings` | সিস্টেম কনফিগ | Maintenance mode toggle, force update switch, min supported version, Cloudflare CDN rules, banner alert |
| `audit` | সিকিউরিটি অডিট লগ | Immutable audit trail: admin name, target model, target ID, client IP, action, and timestamp |
| `health` | সিস্টেম স্বাস্থ্য | Live telemetry for PostgreSQL pool, Redis cache hit rate, Celery task queue, Cloudflare R2 egress |

---

## 3. Administrative RESTful APIs

```
GET    /api/v1/admin/dashboard        # Aggregate metrics & telemetry
GET    /api/v1/admin/roles            # List RBAC operational roles
GET    /api/v1/admin/permissions      # Available granular permissions
PUT    /api/v1/admin/users/:id/status # Suspend/activate or promote user
GET    /api/v1/admin/streaming        # List HLS/DASH streaming sources
POST   /api/v1/admin/streaming        # Add secondary or primary stream
POST   /api/v1/admin/streaming/:id/check-health # Test stream feed latency
GET    /api/v1/admin/subscriptions    # List VIP subscription plans
POST   /api/v1/admin/subscriptions    # Create subscription tier
GET    /api/v1/admin/payments         # List mobile banking/card transactions
POST   /api/v1/admin/payments/:id/refund # Process verified refund
GET    /api/v1/admin/ai               # Get Gemini AI configuration
PUT    /api/v1/admin/ai               # Update AI model and temperature
GET    /api/v1/admin/youtube          # Get YouTube quota usage
POST   /api/v1/admin/youtube/sync     # Sync YouTube channel metadata
GET    /api/v1/admin/notifications    # List notification history
POST   /api/v1/admin/notifications    # Broadcast push notification
GET    /api/v1/admin/settings         # Get global system configuration
PUT    /api/v1/admin/settings         # Update maintenance mode & banner
GET    /api/v1/admin/system-health    # Real-time infrastructure health
GET    /api/v1/admin/audit-logs       # Retrieve immutable audit log history
```
