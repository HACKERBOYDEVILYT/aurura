import React, { createContext, useContext, useState, useEffect } from 'react';
import { MediaItem, Episode, LiveTVChannel, SportsEvent, YouTubeMusicTrack, UserProfile, Language } from '../types';
import { translations } from '../utils/translations';
import { LIVE_CHANNELS, LIVE_SPORTS_EVENTS, YOUTUBE_MUSIC_TRACKS } from '../data/catalog';

interface WatchHistoryItem {
  id: string;
  progressSeconds: number;
  totalSeconds: number;
  episodeId?: string;
  lastWatched: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.bn;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeMedia: MediaItem | null;
  activeEpisode: Episode | null;
  isPlayerOpen: boolean;
  openPlayer: (item: MediaItem, episode?: Episode) => void;
  closePlayer: () => void;
  selectedDetailItem: MediaItem | null;
  openDetails: (item: MediaItem) => void;
  closeDetails: () => void;
  watchlist: string[];
  toggleWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
  watchHistory: WatchHistoryItem[];
  updateProgress: (id: string, progressSeconds: number, totalSeconds: number, episodeId?: string) => void;
  clearWatchHistory: () => void;
  downloads: string[];
  toggleDownload: (id: string) => void;
  isDownloaded: (id: string) => boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeChannel: LiveTVChannel | null;
  setActiveChannel: (ch: LiveTVChannel | null) => void;
  activeSportsEvent: SportsEvent | null;
  setActiveSportsEvent: (sp: SportsEvent | null) => void;
  activeMusicTrack: YouTubeMusicTrack | null;
  setActiveMusicTrack: (tr: YouTubeMusicTrack | null) => void;
  isMusicPlaying: boolean;
  setIsMusicPlaying: (p: boolean) => void;
  userProfile: UserProfile;
  updateUserProfile: (p: Partial<UserProfile>) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isAdminUnlocked: boolean;
  isAdminLockModalOpen: boolean;
  setIsAdminLockModalOpen: (open: boolean) => void;
  unlockAdminWithPassword: (pass: string) => boolean;
  lockAdmin: () => void;
  openAdminPanel: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Primary language: Bangla by default
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('arura_language');
    return (saved === 'en' ? 'en' : 'bn') as Language;
  });

  const [activeTab, setActiveTabRaw] = useState<string>('home');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('arura_admin_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminLockModalOpen, setIsAdminLockModalOpen] = useState(false);

  const setActiveTab = (tab: string) => {
    if (tab === 'admin' && !isAdminUnlocked) {
      setIsAdminLockModalOpen(true);
      return;
    }
    setActiveTabRaw(tab);
  };

  const unlockAdminWithPassword = (password: string) => {
    if (password === 'robiul1000') {
      setIsAdminUnlocked(true);
      try {
        sessionStorage.setItem('arura_admin_unlocked', 'true');
      } catch {}
      setIsAdminLockModalOpen(false);
      setActiveTabRaw('admin');
      showToast(language === 'bn' ? 'পাসওয়ার্ড সঠিক! অ্যাডমিন প্যানেল আনলক হয়েছে।' : 'Admin Panel unlocked successfully!');
      return true;
    }
    return false;
  };

  const lockAdmin = () => {
    setIsAdminUnlocked(false);
    try {
      sessionStorage.removeItem('arura_admin_unlocked');
    } catch {}
    setActiveTabRaw('home');
    showToast(language === 'bn' ? 'অ্যাডমিন প্যানেল লক করা হয়েছে' : 'Admin Panel locked');
  };

  const openAdminPanel = () => {
    if (isAdminUnlocked) {
      setActiveTabRaw('admin');
    } else {
      setIsAdminLockModalOpen(true);
    }
  };

  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState<boolean>(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<MediaItem | null>(null);

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('arura_watchlist');
      return saved ? JSON.parse(saved) : ['bn-natok-1', 'bn-movie-1'];
    } catch {
      return ['bn-natok-1', 'bn-movie-1'];
    }
  });

  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('arura_history');
      return saved ? JSON.parse(saved) : [
        { id: 'bn-natok-1', progressSeconds: 840, totalSeconds: 2880, lastWatched: '১ ঘণ্টা আগে' },
        { id: 'bn-movie-1', progressSeconds: 2400, totalSeconds: 7800, lastWatched: 'গতকাল' }
      ];
    } catch {
      return [];
    }
  });

  const [downloads, setDownloads] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('arura_downloads');
      return saved ? JSON.parse(saved) : ['bn-natok-2'];
    } catch {
      return ['bn-natok-2'];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeChannel, setActiveChannel] = useState<LiveTVChannel | null>(LIVE_CHANNELS[0]);
  const [activeSportsEvent, setActiveSportsEvent] = useState<SportsEvent | null>(LIVE_SPORTS_EVENTS[0]);
  const [activeMusicTrack, setActiveMusicTrack] = useState<YouTubeMusicTrack | null>(YOUTUBE_MUSIC_TRACKS[0]);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'আয়ান ইসলাম (Ayan Islam)',
    email: 'ayanislam10000@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    plan: 'VIP Premium',
    streamQuality: 'Auto',
    audioQuality: 'Dolby Atmos',
    appLanguage: language
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('arura_language', lang);
    setUserProfile(prev => ({ ...prev, appLanguage: lang }));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3200);
  };

  const openPlayer = (item: MediaItem, episode?: Episode) => {
    setActiveMedia(item);
    setActiveEpisode(episode || null);
    setIsPlayerOpen(true);
    // Add to history if not exists
    updateProgress(item.id, 10, 3600, episode?.id);
  };

  const closePlayer = () => {
    setIsPlayerOpen(false);
  };

  const openDetails = (item: MediaItem) => {
    setSelectedDetailItem(item);
  };

  const closeDetails = () => {
    setSelectedDetailItem(null);
  };

  const toggleWatchlist = (id: string) => {
    setWatchlist(prev => {
      let updated: string[];
      if (prev.includes(id)) {
        updated = prev.filter(item => item !== id);
        showToast(language === 'bn' ? 'ওয়াচলিস্ট থেকে বাদ দেওয়া হয়েছে' : 'Removed from Watchlist');
      } else {
        updated = [...prev, id];
        showToast(language === 'bn' ? 'ওয়াচলিস্টে যোগ করা হয়েছে' : 'Added to Watchlist');
      }
      localStorage.setItem('arura_watchlist', JSON.stringify(updated));
      return updated;
    });
  };

  const isInWatchlist = (id: string) => watchlist.includes(id);

  const updateProgress = (id: string, progressSeconds: number, totalSeconds: number, episodeId?: string) => {
    setWatchHistory(prev => {
      const filtered = prev.filter(item => item.id !== id);
      const updated = [
        {
          id,
          progressSeconds,
          totalSeconds,
          episodeId,
          lastWatched: language === 'bn' ? 'এইমাত্র' : 'Just now'
        },
        ...filtered
      ];
      localStorage.setItem('arura_history', JSON.stringify(updated.slice(0, 20)));
      return updated.slice(0, 20);
    });
  };

  const clearWatchHistory = () => {
    setWatchHistory([]);
    localStorage.removeItem('arura_history');
    showToast(language === 'bn' ? 'হিস্ট্রি মুছে ফেলা হয়েছে' : 'Watch history cleared');
  };

  const toggleDownload = (id: string) => {
    setDownloads(prev => {
      let updated: string[];
      if (prev.includes(id)) {
        updated = prev.filter(item => item !== id);
        showToast(language === 'bn' ? 'অফলাইন ডাউনলোড সরানো হয়েছে' : 'Removed from downloads');
      } else {
        updated = [...prev, id];
        showToast(language === 'bn' ? 'অফলাইন ডিভাইসে ডাউনলোড সম্পন্ন হয়েছে!' : 'Downloaded to device storage!');
      }
      localStorage.setItem('arura_downloads', JSON.stringify(updated));
      return updated;
    });
  };

  const isDownloaded = (id: string) => downloads.includes(id);

  const updateUserProfile = (patch: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...patch }));
    showToast(language === 'bn' ? 'প্রোফাইল আপডেট হয়েছে' : 'Profile updated');
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activeTab,
        setActiveTab,
        activeMedia,
        activeEpisode,
        isPlayerOpen,
        openPlayer,
        closePlayer,
        selectedDetailItem,
        openDetails,
        closeDetails,
        watchlist,
        toggleWatchlist,
        isInWatchlist,
        watchHistory,
        updateProgress,
        clearWatchHistory,
        downloads,
        toggleDownload,
        isDownloaded,
        searchQuery,
        setSearchQuery,
        activeChannel,
        setActiveChannel,
        activeSportsEvent,
        setActiveSportsEvent,
        activeMusicTrack,
        setActiveMusicTrack,
        isMusicPlaying,
        setIsMusicPlaying,
        userProfile,
        updateUserProfile,
        toastMessage,
        showToast,
        isAdminUnlocked,
        isAdminLockModalOpen,
        setIsAdminLockModalOpen,
        unlockAdminWithPassword,
        lockAdmin,
        openAdminPanel
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
