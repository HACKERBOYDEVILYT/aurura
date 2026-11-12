import React, { useState } from 'react';
import { 
  Play, Film, Tv, Radio, Trophy, Sparkles, Heart, User, 
  Search, Globe, Menu, X, Crown, Music2, Clapperboard, Shield 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    t, 
    activeTab, 
    setActiveTab, 
    searchQuery, 
    setSearchQuery,
    watchlist,
    userProfile,
    isAdminUnlocked,
    openAdminPanel
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        openAdminPanel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openAdminPanel]);

  const navItems = [
    { id: 'home', label: t.navHome, icon: Play },
    { id: 'movies', label: t.navMovies, icon: Film },
    { id: 'series', label: t.navSeries, icon: Tv },
    { id: 'bangla_hub', label: t.navBanglaHub, icon: Clapperboard, isHighlight: true },
    { id: 'live_tv', label: t.navLiveTv, icon: Radio },
    { id: 'sports', label: t.navSports, icon: Trophy },
    { id: 'youtube', label: t.navYoutube, icon: Music2 },
    { id: 'ai_discovery', label: t.navAiDiscovery, icon: Sparkles, isAi: true },
    { id: 'library', label: t.navLibrary, icon: Heart, count: watchlist.length },
  ];

  return (
    <>
      {/* Desktop & Tablet Top Bar */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3 transition-all duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C4DFF] to-[#00D6A3] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                <Play className="w-5 h-5 text-white fill-current translate-x-0.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                    ARURA
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#7C4DFF]/30 text-[#00D6A3] border border-[#00D6A3]/30 tracking-wider">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-[#A0A6B5] -mt-1 hidden sm:block tracking-wide">
                  {language === 'bn' ? 'অল-ইন-ওয়ান বিনোদন' : 'All-in-One Streaming'}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-[#7C4DFF]/20 border border-[#7C4DFF]/40 shadow-sm'
                      : 'text-[#A0A6B5] hover:text-white hover:bg-white/5'
                  } ${item.isAi ? 'text-[#00D6A3]' : ''}`}
                >
                  <Icon className={`w-4 h-4 ${item.isAi ? 'text-[#00D6A3]' : isActive ? 'text-[#7C4DFF]' : ''}`} />
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#7C4DFF] text-[10px] font-bold flex items-center justify-center text-white">
                      {item.count}
                    </span>
                  )}
                  {item.isHighlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D6A3] animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input Desktop */}
            <div className="relative hidden md:block w-48 lg:w-64">
              <Search className="w-4 h-4 text-[#A0A6B5] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#171B26] border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-[#A0A6B5] focus:outline-none focus:border-[#7C4DFF] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 rounded-lg text-[#A0A6B5] hover:text-white hover:bg-white/5"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:border-[#7C4DFF] transition-all bg-[#171B26]"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#00D6A3]" />
              <span>{language === 'bn' ? 'EN' : 'বাংলা'}</span>
            </button>

            {/* Admin Panel Quick Switch Button (Only visible when unlocked with password robiul1000) */}
            {isAdminUnlocked && (
              <button
                onClick={() => setActiveTab(activeTab === 'admin' ? 'home' : 'admin')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-[#171B26] border-amber-500/40 text-amber-300 hover:bg-amber-500/10'
                }`}
                title={language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'bn' ? 'অ্যাডমিন' : 'Admin'}</span>
              </button>
            )}

            {/* VIP Plan Badge / Profile */}
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-[#7C4DFF]/40 bg-[#7C4DFF]/10 hover:bg-[#7C4DFF]/20 transition-colors"
            >
              <img
                src={userProfile.avatar}
                alt="Profile"
                className="w-6 h-6 rounded-full object-cover border border-[#00D6A3]"
              />
              <span className="hidden sm:inline text-xs font-medium text-white">
                {userProfile.plan}
              </span>
              <Crown className="w-3.5 h-3.5 text-amber-400" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-white hover:bg-white/10"
              aria-label="Open Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Expanded */}
        {searchOpen && (
          <div className="mt-3 md:hidden px-2 pb-1">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[#A0A6B5] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-[#171B26] border border-[#7C4DFF]/50 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-[#A0A6B5] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-3 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium ${
                    isActive
                      ? 'bg-[#7C4DFF] text-white'
                      : 'bg-[#171B26] text-[#A0A6B5] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            {isAdminUnlocked && (
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-black'
                    : 'bg-[#171B26] text-amber-300 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>{language === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</span>
              </button>
            )}
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation (Material 3 Android Style) */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090B10]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] ${
            activeTab === 'home' ? 'text-[#00D6A3] font-bold' : 'text-[#A0A6B5]'
          }`}
        >
          <Play className="w-5 h-5 mb-0.5" />
          <span>{t.navHome}</span>
        </button>

        <button
          onClick={() => setActiveTab('bangla_hub')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] ${
            activeTab === 'bangla_hub' ? 'text-[#00D6A3] font-bold' : 'text-[#A0A6B5]'
          }`}
        >
          <Clapperboard className="w-5 h-5 mb-0.5" />
          <span>{t.navBanglaHub}</span>
        </button>

        <button
          onClick={() => setActiveTab('live_tv')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] ${
            activeTab === 'live_tv' ? 'text-[#00D6A3] font-bold' : 'text-[#A0A6B5]'
          }`}
        >
          <Radio className="w-5 h-5 mb-0.5" />
          <span>{t.navLiveTv}</span>
        </button>

        <button
          onClick={() => setActiveTab('sports')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] ${
            activeTab === 'sports' ? 'text-[#00D6A3] font-bold' : 'text-[#A0A6B5]'
          }`}
        >
          <Trophy className="w-5 h-5 mb-0.5" />
          <span>{t.navSports}</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_discovery')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] ${
            activeTab === 'ai_discovery' ? 'text-[#00D6A3] font-bold' : 'text-[#A0A6B5]'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5 text-[#00D6A3]" />
          <span>এআই</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] ${
            activeTab === 'library' ? 'text-[#00D6A3] font-bold' : 'text-[#A0A6B5]'
          }`}
        >
          <Heart className="w-5 h-5 mb-0.5" />
          <span>লাইব্রেরি</span>
        </button>
      </div>
    </>
  );
};
