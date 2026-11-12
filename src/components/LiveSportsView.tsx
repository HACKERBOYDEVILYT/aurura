import React, { useState } from 'react';
import { Trophy, Play, Radio, Calendar, MapPin, Volume2, VolumeX, Sparkles, AlertCircle } from 'lucide-react';
import { LIVE_SPORTS_EVENTS } from '../data/catalog';
import { SportsEvent } from '../types';
import { useApp } from '../context/AppContext';

export const LiveSportsView: React.FC = () => {
  const { language, t, activeSportsEvent, setActiveSportsEvent } = useApp();
  const [selectedSport, setSelectedSport] = useState<string>('All');
  const [isMuted, setIsMuted] = useState(false);

  const sportsFilter = ['All', 'Cricket', 'Football'];

  const filteredEvents = LIVE_SPORTS_EVENTS.filter(evt => {
    if (selectedSport === 'All') return true;
    return evt.sport === selectedSport;
  });

  const currentMatch = activeSportsEvent || LIVE_SPORTS_EVENTS[0];
  const tournament = language === 'bn' ? currentMatch.tournament : currentMatch.tournamentEn;
  const teamAName = language === 'bn' ? currentMatch.teamA.name : currentMatch.teamA.nameEn;
  const teamBName = language === 'bn' ? currentMatch.teamB.name : currentMatch.teamB.nameEn;
  const summary = language === 'bn' ? currentMatch.summary : currentMatch.summaryEn;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#00D6A3]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.liveSportsMatches}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#A0A6B5] mt-1">
            {language === 'bn' 
              ? 'বিপিএল টি-টোয়েন্টি, আন্তর্জাতিক ক্রিকেট, প্রিমিয়ার লিগ ও চ্যাম্পিয়ন্স লিগের সরাসরি সম্প্রচার' 
              : 'BPL T20, International Cricket, Premier League & Champions League live coverage'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {sportsFilter.map((sp) => (
            <button
              key={sp}
              onClick={() => setSelectedSport(sp)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedSport === sp
                  ? 'bg-[#7C4DFF] text-white shadow-lg shadow-[#7C4DFF]/30'
                  : 'bg-[#171B26] text-[#A0A6B5] hover:text-white border border-white/5'
              }`}
            >
              {sp === 'All' ? t.categoryAll : sp}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Live Match Player */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Stream Video Container (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
            <video
              src={currentMatch.streamUrl}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Live Indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-red-600 text-white shadow-lg animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white" />
                {t.liveBadge}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#7C4DFF] text-white">
                {currentMatch.sport}
              </span>
            </div>

            {/* Sound Toggle */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/10"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Scoreboard Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Team A */}
                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 justify-end">
                      <span>{teamAName}</span>
                      <span className="text-base">{currentMatch.teamA.flag}</span>
                    </div>
                    {currentMatch.teamA.score && (
                      <div className="text-xs sm:text-sm font-extrabold text-[#00D6A3] font-mono mt-0.5">
                        {currentMatch.teamA.score}
                      </div>
                    )}
                  </div>

                  <span className="text-xs font-extrabold text-[#A0A6B5] px-2 py-0.5 rounded bg-white/10">
                    VS
                  </span>

                  {/* Team B */}
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <span className="text-base">{currentMatch.teamB.flag}</span>
                      <span>{teamBName}</span>
                    </div>
                    {currentMatch.teamB.score && (
                      <div className="text-xs sm:text-sm font-extrabold text-white font-mono mt-0.5">
                        {currentMatch.teamB.score}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] sm:text-xs text-[#00D6A3] font-semibold bg-[#00D6A3]/10 px-2 py-1 rounded-md border border-[#00D6A3]/20">
                    4K ULTRA STADIUM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Match Center & Details Panel (1 Col) */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#171B26] border border-white/10 shadow-xl flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold text-[#00D6A3] uppercase tracking-wide">
                  {tournament}
                </span>
                <span className="text-xs font-mono text-gray-400">
                  {currentMatch.time}
                </span>
              </div>

              <div className="my-4">
                <h3 className="text-base font-bold text-white mb-2">
                  {t.matchSummary}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                  {summary}
                </p>
              </div>

              <div className="space-y-2 text-xs text-[#A0A6B5] pt-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#7C4DFF]" />
                  <span>{currentMatch.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#00D6A3]" />
                  <span>{language === 'bn' ? 'সরাসরি ডিজিটাল টেলিকাস্ট' : 'Live Official Digital Stream'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  // Trigger open in main media player if desired
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#7C4DFF] hover:bg-[#6c38f8] text-white font-bold text-xs shadow-lg shadow-[#7C4DFF]/30 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t.streamMatch}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Match Schedule Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#7C4DFF]" />
          <span>{language === 'bn' ? 'সকল লাইভ ও আসন্ন ম্যাচসমূহ' : 'Live & Upcoming Fixtures'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((event) => {
            const isCurrent = currentMatch.id === event.id;
            const tA = language === 'bn' ? event.teamA.name : event.teamA.nameEn;
            const tB = language === 'bn' ? event.teamB.name : event.teamB.nameEn;
            const trn = language === 'bn' ? event.tournament : event.tournamentEn;

            return (
              <div
                key={event.id}
                onClick={() => setActiveSportsEvent(event)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-[#7C4DFF]/15 border-[#7C4DFF] shadow-lg shadow-[#7C4DFF]/10'
                    : 'bg-[#171B26] border-white/5 hover:border-white/20 hover:bg-[#202636]'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-[#A0A6B5] mb-2">
                  <span className="font-semibold text-white">{trn}</span>
                  <div className="flex items-center gap-2">
                    {event.status === 'LIVE' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">
                        LIVE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 text-gray-300">
                        {event.status}
                      </span>
                    )}
                    <span>{event.time}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-y border-white/5 my-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{event.teamA.flag}</span>
                    <span className="text-sm font-bold text-white">{tA}</span>
                    {event.teamA.score && (
                      <span className="text-xs font-mono font-bold text-[#00D6A3] ml-2">
                        {event.teamA.score}
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-gray-500 font-bold">VS</span>

                  <div className="flex items-center gap-2">
                    {event.teamB.score && (
                      <span className="text-xs font-mono font-bold text-white mr-2">
                        {event.teamB.score}
                      </span>
                    )}
                    <span className="text-sm font-bold text-white">{tB}</span>
                    <span className="text-xl">{event.teamB.flag}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#A0A6B5] mt-2">
                  <span className="line-clamp-1">{event.venue}</span>
                  <span className="text-[#00D6A3] font-semibold flex items-center gap-1">
                    <Play className="w-3 h-3 fill-current" /> {language === 'bn' ? 'সরাসরি দেখুন' : 'Watch Stream'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
