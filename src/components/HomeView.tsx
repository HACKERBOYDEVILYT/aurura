import React, { useState } from 'react';
import { 
  Sparkles, Flame, Clapperboard, Film, Tv, Radio, Trophy, 
  ArrowRight, Star, Play, ChevronRight 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MEDIA_CATALOG, LIVE_CHANNELS, LIVE_SPORTS_EVENTS, BANGLA_STARS } from '../data/catalog';
import { HeroBanner } from './HeroBanner';
import { MediaCard } from './MediaCard';

export const HomeView: React.FC = () => {
  const { language, t, setActiveTab, openPlayer, setActiveChannel, setActiveSportsEvent } = useApp();
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  const genres = ['All', 'Romance', 'Drama', 'Thriller', 'Action', 'Sci-Fi', 'Mystery'];

  const featuredItems = MEDIA_CATALOG.filter(m => m.isFeatured);
  const trendingItems = MEDIA_CATALOG.filter(m => m.isTrending);
  const banglaNatokItems = MEDIA_CATALOG.filter(m => m.type === 'natok' || m.type === 'telefilm');
  const movieItems = MEDIA_CATALOG.filter(m => m.type === 'movie');
  const seriesItems = MEDIA_CATALOG.filter(m => m.type === 'series');

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Cinematic Hero Slider */}
      <HeroBanner featuredItems={featuredItems} />

      {/* AI Mood Recommender Quick Banner */}
      <div 
        onClick={() => setActiveTab('ai_discovery')}
        className="relative overflow-hidden rounded-2xl p-4 sm:p-6 bg-gradient-to-r from-[#7C4DFF]/20 via-[#171B26] to-[#00D6A3]/20 border border-[#7C4DFF]/40 cursor-pointer hover:border-[#00D6A3] transition-all group shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C4DFF] to-[#00D6A3] flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-white">
                  {language === 'bn' ? 'কী দেখতে চান? আপনার মুড অনুযায়ী এআই সাজেশন নিন' : 'What do you feel like watching? Ask Arura AI'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00D6A3] text-black">
                  AI 3.8
                </span>
              </div>
              <p className="text-xs text-[#A0A6B5] mt-0.5 line-clamp-1">
                {language === 'bn' 
                  ? 'যেমন: "আজ খুব মন খারাপ, একটা আবেগঘন বাংলা নাটক দেখতে চাই..."' 
                  : 'E.g., "I feel sad today, recommend an emotional Bangla drama..."'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-[#00D6A3] group-hover:translate-x-1 transition-transform self-end sm:self-center">
            <span>{language === 'bn' ? 'এআই মুড রিকমেন্ডার খুলুন' : 'Open AI Recommender'}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Live Sports Ticker Highlight */}
      <div className="p-4 rounded-2xl bg-[#171B26] border border-white/5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#00D6A3]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.liveSportsMatches}
            </h3>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-600 text-white animate-pulse">
              LIVE
            </span>
          </div>
          <button
            onClick={() => setActiveTab('sports')}
            className="text-xs text-[#00D6A3] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>{language === 'bn' ? 'সকল ম্যাচ' : 'View All'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {LIVE_SPORTS_EVENTS.slice(0, 2).map((sp) => (
            <div
              key={sp.id}
              onClick={() => {
                setActiveSportsEvent(sp);
                setActiveTab('sports');
              }}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#7C4DFF]/40 cursor-pointer flex items-center justify-between gap-3 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{sp.teamA.flag}</span>
                <div>
                  <div className="text-xs font-bold text-white">
                    {language === 'bn' ? sp.teamA.name : sp.teamA.nameEn} vs {language === 'bn' ? sp.teamB.name : sp.teamB.nameEn}
                  </div>
                  <div className="text-[11px] text-[#00D6A3] font-mono mt-0.5 font-bold">
                    {sp.teamA.score || sp.time}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 px-2 py-1 rounded bg-black/40">
                {language === 'bn' ? sp.tournament : sp.tournamentEn}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TRENDING NOW ROW */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-400" />
            <span>{t.trendingNow}</span>
          </h2>
          <button
            onClick={() => setActiveTab('movies')}
            className="text-xs text-[#00D6A3] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>{language === 'bn' ? 'আরও দেখুন' : 'Explore All'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {trendingItems.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* POPULAR BANGLA NATOK & TELEFILMS ROW */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
              <Clapperboard className="w-6 h-6 text-[#7C4DFF]" />
              <span>{t.popularBanglaNatok}</span>
            </h2>
            <p className="text-xs text-[#A0A6B5] mt-0.5">
              {language === 'bn' 
                ? 'আফরান নিশো, মেহজাবীন ও চঞ্চল চৌধুরীর শীর্ষ অভিনীত নাটক' 
                : 'Highest rated emotional Bengali dramas and telefilms'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('bangla_hub')}
            className="text-xs text-[#00D6A3] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>{language === 'bn' ? 'বাংলা হাব' : 'Bangla Hub'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {banglaNatokItems.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* TOP MOVIES ROW */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Film className="w-6 h-6 text-[#00D6A3]" />
            <span>{t.topMovies}</span>
          </h2>
          <button
            onClick={() => setActiveTab('movies')}
            className="text-xs text-[#00D6A3] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>{language === 'bn' ? 'সকল সিনেমা' : 'All Movies'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {movieItems.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* EXCLUSIVE SERIES ROW */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Tv className="w-6 h-6 text-[#7C4DFF]" />
            <span>{t.exclusiveSeries}</span>
          </h2>
          <button
            onClick={() => setActiveTab('series')}
            className="text-xs text-[#00D6A3] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>{language === 'bn' ? 'সকল সিরিজ' : 'All Series'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {seriesItems.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* LIVE TV CHANNELS QUICK ROW */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Radio className="w-6 h-6 text-red-500 animate-pulse" />
            <span>{t.liveTvChannels}</span>
          </h2>
          <button
            onClick={() => setActiveTab('live_tv')}
            className="text-xs text-[#00D6A3] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>{language === 'bn' ? 'লাইভ টিভি গাইড (EPG)' : 'Full TV Guide'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {LIVE_CHANNELS.map((ch) => (
            <div
              key={ch.id}
              onClick={() => {
                setActiveChannel(ch);
                setActiveTab('live_tv');
              }}
              className="p-3 rounded-xl bg-[#171B26] border border-white/5 hover:border-[#7C4DFF]/50 cursor-pointer transition-all group flex flex-col justify-between"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black mb-2">
                <img src={ch.logo} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-red-600 text-white animate-pulse">
                  LIVE
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#00D6A3]">
                  {language === 'bn' ? ch.name : ch.nameEn}
                </h4>
                <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                  {language === 'bn' ? ch.currentShow : ch.currentShowEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
