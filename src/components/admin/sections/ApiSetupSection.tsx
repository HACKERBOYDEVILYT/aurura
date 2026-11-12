import React, { useState, useEffect } from 'react';
import { 
  Plug, Plus, Play, CheckCircle2, XCircle, Activity, 
  ExternalLink, Trash2, Edit2, RefreshCw, Key, Code2, 
  Sliders, Shield, Server, Film, Radio, Trophy, DollarSign, Sparkles, MessageSquare, AlertCircle
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export interface CustomApiItem {
  id: string;
  name: string;
  category: 'STREAMING' | 'METADATA' | 'EPG' | 'SPORTS' | 'PAYMENT' | 'AI' | 'SMS' | 'CUSTOM';
  description: string;
  baseUrl: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT';
  authType: 'BEARER' | 'HEADER_KEY' | 'QUERY_PARAM' | 'BASIC' | 'NONE';
  authHeaderName?: string;
  authSecret?: string;
  customHeaders?: Record<string, string>;
  requestPayload?: string;
  isActive: boolean;
  syncIntervalMinutes?: number;
  lastTestedAt?: string;
  lastTestStatus?: 'SUCCESS' | 'FAILED' | 'PENDING';
  lastLatencyMs?: number;
  lastResponsePreview?: string;
}

const PRESETS = [
  {
    name: 'TMDB (The Movie Database)',
    category: 'METADATA' as const,
    baseUrl: 'https://api.themoviedb.org/3',
    endpoint: '/movie/popular?language=bn-BD',
    method: 'GET' as const,
    authType: 'BEARER' as const,
    authHeaderName: 'Authorization',
    authSecret: 'Bearer YOUR_TMDB_READ_ACCESS_TOKEN',
    description: 'সিনেমা, সিরিজ, কাস্ট ও পোস্টার মেটাডাটা ব্যাকএন্ডে অটো-ইম্পোর্ট করার জন্য।'
  },
  {
    name: 'IPTV / M3U8 Video Streaming Origin',
    category: 'STREAMING' as const,
    baseUrl: 'https://test-streams.mux.dev',
    endpoint: '/x36xhzz/x36xhzz.m3u8',
    method: 'GET' as const,
    authType: 'NONE' as const,
    description: 'বাস্তব লাইভ স্ট্রিমিং সার্ভার বা HLS m3u8 মাস্টার প্লেলিস্ট সোর্স।'
  },
  {
    name: 'Live Cricket Score API (CricAPI)',
    category: 'SPORTS' as const,
    baseUrl: 'https://api.cricapi.com/v1',
    endpoint: '/currentMatches',
    method: 'GET' as const,
    authType: 'QUERY_PARAM' as const,
    authHeaderName: 'apikey',
    authSecret: 'YOUR_CRICAPI_KEY',
    description: 'বিপিএল ও আন্তর্জাতিক ক্রিকেট লাইভ বল-বাই-বল স্কোরবোর্ড ফিড।'
  },
  {
    name: 'bKash Tokenized Checkout API',
    category: 'PAYMENT' as const,
    baseUrl: 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',
    endpoint: '/tokenized/checkout/create',
    method: 'POST' as const,
    authType: 'HEADER_KEY' as const,
    authHeaderName: 'X-KM-Api-Version',
    authSecret: 'v1.2.0-beta',
    description: 'বিকাশ সরাসরি পেমেন্ট গেটওয়ে - গ্রাহক সাবস্ক্রিপশন অটোমেশন।'
  },
  {
    name: 'Custom REST API / Stream Server',
    category: 'CUSTOM' as const,
    baseUrl: 'https://api.myserver.com',
    endpoint: '/v1/stream-catalog',
    method: 'GET' as const,
    authType: 'HEADER_KEY' as const,
    authHeaderName: 'X-API-Key',
    authSecret: 'my_secret_key_123',
    description: 'যেকোনো কাস্টম সার্ভার, ওটিটি ব্যাকএন্ড বা ডেটাবেজ এপিআই।'
  }
];

export const ApiSetupSection: React.FC = () => {
  const { language, showToast } = useApp();
  const [apis, setApis] = useState<CustomApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);

  // Response preview modal
  const [testResult, setTestResult] = useState<any>(null);

  // Add / Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{
    name: string;
    category: CustomApiItem['category'];
    description: string;
    baseUrl: string;
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT';
    authType: 'BEARER' | 'HEADER_KEY' | 'QUERY_PARAM' | 'BASIC' | 'NONE';
    authHeaderName: string;
    authSecret: string;
    requestPayload: string;
    syncIntervalMinutes: number;
  }>({
    name: '',
    category: 'STREAMING',
    description: '',
    baseUrl: '',
    endpoint: '',
    method: 'GET',
    authType: 'NONE',
    authHeaderName: '',
    authSecret: '',
    requestPayload: '',
    syncIntervalMinutes: 0
  });

  // Quick URL Tester Modal
  const [showQuickTest, setShowQuickTest] = useState(false);
  const [quickUrl, setQuickUrl] = useState('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
  const [quickResult, setQuickResult] = useState<any>(null);
  const [isQuickTesting, setIsQuickTesting] = useState(false);

  const fetchApis = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/admin/integrations');
      const data = await res.json();
      if (data.results) setApis(data.results);
    } catch {
      console.error('Failed to load APIs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApis();
  }, []);

  const handleTestApi = async (item: CustomApiItem) => {
    setTestingId(item.id);
    try {
      const res = await fetch(`/api/v1/admin/integrations/${item.id}/test`, { method: 'POST' });
      const data = await res.json();
      setTestResult({
        name: item.name,
        url: item.baseUrl + (item.endpoint ? (item.endpoint.startsWith('/') ? item.endpoint : '/' + item.endpoint) : ''),
        ...data
      });
      if (res.ok) {
        showToast(language === 'bn' ? `কানেকশন সফল! (${data.latencyMs}ms, HTTP ${data.statusCode})` : `Connected! (${data.latencyMs}ms, HTTP ${data.statusCode})`);
      } else {
        showToast(`Test failed: ${data.message || 'Error'}`);
      }
      fetchApis();
    } catch (err: any) {
      showToast(`Network error: ${err.message}`);
    } finally {
      setTestingId(null);
    }
  };

  const handleRunQuickTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsQuickTesting(true);
    try {
      const res = await fetch('/api/v1/admin/integrations/quick-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: quickUrl })
      });
      const data = await res.json();
      setQuickResult(data);
    } catch (err: any) {
      setQuickResult({ status: 'error', message: err.message });
    } finally {
      setIsQuickTesting(false);
    }
  };

  const handleSaveApi = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/v1/admin/integrations/${editingId}` : '/api/v1/admin/integrations';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        showToast(language === 'bn' ? 'এপিআই সফলভাবে সংরক্ষিত হয়েছে' : 'API configured successfully');
        setShowModal(false);
        setEditingId(null);
        fetchApis();
      }
    } catch {
      showToast('Error saving API');
    }
  };

  const handleDeleteApi = async (item: CustomApiItem) => {
    if (!window.confirm(language === 'bn' ? `আপনি কি নিশ্চিতভাবে "${item.name}" মুছে ফেলতে চান?` : `Delete API "${item.name}"?`)) return;
    try {
      const res = await fetch(`/api/v1/admin/integrations/${item.id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(language === 'bn' ? 'এপিআই মুছে ফেলা হয়েছে' : 'API deleted');
        fetchApis();
      }
    } catch {
      showToast('Error deleting API');
    }
  };

  const handleToggleActive = async (item: CustomApiItem) => {
    try {
      const res = await fetch(`/api/v1/admin/integrations/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !item.isActive })
      });
      if (res.ok) {
        showToast(language === 'bn' ? 'স্ট্যাটাস আপডেট হয়েছে' : 'Status updated');
        fetchApis();
      }
    } catch {
      showToast('Error updating status');
    }
  };

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setForm({
      name: preset.name,
      category: preset.category,
      description: preset.description,
      baseUrl: preset.baseUrl,
      endpoint: preset.endpoint,
      method: preset.method,
      authType: preset.authType,
      authHeaderName: preset.authHeaderName || '',
      authSecret: preset.authSecret || '',
      requestPayload: '',
      syncIntervalMinutes: 60
    });
  };

  const getCategoryIcon = (category: CustomApiItem['category']) => {
    switch (category) {
      case 'STREAMING': return Server;
      case 'METADATA': return Film;
      case 'EPG': return Radio;
      case 'SPORTS': return Trophy;
      case 'PAYMENT': return DollarSign;
      case 'AI': return Sparkles;
      case 'SMS': return MessageSquare;
      default: return Plug;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-[#171B26] via-[#11141D] to-[#171B26] border border-white/10 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#00D6A3]/10 border border-[#00D6A3]/20 text-[#00D6A3]">
              <Plug className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-white">
              {language === 'bn' ? 'যেকোনো API সেটআপ ও ইন্টিগ্রেশন হাব' : 'Universal API Setup & Integration Hub'}
            </h2>
          </div>
          <p className="text-xs text-[#A0A6B5] max-w-2xl leading-relaxed">
            {language === 'bn' 
              ? 'এখান থেকে যেকোনো ওটিটি স্ট্রিমিং সার্ভার (HLS/IPTV), TMDB মেটাডাটা, বিকাশ পেমেন্ট গেটওয়ে, লাইভ স্পোর্টস স্কোরবোর্ড, বা কাস্টম ওয়েবহুক যুক্ত ও লাইভ টেস্ট করুন।'
              : 'Configure, test, and manage ANY external API (HLS/IPTV video servers, TMDB metadata, bKash checkout, live sports feeds, AI engines, and custom webhooks).'}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowQuickTest(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
          >
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>{language === 'bn' ? 'কুইক URL টেস্ট' : 'Quick URL Tester'}</span>
          </button>

          <button
            onClick={() => {
              setEditingId(null);
              setForm({
                name: '',
                category: 'STREAMING',
                description: '',
                baseUrl: '',
                endpoint: '',
                method: 'GET',
                authType: 'NONE',
                authHeaderName: '',
                authSecret: '',
                requestPayload: '',
                syncIntervalMinutes: 0
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#00D6A3] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-[#7C4DFF]/30 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন API যুক্ত করুন' : 'Add New API'}</span>
          </button>
        </div>
      </div>

      {/* Preset Quick-Buttons Bar */}
      <div className="p-4 rounded-2xl bg-[#171B26] border border-white/10 space-y-2.5">
        <span className="text-[11px] font-bold text-[#A0A6B5] uppercase tracking-wider block">
          {language === 'bn' ? '১-ক্লিকে জনপ্রিয় API টেমপ্লেট নির্বাচন করুন:' : '1-Click Popular API Presets:'}
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                loadPreset(p);
                setEditingId(null);
                setShowModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#090B10] hover:bg-white/10 border border-white/5 hover:border-[#7C4DFF] text-xs font-semibold text-gray-300 hover:text-white whitespace-nowrap transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-[#00D6A3]" />
              <span>{p.name.split(' ')[0]}</span>
              <span className="text-[10px] text-gray-500">({p.category})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Configured APIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apis.map((api) => {
          const Icon = getCategoryIcon(api.category);
          const isTesting = testingId === api.id;

          return (
            <div 
              key={api.id} 
              className={`p-5 rounded-2xl bg-[#171B26] border transition-all shadow-xl flex flex-col justify-between space-y-4 ${
                api.isActive ? 'border-white/10 hover:border-[#7C4DFF]/50' : 'border-white/5 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#7C4DFF]/20 to-[#00D6A3]/20 border border-white/10 text-[#00D6A3] shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                        <span>{api.name}</span>
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-white/10 text-gray-300">
                          {api.category}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#7C4DFF]/20 text-[#7C4DFF]">
                          {api.method}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          Auth: {api.authType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleActive(api)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                      api.isActive 
                        ? 'bg-[#00D6A3]/20 text-[#00D6A3] border-[#00D6A3]/30' 
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}
                  >
                    {api.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </button>
                </div>

                <p className="text-xs text-[#A0A6B5] line-clamp-2">
                  {api.description}
                </p>

                {/* URL and Endpoint display */}
                <div className="p-2.5 rounded-xl bg-[#090B10] border border-white/5 font-mono text-xs text-gray-300 break-all space-y-1">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Target Endpoint</div>
                  <div className="text-cyan-300">
                    {api.baseUrl}
                    <span className="text-white font-bold">{api.endpoint}</span>
                  </div>
                </div>

                {/* Health & Latency status */}
                <div className="flex items-center justify-between text-xs text-[#A0A6B5] pt-1">
                  <div className="flex items-center gap-1.5">
                    {api.lastTestStatus === 'SUCCESS' ? (
                      <span className="flex items-center gap-1 text-[#00D6A3] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Connected</span>
                      </span>
                    ) : api.lastTestStatus === 'FAILED' ? (
                      <span className="flex items-center gap-1 text-red-400 font-bold">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Failed</span>
                      </span>
                    ) : (
                      <span className="text-gray-400">Not tested</span>
                    )}
                    {api.lastLatencyMs && (
                      <span className="text-gray-400 font-mono">({api.lastLatencyMs}ms)</span>
                    )}
                  </div>

                  {api.lastTestedAt && (
                    <span className="text-[10px] text-gray-500">
                      {new Date(api.lastTestedAt).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleTestApi(api)}
                  disabled={isTesting}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#00D6A3]/20 to-[#00D6A3]/10 hover:bg-[#00D6A3]/30 border border-[#00D6A3]/30 text-[#00D6A3] text-xs font-bold transition-all"
                >
                  <Activity className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Testing Feed...' : (language === 'bn' ? 'লাইভ টেস্ট করুন' : 'Test Live Connection')}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingId(api.id);
                      setForm({
                        name: api.name,
                        category: api.category,
                        description: api.description,
                        baseUrl: api.baseUrl,
                        endpoint: api.endpoint,
                        method: api.method,
                        authType: api.authType,
                        authHeaderName: api.authHeaderName || '',
                        authSecret: api.authSecret || '',
                        requestPayload: api.requestPayload || '',
                        syncIntervalMinutes: api.syncIntervalMinutes || 0
                      });
                      setShowModal(true);
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                    title="Edit API"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteApi(api)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    title="Delete API"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit API Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#171B26] border border-white/10 shadow-2xl p-6 sm:p-8 my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-xl font-black text-white mb-1">
              {editingId ? (language === 'bn' ? 'API কনফিগারেশন পরিবর্তন করুন' : 'Edit API Integration') :
                           (language === 'bn' ? 'যেকোনো নতুন API সেটআপ করুন' : 'Setup Any New API')}
            </h3>
            <p className="text-xs text-[#A0A6B5] mb-5">
              {language === 'bn' ? 'ভিডিও স্ট্রিমিং, মেটাডাটা, পেমেন্ট, লাইভ স্কোর বা কাস্টম ওয়েবহুক যুক্ত করুন' : 'Configure video streams, metadata feeds, payment gateways, live sports or custom APIs.'}
            </p>

            <form onSubmit={handleSaveApi} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    {language === 'bn' ? 'এপিআই-এর নাম' : 'API Friendly Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. My Xtream Server / TMDB"
                    className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    {language === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                  >
                    <option value="STREAMING">Video Streaming & IPTV (HLS/M3U8/DASH)</option>
                    <option value="METADATA">Movie & Series Metadata (TMDB/OMDB)</option>
                    <option value="SPORTS">Live Sports Scores Feed</option>
                    <option value="EPG">Live TV & EPG XMLTV</option>
                    <option value="PAYMENT">Payment Gateway (bKash/Nagad/Cards)</option>
                    <option value="AI">AI & Machine Learning (Gemini/OpenAI)</option>
                    <option value="SMS">SMS & Notification Gateway</option>
                    <option value="CUSTOM">Custom REST API / Webhook</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  {language === 'bn' ? 'সংক্ষিপ্ত বিবরণ' : 'Description'}
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Primary 4K streaming origin cluster"
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>

              {/* Base URL and Endpoint */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Base URL (হোস্ট বা সার্ভার ঠিকানা)
                  </label>
                  <input
                    type="url"
                    required
                    value={form.baseUrl}
                    onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
                    placeholder="https://api.themoviedb.org/3 or http://my-server.com:8080"
                    className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">HTTP Method</label>
                  <select
                    value={form.method}
                    onChange={(e) => setForm({ ...form, method: e.target.value as any })}
                    className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Endpoint Path (এন্ডপয়েন্ট রুট ও কুয়েরি)
                </label>
                <input
                  type="text"
                  value={form.endpoint}
                  onChange={(e) => setForm({ ...form, endpoint: e.target.value })}
                  placeholder="/movie/popular?api_key=... or /live/stream.m3u8"
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>

              {/* Authentication Type */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                <span className="text-xs font-bold text-white block">
                  {language === 'bn' ? 'অথেন্টিকেশন ও সিকিউরিটি টোকেন' : 'Authentication & Security Credentials'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Auth Type</label>
                    <select
                      value={form.authType}
                      onChange={(e) => setForm({ ...form, authType: e.target.value as any })}
                      className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                    >
                      <option value="NONE">No Auth (Public)</option>
                      <option value="BEARER">Bearer Token (Authorization)</option>
                      <option value="HEADER_KEY">Custom Header Key (e.g. X-API-Key)</option>
                      <option value="QUERY_PARAM">Query Parameter (e.g. ?apikey=...)</option>
                      <option value="BASIC">Basic Auth (Base64)</option>
                    </select>
                  </div>

                  {form.authType !== 'NONE' && (
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">Header / Param Name</label>
                      <input
                        type="text"
                        value={form.authHeaderName}
                        onChange={(e) => setForm({ ...form, authHeaderName: e.target.value })}
                        placeholder={form.authType === 'BEARER' ? 'Authorization' : 'X-API-Key'}
                        className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                      />
                    </div>
                  )}
                </div>

                {form.authType !== 'NONE' && (
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">API Secret Key / Token</label>
                    <input
                      type="password"
                      value={form.authSecret}
                      onChange={(e) => setForm({ ...form, authSecret: e.target.value })}
                      placeholder="Paste your secret token here..."
                      className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                    />
                  </div>
                )}
              </div>

              {/* POST Payload (if applicable) */}
              {form.method !== 'GET' && (
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    JSON Request Payload (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={form.requestPayload}
                    onChange={(e) => setForm({ ...form, requestPayload: e.target.value })}
                    placeholder='{"key": "value"}'
                    className="w-full bg-[#090B10] border border-white/10 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-[#7C4DFF]"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition-colors"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#00D6A3] text-xs font-bold text-white shadow-lg shadow-[#7C4DFF]/30 transition-all"
                >
                  {language === 'bn' ? 'API সংরক্ষণ করুন' : 'Save Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Response Preview Modal */}
      {testResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#171B26] border border-white/10 shadow-2xl p-6 sm:p-8 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>API Response: {testResult.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    testResult.isOk ? 'bg-[#00D6A3]/20 text-[#00D6A3]' : 'bg-red-500/20 text-red-400'
                  }`}>
                    HTTP {testResult.statusCode} {testResult.statusText}
                  </span>
                </h3>
                <p className="text-xs text-cyan-400 font-mono mt-0.5 truncate max-w-lg">{testResult.url}</p>
              </div>
              <span className="text-xs text-[#00D6A3] font-mono font-bold bg-[#00D6A3]/10 px-2.5 py-1 rounded-xl">
                {testResult.latencyMs}ms
              </span>
            </div>

            <div className="flex-1 overflow-y-auto my-4 p-4 rounded-xl bg-[#090B10] border border-white/5 font-mono text-xs text-gray-300 custom-scrollbar whitespace-pre-wrap">
              {testResult.preview || 'No response content returned.'}
            </div>

            <button
              onClick={() => setTestResult(null)}
              className="py-2.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors self-end"
            >
              {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Quick URL Tester Modal */}
      {showQuickTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#171B26] border border-white/10 shadow-2xl p-6 sm:p-8 max-h-[85vh] flex flex-col">
            <h3 className="text-lg font-black text-white mb-1">
              {language === 'bn' ? 'যেকোনো URL বা এপিআই দ্রুত পরীক্ষা করুন' : 'Quick URL / Stream Inspector'}
            </h3>
            <p className="text-xs text-[#A0A6B5] mb-4">
              {language === 'bn' ? 'যেকোনো লাইভ m3u8 স্ট্রিম বা রেস্ট এপিআই অ্যান্ডপয়েন্টে সরাসরি সংযোগ যাচাই করুন' : 'Test any live stream link or JSON endpoint before configuring it in production.'}
            </p>

            <form onSubmit={handleRunQuickTest} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="url"
                  required
                  value={quickUrl}
                  onChange={(e) => setQuickUrl(e.target.value)}
                  placeholder="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
                  className="flex-1 bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
                <button
                  type="submit"
                  disabled={isQuickTesting}
                  className="px-4 py-2 rounded-xl bg-[#00D6A3] text-black font-bold text-xs hover:opacity-95 shadow transition-all shrink-0 flex items-center gap-1.5"
                >
                  <Activity className={`w-3.5 h-3.5 ${isQuickTesting ? 'animate-spin' : ''}`} />
                  <span>{isQuickTesting ? 'Testing...' : 'Test Now'}</span>
                </button>
              </div>
            </form>

            {quickResult && (
              <div className="mt-4 flex-1 overflow-hidden flex flex-col space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Result: HTTP {quickResult.statusCode}</span>
                  {quickResult.latencyMs && (
                    <span className="text-[#00D6A3] font-mono">{quickResult.latencyMs}ms</span>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto p-3 rounded-xl bg-[#090B10] border border-white/5 font-mono text-[11px] text-cyan-300 max-h-48 custom-scrollbar whitespace-pre-wrap">
                  {quickResult.preview || quickResult.message}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setShowQuickTest(false);
                setQuickResult(null);
              }}
              className="mt-4 py-2 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold self-end"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
