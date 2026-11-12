import React from 'react';
import { Search, Clapperboard, X } from 'lucide-react';
import { MEDIA_CATALOG, LIVE_CHANNELS, LIVE_SPORTS_EVENTS } from '../data/catalog';
import { MediaCard } from './MediaCard';
import { useApp } from '../context/AppContext';

export const SearchResultsView: React.FC = () => {
  const { searchQuery, setSearchQuery, language, t } = useApp();

  const query = searchQuery.trim().toLowerCase();

  const matchedMedia = MEDIA_CATALOG.filter(item => {
    const inTitle = item.title.toLowerCase().includes(query) || item.titleEn.toLowerCase().includes(query);
    const inCast = item.cast?.some(c => c.name.toLowerCase().includes(query) || c.nameEn.toLowerCase().includes(query));
    const inGenre = item.genre.some(g => g.toLowerCase().includes(query)) || item.genreEn.some(g => g.toLowerCase().includes(query));
    const inDirector = item.director?.toLowerCase().includes(query);
    return inTitle || inCast || inGenre || inDirector;
  });

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-[#00D6A3]" />
          <div>
            <h2 className="text-xl font-bold text-white">
              {t.searchResults}: "{searchQuery}"
            </h2>
            <p className="text-xs text-[#A0A6B5]">
              {matchedMedia.length} {language === 'bn' ? 'টি ফলাফল পাওয়া গেছে' : 'results matched'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSearchQuery('')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white"
        >
          <X className="w-4 h-4" />
          <span>{language === 'bn' ? 'অনুসন্ধান মুছুন' : 'Clear Search'}</span>
        </button>
      </div>

      {matchedMedia.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {matchedMedia.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-2xl bg-[#171B26] border border-white/5 max-w-md mx-auto">
          <Clapperboard className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">
            {t.noResults}
          </h3>
          <p className="text-xs text-gray-400">
            {language === 'bn' 
              ? 'অন্য কোনো নাটক, সিনেমা, বা তারকার নাম দিয়ে চেষ্টা করুন।' 
              : 'Try searching for other movies, series, or actor names.'}
          </p>
        </div>
      )}
    </div>
  );
};
