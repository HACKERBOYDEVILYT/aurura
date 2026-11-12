import React from 'react';
import { Play, Plus, Check, Star, Info } from 'lucide-react';
import { MediaItem } from '../types';
import { useApp } from '../context/AppContext';

interface MediaCardProps {
  item: MediaItem;
  size?: 'normal' | 'large' | 'compact';
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, size = 'normal' }) => {
  const { language, openPlayer, openDetails, toggleWatchlist, isInWatchlist } = useApp();
  const inWatchlist = isInWatchlist(item.id);

  const title = language === 'bn' ? item.title : item.titleEn;
  const genres = language === 'bn' ? item.genre : item.genreEn;

  const typeLabels: Record<string, { bn: string; en: string }> = {
    natok: { bn: 'নাটক', en: 'Drama' },
    telefilm: { bn: 'টেলিফিল্ম', en: 'Telefilm' },
    movie: { bn: 'সিনেমা', en: 'Movie' },
    series: { bn: 'সিরিজ', en: 'Series' },
    sports: { bn: 'খেলা', en: 'Sports' },
    live_tv: { bn: 'লাইভ', en: 'Live TV' }
  };

  const typeInfo = typeLabels[item.type] || { bn: 'কনটেন্ট', en: 'Media' };

  return (
    <div className="group relative rounded-xl overflow-hidden bg-[#171B26] border border-white/5 hover:border-[#7C4DFF]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#7C4DFF]/10 flex flex-col justify-between">
      {/* Poster Image Container */}
      <div className={`relative w-full overflow-hidden ${size === 'large' ? 'aspect-[16/10]' : size === 'compact' ? 'aspect-[2/3]' : 'aspect-[2/3]'}`}>
        <img
          src={item.poster}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#171B26] via-transparent to-black/30 opacity-80 group-hover:opacity-95 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-black/60 backdrop-blur-md text-white border border-white/10">
            {language === 'bn' ? typeInfo.bn : typeInfo.en}
          </span>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold bg-[#090B10]/80 backdrop-blur-md text-amber-400 border border-white/10">
            <Star className="w-3 h-3 fill-current" />
            <span>{item.rating}</span>
          </div>
        </div>

        {/* Quick Action Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 backdrop-blur-[2px]">
          <button
            onClick={() => openPlayer(item)}
            className="w-12 h-12 rounded-full bg-[#7C4DFF] hover:bg-[#6c38f8] text-white flex items-center justify-center shadow-lg transform hover:scale-110 active:scale-95 transition-all"
            title="Watch Now"
          >
            <Play className="w-6 h-6 fill-current translate-x-0.5" />
          </button>
          
          <button
            onClick={() => openDetails(item)}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-all"
            title="View Details"
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            onClick={() => toggleWatchlist(item.id)}
            className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
              inWatchlist ? 'bg-[#00D6A3] text-black font-bold' : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            title="Watchlist"
          >
            {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Card Info Content */}
      <div className="p-3">
        <h4 className="font-semibold text-sm text-white line-clamp-1 group-hover:text-[#00D6A3] transition-colors">
          {title}
        </h4>
        
        <div className="flex items-center justify-between text-[11px] text-[#A0A6B5] mt-1">
          <div className="flex items-center gap-1.5">
            <span>{item.year}</span>
            <span>•</span>
            <span>{item.duration || item.ageRating}</span>
          </div>
          <span className="text-[10px] text-gray-400 px-1 py-0.5 rounded bg-white/5">
            {genres[0] || 'Drama'}
          </span>
        </div>
      </div>
    </div>
  );
};
