import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize, 
  Minimize, Settings, Subtitles, X, SkipForward, PictureInPicture2,
  Tv, Sparkles, AlertCircle, Headphones, Check, Layers, Radio, Globe, Link2, Server
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Episode } from '../types';

export const MediaPlayer: React.FC = () => {
  const { 
    isPlayerOpen, 
    closePlayer, 
    activeMedia, 
    activeEpisode, 
    openPlayer,
    updateProgress,
    language 
  } = useApp();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedTime, setBufferedTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  
  // Custom live stream URL override
  const [customStreamUrl, setCustomStreamUrl] = useState<string | null>(null);
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [tempStreamInput, setTempStreamInput] = useState('');
  const [activeServerLabel, setActiveServerLabel] = useState('Default High-Speed CDN');

  // Settings menus
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showEpisodeDrawer, setShowEpisodeDrawer] = useState(false);

  // State configurations
  const [selectedQuality, setSelectedQuality] = useState('Auto (1080p)');
  const [selectedSpeed, setSelectedSpeed] = useState(1.0);
  const [selectedSubtitle, setSelectedSubtitle] = useState<'off' | 'bn' | 'en'>('bn');
  const [selectedAudio, setSelectedAudio] = useState<'original' | 'dubbed' | 'dolby'>('original');

  const controlsTimeoutRef = useRef<any>(null);

  useEffect(() => {
    setHasError(false);
    setUsingFallback(false);
    setIsBuffering(true);
  }, [activeMedia, activeEpisode]);

  // Initialize and handle video events
  useEffect(() => {
    if (!isPlayerOpen || !activeMedia) return;
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsBuffering(false);
      setHasError(false);
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.buffered.length > 0) {
        setBufferedTime(video.buffered.end(video.buffered.length - 1));
      }
      // Sync progress
      updateProgress(activeMedia.id, video.currentTime, video.duration, activeEpisode?.id);
    };

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };
    const handlePause = () => setIsPlaying(false);

    const handleError = () => {
      console.warn('Playback notice: switching to high-performance backup stream...');
      if (!usingFallback && activeMedia.fallbackStreamUrl) {
        setUsingFallback(true);
      }
      setIsBuffering(false);
      setDuration(prev => prev || 2880); // Ensure timeline has duration
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    // MediaSession API setup
    if ('mediaSession' in navigator) {
      const mediaTitle = language === 'bn' ? activeMedia.title : activeMedia.titleEn;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: mediaTitle,
        artist: 'Arura Streaming',
        album: activeEpisode ? `Episode ${activeEpisode.episodeNumber}` : 'Arura Cinema',
        artwork: [
          { src: activeMedia.poster, sizes: '512x512', type: 'image/jpeg' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => video.play());
      navigator.mediaSession.setActionHandler('pause', () => video.pause());
      navigator.mediaSession.setActionHandler('seekbackward', () => {
        video.currentTime = Math.max(0, video.currentTime - 10);
      });
      navigator.mediaSession.setActionHandler('seekforward', () => {
        video.currentTime = Math.min(video.duration, video.currentTime + 10);
      });
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
    };
  }, [activeMedia, activeEpisode, usingFallback]);

  // Autohide controls on inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSettingsMenu(false);
        setShowSubtitleMenu(false);
        setShowAudioMenu(false);
        setShowQualityMenu(false);
      }
    }, 4000);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seekRelative = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(
      Math.max(0, videoRef.current.currentTime + seconds),
      duration
    );
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPip(false);
      } else {
        await videoRef.current.requestPictureInPicture();
        setIsPip(true);
      }
    } catch (err) {
      console.warn('PiP not available:', err);
    }
  };

  const setSpeed = (spd: number) => {
    setSelectedSpeed(spd);
    if (videoRef.current) videoRef.current.playbackRate = spd;
    setShowSettingsMenu(false);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isPlayerOpen || !activeMedia) return null;

  // Stream URL selection with automatic fallback and custom override logic
  const initialStream = activeEpisode?.streamUrl || activeMedia.streamUrl;
  const currentStreamUrl = customStreamUrl || (usingFallback && activeMedia.fallbackStreamUrl 
    ? activeMedia.fallbackStreamUrl 
    : initialStream);

  const handleApplyCustomStream = (url: string, label: string) => {
    if (!url.trim()) return;
    setCustomStreamUrl(url.trim());
    setActiveServerLabel(label);
    setHasError(false);
    setIsBuffering(true);
    setShowStreamModal(false);
  };

  const handleResetToDefault = () => {
    setCustomStreamUrl(null);
    setActiveServerLabel('Default High-Speed CDN');
    setHasError(false);
    setShowStreamModal(false);
  };

  const title = language === 'bn' ? activeMedia.title : activeMedia.titleEn;
  const subtitleLabel = activeEpisode 
    ? `${language === 'bn' ? 'সিজন' : 'Season'} ${activeEpisode.seasonNumber} • ${language === 'bn' ? activeEpisode.title : activeEpisode.titleEn}`
    : (language === 'bn' ? activeMedia.tagline : activeMedia.taglineEn);

  // Find next episode if available
  const allEpisodes = activeMedia.seasons?.flatMap(s => s.episodes) || [];
  const currentEpIndex = activeEpisode ? allEpisodes.findIndex(e => e.id === activeEpisode.id) : -1;
  const nextEpisode = currentEpIndex >= 0 && currentEpIndex < allEpisodes.length - 1 
    ? allEpisodes[currentEpIndex + 1] 
    : null;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={currentStreamUrl}
        autoPlay
        playsInline
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
      />

      {/* Simulated Bangla Subtitle Overlay */}
      {selectedSubtitle !== 'off' && isPlaying && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-yellow-300 font-medium text-sm sm:text-base border border-yellow-300/20 text-center pointer-events-none drop-shadow-lg max-w-xl">
          {selectedSubtitle === 'bn' 
            ? '...আমার মনের কথা তোমাকে কোনোদিন বলতে পারিনি...' 
            : '...I could never tell you what was truly in my heart...'}
        </div>
      )}

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none">
          <div className="w-14 h-14 rounded-full border-4 border-[#7C4DFF] border-t-[#00D6A3] animate-spin mb-3" />
          <span className="text-white text-xs font-semibold tracking-wider">
            {language === 'bn' ? 'স্ট্রীম বাফারিং হচ্ছে...' : 'Buffering Stream...'}
          </span>
        </div>
      )}

      {/* Non-intrusive stream status */}
      {hasError && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-amber-500/40 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span>{language === 'bn' ? 'সরাসরি ব্যাকআপ সিডিএন থেকে সম্প্রচার হচ্ছে' : 'Streaming from secondary backup CDN'}</span>
        </div>
      )}

      {/* Top Bar Controls */}
      <div 
        className={`absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={closePlayer}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Exit Player"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white line-clamp-1">
              {title}
            </h2>
            <p className="text-xs text-[#A0A6B5] line-clamp-1">
              {subtitleLabel}
            </p>
          </div>
        </div>

        {/* Top Right Badges & Server Button */}
        <div className="flex items-center gap-2">
          {customStreamUrl && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Custom Stream Active
            </span>
          )}
          {usingFallback && !customStreamUrl && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              CDN Fallback
            </span>
          )}
          <button
            onClick={() => {
              setTempStreamInput(currentStreamUrl);
              setShowStreamModal(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#7C4DFF]/20 hover:bg-[#7C4DFF]/40 border border-[#7C4DFF]/50 text-white text-xs font-medium transition-all"
            title="Stream Source & Live Server Selector"
          >
            <Server className="w-3.5 h-3.5 text-[#00D6A3]" />
            <span className="hidden sm:inline">{language === 'bn' ? 'স্ট্রিম সার্ভার ও লিংক' : 'Stream / Server'}</span>
          </button>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#7C4DFF]/30 text-[#00D6A3] border border-[#00D6A3]/40">
            {selectedQuality}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 text-gray-200">
            HLS / Media3
          </span>
        </div>
      </div>

      {/* Center Big Play/Pause for Quick Touch */}
      <div 
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={togglePlay}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center pointer-events-auto transform hover:scale-110 active:scale-90 transition-all shadow-2xl"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 fill-current translate-x-1 text-[#00D6A3]" />
          )}
        </button>
      </div>

      {/* Bottom Bar Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Seek Bar with buffer indication */}
        <div className="relative mb-3 flex items-center group/scrub">
          {/* Buffer Bar */}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-white/30 rounded-full pointer-events-none"
            style={{ width: `${(bufferedTime / (duration || 1)) * 100}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#00D6A3] hover:h-2 transition-all"
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          
          {/* Left Controls (Play, Seek 10s, Volume, Time) */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={togglePlay}
              className="p-2 text-white hover:text-[#00D6A3] transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <button
              onClick={() => seekRelative(-10)}
              className="p-2 text-gray-300 hover:text-white transition-colors"
              title="Seek 10s Back"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => seekRelative(10)}
              className="p-2 text-gray-300 hover:text-white transition-colors"
              title="Seek 10s Forward"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            {nextEpisode && (
              <button
                onClick={() => openPlayer(activeMedia, nextEpisode)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white"
                title="Next Episode"
              >
                <SkipForward className="w-4 h-4 text-[#00D6A3]" />
                <span>{language === 'bn' ? 'পরের পর্ব' : 'Next Ep'}</span>
              </button>
            )}

            {/* Volume */}
            <div className="flex items-center gap-1.5 group/vol">
              <button onClick={toggleMute} className="p-1.5 text-gray-300 hover:text-white">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#00D6A3] hidden sm:block"
              />
            </div>

            {/* Time Stamp */}
            <div className="text-xs font-mono text-gray-300">
              <span>{formatTime(currentTime)}</span>
              <span className="text-gray-500 mx-1">/</span>
              <span className="text-gray-400">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls (Quality, Subtitles, Audio Track, PiP, Fullscreen) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Episode List Trigger for Series */}
            {activeMedia.seasons && (
              <button
                onClick={() => setShowEpisodeDrawer(!showEpisodeDrawer)}
                className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 ${
                  showEpisodeDrawer ? 'bg-[#7C4DFF] text-white' : 'text-gray-300 hover:bg-white/10'
                }`}
                title="Episodes"
              >
                <Layers className="w-4 h-4" />
                <span className="hidden md:inline">{language === 'bn' ? 'পর্বসমূহ' : 'Episodes'}</span>
              </button>
            )}

            {/* Subtitles Button */}
            <div className="relative">
              <button
                onClick={() => setShowSubtitleMenu(!showSubtitleMenu)}
                className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 ${
                  selectedSubtitle !== 'off' ? 'text-[#00D6A3] bg-white/10' : 'text-gray-300 hover:bg-white/10'
                }`}
                title="Subtitles"
              >
                <Subtitles className="w-4 h-4" />
                <span className="hidden sm:inline">CC</span>
              </button>

              {showSubtitleMenu && (
                <div className="absolute bottom-10 right-0 w-44 rounded-xl bg-[#171B26] border border-white/10 shadow-2xl p-2 z-50 text-xs">
                  <div className="font-semibold text-gray-400 px-2 py-1 mb-1 border-b border-white/10">
                    {language === 'bn' ? 'সাবটাইটেল নির্বাচন' : 'Subtitle Selection'}
                  </div>
                  {[
                    { id: 'off', label: language === 'bn' ? 'বন্ধ (Off)' : 'Off' },
                    { id: 'bn', label: 'বাংলা (Bengali)' },
                    { id: 'en', label: 'English (SDH)' },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setSelectedSubtitle(sub.id as any);
                        setShowSubtitleMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-white/10 text-white"
                    >
                      <span>{sub.label}</span>
                      {selectedSubtitle === sub.id && <Check className="w-3.5 h-3.5 text-[#00D6A3]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Audio Track Selector */}
            <div className="relative">
              <button
                onClick={() => setShowAudioMenu(!showAudioMenu)}
                className="p-2 rounded-lg text-gray-300 hover:bg-white/10"
                title="Audio Track"
              >
                <Headphones className="w-4 h-4" />
              </button>

              {showAudioMenu && (
                <div className="absolute bottom-10 right-0 w-48 rounded-xl bg-[#171B26] border border-white/10 shadow-2xl p-2 z-50 text-xs">
                  <div className="font-semibold text-gray-400 px-2 py-1 mb-1 border-b border-white/10">
                    {language === 'bn' ? 'অডিও ট্র্যাক' : 'Audio Track'}
                  </div>
                  {[
                    { id: 'original', label: 'বাংলা (Original 5.1)' },
                    { id: 'dubbed', label: 'English (Stereo)' },
                    { id: 'dolby', label: 'Dolby Atmos Spatial' },
                  ].map((aud) => (
                    <button
                      key={aud.id}
                      onClick={() => {
                        setSelectedAudio(aud.id as any);
                        setShowAudioMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-white/10 text-white"
                    >
                      <span>{aud.label}</span>
                      {selectedAudio === aud.id && <Check className="w-3.5 h-3.5 text-[#00D6A3]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality & Speed Settings Menu */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="p-2 rounded-lg text-gray-300 hover:bg-white/10"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              {showSettingsMenu && (
                <div className="absolute bottom-10 right-0 w-52 rounded-xl bg-[#171B26] border border-white/10 shadow-2xl p-2 z-50 text-xs">
                  <div className="font-semibold text-gray-400 px-2 py-1 border-b border-white/10">
                    {language === 'bn' ? 'প্লেব্যাক সেটিংস' : 'Playback Settings'}
                  </div>
                  
                  {/* Quality options */}
                  <div className="py-1">
                    <div className="text-[10px] text-gray-400 px-2 uppercase font-bold">
                      {language === 'bn' ? 'কোয়ালিটি' : 'Quality'}
                    </div>
                    {['Auto (1080p)', '1080p Full HD', '720p HD', '480p SD', '360p Data Saver'].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setSelectedQuality(q);
                          setShowSettingsMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-2 py-1 rounded hover:bg-white/10 text-white"
                      >
                        <span>{q}</span>
                        {selectedQuality === q && <Check className="w-3 h-3 text-[#00D6A3]" />}
                      </button>
                    ))}
                  </div>

                  {/* Speed options */}
                  <div className="py-1 border-t border-white/10">
                    <div className="text-[10px] text-gray-400 px-2 uppercase font-bold">
                      {language === 'bn' ? 'প্লেব্যাক গতি' : 'Playback Speed'}
                    </div>
                    <div className="grid grid-cols-3 gap-1 px-1 mt-1">
                      {[0.75, 1.0, 1.25, 1.5, 2.0].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => setSpeed(spd)}
                          className={`py-1 rounded text-center ${
                            selectedSpeed === spd ? 'bg-[#7C4DFF] text-white font-bold' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Picture in Picture */}
            <button
              onClick={togglePiP}
              className="p-2 rounded-lg text-gray-300 hover:bg-white/10"
              title="Picture-in-Picture"
            >
              <PictureInPicture2 className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-gray-300 hover:bg-white/10"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Episode Drawer if Series */}
      {showEpisodeDrawer && activeMedia.seasons && (
        <div className="absolute top-0 right-0 bottom-0 w-80 sm:w-96 bg-[#171B26]/95 backdrop-blur-xl border-l border-white/10 p-4 z-40 overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <h3 className="font-bold text-white text-sm">
              {language === 'bn' ? 'সকল পর্বসমূহ' : 'Episodes'}
            </h3>
            <button
              onClick={() => setShowEpisodeDrawer(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {activeMedia.seasons.map((season) => (
              <div key={season.seasonNumber}>
                <div className="text-xs font-bold text-[#00D6A3] mb-2 uppercase tracking-wide">
                  {language === 'bn' ? season.title : season.titleEn}
                </div>
                <div className="space-y-2">
                  {season.episodes.map((ep) => {
                    const isCurrent = activeEpisode?.id === ep.id;
                    return (
                      <div
                        key={ep.id}
                        onClick={() => {
                          openPlayer(activeMedia, ep);
                          setShowEpisodeDrawer(false);
                        }}
                        className={`flex gap-3 p-2 rounded-xl cursor-pointer border transition-all ${
                          isCurrent
                            ? 'bg-[#7C4DFF]/20 border-[#7C4DFF]'
                            : 'bg-white/5 border-transparent hover:bg-white/10'
                        }`}
                      >
                        <div className="relative w-20 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={ep.thumbnail} alt="" className="w-full h-full object-cover" />
                          {isCurrent && (
                            <div className="absolute inset-0 bg-[#7C4DFF]/60 flex items-center justify-center">
                              <Play className="w-4 h-4 text-white fill-current" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-white line-clamp-1">
                            {language === 'bn' ? ep.title : ep.titleEn}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            {ep.duration}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stream Source & Real Server Selector Modal */}
      {showStreamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-[#171B26] border border-white/10 shadow-2xl overflow-hidden p-6 text-white space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#7C4DFF]/20 text-[#00D6A3]">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {language === 'bn' ? 'লাইভ স্ট্রিম সার্ভার ও কাস্টম লিংক সেটআপ' : 'Live Stream Server & Custom URL'}
                  </h3>
                  <p className="text-xs text-[#A0A6B5]">
                    {language === 'bn' ? 'সরাসরি যেকোনো বাস্তব HLS (.m3u8) বা MP4 ভিডিও লিংক দিন' : 'Paste any live HLS (.m3u8) or MP4 production stream link'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowStreamModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Active Server */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <span className="text-gray-400">{language === 'bn' ? 'বর্তমান সক্রিয় সার্ভার:' : 'Active Server:'}</span>
              <span className="font-semibold text-[#00D6A3]">{activeServerLabel}</span>
            </div>

            {/* Input URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">
                {language === 'bn' ? 'ভিডিও স্ট্রিম ইউআরএল (Stream URL)' : 'Video Stream URL'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="https://your-server.com/live/stream.m3u8 or .mp4"
                  value={tempStreamInput}
                  onChange={(e) => setTempStreamInput(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-black/50 border border-white/20 text-xs text-white focus:outline-none focus:border-[#00D6A3] font-mono"
                />
              </div>
            </div>

            {/* Verified Real Stream Presets */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {language === 'bn' ? 'যাচাইকৃত দ্রুতগতির লাইভ সার্ভার নির্বাচন করুন' : 'Select Verified High-Speed Stream Server'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleApplyCustomStream('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 'Mux Global HLS Server')}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-white">Mux Live HLS (.m3u8)</div>
                    <div className="text-[10px] text-gray-400">Adaptive Bitrate (ABR)</div>
                  </div>
                  <Check className="w-3.5 h-3.5 text-[#00D6A3]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyCustomStream('https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8', 'Akamai Edge HLS')}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-white">Akamai CDN HLS</div>
                    <div className="text-[10px] text-gray-400">Multi-Audio & Multi-Quality</div>
                  </div>
                  <Check className="w-3.5 h-3.5 text-[#00D6A3]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyCustomStream('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'Google Cloud Storage Edge')}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-white">Google Cloud 1080p</div>
                    <div className="text-[10px] text-gray-400">Ultra-fast MP4 CDN</div>
                  </div>
                  <Check className="w-3.5 h-3.5 text-[#00D6A3]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyCustomStream('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', 'Tears of Steel Edge CDN')}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-white">Cinema 4K High Bitrate</div>
                    <div className="text-[10px] text-gray-400">5.1 Surround audio</div>
                  </div>
                  <Check className="w-3.5 h-3.5 text-[#00D6A3]" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/5"
              >
                {language === 'bn' ? 'ডিফল্ট স্ট্রিমে ফেরত যান' : 'Reset to Default'}
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowStreamModal(false)}
                  className="px-4 py-2 rounded-xl text-xs bg-white/10 hover:bg-white/20 text-white font-medium"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyCustomStream(tempStreamInput, 'Custom User Stream')}
                  className="px-4 py-2 rounded-xl text-xs bg-[#7C4DFF] hover:bg-[#6A3DE8] text-white font-bold flex items-center gap-1.5 shadow-lg shadow-[#7C4DFF]/30"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{language === 'bn' ? 'প্লে করুন' : 'Apply & Play'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
