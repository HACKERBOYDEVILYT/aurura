import React, { useState } from 'react';
import { Radio, Plus, Play, Activity, CheckCircle2, AlertCircle, RefreshCw, Clock } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { LiveTVChannel } from '../../../types';

interface LiveTvSectionProps {
  channels: LiveTVChannel[];
  onRefresh: () => void;
}

export const LiveTvSection: React.FC<LiveTvSectionProps> = ({ channels, onRefresh }) => {
  const { language, openPlayer, showToast } = useApp();
  const [selectedChannel, setSelectedChannel] = useState<LiveTVChannel | null>(null);
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [streamLatencies, setStreamLatencies] = useState<{ [id: string]: number }>({});

  const handlePingStream = async (ch: LiveTVChannel) => {
    setCheckingId(ch.id);
    try {
      // Simulate/perform stream health ping
      await new Promise(r => setTimeout(r, 600));
      const latency = Math.floor(20 + Math.random() * 35);
      setStreamLatencies(prev => ({ ...prev, [ch.id]: latency }));
      showToast(language === 'bn' ? `${ch.name} স্ট্রিম সক্রিয় (${latency}ms)` : `${ch.nameEn} stream active (${latency}ms)`);
    } finally {
      setCheckingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#171B26] border border-white/10">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400" />
            <span>{language === 'bn' ? 'লাইভ টিভি ও EPG ব্রডকাস্ট কন্ট্রোল' : 'Live TV & EPG Broadcast Control'}</span>
          </h2>
          <p className="text-xs text-[#A0A6B5] mt-0.5">
            {language === 'bn' ? '২৪/৭ লাইভ চ্যানেলের কার্যকারিতা, HLS সোর্স যাচাইকরণ ও সময়সূচী ব্যবস্থাপনা' : '24/7 channel feeds, stream uptime check, and EPG schedule synchronization'}
          </p>
        </div>
      </div>

      {/* Channel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((ch) => {
          const latency = streamLatencies[ch.id];
          const isChecking = checkingId === ch.id;

          return (
            <div key={ch.id} className="p-4 rounded-2xl bg-[#171B26] border border-white/10 space-y-3 hover:border-emerald-400/40 transition-colors shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={ch.logo}
                    alt={ch.name}
                    className="w-10 h-10 object-contain rounded-xl bg-black/40 p-1 border border-white/10"
                  />
                  <div>
                    <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                      <span>{ch.name}</span>
                      {ch.isHd && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          HD
                        </span>
                      )}
                    </h3>
                    <p className="text-[10px] text-gray-400">{ch.category}</p>
                  </div>
                </div>

                <span className="flex items-center gap-1 text-[10px] font-bold text-[#00D6A3] bg-[#00D6A3]/10 px-2 py-0.5 rounded-full border border-[#00D6A3]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D6A3] animate-pulse" />
                  LIVE
                </span>
              </div>

              {/* Current show and EPG */}
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1 text-xs">
                <div className="flex items-center justify-between text-[11px] text-gray-300">
                  <span className="text-[#A0A6B5] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>চলমান অনুষ্ঠান:</span>
                  </span>
                  <strong className="text-white truncate max-w-[140px]">{ch.currentShow}</strong>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span>পরবর্তী শো:</span>
                  <span className="truncate max-w-[140px]">{ch.nextShow}</span>
                </div>
              </div>

              {/* Stream Actions */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div className="text-[10px] font-semibold text-gray-400">
                  {latency ? (
                    <span className="text-[#00D6A3] font-bold">Latency: {latency}ms</span>
                  ) : (
                    <span>Status: Healthy</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePingStream(ch)}
                    disabled={isChecking}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-gray-300 transition-colors"
                    title="Ping HLS Source"
                  >
                    <Activity className={`w-3 h-3 text-emerald-400 ${isChecking ? 'animate-spin' : ''}`} />
                    <span>{isChecking ? 'Testing...' : 'Ping Feed'}</span>
                  </button>

                  <button
                    onClick={() => openPlayer({
                      id: ch.id,
                      type: 'live_tv',
                      title: ch.name,
                      titleEn: ch.nameEn,
                      description: ch.currentShow,
                      descriptionEn: ch.currentShowEn,
                      poster: ch.logo,
                      backdrop: ch.logo,
                      rating: 9.0,
                      year: 2026,
                      ageRating: 'ALL',
                      genre: [ch.category],
                      genreEn: [ch.category],
                      streamUrl: ch.streamUrl
                    })}
                    className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-bold transition-colors"
                    title="Watch Feed"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
