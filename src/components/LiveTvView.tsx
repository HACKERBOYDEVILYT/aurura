import React, { useState } from 'react';
import { Radio, Tv, Clock, Play, Volume2, VolumeX, Maximize, Calendar, Sparkles } from 'lucide-react';
import { LIVE_CHANNELS } from '../data/catalog';
import { LiveTVChannel } from '../types';
import { useApp } from '../context/AppContext';

export const LiveTvView: React.FC = () => {
  const { language, t, activeChannel, setActiveChannel } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isMuted, setIsMuted] = useState(false);

  const categories = ['All', 'Sports', 'News', 'Bangla', 'Kids'];

  const filteredChannels = LIVE_CHANNELS.filter(ch => {
    if (selectedCategory === 'All') return true;
    return ch.category === selectedCategory;
  });

  const currentCh = activeChannel || LIVE_CHANNELS[0];
  const channelName = language === 'bn' ? currentCh.name : currentCh.nameEn;
  const currentShow = language === 'bn' ? currentCh.currentShow : currentCh.currentShowEn;
  const nextShow = language === 'bn' ? currentCh.nextShow : currentCh.nextShowEn;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-6 h-6 text-[#00D6A3] animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.liveTvChannels}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#A0A6B5] mt-1">
            {language === 'bn' 
              ? 'নিরবচ্ছিন্ন লাইভ স্ট্রিমিং ও ইলেকট্রনিক প্রোগ্রাম গাইড (EPG) এর সাথে সরাসরি সম্প্রচার' 
              : 'Seamless live streams with hour-by-hour Electronic Program Guide (EPG)'}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#7C4DFF] text-white shadow-lg shadow-[#7C4DFF]/30'
                  : 'bg-[#171B26] text-[#A0A6B5] hover:text-white border border-white/5'
              }`}
            >
              {cat === 'All' ? t.categoryAll : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Live Player & EPG Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Live Channel Screen (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
            <video
              src={currentCh.streamUrl}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Live Indicator overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-red-600 text-white shadow-lg animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white" />
                {t.liveBadge}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-black/60 backdrop-blur-md text-[#00D6A3] border border-white/10">
                HD 1080p
              </span>
            </div>

            {/* Bottom Stream Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black via-black/60 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentCh.logo}
                  alt={currentCh.name}
                  className="w-12 h-12 rounded-xl object-cover border border-white/20 bg-white/10 p-0.5"
                />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {channelName}
                  </h3>
                  <p className="text-xs text-[#00D6A3] font-medium flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D6A3] animate-ping" />
                    {currentShow}
                  </p>
                </div>
              </div>

              {/* Player Quick Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors"
                  title="Toggle Mute"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Current Program Details Banner */}
          <div className="p-4 rounded-xl bg-[#171B26] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-[#A0A6B5] uppercase tracking-wider">
                {t.nowPlaying}
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                {currentShow}
              </div>
            </div>
            <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-4">
              <div className="text-[11px] font-bold text-[#00D6A3] uppercase tracking-wider">
                {t.upNext}
              </div>
              <div className="text-xs text-gray-300 mt-0.5">
                {nextShow}
              </div>
            </div>
          </div>
        </div>

        {/* EPG (Electronic Program Guide) Schedule Timeline (1 Col) */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#171B26] border border-white/10 shadow-xl flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#7C4DFF]" />
                <h3 className="font-bold text-sm text-white">
                  {t.fullSchedule}
                </h3>
              </div>
              <span className="text-[11px] text-[#A0A6B5] font-mono">
                {currentCh.category}
              </span>
            </div>

            {/* EPG Program List */}
            <div className="mt-3 space-y-2.5 overflow-y-auto max-h-[360px] pr-1">
              {currentCh.epg.map((prog) => {
                const progTitle = language === 'bn' ? prog.title : prog.titleEn;
                return (
                  <div
                    key={prog.id}
                    className={`p-3 rounded-xl border transition-all ${
                      prog.isCurrent
                        ? 'bg-[#7C4DFF]/15 border-[#7C4DFF]/50 shadow-md'
                        : 'bg-white/5 border-transparent hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-[#00D6A3]">
                        {prog.time}
                      </span>
                      {prog.isCurrent ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">
                          {t.liveBadge}
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#A0A6B5]">
                          {prog.duration}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-white mt-1">
                      {progTitle}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {prog.category}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Channel Grid List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Tv className="w-5 h-5 text-[#7C4DFF]" />
          <span>{language === 'bn' ? 'সকল লাইভ চ্যানেলসমূহ' : 'All Live Channels'}</span>
          <span className="text-xs font-normal text-[#A0A6B5]">({filteredChannels.length})</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredChannels.map((channel) => {
            const isSelected = currentCh.id === channel.id;
            const chName = language === 'bn' ? channel.name : channel.nameEn;
            const chShow = language === 'bn' ? channel.currentShow : channel.currentShowEn;

            return (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel)}
                className={`p-3 rounded-xl border text-left transition-all group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#7C4DFF]/20 border-[#7C4DFF] shadow-lg shadow-[#7C4DFF]/20'
                    : 'bg-[#171B26] border-white/5 hover:border-white/20 hover:bg-[#202636]'
                }`}
              >
                <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/40 mb-2 border border-white/10">
                  <img
                    src={channel.logo}
                    alt={chName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-1 right-1 px-1 py-0.5 rounded text-[9px] font-bold bg-black/70 text-white">
                    HD
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#7C4DFF]/40 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-current animate-pulse" />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-xs text-white line-clamp-1 group-hover:text-[#00D6A3]">
                    {chName}
                  </h4>
                  <p className="text-[10px] text-[#A0A6B5] line-clamp-1 mt-0.5">
                    {chShow}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
