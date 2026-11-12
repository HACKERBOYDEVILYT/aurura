import React, { useState } from 'react';
import { Server, Plus, Activity, CheckCircle2, AlertTriangle, X, Shield, RefreshCw } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

interface StreamingSource {
  id: string;
  contentId: string;
  contentTitle: string;
  sourceName: string;
  protocol: 'HLS' | 'DASH' | 'MP4';
  primaryUrl: string;
  backupUrl: string;
  quality: '4K' | '1080p' | '720p' | '480p';
  audioLanguage: string;
  subtitleLanguage: string;
  priority: number;
  status: 'ACTIVE' | 'DEGRADED' | 'DOWN';
  uptimePercentage: number;
  latencyMs: number;
  lastChecked: string;
}

interface StreamingSectionProps {
  sources: StreamingSource[];
  onRefresh: () => void;
}

export const StreamingSection: React.FC<StreamingSectionProps> = ({ sources, onRefresh }) => {
  const { language, showToast } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    contentTitle: '',
    sourceName: '',
    protocol: 'HLS' as const,
    primaryUrl: '',
    backupUrl: '',
    quality: '1080p' as const,
    audioLanguage: 'Bengali (5.1)',
    subtitleLanguage: 'Bengali, English'
  });

  const handleTestHealth = async (id: string, name: string) => {
    setTestingId(id);
    try {
      const res = await fetch(`/api/v1/admin/streaming/${id}/check-health`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showToast(language === 'bn' ? `${name} সক্রিয় (${data.source.latencyMs}ms)` : `${name} operational (${data.source.latencyMs}ms)`);
        onRefresh();
      }
    } finally {
      setTestingId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/admin/streaming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        showToast(language === 'bn' ? 'নতুন স্ট্রিমিং সোর্স যুক্ত হয়েছে' : 'Streaming source created');
        setShowAddModal(false);
        onRefresh();
      }
    } catch {
      showToast('Error creating streaming source');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#171B26] border border-white/10">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-[#00D6A3]" />
            <span>{language === 'bn' ? 'স্ট্রিমিং সোর্স ও CDN ইঞ্জিন কন্ট্রোল' : 'Streaming Source & CDN Engine'}</span>
          </h2>
          <p className="text-xs text-[#A0A6B5] mt-0.5">
            {language === 'bn' ? 'HLS ও DASH অ্যাডাপ্টিভ বিটরেট সোর্স, অটো-ফেইলওভার ও ব্যান্ডউইথ হেলথ' : 'Configure multi-CDN failovers, HLS renditions, and playback SLAs'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D6A3] to-[#7C4DFF] text-black font-bold text-xs shadow-lg shadow-[#00D6A3]/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন সোর্স যোগ করুন' : 'Add Streaming Source'}</span>
        </button>
      </div>

      {/* Sources Table */}
      <div className="rounded-2xl bg-[#171B26] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#A0A6B5]">
            <thead className="bg-[#090B10] text-[11px] font-bold text-gray-300 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="p-3.5 pl-4">{language === 'bn' ? 'সোর্স নাম ও কনটেন্ট' : 'Source & Content'}</th>
                <th className="p-3.5">{language === 'bn' ? 'প্রটোকল / কোয়ালিটি' : 'Protocol / Quality'}</th>
                <th className="p-3.5">{language === 'bn' ? 'আপটাইম / লেটেন্সি' : 'Uptime / Latency'}</th>
                <th className="p-3.5">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="p-3.5 text-right pr-4">{language === 'bn' ? 'হেলথ টেস্ট' : 'Health Test'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sources.map((src) => (
                <tr key={src.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 pl-4">
                    <p className="font-bold text-white text-xs">{src.sourceName}</p>
                    <p className="text-[10px] text-gray-400">{src.contentTitle}</p>
                    <p className="text-[9px] font-mono text-gray-500 truncate max-w-xs mt-0.5">{src.primaryUrl}</p>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#7C4DFF]/20 text-[#7C4DFF]">
                      {src.protocol}
                    </span>
                    <span className="ml-2 font-bold text-white">{src.quality}</span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <p className="text-white font-bold">{src.uptimePercentage}%</p>
                    <p className="text-[10px] text-[#00D6A3]">{src.latencyMs}ms response</p>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00D6A3]/20 text-[#00D6A3] border border-[#00D6A3]/30">
                      <CheckCircle2 className="w-3 h-3" />
                      {src.status}
                    </span>
                  </td>
                  <td className="p-3 text-right pr-4 whitespace-nowrap">
                    <button
                      onClick={() => handleTestHealth(src.id, src.sourceName)}
                      disabled={testingId === src.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors ml-auto border border-white/5"
                    >
                      <Activity className={`w-3.5 h-3.5 text-[#00D6A3] ${testingId === src.id ? 'animate-spin' : ''}`} />
                      <span>{testingId === src.id ? 'Verifying...' : 'Ping Test'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#171B26] border border-white/10 shadow-2xl p-6 sm:p-8">
            <h3 className="text-xl font-black text-white mb-4">
              {language === 'bn' ? 'নতুন স্ট্রিমিং সোর্স যুক্ত করুন' : 'Add Streaming Source'}
            </h3>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  {language === 'bn' ? 'সোর্সের নাম' : 'Source Name'}
                </label>
                <input
                  type="text"
                  required
                  value={form.sourceName}
                  onChange={(e) => setForm({ ...form, sourceName: e.target.value })}
                  placeholder="e.g. Cloudflare R2 BDIX Multi-CDN"
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  {language === 'bn' ? 'কনটেন্টের শিরোনাম' : 'Content Title'}
                </label>
                <input
                  type="text"
                  required
                  value={form.contentTitle}
                  onChange={(e) => setForm({ ...form, contentTitle: e.target.value })}
                  placeholder="e.g. Hawa 4K Premiere"
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">প্রটোকল</label>
                  <select
                    value={form.protocol}
                    onChange={(e) => setForm({ ...form, protocol: e.target.value as any })}
                    className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                  >
                    <option value="HLS">HLS (.m3u8)</option>
                    <option value="DASH">MPEG-DASH (.mpd)</option>
                    <option value="MP4">MP4 Direct</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">সর্বোচ্চ রেজোলিউশন</label>
                  <select
                    value={form.quality}
                    onChange={(e) => setForm({ ...form, quality: e.target.value as any })}
                    className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                  >
                    <option value="4K">4K Ultra HD</option>
                    <option value="1080p">1080p Full HD</option>
                    <option value="720p">720p HD</option>
                    <option value="480p">480p SD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Primary Stream URL</label>
                <input
                  type="url"
                  required
                  value={form.primaryUrl}
                  onChange={(e) => setForm({ ...form, primaryUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Backup Failover URL (Optional)</label>
                <input
                  type="url"
                  value={form.backupUrl}
                  onChange={(e) => setForm({ ...form, backupUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-xs text-gray-300"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00D6A3] to-[#7C4DFF] text-xs font-bold text-black shadow-lg"
                >
                  {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Source'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
