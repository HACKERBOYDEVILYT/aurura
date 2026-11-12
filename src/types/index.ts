export type ContentType = 'movie' | 'series' | 'live_tv' | 'sports' | 'natok' | 'telefilm' | 'youtube' | 'short';

export type Language = 'bn' | 'en';

export interface Episode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  titleEn: string;
  duration: string;
  thumbnail: string;
  description: string;
  descriptionEn: string;
  streamUrl: string;
}

export interface Season {
  seasonNumber: number;
  title: string;
  titleEn: string;
  episodes: Episode[];
}

export interface CastMember {
  name: string;
  nameEn: string;
  role: string;
  avatar: string;
}

export interface SubtitleTrack {
  id: string;
  label: string;
  lang: string;
  src?: string;
}

export interface AudioTrack {
  id: string;
  label: string;
  lang: string;
}

export interface MediaItem {
  id: string;
  type: ContentType;
  title: string;
  titleEn: string;
  tagline?: string;
  taglineEn?: string;
  description: string;
  descriptionEn: string;
  poster: string;
  backdrop: string;
  rating: number; // e.g. 8.7
  year: number;
  duration?: string; // e.g. "2h 15m" or "45 min/ep"
  ageRating: string; // e.g. "13+", "16+", "PG"
  genre: string[];
  genreEn: string[];
  director?: string;
  cast?: CastMember[];
  streamUrl: string;
  fallbackStreamUrl?: string;
  youtubeId?: string;
  isTrending?: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
  isBanglaHub?: boolean;
  starCategory?: string; // e.g. 'Afran Nisho', 'Mosharraf Karim', 'Chanchal Chowdhury'
  seasons?: Season[];
}

export interface EPGProgram {
  id: string;
  time: string;
  title: string;
  titleEn: string;
  category: string;
  isCurrent?: boolean;
  duration: string;
}

export interface LiveTVChannel {
  id: string;
  name: string;
  nameEn: string;
  logo: string;
  category: 'Entertainment' | 'News' | 'Sports' | 'Bangla' | 'Islamic' | 'Kids';
  streamUrl: string;
  currentShow: string;
  currentShowEn: string;
  nextShow: string;
  nextShowEn: string;
  epg: EPGProgram[];
  isHd: boolean;
}

export interface SportsEvent {
  id: string;
  sport: 'Cricket' | 'Football' | 'Tennis' | 'Kabaddi';
  tournament: string;
  tournamentEn: string;
  teamA: {
    name: string;
    nameEn: string;
    flag: string;
    score?: string;
  };
  teamB: {
    name: string;
    nameEn: string;
    flag: string;
    score?: string;
  };
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  time: string;
  venue: string;
  streamUrl: string;
  highlightsUrl?: string;
  summary: string;
  summaryEn: string;
}

export interface YouTubeShort {
  id: string;
  title: string;
  titleEn: string;
  channelName: string;
  channelAvatar: string;
  likes: string;
  comments: string;
  videoUrl: string;
  tags: string[];
}

export interface YouTubeMusicTrack {
  id: string;
  title: string;
  titleEn: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
  audioUrl: string;
}

export interface WatchProgress {
  contentId: string;
  currentTime: number;
  duration: number;
  lastUpdated: string;
  episodeId?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  plan: 'VIP Premium' | 'Free Standard';
  streamQuality: 'Auto' | '1080p Full HD' | '720p HD' | '480p SD';
  audioQuality: 'Dolby Atmos' | 'Stereo' | 'High';
  appLanguage: Language;
}
