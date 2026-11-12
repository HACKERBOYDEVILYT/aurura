import React, { useState } from 'react';
import { Film, Tv, Filter, Search, Star, Clapperboard } from 'lucide-react';
import { MEDIA_CATALOG } from '../data/catalog';
import { MediaCard } from './MediaCard';
import { useApp } from '../context/AppContext';
import { ContentType } from '../types';

interface CatalogViewProps {
  type: 'movie' | 'series';
}

export const CatalogView: React.FC<CatalogViewProps> = ({ type }) => {
  const { language, t } = useApp();
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [filterRating, setFilterRating] = useState<number>(0);

  const isMovie = type === 'movie';
  const title = isMovie ? t.topMovies : t.exclusiveSeries;

  const genres = isMovie 
    ? ['All', 'Action', 'Sci-Fi', 'Drama', 'Mystery', 'Romance', 'Thriller']
    : ['All', 'Mystery', 'Crime', 'Drama', 'Sci-Fi', 'Thriller'];

  const rawItems = MEDIA_CATALOG.filter(m => m.type === type);

  const filteredItems = rawItems.filter(item => {
    if (selectedGenre !== 'All') {
      const matchGenre = item.genreEn.includes(selectedGenre) || item.genre.includes(selectedGenre);
      if (!matchGenre) return false;
    }
    if (filterRating > 0 && item.rating < filterRating) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            {isMovie ? (
              <Film className="w-6 h-6 text-[#00D6A3]" />
            ) : (
              <Tv className="w-6 h-6 text-[#7C4DFF]" />
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {title}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#A0A6B5] mt-1">
            {isMovie
              ? (language === 'bn' ? 'বাংলা ও বিশ্বমানের ব্লকবাস্টার পূর্ণদৈর্ঘ্য সিনেমার সমাহার' : 'Blockbuster Bangla and international feature films')
              : (language === 'bn' ? 'টানটান উত্তেজনার প্রিমিয়ার ওয়েব সিরিজ ও সিজনাল এপিসোড' : 'Binge-worthy acclaimed series and multi-season mystery')}
          </p>
        </div>

        {/* Genre Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedGenre === g
                  ? 'bg-[#7C4DFF] text-white shadow-lg shadow-[#7C4DFF]/30'
                  : 'bg-[#171B26] text-[#A0A6B5] hover:text-white border border-white/5'
              }`}
            >
              {g === 'All' ? t.categoryAll : g}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#171B26] border border-white/5 max-w-md mx-auto">
          <Clapperboard className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">
            {language === 'bn' ? 'কোনো কনটেন্ট পাওয়া যায়নি' : 'No items found'}
          </h3>
          <button
            onClick={() => setSelectedGenre('All')}
            className="mt-3 px-4 py-2 rounded-xl bg-[#7C4DFF] text-white text-xs font-semibold"
          >
            {t.categoryAll}
          </button>
        </div>
      )}
    </div>
  );
};
