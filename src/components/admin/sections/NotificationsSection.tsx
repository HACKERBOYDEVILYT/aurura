import React, { useState } from 'react';
import { Bell, Send, CheckCircle2, Users, Radio, Sparkles } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

interface NotifItem {
  id: string;
  title: string;
  titleEn: string;
  body: string;
  bodyEn: string;
  category: string;
  targetAudience: string;
  sentTime: string;
  status: string;
  deliveredCount: number;
  openRate: string;
}

interface NotificationsSectionProps {
  notifications: NotifItem[];
  onRefresh: () => void;
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({ notifications, onRefresh }) => {
  const { language, showToast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    titleEn: '',
    body: '',
    bodyEn: '',
    category: 'PUSH',
    targetAudience: 'ALL'
  });
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await fetch('/api/v1/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        showToast(language === 'bn' ? 'পুশ নোটিফিকেশন সফলভাবে পাঠানো হয়েছে!' : 'Notification broadcasted successfully!');
        setShowModal(false);
        setForm({ title: '', titleEn: '', body: '', bodyEn: '', category: 'PUSH', targetAudience: 'ALL' });
        onRefresh();
      }
    } catch {
      showToast('Error sending notification');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#171B26] border border-white/10">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <span>{language === 'bn' ? 'পুশ নোটিফিকেশন ও অডিয়েন্স সেন্টার' : 'Push Notification Center'}</span>
          </h2>
          <p className="text-xs text-[#A0A6B5] mt-0.5">
            {language === 'bn' ? 'সরাসরি অ্যান্ড্রয়েড অ্যাপ এবং ওয়েব দর্শকদের কাছে বার্তা সম্প্রচার ও ওপেন রেট ট্র্যাকিং' : 'Broadcast system announcements, match alerts, and premier releases'}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-[#7C4DFF] text-black font-bold text-xs shadow-lg shadow-amber-400/20 transition-all shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন নোটিফিকেশন পাঠান' : 'Broadcast Alert'}</span>
        </button>
      </div>

      {/* History Table */}
      <div className="rounded-2xl bg-[#171B26] border border-white/10 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            {language === 'bn' ? 'সম্প্রচারিত বিজ্ঞপ্তিসমূহ' : 'Broadcast History'}
          </h3>
          <span className="text-xs text-[#A0A6B5]">Total: {notifications.length} alerts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#A0A6B5]">
            <thead className="bg-[#090B10] text-[11px] font-bold text-gray-300 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="p-3.5 pl-4">{language === 'bn' ? 'বার্তা ও শিরোনাম' : 'Message'}</th>
                <th className="p-3.5">{language === 'bn' ? 'ক্যাটাগরি' : 'Category'}</th>
                <th className="p-3.5">{language === 'bn' ? 'টার্গেট অডিয়েন্স' : 'Target'}</th>
                <th className="p-3.5">{language === 'bn' ? 'ডেলিভারি / ওপেন রেট' : 'Delivered / Open'}</th>
                <th className="p-3.5 text-right pr-4">{language === 'bn' ? 'সময়' : 'Timestamp'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {notifications.map((notif) => (
                <tr key={notif.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 pl-4 max-w-sm">
                    <p className="font-bold text-white text-xs">{notif.title}</p>
                    <p className="text-[11px] text-gray-400 line-clamp-1">{notif.body}</p>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#7C4DFF]/20 text-[#7C4DFF]">
                      {notif.category}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-gray-300">
                      {notif.targetAudience}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <p className="text-white font-bold">{notif.deliveredCount?.toLocaleString()} devices</p>
                    <p className="text-[10px] text-[#00D6A3] font-semibold">{notif.openRate} open rate</p>
                  </td>
                  <td className="p-3 text-right pr-4 whitespace-nowrap text-gray-400">
                    {new Date(notif.sentTime).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#171B26] border border-white/10 shadow-2xl p-6 sm:p-8">
            <h3 className="text-xl font-black text-white mb-4">
              {language === 'bn' ? 'নতুন পুশ নোটিফিকেশন পাঠান' : 'Broadcast Push Notification'}
            </h3>

            <form onSubmit={handleSend} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  {language === 'bn' ? 'বিজ্ঞপ্তির শিরোনাম (বাংলা)' : 'Title (Bangla)'}
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="যেমন: নতুন বিপিএল ম্যাচ শুরু হয়েছে!"
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  {language === 'bn' ? 'বিস্তারিত বার্তা (বাংলা)' : 'Body Message (Bangla)'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="দর্শক বন্ধুদের এখনই আরুরা অ্যাপে চোখ রাখতে আমন্ত্রণ জানানো হচ্ছে..."
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">ক্যাটাগরি</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                  >
                    <option value="PUSH">General Push</option>
                    <option value="SPORTS">Live Sports Alert</option>
                    <option value="RELEASE">Movie / Drama Release</option>
                    <option value="SYSTEM">System Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">টার্গেট অডিয়েন্স</label>
                  <select
                    value={form.targetAudience}
                    onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                    className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                  >
                    <option value="ALL">All Active Users</option>
                    <option value="VIP">VIP Subscribers Only</option>
                    <option value="FREE">Free Users Only</option>
                    <option value="SPORTS_FAN">Cricket & Sports Fans</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-xs text-gray-300"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-[#7C4DFF] text-xs font-bold text-black shadow-lg"
                >
                  {isSending ? 'Broadcasting...' : (language === 'bn' ? 'সম্প্রচার করুন' : 'Broadcast Now')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
