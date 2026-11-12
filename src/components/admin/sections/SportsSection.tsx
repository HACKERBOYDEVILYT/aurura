import React, { useState } from 'react';
import { Trophy, Edit2, Play, CheckCircle2, Clock, Activity, Zap } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { SportsEvent } from '../../../types';

interface SportsSectionProps {
  sports: SportsEvent[];
  onRefresh: () => void;
}

export const SportsSection: React.FC<SportsSectionProps> = ({ sports, onRefresh }) => {
  const { language, openPlayer, showToast } = useApp();
  const [editingMatch, setEditingMatch] = useState<SportsEvent | null>(null);
  const [scoreA, setScoreA] = useState('');
  const [scoreB, setScoreB] = useState('');
  const [status, setStatus] = useState<'LIVE' | 'UPCOMING' | 'COMPLETED'>('LIVE');
  const [isUpdating, setIsUpdating] = useState(false);

  const openScoreModal = (match: SportsEvent) => {
    setEditingMatch(match);
    setScoreA(match.teamA.score || '');
    setScoreB(match.teamB.score || '');
    setStatus(match.status);
  };

  const handleUpdateScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMatch) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/v1/sports/${editingMatch.id}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scoreA, scoreB, status })
      });

      if (res.ok) {
        showToast(language === 'bn' ? 'লাইভ স্কোর সফলভাবে আপডেট হয়েছে!' : 'Live score updated & broadcasted!');
        setEditingMatch(null);
        onRefresh();
      }
    } catch {
      showToast('Error updating sports score');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#171B26] border border-white/10">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>{language === 'bn' ? 'লাইভ স্পোর্টস ও স্কোরবোর্ড ব্রডকাস্ট' : 'Live Sports Scoreboard Broadcast'}</span>
          </h2>
          <p className="text-xs text-[#A0A6B5] mt-0.5">
            {language === 'bn' ? 'বিপিএল ক্রিকেট ও প্রিমিয়ার লিগের রিয়েল-টাইম স্কোর আপডেট ও অডিয়েন্স পুশ' : 'Broadcast real-time cricket/football scores and stadium multi-cam feeds'}
          </p>
        </div>
      </div>

      {/* Sports Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sports.map((match) => (
          <div key={match.id} className="p-5 rounded-2xl bg-[#171B26] border border-white/10 space-y-4 hover:border-amber-400/30 transition-all shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  {match.tournament}
                </span>
                <span className="text-xs text-gray-400">{match.venue}</span>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                match.status === 'LIVE'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                  : 'bg-white/10 text-gray-300'
              }`}>
                {match.status}
              </span>
            </div>

            {/* Teams and Scorecard Box */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{match.teamA.flag}</span>
                  <span className="text-sm font-bold text-white">{match.teamA.name}</span>
                </div>
                <span className="text-sm font-black text-[#00D6A3] font-mono">
                  {match.teamA.score || 'Yet to bat'}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{match.teamB.flag}</span>
                  <span className="text-sm font-bold text-white">{match.teamB.name}</span>
                </div>
                <span className="text-sm font-black text-[#7C4DFF] font-mono">
                  {match.teamB.score || 'Yet to bat'}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#A0A6B5] italic">
              {match.summary}
            </p>

            {/* Actions Bar */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={() => openScoreModal(match)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 text-xs font-bold transition-colors border border-amber-400/30"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'স্কোর ও স্ট্যাটাস আপডেট করুন' : 'Update Live Score'}</span>
              </button>

              <button
                onClick={() => openPlayer({
                  id: match.id,
                  type: 'sports',
                  title: `${match.teamA.name} বনাম ${match.teamB.name}`,
                  titleEn: `${match.teamA.nameEn} vs ${match.teamB.nameEn}`,
                  description: match.summary,
                  descriptionEn: match.summaryEn,
                  poster: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600&auto=format&fit=crop',
                  backdrop: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1600&auto=format&fit=crop',
                  rating: 9.8,
                  year: 2026,
                  ageRating: 'ALL',
                  genre: [match.sport],
                  genreEn: [match.sport],
                  streamUrl: match.streamUrl
                })}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                title="Preview Live Stadium Feed"
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Score Modal */}
      {editingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#171B26] border border-white/10 shadow-2xl p-6 sm:p-8">
            <h3 className="text-xl font-black text-white mb-1">
              {language === 'bn' ? 'লাইভ ম্যাচ স্কোর আপডেট' : 'Update Match Score'}
            </h3>
            <p className="text-xs text-[#A0A6B5] mb-4">
              {editingMatch.teamA.name} vs {editingMatch.teamB.name} ({editingMatch.tournament})
            </p>

            <form onSubmit={handleUpdateScore} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  {editingMatch.teamA.name} {language === 'bn' ? 'স্কোর' : 'Score'}
                </label>
                <input
                  type="text"
                  required
                  value={scoreA}
                  onChange={(e) => setScoreA(e.target.value)}
                  placeholder="e.g. 184/4 (20 ov)"
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  {editingMatch.teamB.name} {language === 'bn' ? 'স্কোর' : 'Score'}
                </label>
                <input
                  type="text"
                  required
                  value={scoreB}
                  onChange={(e) => setScoreB(e.target.value)}
                  placeholder="e.g. 142/6 (16.2 ov)"
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  {language === 'bn' ? 'ম্যাচ স্ট্যাটাস' : 'Match Status'}
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                >
                  <option value="LIVE">LIVE (চলমান)</option>
                  <option value="UPCOMING">UPCOMING (আসন্ন)</option>
                  <option value="COMPLETED">COMPLETED (সমাপ্ত)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMatch(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-[#00D6A3] text-xs font-bold text-black shadow-lg"
                >
                  {isUpdating ? 'Broadcasting...' : (language === 'bn' ? 'লাইভ ব্রডকাস্ট করুন' : 'Push Live Update')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
