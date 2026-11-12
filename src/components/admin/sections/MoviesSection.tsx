import React, { useState } from 'react';
import { 
  Film, Plus, Search, Trash2, Edit2, Play, Eye, 
  CheckCircle2, AlertCircle, X, ExternalLink, Filter 
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MediaItem } from '../../../types';

interface MoviesSectionProps {
  movies: MediaItem[];
  onRefresh: () => void;
}

export const MoviesSection: React.FC<MoviesSectionProps> = ({ movies, onRefresh }) => {
  const { language, openPlayer, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    director: '',
    year: '2026',
    rating: '8.8',
    ageRating: '13+',
    genres: 'নাটক, থ্রিলার',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?q=80&w=1600&auto=format&fit=crop',
    description: 'আরুরার অনুমোদিত প্রিমিয়াম বাংলা সিনেমা।',
    descriptionEn: 'Authorized Arura original cinema release.',
    isTrending: true,
    isFeatured: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredMovies = movies.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || 
                          m.titleEn.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || m.genre.includes(selectedGenre) || m.genreEn.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(language === 'bn' ? `আপনি কি নিশ্চিতভাবে "${title}" মুছে ফেলতে চান?` : `Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/v1/movies/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(language === 'bn' ? 'সিনেমা সফলভাবে মুছে ফেলা হয়েছে' : 'Movie deleted successfully');
        onRefresh();
      }
    } catch {
      showToast('Failed to delete movie');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const genreArr = formData.genres.split(',').map(s => s.trim()).filter(Boolean);
      const payload = {
        type: 'movie',
        title: formData.title,
        titleEn: formData.titleEn || formData.title,
        director: formData.director || 'Arura Studios',
        year: parseInt(formData.year) || 2026,
        rating: parseFloat(formData.rating) || 8.5,
        ageRating: formData.ageRating,
        genre: genreArr,
        genreEn: genreArr,
        streamUrl: formData.streamUrl,
        poster: formData.poster,
        backdrop: formData.backdrop,
        description: formData.description,
        descriptionEn: formData.descriptionEn,
        isTrending: formData.isTrending,
        isFeatured: formData.isFeatured
      };

      const res = await fetch('/api/v1/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(language === 'bn' ? 'সিনেমা সফলভাবে যুক্ত হয়েছে' : 'Movie saved successfully');
        setShowAddModal(false);
        setEditingItem(null);
        onRefresh();
      }
    } catch {
      showToast('Error saving movie');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#171B26] border border-white/10">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-[#7C4DFF]" />
            <span>{language === 'bn' ? 'সিনেমা ও মুভি ক্যাটালগ কন্ট্রোল' : 'Movie Catalog Management'}</span>
          </h2>
          <p className="text-xs text-[#A0A6B5] mt-0.5">
            {language === 'bn' ? 'সরাসরি ব্যাকএন্ড ক্যাটালগ এডিট, পাবলিশ, স্ট্রিমিং সোর্স এবং মেটাডাটা ব্যবস্থাপনা' : 'Manage metadata, HLS sources, poster art and publishing states'}
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              title: '',
              titleEn: '',
              director: '',
              year: '2026',
              rating: '8.8',
              ageRating: '13+',
              genres: 'নাটক, থ্রিলার',
              streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
              poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop',
              backdrop: 'https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?q=80&w=1600&auto=format&fit=crop',
              description: 'আরুরার অনুমোদিত প্রিমিয়াম বাংলা সিনেমা।',
              descriptionEn: 'Authorized Arura original cinema release.',
              isTrending: true,
              isFeatured: false
            });
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#00D6A3] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-[#7C4DFF]/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন সিনেমা যোগ করুন' : 'Add New Movie'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#171B26] border border-white/10">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#A0A6B5] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === 'bn' ? 'সিনেমা খুঁজুন...' : 'Search movies...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#090B10] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#A0A6B5] focus:outline-none focus:border-[#7C4DFF]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['all', 'নাটক', 'থ্রিলার', 'অ্যাকশন', 'কমেডি'].map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedGenre === genre
                  ? 'bg-[#7C4DFF] text-white shadow'
                  : 'bg-[#090B10] text-[#A0A6B5] hover:text-white border border-white/5'
              }`}
            >
              {genre === 'all' ? (language === 'bn' ? 'সকল জনরা' : 'All Genres') : genre}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Table */}
      <div className="rounded-2xl bg-[#171B26] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#A0A6B5]">
            <thead className="bg-[#090B10] text-[11px] font-bold text-gray-300 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="p-3.5 pl-4">{language === 'bn' ? 'পোস্টার ও শিরোনাম' : 'Poster & Title'}</th>
                <th className="p-3.5">{language === 'bn' ? 'পরিচালক' : 'Director'}</th>
                <th className="p-3.5">{language === 'bn' ? 'বছর / রেটিং' : 'Year / Rating'}</th>
                <th className="p-3.5">{language === 'bn' ? 'জনরা' : 'Genres'}</th>
                <th className="p-3.5">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="p-3.5 text-right pr-4">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMovies.map((movie) => (
                <tr key={movie.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 pl-4 flex items-center gap-3">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-10 h-14 object-cover rounded-lg border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-white text-xs truncate">{movie.title}</p>
                      <p className="text-[10px] text-gray-400 truncate">{movie.titleEn}</p>
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-white/10 text-gray-300">
                        {movie.ageRating}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 font-medium text-white truncate max-w-[120px]">
                    {movie.director || 'Arura Studios'}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="text-white font-bold">{movie.year}</span>
                    <span className="text-amber-400 ml-2 font-bold">★ {movie.rating}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {movie.genre.slice(0, 2).map((g, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-gray-300">
                          {g}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00D6A3]/20 text-[#00D6A3] border border-[#00D6A3]/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{language === 'bn' ? 'পাবলিশড' : 'Published'}</span>
                    </span>
                  </td>
                  <td className="p-3 text-right pr-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => openPlayer(movie)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white transition-colors"
                        title="Preview Stream"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id, movie.title)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Delete Movie"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Movie Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#171B26] border border-white/10 shadow-2xl p-6 sm:p-8 my-auto max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white mb-4">
              {language === 'bn' ? 'নতুন সিনেমা যোগ করুন' : 'Add New Movie to Catalog'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    {language === 'bn' ? 'শিরোনাম (বাংলা)' : 'Title (Bangla)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="যেমন: রাজকুমার"
                    className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    {language === 'bn' ? 'শিরোনাম (ইংরেজি)' : 'Title (English)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="e.g. Rajkumar"
                    className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    {language === 'bn' ? 'পরিচালক' : 'Director'}
                  </label>
                  <input
                    type="text"
                    value={formData.director}
                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                    placeholder="হিমেল আশরাফ"
                    className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    {language === 'bn' ? 'মুক্তি পাওয়ার বছর' : 'Release Year'}
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    {language === 'bn' ? 'রেটিং' : 'Rating'}
                  </label>
                  <input
                    type="text"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    placeholder="8.8"
                    className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  {language === 'bn' ? 'জনরা (কমা দিয়ে আলাদা করুন)' : 'Genres (comma-separated)'}
                </label>
                <input
                  type="text"
                  value={formData.genres}
                  onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                  placeholder="নাটক, রোমান্স, অ্যাকশন"
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  {language === 'bn' ? 'অনুমোদিত HLS / MP4 স্ট্রিম URL' : 'Authorized HLS / MP4 Stream URL'}
                </label>
                <input
                  type="url"
                  required
                  value={formData.streamUrl}
                  onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  {language === 'bn' ? 'পোস্টার ইমেজ URL' : 'Poster Image URL'}
                </label>
                <input
                  type="url"
                  value={formData.poster}
                  onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="rounded bg-[#090B10] border-white/10 text-[#7C4DFF]"
                  />
                  <span>{language === 'bn' ? 'ট্রেন্ডিং হিসেবে চিহ্নিত করুন' : 'Mark as Trending'}</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded bg-[#090B10] border-white/10 text-[#7C4DFF]"
                  />
                  <span>{language === 'bn' ? 'ফিচার্ড হিরো ব্যানারে রাখুন' : 'Feature in Hero Carousel'}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#00D6A3] text-white text-xs font-bold shadow-lg shadow-[#7C4DFF]/30 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>{language === 'bn' ? 'সিনেমা প্রকাশ করুন' : 'Publish Movie'}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
