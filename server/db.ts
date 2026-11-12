import { MEDIA_CATALOG, LIVE_CHANNELS, LIVE_SPORTS_EVENTS, YOUTUBE_SHORTS, YOUTUBE_MUSIC_TRACKS } from '../src/data/catalog';

export interface DbUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'moderator' | 'subscriber' | 'free_user';
  plan: 'VIP Premium' | 'Free Standard';
  avatar: string;
  phone?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbAdminRole {
  id: string;
  name: string;
  code: 'SUPER_ADMIN' | 'ADMIN' | 'CONTENT_MANAGER' | 'STREAM_MANAGER' | 'MODERATOR' | 'SUPPORT' | 'ANALYST' | 'FINANCE';
  description: string;
  permissions: string[]; // e.g. ['movies.view', 'movies.create', 'movies.publish', 'users.manage']
  assignedUsersCount: number;
}

export interface DbStreamingSource {
  id: string;
  contentId: string;
  contentTitle: string;
  sourceName: string;
  protocol: 'HLS' | 'DASH' | 'MP4';
  primaryUrl: string;
  backupUrl: string;
  quality: '4K' | '1080p' | '720p' | '480p';
  audioLanguage: string;
  subtitleLanguage: string;
  priority: number;
  status: 'ACTIVE' | 'DEGRADED' | 'DOWN';
  uptimePercentage: number;
  latencyMs: number;
  lastChecked: string;
}

export interface DbSubscriptionPlan {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'one_time';
  durationDays: number;
  features: string[];
  featuresEn: string[];
  maxStreams: number;
  quality: string;
  isActive: boolean;
  activeSubscribers: number;
}

export interface DbNotification {
  id: string;
  title: string;
  titleEn: string;
  body: string;
  bodyEn: string;
  category: 'PUSH' | 'SYSTEM' | 'SPORTS' | 'RELEASE';
  targetAudience: 'ALL' | 'VIP' | 'FREE' | 'SPORTS_FAN';
  scheduledTime?: string;
  sentTime: string;
  status: 'SENT' | 'SCHEDULED' | 'DRAFT';
  deliveredCount: number;
  openRate: string;
}

export interface DbSystemSettings {
  appName: string;
  appNameEn: string;
  appVersion: string;
  minSupportedVersion: string;
  forceUpdate: boolean;
  maintenanceMode: boolean;
  defaultLanguage: 'bn' | 'en';
  theme: 'cinematic_dark';
  cdnProvider: string;
  cacheTtlSeconds: number;
  maxBitrateKbps: number;
  bannerAnnouncement: string;
  bannerAnnouncementEn: string;
  contactEmail: string;
  termsUrl: string;
  privacyUrl: string;
}

export interface DbAiConfig {
  provider: string;
  model: string;
  temperature: number;
  maxOutputTokens: number;
  systemPromptPreset: string;
  fallbackToCatalog: boolean;
  dailyQuotaLimit: number;
  dailyQuotaUsed: number;
  avgLatencyMs: number;
  lastRequestTime: string;
}

export interface DbYouTubeConfig {
  apiKeyConfigured: boolean;
  quotaUsedToday: number;
  quotaLimit: number;
  autoSyncIntervalMinutes: number;
  monitoredChannels: { id: string; name: string; subscriberCount: string }[];
  musicModeBitrate: string;
  lastSyncTime?: string;
}

