-- ====================================================================
-- ARURA STREAMING PLATFORM — POSTGRESQL PRODUCTION RELATIONAL SCHEMA
-- Database: PostgreSQL 16+ with extensions: uuid-ossp, pg_trgm
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. USERS & PROFILES
CREATE TYPE user_role_enum AS ENUM ('superadmin', 'admin', 'moderator', 'subscriber', 'free_user');
CREATE TYPE subscription_plan_enum AS ENUM ('VIP Premium', 'Free Standard');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(150) NOT NULL,
    role user_role_enum DEFAULT 'subscriber',
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(30),
    avatar_url TEXT,
    bio TEXT,
    country VARCHAR(10) DEFAULT 'BD',
    preferred_language VARCHAR(10) DEFAULT 'bn',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    default_stream_quality VARCHAR(30) DEFAULT 'Auto',
    audio_track_preference VARCHAR(30) DEFAULT 'Dolby Atmos',
    subtitles_enabled BOOLEAN DEFAULT TRUE,
    subtitle_language VARCHAR(10) DEFAULT 'bn',
    data_saver_mode BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. CATEGORIES & GENRES
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name_bn VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE genres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name_bn VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. MOVIES & SERIES
CREATE TYPE content_type_enum AS ENUM ('movie', 'series', 'natok', 'telefilm');

CREATE TABLE movies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) UNIQUE NOT NULL,
    type content_type_enum NOT NULL DEFAULT 'movie',
    title_bn VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    tagline_bn TEXT,
    tagline_en TEXT,
    description_bn TEXT NOT NULL,
    description_en TEXT NOT NULL,
    poster_url TEXT NOT NULL,
    backdrop_url TEXT NOT NULL,
    rating NUMERIC(3,1) DEFAULT 8.0,
    release_year INT NOT NULL,
    duration_minutes INT,
    age_rating VARCHAR(20) DEFAULT '13+',
    is_bangla_hub BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    star_category VARCHAR(150),
    director VARCHAR(150),
    view_count BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE series (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) UNIQUE NOT NULL,
    title_bn VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    tagline_bn TEXT,
    tagline_en TEXT,
    description_bn TEXT NOT NULL,
    description_en TEXT NOT NULL,
    poster_url TEXT NOT NULL,
    backdrop_url TEXT NOT NULL,
    rating NUMERIC(3,1) DEFAULT 8.5,
    release_year INT NOT NULL,
    age_rating VARCHAR(20) DEFAULT '16+',
    is_bangla_hub BOOLEAN DEFAULT FALSE,
    total_seasons INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE seasons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    series_id UUID NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    season_number INT NOT NULL,
    title_bn VARCHAR(150) NOT NULL,
    title_en VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(series_id, season_number)
);

CREATE TABLE episodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    episode_number INT NOT NULL,
    title_bn VARCHAR(200) NOT NULL,
    title_en VARCHAR(200) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    thumbnail_url TEXT NOT NULL,
    description_bn TEXT,
    description_en TEXT,
    stream_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(season_id, episode_number)
);

-- 4. CAST & CREW
CREATE TABLE cast_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_bn VARCHAR(150) NOT NULL,
    name_en VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movie_cast (
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
    cast_member_id UUID REFERENCES cast_members(id) ON DELETE CASCADE,
    character_name VARCHAR(150),
    PRIMARY KEY (movie_id, cast_member_id)
);

-- 5. STREAMING SOURCES, SUBTITLES, AUDIO TRACKS
CREATE TABLE streaming_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    source_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT TRUE,
    protocol VARCHAR(20) DEFAULT 'HLS',
    quality_label VARCHAR(30) DEFAULT '1080p Full HD',
    cdn_provider VARCHAR(50) DEFAULT 'Cloudflare R2',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subtitles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    label VARCHAR(50) NOT NULL,
    format VARCHAR(10) DEFAULT 'vtt',
    file_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audio_tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    label VARCHAR(50) NOT NULL,
    channels VARCHAR(20) DEFAULT '5.1 Spatial',
    file_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. LIVE TV CHANNELS & ELECTRONIC PROGRAM GUIDE (EPG)
CREATE TABLE live_channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name_bn VARCHAR(150) NOT NULL,
    name_en VARCHAR(150) NOT NULL,
    logo_url TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    stream_url TEXT NOT NULL,
    is_hd BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE epg_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID NOT NULL REFERENCES live_channels(id) ON DELETE CASCADE,
    title_bn VARCHAR(200) NOT NULL,
    title_en VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration VARCHAR(50),
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. SPORTS & LIVE MATCHES
CREATE TABLE sports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE sports_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sport VARCHAR(50) NOT NULL,
    tournament_bn VARCHAR(150) NOT NULL,
    tournament_en VARCHAR(150) NOT NULL,
    team_a_name_bn VARCHAR(100) NOT NULL,
    team_a_name_en VARCHAR(100) NOT NULL,
    team_a_flag VARCHAR(10),
    team_a_score VARCHAR(50),
    team_b_name_bn VARCHAR(100) NOT NULL,
    team_b_name_en VARCHAR(100) NOT NULL,
    team_b_flag VARCHAR(10),
    team_b_score VARCHAR(50),
    status VARCHAR(20) DEFAULT 'LIVE',
    match_time VARCHAR(100),
    venue TEXT,
    stream_url TEXT NOT NULL,
    summary_bn TEXT,
    summary_en TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. WATCH HISTORY, WATCHLIST, PROGRESS
CREATE TABLE watch_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id VARCHAR(100) NOT NULL,
    episode_id VARCHAR(100),
    progress_seconds INT DEFAULT 0,
    total_seconds INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    last_watched TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, content_id)
);

CREATE TABLE watchlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, content_id)
);

-- 9. SUBSCRIPTIONS & PAYMENT TRANSACTIONS
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_tier VARCHAR(50) NOT NULL,
    starts_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL,
    is_auto_renew BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'BDT',
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'COMPLETED',
    transaction_ref VARCHAR(100) UNIQUE NOT NULL,
    raw_webhook_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. SYSTEM AUDIT & NOTIFICATIONS
CREATE TABLE admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    admin_name VARCHAR(150),
    action VARCHAR(100) NOT NULL,
    target_model VARCHAR(100) NOT NULL,
    target_id VARCHAR(100),
    details TEXT,
    ip_address VARCHAR(50),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR MAXIMUM QUERY EFFICIENCY
CREATE INDEX idx_movies_trending ON movies(is_trending) WHERE deleted_at IS NULL;
CREATE INDEX idx_movies_bangla ON movies(is_bangla_hub) WHERE deleted_at IS NULL;
CREATE INDEX idx_movies_title_trgm ON movies USING gin(title_en gin_trgm_ops);
CREATE INDEX idx_episodes_season ON episodes(season_id);
CREATE INDEX idx_epg_channel_time ON epg_programs(channel_id, start_time, end_time);
CREATE INDEX idx_watch_history_user ON watch_history(user_id, last_watched DESC);
CREATE INDEX idx_watchlist_user ON watchlist(user_id);
CREATE INDEX idx_transactions_user ON payment_transactions(user_id, created_at DESC);
CREATE INDEX idx_audit_timestamp ON admin_audit_logs(timestamp DESC);
