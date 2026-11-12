import React from 'react';
import { Play, Shield, Globe, Radio, Sparkles, Heart, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { language, setLanguage, setActiveTab, openAdminPanel } = useApp();

  return (
    <footer className="mt-20 border-t border-white/10 bg-[#090B10] pt-12 pb-24 xl:pb-12 text-[#A0A6B5] text-xs">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C4DFF] to-[#00D6A3] flex items-center justify-center text-white font-bold">
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">ARURA</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#7C4DFF]/30 text-[#00D6A3]">PRO</span>
          </div>
          <p className="leading-relaxed">
            {language === 'bn' 
              ? 'প্রিমিয়াম অল-ইন-ওয়ান বিনোদন স্ট্রিমিং প্ল্যাটফর্ম। সিনেমা, নাটক, লাইভ টিভি, স্পোর্টস ও এআই রিকমেন্ডেশন।'
              : 'Premium all-in-one entertainment streaming platform. Movies, drama, live TV, sports and AI recommendation.'}
          </p>
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <span>Bangla First (বাংলা)</span>
            <span>•</span>
            <span>Media3 HLS Engine</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider mb-3">
            {language === 'bn' ? 'কনটেন্ট ক্যাটাগরি' : 'Content Categories'}
          </h4>
          <ul className="space-y-2">
            <li><button onClick={() => setActiveTab('bangla_hub')} className="hover:text-white transition-colors">বাংলা নাটক ও টেলিফিল্ম</button></li>
            <li><button onClick={() => setActiveTab('movies')} className="hover:text-white transition-colors">ব্লকবাস্টার সিনেমা</button></li>
            <li><button onClick={() => setActiveTab('series')} className="hover:text-white transition-colors">ওয়েব সিরিজ</button></li>
            <li><button onClick={() => setActiveTab('live_tv')} className="hover:text-white transition-colors">লাইভ টেলিভিশন (EPG)</button></li>
            <li><button onClick={() => setActiveTab('sports')} className="hover:text-white transition-colors">লাইভ ক্রিকেট ও ফুটবল</button></li>
          </ul>
        </div>

        {/* Help & Policies */}
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider mb-3">
            {language === 'bn' ? 'সহায়তা ও নীতিমালা' : 'Support & Terms'}
          </h4>
          <ul className="space-y-2">
            <li><span className="hover:text-white transition-colors cursor-pointer">{language === 'bn' ? 'ব্যবহারবিধি ও শর্তাবলী' : 'Terms of Service'}</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">{language === 'bn' ? 'গোপনীয়তা সুরক্ষা' : 'Privacy Policy'}</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">{language === 'bn' ? 'হেল্প সেন্টার ও সাপোর্ট' : 'Help Center'}</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">{language === 'bn' ? 'কপিরাইট ও লাইসেন্স' : 'Copyright & Licensing'}</span></li>
          </ul>
        </div>

        {/* Language & Security */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider mb-3">
            {language === 'bn' ? 'ভাষা ও সেটিংস' : 'Language & Region'}
          </h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage('bn')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                language === 'bn' ? 'bg-[#7C4DFF] text-white border-[#7C4DFF]' : 'bg-white/5 text-gray-300 border-white/10'
              }`}
            >
              বাংলা (Default)
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                language === 'en' ? 'bg-[#7C4DFF] text-white border-[#7C4DFF]' : 'bg-white/5 text-gray-300 border-white/10'
              }`}
            >
              English
            </button>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-gray-500">
            <span>© 2026 Arura Entertainment Inc. All rights reserved.</span>
            <button
              onClick={openAdminPanel}
              className="p-1 rounded text-gray-600 hover:text-amber-400/80 transition-colors"
              title="Admin Access"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