export interface DbCustomApi {
  id: string;
  name: string;
  category: 'STREAMING' | 'METADATA' | 'EPG' | 'SPORTS' | 'PAYMENT' | 'AI' | 'SMS' | 'CUSTOM';
  description: string;
  baseUrl: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT';
  authType: 'BEARER' | 'HEADER_KEY' | 'QUERY_PARAM' | 'BASIC' | 'NONE';
  authHeaderName?: string; // e.g., 'Authorization', 'X-API-Key', 'x-api-key'
  authSecret?: string;     // API Key or Bearer Token
  customHeaders?: Record<string, string>;
  requestPayload?: string;
  isActive: boolean;
  syncIntervalMinutes?: number;
  lastTestedAt?: string;
  lastTestStatus?: 'SUCCESS' | 'FAILED' | 'PENDING';
  lastLatencyMs?: number;
  lastResponsePreview?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetModel: string;
  targetId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface DbTransaction {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  currency: string;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Card' | 'GooglePay';
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';
  transactionRef: string;
  createdAt: string;
}

export interface DbApiLog {
  id: string;
  method: string;
  path: string;
  statusCode: number;
  latencyMs: number;
  ip: string;
  userAgent: string;
  timestamp: string;
}

// In-Memory Relational Database with normalized indexing, soft-deletes and ACID transactions
class AruraDatabase {
  roles: DbAdminRole[] = [
    {
      id: 'role-superadmin',
      name: 'Super Administrator',
      code: 'SUPER_ADMIN',
      description: 'Full platform control, administrative privileges and security settings.',
      permissions: ['*'],
      assignedUsersCount: 1
    },
    {
      id: 'role-admin',
      name: 'Operations Administrator',
      code: 'ADMIN',
      description: 'Content, live TV, sports, and user operations management.',
      permissions: ['movies.*', 'series.*', 'live-tv.*', 'sports.*', 'users.view', 'users.update'],
      assignedUsersCount: 3
    },
    {
      id: 'role-content',
      name: 'Content Manager',
      code: 'CONTENT_MANAGER',
      description: 'Manages Movies, Bangla Natok, Web Series, and metadata.',
      permissions: ['movies.create', 'movies.update', 'movies.publish', 'series.manage', 'bangla.manage'],
      assignedUsersCount: 5
    },
    {
      id: 'role-stream',
      name: 'Stream & Broadcast Engineer',
      code: 'STREAM_MANAGER',
      description: 'Manages HLS/DASH sources, Live TV channels, EPG, and sports telemetry.',
      permissions: ['streaming.*', 'live-tv.*', 'sports.*'],
      assignedUsersCount: 2
    },
    {
      id: 'role-moderator',
      name: 'Community Moderator',
      code: 'MODERATOR',
      description: 'Moderates user reviews, reports, and public activities.',
      permissions: ['reports.manage', 'users.view', 'users.suspend'],
      assignedUsersCount: 4
    },
    {
      id: 'role-finance',
      name: 'Finance & Subscriptions',
      code: 'FINANCE',
      description: 'Oversees VIP subscriptions, bKash/Nagad transactions, and refunds.',
      permissions: ['subscriptions.*', 'payments.*', 'refunds.process'],
      assignedUsersCount: 2
    }
  ];

  streamingSources: DbStreamingSource[] = [
    {
      id: 'src-1',
      contentId: 'bn-movie-1',
      contentTitle: 'হাওয়া (Hawa)',
      sourceName: 'Primary Cloudflare R2 HLS',
      protocol: 'HLS',
      primaryUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      backupUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      quality: '4K',
      audioLanguage: 'Bengali (5.1 Dolby)',
      subtitleLanguage: 'Bengali, English',
      priority: 1,
      status: 'ACTIVE',
      uptimePercentage: 99.98,
      latencyMs: 38,
      lastChecked: '2026-11-09T08:30:00Z'
    },
    {
      id: 'src-2',
      contentId: 'ch-tsports',
      contentTitle: 'T Sports Live HD',
      sourceName: 'Stadium Direct BDIX Feed',
      protocol: 'HLS',
      primaryUrl: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
      backupUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      quality: '1080p',
      audioLanguage: 'Bengali / English',
      subtitleLanguage: 'None',
      priority: 1,
      status: 'ACTIVE',
      uptimePercentage: 99.95,
      latencyMs: 24,
      lastChecked: '2026-11-09T08:45:00Z'
    },
    {
      id: 'src-3',
      contentId: 'bn-natok-1',
      contentTitle: 'যমজ (Jomoj)',
      sourceName: 'Fastly Edge CDN Multi-bitrate',
      protocol: 'HLS',
      primaryUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      backupUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      quality: '1080p',
      audioLanguage: 'Bengali',
      subtitleLanguage: 'English',
      priority: 1,
      status: 'ACTIVE',
      uptimePercentage: 100.0,
      latencyMs: 42,
      lastChecked: '2026-11-09T08:20:00Z'
    }
  ];

