import React, { useState, useEffect } from 'react';
import { Sparkles, Save, CheckCircle2, Zap, Sliders, Shield } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const AiConfigSection: React.FC = () => {
  const { language, showToast } = useApp();
  const [config, setConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [model, setModel] = useState('gemini-3.8-flash');
  const [temperature, setTemperature] = useState(0.7);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [fallbackToCatalog, setFallbackToCatalog] = useState(true);

  useEffect(() => {
    fetch('/api/v1/admin/ai')
      .then(r => r.json())
      .then(data => {
        if (data.config) {
          setConfig(data.config);
          setModel(data.config.model);
          setTemperature(data.config.temperature);
          setSystemPrompt(data.config.systemPromptPreset);
          setFallbackToCatalog(data.config.fallbackToCatalog);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/v1/admin/ai', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, temperature, systemPromptPreset: systemPrompt, fallbackToCatalog })
      });
      if (res.ok) {
        showToast(language === 'bn' ? 'Gemini AI কনফিগারেশন সংরক্ষিত হয়েছে' : 'AI configuration saved');
      }
    } catch {
      showToast('Error saving AI config');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#171B26] border border-white/10">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00D6A3]" />
            <span>{language === 'bn' ? 'Gemini AI রিকমেন্ডেশন ইঞ্জিন কনফিগারেশন' : 'Gemini AI Recommendation Configuration'}</span>
          </h2>
          <p className="text-xs text-[#A0A6B5] mt-0.5">
            {language === 'bn' ? 'মডেল প্যারামিটার, বাংলা মেজাজ প্রম্পট টেমপ্লেট ও কোটা পর্যবেক্ষণ' : 'Manage model selection, Bengali cultural prompts, and API quota limits'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Settings Form */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#171B26] border border-white/10">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                {language === 'bn' ? 'নির্বাচিত AI মডেল' : 'Selected Gemini Model'}
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
              >
                <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended: Low latency, sub-second responses)</option>
                <option value="gemini-3.8-pro">gemini-3.8-pro (Complex reasoning & deep film analysis)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-300">
                  {language === 'bn' ? 'টেম্পারেচার (ক্রিয়েটিভিটি কন্ট্রোল):' : 'Temperature (Creativity):'} {temperature}
                </label>
                <span className="text-[10px] text-[#A0A6B5]">0.0 (Deterministic) - 1.0 (Creative)</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-[#00D6A3]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                {language === 'bn' ? 'সিস্টেম প্রম্পট টেমপ্লেট (বাংলা বিনোদন নির্দেশিকা)' : 'System Prompt Template (Bengali Guidance)'}
              </label>
              <textarea
                rows={4}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full bg-[#090B10] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#7C4DFF] leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fallbackToCatalog}
                  onChange={(e) => setFallbackToCatalog(e.target.checked)}
                  className="rounded bg-[#090B10] border-white/10 text-[#7C4DFF]"
                />
                <span>{language === 'bn' ? 'অফলাইন বা এপিআই লিমিটে অটোমেটিক ক্যাটালগ ফলব্যাক সক্রিয় রাখুন' : 'Enable resilient heuristic catalog fallback during offline/quota limits'}</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#00D6A3] text-white text-xs font-bold shadow-lg shadow-[#7C4DFF]/30 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : (language === 'bn' ? 'কনফিগারেশন সংরক্ষণ করুন' : 'Save AI Configuration')}</span>
            </button>
          </form>
        </div>

        {/* Quota & Telemetry Box */}
        <div className="p-6 rounded-2xl bg-[#171B26] border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{language === 'bn' ? 'এপিআই কোটা ও পারফরম্যান্স' : 'API Quota & Health'}</span>
            </h3>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#A0A6B5]">আজকের কোটা ব্যবহার:</span>
                <strong className="text-white">1,420 / 50,000</strong>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div style={{ width: '2.84%' }} className="h-full bg-[#00D6A3] rounded-full" />
              </div>
              <span className="text-[10px] text-[#00D6A3] font-semibold block">97.16% Quota Remaining</span>
            </div>

            <div className="space-y-1.5 text-xs text-[#A0A6B5]">
              <div className="flex justify-between">
                <span>গড় এআই রেসপন্স সময়:</span>
                <strong className="text-white">460 ms</strong>
              </div>
              <div className="flex justify-between">
                <span>SDK ভার্সন:</span>
                <strong className="text-[#7C4DFF]">@google/genai v2.4.0</strong>
              </div>
              <div className="flex justify-between">
                <span>কী স্টোরেজ:</span>
                <strong className="text-emerald-400">Server-Side Protected</strong>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>AI Discovery Service is active and responding to Bengali natural queries.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
