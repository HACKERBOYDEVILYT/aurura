import React, { useState } from 'react';
import { 
  Heart, History, Download, Trash2, Play, HardDrive, 
  Check, ArrowRight, Film, Clock, Sparkles 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MEDIA_CATALOG } from '../data/catalog';
import { MediaCard } from './MediaCard';
import { MediaItem } from '../types';

export const LibraryView: React.FC = () => {
  const { 
    language, 
    t, 
    watchlist, 
    toggleWatchlist, 
    watchHistory, 
    clearWatchHistory, 
    downloads, 
    toggleDownload, 
    openPlayer 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'watchlist' | 'history' | 'downloads'>('watchlist');

  // Resolve items
  const watchlistItems = watchlist
    .map(id => MEDIA_CATALOG.find(m => m.id === id))
    .filter((item): item is MediaItem => Boolean(item));

  const downloadItems = downloads
    .map(id => MEDIA_CATALOG.find(m => m.id === id))
    .filter((item): item is MediaItem => Boolean(item));

  const historyItems = watchHistory
    .map(hist => {
      const media = MEDIA_CATALOG.find(m => m.id === hist.id);
      return media ? { ...hist, media } : null;
    })
    .filter(Boolean);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    return `${m} min`;
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.navLibrary}
          </h1>
          <p className="text-xs sm:text-sm text-[#A0A6B5] mt-1">
            {language === 'bn' 
              ? 'আপনার ওয়াচলিস্ট, কন্টিনিউ ওয়াচিং এবং অফলাইন ডাউনলোডকৃত কনটেন্ট' 
              : 'Your saved watchlist, continue watching queue, and offline downloads'}
          </p>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#171B26] border border-white/10">
          <button
            onClick={() => setActiveSubTab('watchlist')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'watchlist'
                ? 'bg-[#7C4DFF] text-white shadow-md'
                : 'text-[#A0A6B5] hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>{t.myWatchlist} ({watchlist.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'history'
                ? 'bg-[#7C4DFF] text-white shadow-md'
                : 'text-[#A0A6B5] hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{t.watchHistory}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('downloads')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'downloads'
                ? 'bg-[#7C4DFF] text-white shadow-md'
                : 'text-[#A0A6B5] hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.downloads} ({downloads.length})</span>
          </button>
        </div>
      </div>

      {/* WATCHLIST SUB TAB */}
      {activeSubTab === 'watchlist' && (
        <div>
          {watchlistItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {watchlistItems.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-[#171B26] border border-white/5 max-w-lg mx-auto">
              <Heart className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">
                {t.noWatchlist}
              </h3>
              <p className="text-xs text-gray-400">
                {language === 'bn' 
                  ? 'হোম অথবা বাংলা হাব থেকে আপনার পছন্দের নাটক ও সিনেমা ওয়াচলিস্টে যুক্ত করুন।' 
                  : 'Browse movies and series from Home or Bangla Hub and save them here.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* WATCH HISTORY SUB TAB */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A0A6B5]">
              {historyItems.length} {language === 'bn' ? 'টি কনটেন্ট চালু করা হয়েছিল' : 'items recently watched'}
            </span>
            {historyItems.length > 0 && (
              <button
                onClick={clearWatchHistory}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.clearHistory}</span>
              </button>
            )}
          </div>

          {historyItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {historyItems.map((item: any) => {
                const media: MediaItem = item.media;
                const progressPct = Math.min(
                  100, 
                  Math.round((item.progressSeconds / (item.totalSeconds || 1)) * 100)
                );
                const title = language === 'bn' ? media.title : media.titleEn;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#171B26] border border-white/5 hover:border-[#7C4DFF]/40 transition-all flex flex-col justify-between group"
                  >
                    <div className="flex gap-3">
                      <div className="relative w-24 aspect-[2/3] rounded-xl overflow-hidden flex-shrink-0">
                        <img src={media.poster} alt={title} className="w-full h-full object-cover" />
                        <button
                          onClick={() => openPlayer(media)}
                          className="absolute inset-0 bg-black/40 group-hover:bg-[#7C4DFF]/60 flex items-center justify-center transition-colors"
                        >
                          <Play className="w-6 h-6 text-white fill-current" />
                        </button>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-[#00D6A3]">
                            {title}
                          </h4>
                          <span className="text-[11px] text-gray-400 mt-0.5 block">
                            {media.duration || 'Feature'}
                          </span>
                          <span className="text-[10px] text-[#A0A6B5] mt-1 block">
                            {language === 'bn' ? 'সর্বশেষ:' : 'Watched:'} {item.lastWatched}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                            <span>{progressPct}% {language === 'bn' ? 'সম্পন্ন' : 'completed'}</span>
                            <span>{formatSeconds(item.progressSeconds)}</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#7C4DFF] to-[#00D6A3] rounded-full"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => openPlayer(media)}
                      className="mt-3 w-full py-2 rounded-xl bg-white/5 hover:bg-[#7C4DFF] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{t.playerResume}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-[#171B26] border border-white/5 max-w-lg mx-auto">
              <History className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">
                {t.noHistory}
              </h3>
            </div>
          )}
        </div>
      )}

      {/* DOWNLOADS SUB TAB */}
      {activeSubTab === 'downloads' && (
        <div className="space-y-6">
          {/* Simulated Device Storage Gauge */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#171B26] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00D6A3]/20 flex items-center justify-center text-[#00D6A3]">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-[#A0A6B5] uppercase font-bold">
                  {t.storageUsed}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  1.4 GB / 32 GB {language === 'bn' ? 'ব্যবহৃত' : 'Used'}
                </div>
              </div>
            </div>

            <div className="w-full sm:w-64">
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#00D6A3] w-[18%] rounded-full" />
              </div>
              <div className="text-[10px] text-gray-400 text-right mt-1">
                {language === 'bn' ? '৩০.৬ জিবি ফাঁকা রয়েছে' : '30.6 GB Free on Device'}
              </div>
            </div>
          </div>

          {/* Downloaded Content List */}
          {downloadItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {downloadItems.map((item) => {
                const title = language === 'bn' ? item.title : item.titleEn;
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#171B26] border border-white/5 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={item.poster} alt="" className="w-14 aspect-[2/3] rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-white line-clamp-1">
                          {title}
                        </h4>
                        <span className="text-[10px] text-[#00D6A3] flex items-center gap-1 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>{language === 'bn' ? 'অফলাইন প্রস্তুত' : 'Offline Ready (1080p)'}</span>
                        </span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          480 MB • MP4 High
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => openPlayer(item)}
                        className="p-2 rounded-xl bg-[#7C4DFF] hover:bg-[#6c38f8] text-white"
                        title="Play Offline"
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                      <button
                        onClick={() => toggleDownload(item.id)}
                        className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                        title="Delete Download"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-[#171B26] border border-white/5 max-w-lg mx-auto">
              <Download className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">
                {t.noDownloads}
              </h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