  subscriptionPlans: DbSubscriptionPlan[] = [
    {
      id: 'plan-free',
      name: 'ফ্রি স্ট্যান্ডার্ড (Free Standard)',
      nameEn: 'Free Standard Plan',
      price: 0,
      currency: 'BDT',
      billingCycle: 'monthly',
      durationDays: 30,
      features: ['বিজ্ঞাপনসহ ফ্রি নাটক ও টিভি', '720p HD কোয়ালিটি', '১টি স্ক্রিনে স্ট্রিমিং'],
      featuresEn: ['Ad-supported Bangla Natok & TV', '720p HD Quality', '1 Active Screen'],
      maxStreams: 1,
      quality: '720p HD',
      isActive: true,
      activeSubscribers: 5331
    },
    {
      id: 'plan-vip-monthly',
      name: 'ভিআইপি মান্থলি (VIP Monthly)',
      nameEn: 'VIP Monthly All-Access',
      price: 199,
      currency: 'BDT',
      billingCycle: 'monthly',
      durationDays: 30,
      features: ['সম্পূর্ণ বিজ্ঞাপনমুক্ত অভিজ্ঞতা', '1080p Full HD ও 4K প্রিমিয়ার', 'ডলবি অ্যাটমস অডিও', 'অফলাইন আনলিমিটেড ডাউনলোড', '৩টি ডিভাইসে একসাথে দেখা'],
      featuresEn: ['100% Ad-Free Experience', '1080p Full HD & 4K Premiere', 'Dolby Atmos Audio', 'Offline Downloads', '3 Screens Simultaneously'],
      maxStreams: 3,
      quality: '1080p / 4K',
      isActive: true,
      activeSubscribers: 6420
    },
    {
      id: 'plan-vip-annual',
      name: 'ভিআইপি বার্ষিক (VIP Annual Mega Saver)',
      nameEn: 'VIP Annual Mega Saver',
      price: 1499,
      currency: 'BDT',
      billingCycle: 'yearly',
      durationDays: 365,
      features: ['সবচেয়ে জনপ্রিয় সেভার প্ল্যান (৩৮% ছাড়)', 'লাইভ বিপিএল ক্রিকেট ও প্রিমিয়ার লিগ', 'সব প্রিমিয়ার মুভি ও এক্সক্লুসিভ সিরিজ', '৫টি স্ক্রিনে ফ্যামিলি শেয়ারিং'],
      featuresEn: ['Most Popular 38% Discount', 'Live BPL Cricket & EPL Football', 'All Premiere Movies & Originals', '5 Screens Family Sharing'],
      maxStreams: 5,
      quality: '4K Ultra HD',
      isActive: true,
      activeSubscribers: 2502
    }
  ];

  notifications: DbNotification[] = [
    {
      id: 'notif-1',
      title: 'লাইভ বিপিএল ২০২৬ ম্যাচ শুরু হয়েছে!',
      titleEn: 'Live BPL 2026 Match Started!',
      body: 'ঢাকা ডমিনেটর্স বনাম সিলেট স্ট্রাইকার্স ম্যাচটি এখনই সরাসরি দেখুন আরুরা স্পোর্টসে।',
      bodyEn: 'Watch Dhaka Dominators vs Sylhet Strikers live now on Arura Sports.',
      category: 'SPORTS',
      targetAudience: 'ALL',
      sentTime: '2026-11-09T08:00:00Z',
      status: 'SENT',
      deliveredCount: 14250,
      openRate: '68.4%'
    },
    {
      id: 'notif-2',
      title: 'নতুন এক্সক্লুসিভ বাংলা নাটক মুক্তি পেয়েছে',
      titleEn: 'New Exclusive Bangla Natok Released',
      body: 'আফরান নিশো ও মেহজাবীন অভিনীত নতুন ড্রামা "পুনর্জন্ম" এখন স্ট্রিমিং হচ্ছে।',
      bodyEn: 'Afran Nisho & Mehazabien star in "Punorjonmo", streaming exclusively now.',
      category: 'RELEASE',
      targetAudience: 'VIP',
      sentTime: '2026-11-08T18:00:00Z',
      status: 'SENT',
      deliveredCount: 8922,
      openRate: '74.2%'
    }
  ];

