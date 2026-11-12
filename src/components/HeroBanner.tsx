import React, { useState, useEffect } from 'react';
import { Play, Plus, Check, Info, Star, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { MediaItem } from '../types';
import { useApp } from '../context/AppContext';

interface HeroBannerProps {
  featuredItems: MediaItem[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ featuredItems }) => {
  const { language, t, openPlayer, openDetails, toggleWatchlist, isInWatchlist } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const current = featuredItems[currentIndex] || featuredItems[0];
  const inWatchlist = current ? isInWatchlist(current.id) : false;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [featuredItems.length]);

  if (!current) return null;

  const title = language === 'bn' ? current.title : current.titleEn;
  const tagline = language === 'bn' ? (current.tagline || current.description) : (current.taglineEn || current.descriptionEn);
  const genres = language === 'bn' ? current.genre : current.genreEn;

  return (
    <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[640px] overflow-hidden rounded-2xl border border-white/10 mb-8 shadow-2xl">
      {/* Background Image / Backdrop */}
      <div className="absolute inset-0">
        <img
          src={current.backdrop}
          alt={title}
          className="w-full h-full object-cover object-center transition-all duration-1000 scale-105"
        />
        {/* Cinematic Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090B10] via-[#090B10]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090B10] via-[#090B10]/80 to-transparent" />
      </div>

      {/* Floating Content Details */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col justify-end pb-12 lg:pb-16">
        
        {/* Top Highlight Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#7C4DFF] text-white shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#00D6A3]" />
            {language === 'bn' ? 'এক্সক্লুসিভ ফিচার্ড' : 'Exclusive Featured'}
          </span>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md text-amber-400 border border-white/10">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{current.rating} IMDb</span>
          </div>
          <span className="text-xs text-[#A0A6B5] hidden sm:inline">
            {current.year} • {current.duration || current.ageRating}
          </span>
        </div>

        {/* Big Bold Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-md max-w-3xl">
          {title}
        </h1>

        {/* Tagline / Synopsis */}
        <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-2xl line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow">
          {tagline}
        </p>

        {/* Genre Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {genres.map((g, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-gray-200 border border-white/5"
            >
              {g}
            </span>
          ))}
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-[#00D6A3] border border-[#00D6A3]/30 font-semibold">
            4K Ultra HD • Dolby 5.1
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6">
          <button
            onClick={() => openPlayer(current)}
            className="flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#6c38f8] hover:from-[#6c38f8] hover:to-[#5822e8] text-white font-bold text-sm sm:text-base shadow-xl shadow-[#7C4DFF]/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{t.heroWatchNow}</span>
          </button>

          <button
            onClick={() => toggleWatchlist(current.id)}
            className={`flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl backdrop-blur-md border text-sm font-semibold transition-all ${
              inWatchlist
                ? 'bg-[#00D6A3] text-black border-[#00D6A3]'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
            }`}
          >
            {inWatchlist ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4" />}
            <span>{inWatchlist ? t.heroInWatchlist : t.heroAddToWatchlist}</span>
          </button>

          <button
            onClick={() => openDetails(current)}
            className="flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white text-sm font-semibold transition-all"
          >
            <Info className="w-4 h-4" />
            <span>{t.heroDetails}</span>
          </button>
        </div>

        {/* Slide navigation bullets & sound toggle */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            {featuredItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-8 bg-[#00D6A3]' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="text-xs text-[#A0A6B5] flex items-center gap-2">
            <span>{currentIndex + 1} / {featuredItems.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
