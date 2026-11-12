import React, { useState, useRef } from 'react';
import { 
  Play, Pause, Heart, MessageCircle, Share2, Volume2, VolumeX, 
  Music, Sparkles, ExternalLink, SkipForward, SkipBack, Disc 
} from 'lucide-react';
import { YOUTUBE_SHORTS, YOUTUBE_MUSIC_TRACKS } from '../data/catalog';
import { YouTubeShort, YouTubeMusicTrack } from '../types';
import { useApp } from '../context/AppContext';

export const YouTubeView: React.FC = () => {
  const { 
    language, 
    t, 
    activeMusicTrack, 
    setActiveMusicTrack, 
    isMusicPlaying, 
    setIsMusicPlaying,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'shorts' | 'music'>('shorts');
  const [currentShortIndex, setCurrentShortIndex] = useState(0);
  const [isShortMuted, setIsShortMuted] = useState(true);
  const [likedShorts, setLikedShorts] = useState<string[]>([]);

  const musicAudioRef = useRef<HTMLAudioElement | null>(null);

  const toggleShortLike = (id: string) => {
    setLikedShorts(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleShareShort = (short: YouTubeShort) => {
    navigator.clipboard?.writeText(`https://youtube.com/shorts/${short.id}`);
    showToast(t.copied);
  };

  const toggleMusicPlay = () => {
    if (!musicAudioRef.current) return;
    if (isMusicPlaying) {
      musicAudioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      musicAudioRef.current.play();
      setIsMusicPlaying(true);
    }
  };

  const switchMusicTrack = (track: YouTubeMusicTrack) => {
    setActiveMusicTrack(track);
    setIsMusicPlaying(true);
    setTimeout(() => {
      musicAudioRef.current?.play();
    }, 100);
  };

  const currentTrack = activeMusicTrack || YOUTUBE_MUSIC_TRACKS[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30">
              <Play className="w-4 h-4 text-white fill-current translate-x-0.5" />
            </span>
            <span>{language === 'bn' ? 'ইউটিউব ও মিউজিক মোড' : 'YouTube & Music Mode'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A0A6B5] mt-1">
            {language === 'bn' 
              ? 'অফিসিয়াল ইউটিউব শর্টস এবং ব্যাকগ্রাউন্ড ইউটিউব মিউজিক প্লেয়ার' 
              : 'Official YouTube Shorts and background YouTube Music Mode'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-[#171B26] border border-white/10 self-start">
          <button
            onClick={() => setActiveTab('shorts')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'shorts'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-[#A0A6B5] hover:text-white'
            }`}
          >
            {language === 'bn' ? 'শর্টস ভিডিও' : 'YouTube Shorts'}
          </button>

          <button
            onClick={() => setActiveTab('music')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'music'
                ? 'bg-[#7C4DFF] text-white shadow-md'
                : 'text-[#A0A6B5] hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'মিউজিক মোড' : 'Music Mode'}</span>
          </button>
        </div>
      </div>

      {/* SHORTS MODE */}
      {activeTab === 'shorts' && (
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl">
            {/* Short Video */}
            <video
              src={YOUTUBE_SHORTS[currentShortIndex].videoUrl}
              autoPlay
              loop
              muted={isShortMuted}
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />

            {/* Top Bar for Short */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-red-400 border border-red-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                SHORTS
              </span>

              <button
                onClick={() => setIsShortMuted(!isShortMuted)}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10"
              >
                {isShortMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Right Action Stack */}
            <div className="absolute right-3 bottom-20 flex flex-col items-center gap-4 z-10">
              {/* Like */}
              <button
                onClick={() => toggleShortLike(YOUTUBE_SHORTS[currentShortIndex].id)}
                className="flex flex-col items-center group"
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                  likedShorts.includes(YOUTUBE_SHORTS[currentShortIndex].id)
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/40'
                    : 'bg-black/60 text-white group-hover:scale-110'
                }`}>
                  <Heart className={`w-5 h-5 ${likedShorts.includes(YOUTUBE_SHORTS[currentShortIndex].id) ? 'fill-current' : ''}`} />
                </div>
                <span className="text-[10px] text-white font-bold mt-1">
                  {YOUTUBE_SHORTS[currentShortIndex].likes}
                </span>
              </button>

              {/* Comments */}
              <button className="flex flex-col items-center group">
                <div className="w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-white font-bold mt-1">
                  {YOUTUBE_SHORTS[currentShortIndex].comments}
                </span>
              </button>

              {/* Share */}
              <button
                onClick={() => handleShareShort(YOUTUBE_SHORTS[currentShortIndex])}
                className="flex flex-col items-center group"
              >
                <div className="w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-white font-bold mt-1">
                  {t.share}
                </span>
              </button>

              {/* Open Official */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform"
                title="Open on YouTube"
              >
                <ExternalLink className="w-5 h-5 text-gray-300" />
              </a>
            </div>

            {/* Bottom Caption & Channel Profile */}
            <div className="absolute bottom-4 left-4 right-16 z-10 text-white">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={YOUTUBE_SHORTS[currentShortIndex].channelAvatar}
                  alt=""
                  className="w-8 h-8 rounded-full border border-white"
                />
                <span className="text-xs font-bold shadow-sm">
                  {YOUTUBE_SHORTS[currentShortIndex].channelName}
                </span>
              </div>

              <h3 className="text-xs sm:text-sm font-semibold line-clamp-2 drop-shadow">
                {language === 'bn' ? YOUTUBE_SHORTS[currentShortIndex].title : YOUTUBE_SHORTS[currentShortIndex].titleEn}
              </h3>

              <div className="flex flex-wrap gap-1 mt-1.5">
                {YOUTUBE_SHORTS[currentShortIndex].tags.map((tag, i) => (
                  <span key={i} className="text-[10px] text-[#00D6A3] font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Vertical Short Navigation Buttons */}
          <div className="flex items-center gap-3 mt-4">
            <button
              disabled={currentShortIndex === 0}
              onClick={() => setCurrentShortIndex(prev => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl bg-[#171B26] hover:bg-[#202636] disabled:opacity-40 text-xs font-bold text-white border border-white/10"
            >
              ↑ {language === 'bn' ? 'আগের শর্ট' : 'Previous'}
            </button>
            <span className="text-xs font-mono text-gray-400">
              {currentShortIndex + 1} / {YOUTUBE_SHORTS.length}
            </span>
            <button
              disabled={currentShortIndex === YOUTUBE_SHORTS.length - 1}
              onClick={() => setCurrentShortIndex(prev => Math.min(YOUTUBE_SHORTS.length - 1, prev + 1))}
              className="px-4 py-2 rounded-xl bg-[#7C4DFF] hover:bg-[#6c38f8] disabled:opacity-40 text-xs font-bold text-white shadow-lg shadow-[#7C4DFF]/30"
            >
              ↓ {language === 'bn' ? 'পরের শর্ট' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {/* YOUTUBE MUSIC MODE */}
      {activeTab === 'music' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Visualizer & Player Card (2 Cols) */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#171B26] via-[#202636] to-[#090B10] border border-[#7C4DFF]/30 shadow-2xl flex flex-col justify-between">
            <audio
              ref={musicAudioRef}
              src={currentTrack.audioUrl}
              onEnded={() => {
                const curIdx = YOUTUBE_MUSIC_TRACKS.findIndex(t => t.id === currentTrack.id);
                const next = YOUTUBE_MUSIC_TRACKS[(curIdx + 1) % YOUTUBE_MUSIC_TRACKS.length];
                switchMusicTrack(next);
              }}
            />

            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Disc className={`w-5 h-5 text-[#00D6A3] ${isMusicPlaying ? 'animate-spin' : ''}`} />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {t.youtubeMusicMode}
                </span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#00D6A3]/20 text-[#00D6A3] border border-[#00D6A3]/30">
                Dolby Stereo • 320 kbps
              </span>
            </div>

            {/* Album Cover & Animated Equalizer Waveform */}
            <div className="my-8 flex flex-col sm:flex-row items-center gap-8">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0 group">
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {isMusicPlaying && (
                  <div className="absolute inset-0 bg-[#7C4DFF]/20 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="flex items-end gap-1.5 h-12">
                      <div className="w-1.5 bg-[#00D6A3] rounded-full animate-wave-1" />
                      <div className="w-1.5 bg-[#00D6A3] rounded-full animate-wave-2" />
                      <div className="w-1.5 bg-[#00D6A3] rounded-full animate-wave-3" />
                      <div className="w-1.5 bg-[#00D6A3] rounded-full animate-wave-4" />
                      <div className="w-1.5 bg-[#00D6A3] rounded-full animate-wave-5" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <span className="text-xs font-mono text-[#00D6A3]">
                  {currentTrack.album}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {language === 'bn' ? currentTrack.title : currentTrack.titleEn}
                </h2>
                <p className="text-sm text-gray-300 mt-1">
                  {currentTrack.artist}
                </p>

                {/* Animated Waveform Bars */}
                <div className="flex items-center gap-1 mt-6 h-8 justify-center sm:justify-start">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 bg-[#7C4DFF] rounded-full transition-all duration-300 ${
                        isMusicPlaying ? 'opacity-80' : 'opacity-20'
                      }`}
                      style={{
                        height: isMusicPlaying ? `${Math.sin(i) * 16 + 20}px` : '6px'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Music Controls Bar */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const idx = YOUTUBE_MUSIC_TRACKS.findIndex(t => t.id === currentTrack.id);
                    const prev = YOUTUBE_MUSIC_TRACKS[(idx - 1 + YOUTUBE_MUSIC_TRACKS.length) % YOUTUBE_MUSIC_TRACKS.length];
                    switchMusicTrack(prev);
                  }}
                  className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={toggleMusicPlay}
                  className="w-14 h-14 rounded-full bg-[#7C4DFF] hover:bg-[#6c38f8] text-white flex items-center justify-center shadow-lg shadow-[#7C4DFF]/40 transform hover:scale-105 active:scale-95 transition-all"
                >
                  {isMusicPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  )}
                </button>

                <button
                  onClick={() => {
                    const idx = YOUTUBE_MUSIC_TRACKS.findIndex(t => t.id === currentTrack.id);
                    const next = YOUTUBE_MUSIC_TRACKS[(idx + 1) % YOUTUBE_MUSIC_TRACKS.length];
                    switchMusicTrack(next);
                  }}
                  className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs font-mono text-[#A0A6B5]">
                {currentTrack.duration}
              </div>
            </div>
          </div>

          {/* Playlist Queue (1 Col) */}
          <div className="p-5 rounded-3xl bg-[#171B26] border border-white/10 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <h3 className="font-bold text-sm text-white">
                  {language === 'bn' ? 'মিউজিক প্লেলিস্ট' : 'Music Playlist'}
                </h3>
                <span className="text-xs text-[#00D6A3] font-mono">
                  {YOUTUBE_MUSIC_TRACKS.length} tracks
                </span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {YOUTUBE_MUSIC_TRACKS.map((track) => {
                  const isCurrent = currentTrack.id === track.id;
                  return (
                    <div
                      key={track.id}
                      onClick={() => switchMusicTrack(track)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer border transition-all ${
                        isCurrent
                          ? 'bg-[#7C4DFF]/20 border-[#7C4DFF]'
                          : 'bg-white/5 border-transparent hover:bg-white/10'
                      }`}
                    >
                      <img
                        src={track.cover}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white line-clamp-1">
                          {language === 'bn' ? track.title : track.titleEn}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {track.artist}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">
                        {track.duration}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
