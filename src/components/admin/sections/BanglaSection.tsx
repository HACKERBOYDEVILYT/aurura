import React, { useState } from 'react';
import { Clapperboard, Star, Plus, CheckCircle2, Search, Play, UserCheck } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MediaItem } from '../../../types';

interface BanglaSectionProps {
  items: MediaItem[];
  onRefresh: () => void;
}

export const BanglaSection: React.FC<BanglaSectionProps> = ({ items, onRefresh }) => {
  const { language, openPlayer, showToast } = useApp();
  const [selectedStar, setSelectedStar] = useState<string>('all');
  const [search, setSearch] = useState('');

  const banglaItems = items.filter(i => i.isBanglaHub || i.starCategory || i.genre.includes('নাটক'));

  const stars = [
    'all',
    'Afran Nisho',
    'Mosharraf Karim',
    'Chanchal Chowdhury',
    'Mehazabien Chowdhury',
    'Ziaul Faruq Apurba',
    'Siam Ahmed'
  ];

  const filteredItems = banglaItems.filter(item => {
    const matchesStar = selectedStar === 'all' || item.starCategory === selectedStar;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.titleEn.toLowerCase().includes(search.toLowerCase());
    return matchesStar && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#171B26] border border-white/10">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Clapperboard className="w-5 h-5 text-amber-400" />
            <span>{language === 'bn' ? 'বাংলা বিনোদন হাব ও তারকা ব্যবস্থাপনা' : 'Bangla Entertainment Hub & Stars'}</span>
          </h2>
          <p className="text-xs text-[#A0A6B5] mt-0.5">
            {language === 'bn' ? 'বাংলা নাটক, টেলিফিল্ম, ওয়েব সিরিজ এবং শীর্ষ তারকা ভিত্তিক কিউরেশন' : 'Curate Bangla Natok, Telefilms, Web Series, and celebrity categories'}
          </p>
        </div>
      </div>

      {/* Star Chips Filter */}
      <div className="p-3 rounded-2xl bg-[#171B26] border border-white/10 space-y-2">
        <span className="text-[11px] font-bold text-[#A0A6B5] uppercase tracking-wider block">
          {language === 'bn' ? 'জনপ্রিয় তারকা ফিল্টার' : 'Popular Star Filters'}
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {stars.map((star) => (
            <button
              key={star}
              onClick={() => setSelectedStar(star)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStar === star
                  ? 'bg-amber-400 text-black font-bold shadow-md shadow-amber-400/20'
                  : 'bg-[#090B10] text-[#A0A6B5] hover:text-white border border-white/5'
              }`}
            >
              {star === 'all' ? (language === 'bn' ? 'সকল তারকা' : 'All Stars') : star}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="rounded-2xl bg-[#171B26] border border-white/10 overflow-hidden shadow-lg group hover:border-amber-400/40 transition-all flex flex-col justify-between">
            <div className="relative aspect-video overflow-hidden">
              <img
                src={item.backdrop || item.poster}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171B26] via-transparent to-transparent" />
              
              <div className="absolute top-2 left-2 flex gap-1">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400/90 text-black">
                  {item.starCategory || 'বাংলা স্পেশাল'}
                </span>
              </div>

              <button
                onClick={() => openPlayer(item)}
                className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-amber-400 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <Play className="w-4 h-4 fill-current translate-x-0.5" />
              </button>
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-white text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-400">{item.titleEn} ({item.year})</p>
                </div>
                <span className="text-xs font-bold text-amber-400 shrink-0">
                  ★ {item.rating}
                </span>
              </div>

              <p className="text-xs text-[#A0A6B5] line-clamp-2">
                {item.description}
              </p>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                <span>পরিচালক: <strong className="text-gray-200">{item.director || 'আরুরা ক্রিয়েটিভস'}</strong></span>
                <span className="text-[#00D6A3] font-bold">Bangla Hub</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
