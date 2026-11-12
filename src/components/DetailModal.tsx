import React from 'react';
import { 
  X, Play, Plus, Check, Download, Share2, Star, Calendar, 
  Clock, Shield, Clapperboard, Sparkles 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DetailModal: React.FC = () => {
  const { 
    selectedDetailItem, 
    closeDetails, 
    language, 
    t, 
    openPlayer, 
    toggleWatchlist, 
    isInWatchlist,
    toggleDownload,
    isDownloaded,
    showToast 
  } = useApp();

  if (!selectedDetailItem) return null;

  const item = selectedDetailItem;
  const inWatchlist = isInWatchlist(item.id);
  const downloaded = isDownloaded(item.id);

  const title = language === 'bn' ? item.title : item.titleEn;
  const tagline = language === 'bn' ? item.tagline : item.taglineEn;
  const description = language === 'bn' ? item.description : item.descriptionEn;
  const genres = language === 'bn' ? item.genre : item.genreEn;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast(t.copied);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#171B26] border border-white/10 shadow-2xl overflow-hidden my-auto">
        
        {/* Close Button */}
        <button
          onClick={closeDetails}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center border border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Backdrop */}
        <div className="relative w-full h-64 sm:h-80 overflow-hidden">
          <img
            src={item.backdrop}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171B26] via-[#171B26]/60 to-transparent" />
          
          {/* Quick Play Float button */}
          <button
            onClick={() => {
              closeDetails();
              openPlayer(item);
            }}
            className="absolute bottom-6 left-6 sm:left-8 flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#7C4DFF] hover:bg-[#6c38f8] text-white font-bold shadow-xl shadow-[#7C4DFF]/40 hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{t.heroWatchNow}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 -mt-6 relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00D6A3]/20 text-[#00D6A3] border border-[#00D6A3]/30 uppercase">
                  {item.type.toUpperCase()}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{item.rating}</span>
                </div>
                <span className="text-xs text-[#A0A6B5]">•</span>
                <span className="text-xs text-[#A0A6B5] flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {item.year}
                </span>
                <span className="text-xs text-[#A0A6B5]">•</span>
                <span className="text-xs text-[#A0A6B5] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.duration || item.ageRating}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-gray-300">
                  {item.ageRating}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                {title}
              </h2>
              {tagline && (
                <p className="text-sm text-[#00D6A3] font-medium mt-1">
                  {tagline}
                </p>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => toggleWatchlist(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  inWatchlist
                    ? 'bg-[#00D6A3] text-black border-[#00D6A3]'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                }`}
              >
                {inWatchlist ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4" />}
                <span>{inWatchlist ? t.heroInWatchlist : t.heroAddToWatchlist}</span>
              </button>

              <button
                onClick={() => toggleDownload(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  downloaded
                    ? 'bg-[#7C4DFF] text-white border-[#7C4DFF]'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>{downloaded ? t.downloaded : t.downloadNow}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title={t.share}
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description & Genres */}
          <div className="py-6 border-b border-white/10">
            <h3 className="text-xs uppercase font-bold text-[#A0A6B5] tracking-wider mb-2">
              {language === 'bn' ? 'সারসংক্ষেপ' : 'Synopsis'}
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed max-w-3xl">
              {description}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {genres.map((g, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Cast & Director */}
          {(item.director || (item.cast && item.cast.length > 0)) && (
            <div className="py-6 border-b border-white/10">
              {item.director && (
                <div className="mb-4">
                  <span className="text-xs uppercase font-bold text-[#A0A6B5] mr-2">
                    {t.director}:
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {item.director}
                  </span>
                </div>
              )}

              {item.cast && item.cast.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase font-bold text-[#A0A6B5] tracking-wider mb-3">
                    {t.cast}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {item.cast.map((actor, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5">
                        <img
                          src={actor.avatar}
                          alt={actor.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#7C4DFF]"
                        />
                        <div>
                          <div className="text-xs font-semibold text-white">
                            {language === 'bn' ? actor.name : actor.nameEn}
                          </div>
                          <div className="text-[10px] text-[#A0A6B5]">
                            {actor.role}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Seasons & Episodes if Available */}
          {item.seasons && item.seasons.length > 0 && (
            <div className="py-6">
              <h3 className="text-lg font-bold text-white mb-4">
                {t.episodes}
              </h3>

              <div className="space-y-4">
                {item.seasons.map((season) => (
                  <div key={season.seasonNumber}>
                    <div className="text-xs font-bold text-[#00D6A3] uppercase tracking-wider mb-3">
                      {language === 'bn' ? season.title : season.titleEn}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {season.episodes.map((ep) => (
                        <div
                          key={ep.id}
                          onClick={() => {
                            closeDetails();
                            openPlayer(item, ep);
                          }}
                          className="group/ep flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#7C4DFF]/50 cursor-pointer transition-all"
                        >
                          <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={ep.thumbnail} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 group-hover/ep:bg-[#7C4DFF]/60 flex items-center justify-center transition-colors">
                              <Play className="w-5 h-5 text-white fill-current" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-white line-clamp-1 group-hover/ep:text-[#00D6A3]">
                              {language === 'bn' ? ep.title : ep.titleEn}
                            </div>
                            <div className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                              {language === 'bn' ? ep.description : ep.descriptionEn}
                            </div>
                            <div className="text-[10px] text-[#A0A6B5] mt-1">
                              {ep.duration}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