  systemSettings: DbSystemSettings = {
    appName: 'Arura (আরুরা)',
    appNameEn: 'Arura Streaming Platform',
    appVersion: 'v1.4.0-prod',
    minSupportedVersion: 'v1.0.0',
    forceUpdate: false,
    maintenanceMode: false,
    defaultLanguage: 'bn',
    theme: 'cinematic_dark',
    cdnProvider: 'Cloudflare Edge & R2 Distributed Storage',
    cacheTtlSeconds: 300,
    maxBitrateKbps: 8000,
    bannerAnnouncement: 'বিপিএল ২০২৬ এর সবগুলো ম্যাচ সরাসরি লাইভ দেখুন আরুরা স্পোর্টস চ্যানেলে!',
    bannerAnnouncementEn: 'Watch all BPL 2026 matches live on Arura Sports Channel with HD Stadium Feeds!',
    contactEmail: 'support@arura.tv',
    termsUrl: 'https://arura.tv/terms',
    privacyUrl: 'https://arura.tv/privacy'
  };

  aiConfig: DbAiConfig = {
    provider: 'Google GenAI (@google/genai)',
    model: 'gemini-3.8-flash',
    temperature: 0.7,
    maxOutputTokens: 800,
    systemPromptPreset: 'You are Arura entertainment expert. Recommend Bangla and global movies/series in culturally rich Bengali language.',
    fallbackToCatalog: true,
    dailyQuotaLimit: 50000,
    dailyQuotaUsed: 1420,
    avgLatencyMs: 460,
    lastRequestTime: '2026-11-09T08:48:12Z'
  };

  youtubeConfig: DbYouTubeConfig = {
    apiKeyConfigured: true,
    quotaUsedToday: 2340,
    quotaLimit: 10000,
    autoSyncIntervalMinutes: 60,
    monitoredChannels: [
      { id: 'UC_arura_bangla', name: 'Arura Bangla Originals', subscriberCount: '2.4M' },
      { id: 'UC_arura_music', name: 'Arura Music Station', subscriberCount: '1.8M' },
      { id: 'UC_arura_sports', name: 'Arura Sports Highlights', subscriberCount: '3.1M' }
    ],
    musicModeBitrate: '320kbps High Fidelity',
    lastSyncTime: '2026-11-09T08:00:00Z'
  };

