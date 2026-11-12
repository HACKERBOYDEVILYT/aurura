import React, { useState } from 'react';
import { Clapperboard, Star, Sparkles, Filter, UserCheck, Flame } from 'lucide-react';
import { MEDIA_CATALOG, BANGLA_STARS } from '../data/catalog';
import { MediaCard } from './MediaCard';
import { useApp } from '../context/AppContext';

export const BanglaHubView: React.FC = () => {
  const { language, t } = useApp();
  const [selectedSubtype, setSelectedSubtype] = useState<string>('all');
  const [selectedStar, setSelectedStar] = useState<string>('all');

  const banglaItems = MEDIA_CATALOG.filter(item => item.isBanglaHub);

  const filteredItems = banglaItems.filter(item => {
    if (selectedSubtype !== 'all' && item.type !== selectedSubtype) return false;
    if (selectedStar !== 'all') {
      const matchStarCategory = item.starCategory?.toLowerCase().includes(selectedStar.toLowerCase());
      const matchCast = item.cast?.some(c => c.nameEn.toLowerCase().includes(selectedStar.toLowerCase()));
      if (!matchStarCategory && !matchCast) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="relative rounded-2xl overflow-hidden p-6 sm:p-10 bg-gradient-to-r from-[#171B26] via-[#202636] to-[#171B26] border border-[#7C4DFF]/30 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#00D6A3]/20 text-[#00D6A3] border border-[#00D6A3]/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'এক্সক্লুসিভ বাংলা হাব' : 'Exclusive Bangla Hub'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {language === 'bn' ? 'বাংলা নাটক, টেলিফিল্ম ও সিনেমা' : 'Bangla Natok, Telefilm & Cinema'}
          </h1>
          <p className="mt-2 text-sm text-gray-300 leading-relaxed">
            {language === 'bn'
              ? 'মোশাররফ করিম, আফরান নিশো, চঞ্চল চৌধুরী ও মেহজাবীন চৌধুরীর কালজয়ী নাটক, রোমান্টিক টেলিফিল্ম এবং আন্তর্জাতিক পুরস্কারপ্রাপ্ত বাংলা সিনেমা এক জায়গায়।'
              : 'The finest collection of Bengali dramas, romantic telefilms, thrillers and award-winning cinema starring the legends of Bangladesh.'}
          </p>
        </div>

        {/* Background Decorative Gradient glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#7C4DFF]/20 to-transparent pointer-events-none" />
      </div>

      {/* Star / Celebrity Filter Carousel */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#00D6A3]" />
          <span>{t.banglaStars}</span>
        </h3>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setSelectedStar('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedStar === 'all'
                ? 'bg-[#00D6A3] text-black border-[#00D6A3] font-bold shadow-lg shadow-[#00D6A3]/20'
                : 'bg-[#171B26] text-gray-300 border-white/5 hover:border-white/20'
            }`}
          >
            {language === 'bn' ? 'সকল তারকা' : 'All Stars'}
          </button>

          {BANGLA_STARS.map((star) => {
            const isSelected = selectedStar === star.filterKey;
            const starName = language === 'bn' ? star.name : star.nameEn;
            return (
              <button
                key={star.filterKey}
                onClick={() => setSelectedStar(isSelected ? 'all' : star.filterKey)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#7C4DFF] text-white border-[#7C4DFF] shadow-lg shadow-[#7C4DFF]/30'
                    : 'bg-[#171B26] text-gray-300 border-white/5 hover:border-white/20'
                }`}
              >
                <img
                  src={star.avatar}
                  alt={starName}
                  className="w-7 h-7 rounded-full object-cover border border-[#00D6A3]"
                />
                <span className="text-xs font-semibold">{starName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtype Filters (All, Natok, Telefilm, Movie, Series) */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: language === 'bn' ? 'সকল কনটেন্ট' : 'All Content' },
            { id: 'natok', label: language === 'bn' ? 'বাংলা নাটক' : 'Natok' },
            { id: 'telefilm', label: language === 'bn' ? 'টেলিফিল্ম' : 'Telefilms' },
            { id: 'movie', label: language === 'bn' ? 'বাংলা সিনেমা' : 'Bangla Movies' },
            { id: 'series', label: language === 'bn' ? 'ওয়েব সিরিজ' : 'Web Series' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedSubtype(type.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedSubtype === type.id
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'text-[#A0A6B5] hover:text-white'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#A0A6B5]">
          {filteredItems.length} {language === 'bn' ? 'টি পাওয়া গেছে' : 'items found'}
        </span>
      </div>

      {/* Catalog Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#171B26] border border-white/5">
          <Clapperboard className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">
            {language === 'bn' ? 'এই ফিল্টারে কোনো কনটেন্ট পাওয়া যায়নি' : 'No items match your selected filter'}
          </h3>
          <button
            onClick={() => {
              setSelectedSubtype('all');
              setSelectedStar('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#7C4DFF] text-white text-xs font-semibold"
          >
            {language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
          </button>
        </div>
      )}
    </div>
  );
};
