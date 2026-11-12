# 🗄️ ARURA PostgreSQL 16 Database Architecture & Schema

The relational database architecture is modeled in `database/schema.sql` and mirrored in Django models (`backend/apps/catalog/models.py`).

## 1. Schema Conventions
* **Primary Keys**: UUID v4 (`uuid_generate_v4()`) for distributed scalability and privacy.
* **Timestamps**: All tables include `created_at` and `updated_at` with microsecond precision.
* **Soft Deletion**: Content tables implement `deleted_at TIMESTAMP WITH TIME ZONE` to protect against accidental data loss.
* **Foreign Key Constraints**: Standard cascading rules (`ON DELETE CASCADE` or `RESTRICT`) to ensure relational integrity.

---

## 2. Entity-Relationship Overview

```
                      +-------------------+
                      |       Users       |
                      +---------+---------+
                                |
             +------------------+------------------+
             |                                     |
             v                                     v
+------------------------+             +------------------------+
|     UserProfiles       |             |     Subscriptions      |
+------------------------+             +------------------------+
             |                                     |
             v                                     v
+------------------------+             +------------------------+
|      WatchHistory      |             |  PaymentTransactions   |
+------------------------+             +------------------------+
             |
             +------------------+
                                |
                                v
                      +-------------------+
                      |      Catalog      |
                      +---------+---------+
                                |
             +------------------+------------------+
             |                  |                  |
             v                  v                  v
+-------------------+  +-------------------+  +-------------------+
|      Movies       |  |      Series       |  |   LiveChannels    |
+-------------------+  +--------+----------+  +---------+---------+
                                |                       |
                                v                       v
                       +-------------------+   +-------------------+
                       |     Episodes      |   |    EPGPrograms    |
                       +-------------------+   +-------------------+
```

---

## 3. Core Tables & Index Strategy

### `users`
* `id` UUID PRIMARY KEY
* `email` VARCHAR(255) UNIQUE NOT NULL
* `password_hash` VARCHAR(255) NOT NULL
* `role` VARCHAR(50) DEFAULT 'subscriber'
* `is_active` BOOLEAN DEFAULT TRUE
* `is_verified` BOOLEAN DEFAULT FALSE
* **Indexes**: `idx_users_email` (B-Tree)

### `catalog_items`
* Polymorphic base table storing general metadata for Movies, Series, Natok, and Specials.
* `id` UUID PRIMARY KEY
* `content_type` VARCHAR(50) NOT NULL
* `title` VARCHAR(255) NOT NULL (Bengali)
* `title_en` VARCHAR(255) NOT NULL (English)
* `rating` DECIMAL(3, 1)
* `is_trending` BOOLEAN DEFAULT FALSE
* `is_popular` BOOLEAN DEFAULT FALSE
* `is_featured` BOOLEAN DEFAULT FALSE
* `is_bangla_hub` BOOLEAN DEFAULT FALSE
* **Indexes**:
  - `idx_catalog_type` (`content_type`)
  - `idx_catalog_bangla` (`is_bangla_hub`)
  - `idx_catalog_featured` (`is_featured`)

### `episodes`
* Maps to `series` via foreign key `series_id` with composite unique constraint `(series_id, season_number, episode_number)`.

### `live_channels` & `epg_programs`
* Supports high-frequency reads for EPG schedule lookup.
* **Composite Index**: `idx_epg_channel_time (channel_id, start_time, end_time)` allows instant retrieval of currently airing programs.

### `admin_audit_logs`
* Implements immutable event logging for all administrative modifications (insertions, deletions, metadata overrides).
