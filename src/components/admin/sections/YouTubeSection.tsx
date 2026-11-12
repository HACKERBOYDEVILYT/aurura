import React, { useState } from 'react';
import { Music2, RefreshCw, CheckCircle2, Youtube, ExternalLink, Zap } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const YouTubeSection: React.FC = () => {
  const { language, showToast } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('আজ সকাল ০৮:০০');

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/v1/admin/youtube/sync', { method: 'POST' });
      if (res.ok) {
        setLastSync(language === 'bn' ? 'এইমাত্র' : 'Just now');
        showToast(language === 'bn' ? 'ইউটিউব শর্টস ও মিউজিক মেটাডাটা সিঙ্ক সম্পন্ন হয়েছে' : 'YouTube content metadata synced');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const channels = [
    { name: 'Arura Bangla Originals', id: 'UC_arura_bangla', subs: '2.4M', category: 'Bangla Drama & Shorts' },
    { name: 'Arura Music Station', id: 'UC_arura_music', subs: '1.8M', category: 'High-Res Audio & Bengali Songs' },
    { name: 'Arura Sports Highlights', id: 'UC_arura_sports', subs: '3.1M', category: 'Cricket & Football Clips' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#171B26] border border-white/10">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Music2 className="w-5 h-5 text-red-500" />
            <span>{language === 'bn' ? 'ইউটিউব শর্টস ও ব্যাকগ্রাউন্ড মিউজিক ইন্টিগ্রেশন' : 'YouTube Shorts & Music Mode Integration'}</span>
          </h2>
          <p className="text-xs text-[#A0A6B5] mt-0.5">
            {language === 'bn' ? 'অফিসিয়াল ইউটিউব এপিআই মেটাডাটা, শর্টস ডিসকভারি ও অডিও মোড পলিসি' : 'Manage permitted YouTube embeds, vertical Shorts feed, and audio-only playback'}
          </p>
        </div>

        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : (language === 'bn' ? 'এখনই সিঙ্ক করুন' : 'Sync Channels Now')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Monitored Channels */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#171B26] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>{language === 'bn' ? 'অনুমোদিত মনিটরড চ্যানেলসমূহ' : 'Monitored Official Channels'}</span>
            <span className="text-xs text-[#A0A6B5]">সর্বশেষ সিঙ্ক: {lastSync}</span>
          </h3>

          <div className="space-y-3">
            {channels.map((ch, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#090B10] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shrink-0">
                    <Youtube className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">{ch.name}</h4>
                    <p className="text-[10px] text-gray-400">{ch.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white block">{ch.subs}</span>
                  <span className="text-[10px] text-[#00D6A3]">Auto-Ingest Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quota & Policies */}
        <div className="p-5 rounded-2xl bg-[#171B26] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white">
            {language === 'bn' ? 'ইউটিউব এপিআই কোটা' : 'API Quota Tracker'}
          </h3>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[#A0A6B5]">দৈনিক ব্যবহৃত ইউনিট:</span>
              <strong className="text-white">2,340 / 10,000</strong>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div style={{ width: '23.4%' }} className="h-full bg-red-500 rounded-full" />
            </div>
            <span className="text-[10px] text-gray-400">76.6% Quota Remaining for Today</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2 text-xs text-[#A0A6B5]">
            <strong className="text-white block font-bold">পলিসি কমপ্লায়েন্স:</strong>
            <p>
              {language === 'bn' 
                ? '• অফিসিয়াল ইউটিউব আইফ্রেম ও এমবেড ব্যবহার করা হয়; কোনো অননুমোদিত স্ট্রিম নিষ্কাশন নেই।'
                : '• Strictly adheres to official YouTube embed policies; no unauthorized video extraction.'}
            </p>
            <p>
              {language === 'bn' 
                ? '• মিউজিক মোডে অনুমোদিত লিরিক্স ও ডিস্ক অ্যানিমেশন ব্যাকগ্রাউন্ডে প্রদর্শিত হয়।'
                : '• High-fidelity 320kbps vinyl simulation in background audio mode.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