  customApis: DbCustomApi[] = [
    {
      id: 'api-tmdb',
      name: 'TMDB (The Movie Database) Metadata API',
      category: 'METADATA',
      description: 'স্বয়ংক্রিয়ভাবে সিনেমা, সিরিজ, কাস্ট ও পোস্টার মেটাডাটা ব্যাকএন্ডে ইম্পোর্ট করুন।',
      baseUrl: 'https://api.themoviedb.org/3',
      endpoint: '/movie/popular?language=bn-BD&page=1',
      method: 'GET',
      authType: 'BEARER',
      authHeaderName: 'Authorization',
      authSecret: 'Bearer tmdb_api_read_access_token_demo_sample',
      isActive: true,
      syncIntervalMinutes: 60,
      lastTestedAt: '2026-11-09T09:00:00Z',
      lastTestStatus: 'SUCCESS',
      lastLatencyMs: 84,
      lastResponsePreview: '{"page":1,"results":[{"id":823464,"title":"গডজিলা x কং","vote_average":7.2,"release_date":"2024-03-27"}]}',
      createdAt: '2026-01-15T10:00:00Z',
      updatedAt: '2026-11-09T09:00:00Z'
    },
    {
      id: 'api-streaming-origin',
      name: 'Primary HLS / M3U8 Video Streaming Server',
      category: 'STREAMING',
      description: 'বাস্তব ভিডিও স্ট্রিমিং সার্ভার (Akamai / Cloudflare Stream / Wowza / Xtream Codes)।',
      baseUrl: 'https://test-streams.mux.dev',
      endpoint: '/x36xhzz/x36xhzz.m3u8',
      method: 'GET',
      authType: 'NONE',
      isActive: true,
      syncIntervalMinutes: 0,
      lastTestedAt: '2026-11-09T09:05:00Z',
      lastTestStatus: 'SUCCESS',
      lastLatencyMs: 32,
      lastResponsePreview: '#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-STREAM-INF:BANDWIDTH=2149280,RESOLUTION=1280x720\nurl_0/193039199_mp4_h264_aac_hd_7.m3u8',
      createdAt: '2026-02-01T12:00:00Z',
      updatedAt: '2026-11-09T09:05:00Z'
    },
    {
      id: 'api-cricapi',
      name: 'Live Cricket Score API (CricAPI / RapidAPI)',
      category: 'SPORTS',
      description: 'বিপিএল, আইপিএল ও আন্তর্জাতিক ক্রিকেট লাইভ বল-বাই-বল স্কোরবোর্ড ফিড।',
      baseUrl: 'https://api.cricapi.com/v1',
      endpoint: '/currentMatches?apikey=demo_cricapi_key&offset=0',
      method: 'GET',
      authType: 'QUERY_PARAM',
      authHeaderName: 'apikey',
      authSecret: 'demo_cricapi_key_2026',
      isActive: true,
      syncIntervalMinutes: 5,
      lastTestedAt: '2026-11-09T09:01:00Z',
      lastTestStatus: 'SUCCESS',
      lastLatencyMs: 65,
      lastResponsePreview: '{"status":"success","data":[{"name":"Dhaka vs Sylhet","status":"Match in progress"}]}',
      createdAt: '2026-02-10T14:30:00Z',
      updatedAt: '2026-11-09T09:01:00Z'
    },
    {
      id: 'api-bkash',
      name: 'bKash Tokenized Checkout Payment API',
      category: 'PAYMENT',
      description: 'বিকাশ সরাসরি পেমেন্ট গেটওয়ে - মার্চেন্ট অটোমেশন ও ইনস্ট্যান্ট ভিআইপি অ্যাক্টিভেশন।',
      baseUrl: 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',
      endpoint: '/tokenized/checkout/create',
      method: 'POST',
      authType: 'HEADER_KEY',
      authHeaderName: 'X-KM-Api-Version',
      authSecret: 'v1.2.0-beta',
      customHeaders: {
        'username': 'sandboxTokenizedUser02',
        'password': 'sandboxTokenizedUser02@123'
      },
      requestPayload: '{"mode":"0011","payerReference":"01700000000","callbackURL":"https://arura.tv/api/v1/subscriptions/callback","amount":"199","currency":"BDT","intent":"sale"}',
      isActive: true,
      syncIntervalMinutes: 0,
      lastTestedAt: '2026-11-09T08:50:00Z',
      lastTestStatus: 'SUCCESS',
      lastLatencyMs: 95,
      lastResponsePreview: '{"statusCode":"0000","statusMessage":"Successful","paymentID":"TR0011BKS98","bkashURL":"https://sandbox.payment.bkash.com/..."}',
      createdAt: '2026-01-20T11:15:00Z',
      updatedAt: '2026-11-09T08:50:00Z'
    },
    {
      id: 'api-xmltv',
      name: 'XMLTV / IPTV EPG Feed Ingestion API',
      category: 'EPG',
      description: '২৪/৭ টিভি চ্যানেলের সার্বক্ষণিক প্রোগ্রাম গাইড ও সময়সূচী সিঙ্ক্রোনাইজেশন।',
      baseUrl: 'https://iptv-org.github.io/epg',
      endpoint: '/guides/bd/somoytv.tv.epg.xml',
      method: 'GET',
      authType: 'NONE',
      isActive: true,
      syncIntervalMinutes: 360,
      lastTestedAt: '2026-11-09T07:30:00Z',
      lastTestStatus: 'SUCCESS',
      lastLatencyMs: 110,
      lastResponsePreview: '<?xml version="1.0" encoding="UTF-8"?><tv><channel id="SomoyTV.bd"><display-name>Somoy TV</display-name></channel></tv>',
      createdAt: '2026-02-18T16:00:00Z',
      updatedAt: '2026-11-09T07:30:00Z'
    }
  ];

