import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertTriangle, Shield, CheckCircle2, Globe, Cpu } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const SettingsSection: React.FC = () => {
  const { language, showToast } = useApp();
  const [settings, setSettings] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/v1/admin/settings')
      .then(r => r.json())
      .then(data => {
        if (data.settings) setSettings(data.settings);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/v1/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        showToast(language === 'bn' ? 'সিস্টেম সেটিংস সফলভাবে সংরক্ষিত হয়েছে' : 'System settings updated');
      }
    } catch {
      showToast('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings) return null;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#171B26] border border-white/10">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#7C4DFF]" />
            <span>{language === 'bn' ? 'গ্লোবাল সিস্টেম সেটিংস ও কনফিগ' : 'Global System Settings & Rules'}</span>
          </h2>
          <p className="text-xs text-[#A0A6B5] mt-0.5">
            {language === 'bn' ? 'অ্যাপ্লিকেশন ভার্সন, রক্ষণাবেক্ষণ মোড, ক্লাউডফ্লেয়ার ক্যাশ ও ব্যানার ঘোষণা' : 'Manage app maintenance mode, CDN caching TTL, force updates, and system banners'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* General Information */}
          <div className="p-5 rounded-2xl bg-[#171B26] border border-white/10 space-y-3.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#00D6A3]" />
              <span>{language === 'bn' ? 'অ্যাপ্লিকেশন তথ্য' : 'App Information'}</span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">App Name</label>
              <input
                type="text"
                value={settings.appName}
                onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Production Version</label>
                <input
                  type="text"
                  value={settings.appVersion}
                  onChange={(e) => setSettings({ ...settings, appVersion: e.target.value })}
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Min Supported Version</label>
                <input
                  type="text"
                  value={settings.minSupportedVersion}
                  onChange={(e) => setSettings({ ...settings, minSupportedVersion: e.target.value })}
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
              />
            </div>
          </div>

          {/* Operational Toggles */}
          <div className="p-5 rounded-2xl bg-[#171B26] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>{language === 'bn' ? 'সিস্টেম স্ট্যাটাস ও কন্ট্রোল' : 'Operational Controls'}</span>
            </h3>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-xs font-bold text-white block">Maintenance Mode</strong>
                  <span className="text-[10px] text-[#A0A6B5]">Temporarily disable streaming playback for system updates</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="w-4 h-4 rounded text-[#7C4DFF]"
                />
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <div>
                  <strong className="text-xs font-bold text-white block">Force App Update</strong>
                  <span className="text-[10px] text-[#A0A6B5]">Prompt Android users below minimum version to upgrade</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.forceUpdate}
                  onChange={(e) => setSettings({ ...settings, forceUpdate: e.target.checked })}
                  className="w-4 h-4 rounded text-[#7C4DFF]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">CDN Provider & Storage</label>
              <input
                type="text"
                value={settings.cdnProvider}
                onChange={(e) => setSettings({ ...settings, cdnProvider: e.target.value })}
                className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
              />
            </div>
          </div>
        </div>

        {/* Global Announcement Banner */}
        <div className="p-5 rounded-2xl bg-[#171B26] border border-white/10 space-y-3">
          <label className="text-xs font-bold text-white uppercase tracking-wider block">
            {language === 'bn' ? 'শীর্ষ লাইভ ঘোষণা ব্যানার (Home Banner)' : 'Live Top Banner Announcement'}
          </label>
          <input
            type="text"
            value={settings.bannerAnnouncement}
            onChange={(e) => setSettings({ ...settings, bannerAnnouncement: e.target.value })}
            className="w-full bg-[#090B10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="py-3 px-8 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#00D6A3] text-white text-xs font-bold shadow-lg shadow-[#7C4DFF]/30 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : (language === 'bn' ? 'সকল সেটিংস সংরক্ষণ করুন' : 'Save System Settings')}</span>
        </button>
      </form>
    </div>
  );
};
