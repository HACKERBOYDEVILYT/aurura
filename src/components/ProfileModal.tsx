import React from 'react';
import { 
  X, Crown, Shield, Globe, HardDrive, Smartphone, Check, 
  Volume2, Sliders, LogOut, Sparkles 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfileModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  onOpenAuth?: () => void;
}> = ({ isOpen, onClose, onOpenAuth }) => {
  const { userProfile, updateUserProfile, language, setLanguage, t, showToast } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#171B26] border border-white/10 shadow-2xl p-6 sm:p-8 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-white/10">
          <div className="relative">
            <img
              src={userProfile.avatar}
              alt=""
              className="w-16 h-16 rounded-full object-cover border-2 border-[#00D6A3]"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#7C4DFF] flex items-center justify-center text-white border-2 border-[#171B26]">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">
                {userProfile.name}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00D6A3]/20 text-[#00D6A3] border border-[#00D6A3]/30">
                {userProfile.plan}
              </span>
            </div>
            <p className="text-xs text-[#A0A6B5] mt-0.5">
              {userProfile.email}
            </p>
          </div>
        </div>

        {/* Settings Form */}
        <div className="py-6 space-y-6">
          
          {/* Language Selector */}
          <div>
            <label className="text-xs font-bold text-[#A0A6B5] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#00D6A3]" />
              <span>{language === 'bn' ? 'অ্যাপের প্রধান ভাষা (Language)' : 'Default App Language'}</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'bn', label: 'বাংলা (Bengali - Default)' },
                { id: 'en', label: 'English (US)' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setLanguage(lang.id as any);
                    showToast(lang.id === 'bn' ? 'ভাষা পরিবর্তন করে বাংলা করা হয়েছে' : 'Language switched to English');
                  }}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                    language === lang.id
                      ? 'bg-[#7C4DFF]/20 border-[#7C4DFF] text-white'
                      : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span>{lang.label}</span>
                  {language === lang.id && <Check className="w-4 h-4 text-[#00D6A3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Streaming Quality Preference */}
          <div>
            <label className="text-xs font-bold text-[#A0A6B5] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#7C4DFF]" />
              <span>{language === 'bn' ? 'ভিডিও স্ট্রিমিং পছন্দ' : 'Streaming Quality'}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Auto', '1080p Full HD', '720p HD', '480p SD'].map((qual) => (
                <button
                  key={qual}
                  onClick={() => updateUserProfile({ streamQuality: qual as any })}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                    userProfile.streamQuality === qual
                      ? 'bg-[#7C4DFF] border-[#7C4DFF] text-white shadow-lg shadow-[#7C4DFF]/30'
                      : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {qual}
                </button>
              ))}
            </div>
          </div>

          {/* Audio Preference */}
          <div>
            <label className="text-xs font-bold text-[#A0A6B5] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-[#00D6A3]" />
              <span>{language === 'bn' ? 'অডিও সাউন্ড ট্র্যাক' : 'Audio Profile'}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Dolby Atmos', 'Stereo', 'High'].map((aud) => (
                <button
                  key={aud}
                  onClick={() => updateUserProfile({ audioQuality: aud as any })}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                    userProfile.audioQuality === aud
                      ? 'bg-[#00D6A3] border-[#00D6A3] text-black font-bold shadow-lg shadow-[#00D6A3]/20'
                      : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {aud}
                </button>
              ))}
            </div>
          </div>

          {/* Active Devices */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between text-xs text-[#A0A6B5] mb-2">
              <span className="font-bold flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#7C4DFF]" />
                <span>{language === 'bn' ? 'সংযুক্ত ডিভাইসসমূহ' : 'Active Connected Devices'}</span>
              </span>
              <span className="text-[#00D6A3] font-semibold">2 / 5 Devices</span>
            </div>
            <div className="text-xs text-white">
              • Android Phone (Xiaomi 13 Pro) — <span className="text-[#00D6A3]">অনলাইন</span>
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              • Android TV (Sony Bravia 4K) — ঢাকা, বাংলাদেশ
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              if (onOpenAuth) onOpenAuth();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-[#7C4DFF] text-xs font-semibold text-gray-300 hover:text-white transition-all bg-white/5"
          >
            <LogOut className="w-3.5 h-3.5 text-[#00D6A3]" />
            <span>{language === 'bn' ? 'অ্যাকাউন্ট পরিবর্তন / লগইন' : 'Switch Account / Login'}</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#00D6A3] hover:opacity-95 text-white text-xs font-semibold transition-all shadow-md"
          >
            {language === 'bn' ? 'সম্পন্ন' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
