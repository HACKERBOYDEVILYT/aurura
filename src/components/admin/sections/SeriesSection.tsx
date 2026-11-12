import React, { useState } from 'react';
import { Tv, Plus, Play, ChevronDown, ChevronUp, Trash2, Edit2, Film, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MediaItem, Season, Episode } from '../../../types';

interface SeriesSectionProps {
  seriesList: MediaItem[];
  onRefresh: () => void;
}

export const SeriesSection: React.FC<SeriesSectionProps> = ({ seriesList, onRefresh }) => {
  const { language, openPlayer, showToast } = useApp();
  const [expandedSeriesId, setExpandedSeriesId] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [showAddEpisodeModal, setShowAddEpisodeModal] = useState(false);
  const [targetSeries, setTargetSeries] = useState<MediaItem | null>(null);

  const [epForm, setEpForm] = useState({
    title: '',
    titleEn: '',
    duration: '42 মিনিট',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnail: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=600&auto=format&fit=crop'
  });

  const handleAddEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSeries) return;
    showToast(language === 'bn' ? `নতুন পর্ব "${epForm.title}" সফলভাবে যোগ করা হয়েছে` : `Episode "${epForm.titleEn}" added successfully`);
    setShowAddEpisodeModal(false);
    onRefresh();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#171B26] border border-white/10">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Tv className="w-5 h-5 text-[#7C4DFF]" />
            <span>{language === 'bn' ? 'টিভি ও ওয়েব সিরিজ কন্ট্রোল' : 'TV & Web Series Management'}</span>
          </h2>
          <p className="text-xs text-[#A0A6B5] mt-0.5">
            {language === 'bn' ? 'সিজন ও পর্ব ভিত্তিক ভিডিও ম্যানেজমেন্ট, প্লেলিস্ট ও কন্টিনিউ ওয়াচিং সিঙ্ক' : 'Manage multi-season episodic content, sequencing, and autoplay streams'}
          </p>
        </div>
      </div>

      {/* Series List Cards */}
      <div className="space-y-4">
        {seriesList.map((series) => {
          const isExpanded = expandedSeriesId === series.id;
          const seasons = series.seasons || [
            {
              seasonNumber: 1,
              title: 'সিজন ১ (Season 1)',
              titleEn: 'Season 1',
              episodes: [
                {
                  id: 'ep-1',
                  seasonNumber: 1,
                  episodeNumber: 1,
                  title: 'রহস্যের সূচনা',
                  titleEn: 'The Beginning of Mystery',
                  duration: '45 min',
                  thumbnail: series.backdrop,
                  description: 'সিরিজের প্রথম পর্ব।',
                  descriptionEn: 'First episode premiere.',
                  streamUrl: series.streamUrl
                },
                {
                  id: 'ep-2',
                  seasonNumber: 1,
                  episodeNumber: 2,
                  title: 'অন্ধকার অতীত',
                  titleEn: 'Dark Secrets',
                  duration: '42 min',
                  thumbnail: series.poster,
                  description: 'দ্বিতীয় পর্ব।',
                  descriptionEn: 'Second thrilling episode.',
                  streamUrl: series.streamUrl
                }
              ]
            }
          ];

          const currentSeasonData = seasons.find(s => s.seasonNumber === selectedSeason) || seasons[0];

          return (
            <div key={series.id} className="rounded-2xl bg-[#171B26] border border-white/10 overflow-hidden shadow-lg transition-all">
              <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={series.poster}
                    alt={series.title}
                    className="w-12 h-16 object-cover rounded-xl border border-white/10 shrink-0"
                  />
                  <div>
                    <h3 className="font-extrabold text-white text-sm">{series.title}</h3>
                    <p className="text-xs text-gray-400">{series.titleEn} ({series.year})</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#7C4DFF]/20 text-[#7C4DFF]">
                        {seasons.length} {language === 'bn' ? 'টি সিজন' : 'Seasons'}
                      </span>
                      <span className="text-[10px] text-amber-400 font-bold">
                        ★ {series.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setTargetSeries(series);
                      setShowAddEpisodeModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#00D6A3]" />
                    <span>{language === 'bn' ? 'পর্ব যোগ করুন' : 'Add Episode'}</span>
                  </button>

                  <button
                    onClick={() => setExpandedSeriesId(isExpanded ? null : series.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7C4DFF]/20 text-[#7C4DFF] hover:bg-[#7C4DFF]/30 text-xs font-semibold transition-colors"
                  >
                    <span>{isExpanded ? (language === 'bn' ? 'লুকান' : 'Hide') : (language === 'bn' ? 'পর্বগুলো দেখুন' : 'View Episodes')}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Episodes Accordion Drawer */}
              {isExpanded && (
                <div className="p-4 pt-0 border-t border-white/5 bg-[#090B10]/50 space-y-4">
                  {/* Season Selector Chips */}
                  <div className="flex items-center gap-2 pt-3">
                    {seasons.map((s) => (
                      <button
                        key={s.seasonNumber}
                        onClick={() => setSelectedSeason(s.seasonNumber)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          selectedSeason === s.seasonNumber
                            ? 'bg-[#7C4DFF] text-white shadow'
                            : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {language === 'bn' ? s.title : s.titleEn}
                      </button>
                    ))}
                  </div>

                  {/* Episodes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentSeasonData.episodes.map((ep) => (
                      <div key={ep.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#171B26] border border-white/5 group hover:border-[#7C4DFF]/50 transition-colors">
                        <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0">
                          <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover" />
                          <button
                            onClick={() => openPlayer(series, ep)}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Play className="w-5 h-5 text-white fill-current" />
                          </button>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#00D6A3]">EP {ep.episodeNumber}</span>
                            <span className="text-[10px] text-gray-400">{ep.duration}</span>
                          </div>
                          <p className="font-bold text-white text-xs truncate mt-0.5">{ep.title}</p>
                          <p className="text-[10px] text-gray-400 truncate">{ep.titleEn}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Episode Modal */}
      {showAddEpisodeModal && targetSeries && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#171B26] border border-white/10 shadow-2xl p-6 sm:p-8">
            <h3 className="text-xl font-black text-white mb-1">
              {language === 'bn' ? 'নতুন পর্ব যুক্ত করুন' : 'Add New Episode'}
            </h3>
            <p className="text-xs text-[#A0A6B5] mb-4">
              {targetSeries.title} ({language === 'bn' ? `সিজন ${selectedSeason}` : `Season ${selectedSeason}`})
            </p>

            <form onSubmit={handleAddEpisode} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  {language === 'bn' ? 'পর্বের নাম (বাংলা)' : 'Episode Title (Bangla)'}
                </label>
                <input
                  type="text"
                  required
                  value={epForm.title}
                  onChange={(e) => setEpForm({ ...epForm, title: e.target.value })}
                  placeholder="যেমন: নতুন বিপদ"
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  {language === 'bn' ? 'পর্বের নাম (ইংরেজি)' : 'Episode Title (English)'}
                </label>
                <input
                  type="text"
                  required
                  value={epForm.titleEn}
                  onChange={(e) => setEpForm({ ...epForm, titleEn: e.target.value })}
                  placeholder="e.g. A New Danger"
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  {language === 'bn' ? 'সময়কাল (Duration)' : 'Duration'}
                </label>
                <input
                  type="text"
                  value={epForm.duration}
                  onChange={(e) => setEpForm({ ...epForm, duration: e.target.value })}
                  placeholder="42 min"
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  {language === 'bn' ? 'স্ট্রিমিং ভিডিও URL' : 'Stream URL'}
                </label>
                <input
                  type="url"
                  required
                  value={epForm.streamUrl}
                  onChange={(e) => setEpForm({ ...epForm, streamUrl: e.target.value })}
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEpisodeModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition-colors"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#00D6A3] text-xs font-bold text-white shadow-lg transition-all"
                >
                  {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Episode'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
