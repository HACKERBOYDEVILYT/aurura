import React, { useState } from 'react';
import { CreditCard, Plus, CheckCircle2, Shield, DollarSign } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

interface SubPlan {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'one_time';
  durationDays: number;
  features: string[];
  featuresEn: string[];
  maxStreams: number;
  quality: string;
  isActive: boolean;
  activeSubscribers: number;
}

interface SubscriptionsSectionProps {
  plans: SubPlan[];
  onRefresh: () => void;
}

export const SubscriptionsSection: React.FC<SubscriptionsSectionProps> = ({ plans, onRefresh }) => {
  const { language, showToast } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    nameEn: '',
    price: 99,
    currency: 'BDT',
    billingCycle: 'monthly',
    durationDays: 30,
    features: 'বিজ্ঞাপনমুক্ত লাইভ স্ট্রিমিং, 1080p HD',
    maxStreams: 2,
    quality: '1080p Full HD'
  });

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const featArr = form.features.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch('/api/v1/admin/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          features: featArr,
          featuresEn: featArr
        })
      });
      if (res.ok) {
        showToast(language === 'bn' ? 'নতুন সাবস্ক্রিপশন প্ল্যান তৈরি হয়েছে' : 'Subscription plan created');
        setShowAddModal(false);
        onRefresh();
      }
    } catch {
      showToast('Error creating plan');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#171B26] border border-white/10">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#00D6A3]" />
            <span>{language === 'bn' ? 'সাবস্ক্রিপশন প্ল্যান ও ট্যারিফ' : 'Subscription Plans & Tiers'}</span>
          </h2>
          <p className="text-xs text-[#A0A6B5] mt-0.5">
            {language === 'bn' ? 'ভিআইপি প্রিমিয়াম প্ল্যানের মূল্য নির্ধারণ, ডিভাইসের সীমা ও প্যাকেজ পরিচালনা' : 'Manage pricing tiers, multi-screen limits, and billing durations in BDT'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D6A3] to-[#7C4DFF] text-black font-bold text-xs shadow-lg shadow-[#00D6A3]/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন প্ল্যান তৈরি করুন' : 'Create New Plan'}</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <div key={plan.id} className="p-5 rounded-2xl bg-[#171B26] border border-white/10 space-y-4 hover:border-[#00D6A3]/40 transition-all flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00D6A3]/20 text-[#00D6A3] border border-[#00D6A3]/30">
                  {plan.billingCycle.toUpperCase()}
                </span>
                <span className="text-xs font-bold text-gray-300">
                  {plan.activeSubscribers.toLocaleString()} {language === 'bn' ? 'জন গ্রাহক' : 'Members'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white">{plan.name}</h3>
                <p className="text-xs text-gray-400">{plan.nameEn}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{plan.price}</span>
                <span className="text-xs text-[#A0A6B5] font-semibold">{plan.currency} / {plan.durationDays} days</span>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-2">
                <div className="text-[11px] text-gray-300 flex items-center justify-between">
                  <span>স্ক্রিন সীমা:</span>
                  <strong className="text-white">{plan.maxStreams} Devices</strong>
                </div>
                <div className="text-[11px] text-gray-300 flex items-center justify-between">
                  <span>স্ট্রিমিং কোয়ালিটি:</span>
                  <strong className="text-white">{plan.quality}</strong>
                </div>
              </div>

              <ul className="pt-2 space-y-1.5 text-xs text-[#A0A6B5]">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00D6A3] shrink-0" />
                    <span className="truncate">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#171B26] border border-white/10 shadow-2xl p-6 sm:p-8">
            <h3 className="text-xl font-black text-white mb-4">
              {language === 'bn' ? 'নতুন সাবস্ক্রিপশন প্ল্যান তৈরি করুন' : 'Create Subscription Plan'}
            </h3>

            <form onSubmit={handleCreatePlan} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">প্ল্যানের নাম (বাংলা)</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="যেমন: স্পোর্টস মান্থলি পাস"
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">প্ল্যানের নাম (ইংরেজি)</label>
                <input
                  type="text"
                  required
                  value={form.nameEn}
                  onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                  placeholder="e.g. Sports Monthly Pass"
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">মূল্য (BDT)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">মেয়াদ (দিন)</label>
                  <input
                    type="number"
                    required
                    value={form.durationDays}
                    onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })}
                    className="w-full bg-[#090B10] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">সুবিধাসমূহ (কমা দিয়ে আলাদা করুন)</label>
                <input
                  type="text"
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
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
                  {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