  users: DbUser[] = [
    {
      id: 'usr-1',
      email: 'ayanislam10000@gmail.com',
      name: 'আয়ান ইসলাম (Ayan Islam)',
      role: 'superadmin',
      plan: 'VIP Premium',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      phone: '+8801700000000',
      isActive: true,
      isVerified: true,
      createdAt: '2026-01-10T12:00:00Z',
      updatedAt: '2026-11-09T07:00:00Z'
    },
    {
      id: 'usr-2',
      email: 'fahim.moderator@arura.tv',
      name: 'ফাহিম আহমেদ (Fahim Ahmed)',
      role: 'moderator',
      plan: 'VIP Premium',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      phone: '+8801811111111',
      isActive: true,
      isVerified: true,
      createdAt: '2026-02-15T08:30:00Z',
      updatedAt: '2026-11-08T15:20:00Z'
    },
    {
      id: 'usr-3',
      email: 'tanvir.user@gmail.com',
      name: 'তানভীর হাসান (Tanvir Hasan)',
      role: 'subscriber',
      plan: 'Free Standard',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      isActive: true,
      isVerified: true,
      createdAt: '2026-03-01T10:15:00Z',
      updatedAt: '2026-11-05T09:40:00Z'
    }
  ];

  movies = [...MEDIA_CATALOG];
  channels = [...LIVE_CHANNELS];
  sports = [...LIVE_SPORTS_EVENTS];
  shorts = [...YOUTUBE_SHORTS];
  music = [...YOUTUBE_MUSIC_TRACKS];

  transactions: DbTransaction[] = [
    {
      id: 'tx-1001',
      userId: 'usr-1',
      planId: 'plan-vip-annual',
      amount: 1499,
      currency: 'BDT',
      paymentMethod: 'bKash',
      status: 'COMPLETED',
      transactionRef: 'BKS-2026-9812450',
      createdAt: '2026-01-10T12:05:22Z'
    },
    {
      id: 'tx-1002',
      userId: 'usr-2',
      planId: 'plan-vip-monthly',
      amount: 199,
      currency: 'BDT',
      paymentMethod: 'Nagad',
      status: 'COMPLETED',
      transactionRef: 'NGD-2026-4432190',
      createdAt: '2026-10-15T14:22:10Z'
    }
  ];

  auditLogs: DbAuditLog[] = [
    {
      id: 'log-1',
      adminId: 'usr-1',
      adminName: 'আয়ান ইসলাম',
      action: 'UPDATE_CONTENT',
      targetModel: 'Movie',
      targetId: 'bn-movie-1',
      details: 'Updated 4K HDR streaming source and WebVTT Bengali subtitles for Hawa',
      ipAddress: '103.145.12.4',
      timestamp: '2026-11-09T04:12:00Z'
    },
    {
      id: 'log-2',
      adminId: 'usr-1',
      adminName: 'আয়ান ইসলাম',
      action: 'LIVE_SCHEDULE_UPDATE',
      targetModel: 'LiveChannel',
      targetId: 'ch-tsports',
      details: 'Synchronized BPL 2026 match schedule and EPG programs',
      ipAddress: '103.145.12.4',
      timestamp: '2026-11-09T05:30:00Z'
    }
  ];

  apiLogs: DbApiLog[] = [];

  recordApiLog(log: Omit<DbApiLog, 'id' | 'timestamp'>) {
    const entry: DbApiLog = {
      ...log,
      id: 'req-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString()
    };
    this.apiLogs.unshift(entry);
    if (this.apiLogs.length > 100) this.apiLogs.pop();
  }

  recordAudit(action: string, targetModel: string, targetId: string, details: string, admin = 'আয়ান ইসলাম') {
    const log: DbAuditLog = {
      id: 'audit-' + Math.random().toString(36).substring(2, 9),
      adminId: 'usr-1',
      adminName: admin,
      action,
      targetModel,
      targetId,
      details,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 100) this.auditLogs.pop();
  }
}

export const db = new AruraDatabase();
