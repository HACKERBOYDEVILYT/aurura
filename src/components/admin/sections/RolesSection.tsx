import React from 'react';
import { ShieldCheck, Key, Lock, Check, Shield } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const RolesSection: React.FC = () => {
  const { language } = useApp();

  const roles = [
    {
      code: 'SUPER_ADMIN',
      name: language === 'bn' ? 'সুপার অ্যাডমিনিস্ট্রেটর' : 'Super Administrator',
      desc: language === 'bn' ? 'প্ল্যাটফর্মের সম্পূর্ণ অ্যাক্সেস, সব অ্যাডমিন ও নিরাপত্তা কনফিগারেশন পরিচালনা।' : 'Full platform access. Manage all administrators, security policies, and system settings.',
      users: 1,
      color: 'border-red-500/40 text-red-400 bg-red-500/10',
      perms: ['All Capabilities (*)', 'User Suspension & Promotion', 'Payment Gateway & Refunds', 'Server Root & Database Maintenance']
    },
    {
      code: 'ADMIN',
      name: language === 'bn' ? 'অপারেশনস অ্যাডমিন' : 'Operations Admin',
      desc: language === 'bn' ? 'প্ল্যাটফর্মের সামগ্রিক কনটেন্ট, ব্রডকাস্ট এবং ব্যবহারকারী পরিচালনা।' : 'Manage platform operations, content pipelines, users, and aggregate telemetry.',
      users: 3,
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
      perms: ['Publish & Unpublish Movies', 'Live EPG Schedules', 'User Management', 'Export Metrics']
    },
    {
      code: 'CONTENT_MANAGER',
      name: language === 'bn' ? 'কনটেন্ট ম্যানেজার' : 'Content Manager',
      desc: language === 'bn' ? 'সিনেমা, সিরিজ, বাংলা হাব এবং মেটাডাটা কিউরেশন।' : 'Manage movies, series, episodes, Bangla entertainment, and artist metadata.',
      users: 5,
      color: 'border-[#7C4DFF]/40 text-[#7C4DFF] bg-[#7C4DFF]/10',
      perms: ['Create & Edit Movies', 'Add Seasons & Episodes', 'Curate Bangla Hub Stars', 'Subtitle & Audio Tracks']
    },
    {
      code: 'STREAM_MANAGER',
      name: language === 'bn' ? 'স্ট্রিমিং ও ব্রডকাস্ট ইঞ্জিনিয়ার' : 'Stream Manager',
      desc: language === 'bn' ? 'HLS/DASH সোর্স, লাইভ টিভি চ্যানেল ও লাইভ স্পোর্টস স্কোর ব্রডকাস্ট।' : 'Manage authorized streaming sources, live TV channels, and sports feeds.',
      users: 2,
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
      perms: ['Configure Multi-CDN Streams', 'Live Cricket/Football Scores', 'Stream Ping Health Checks', 'Failover Switch']
    },
    {
      code: 'MODERATOR',
      name: language === 'bn' ? 'কমিউনিটি মডারেটর' : 'Moderator',
      desc: language === 'bn' ? 'ব্যবহারকারী অ্যাক্টিভিটি রিভিউ, রিপোর্ট পর্যালোচনা এবং নিরাপত্তা নিশ্চিতকরণ।' : 'Manage user reports, review user-submitted activities, and flag violations.',
      users: 4,
      color: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
      perms: ['Review User Reports', 'Flag Spam Comments', 'Temporary Account Suspension']
    },
    {
      code: 'FINANCE',
      name: language === 'bn' ? 'ফাইন্যান্স ও সাবস্ক্রিপশন' : 'Finance Manager',
      desc: language === 'bn' ? 'ভিআইপি সাবস্ক্রিপশন প্ল্যান, bKash/Nagad লেনদেন এবং রিফান্ড পরিচালনা।' : 'Manage subscription tiers, payment verification, and automated refund processing.',
      users: 2,
      color: 'border-[#00D6A3]/40 text-[#00D6A3] bg-[#00D6A3]/10',
      perms: ['Manage VIP Pricing in BDT', 'bKash / Nagad Transaction Logs', 'Process Entitled Refunds']
    },
    {
      code: 'SUPPORT',
      name: language === 'bn' ? 'কাস্টমার সাপোর্ট' : 'Support Specialist',
      desc: language === 'bn' ? 'গ্রাহকদের সহায়তা অনুরোধ এবং ওয়াচ হিস্ট্রি ডায়াগনস্টিকস।' : 'View user profiles, handle ticket inquiries, and inspect playback device sessions.',
      users: 6,
      color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
      perms: ['Read-only User Profile', 'Check Device Sessions', 'Password Reset Support']
    },
    {
      code: 'ANALYST',
      name: language === 'bn' ? 'ডেটা অ্যানালিস্ট' : 'Data Analyst',
      desc: language === 'bn' ? 'ভিউয়ারশিপ অ্যানালিটিক্স, ওয়াচ টাইম গ্রাফ ও পারফরম্যান্স রিপোর্ট।' : 'Read-only access to platform metrics, DAU telemetry, and engagement analytics.',
      users: 3,
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
      perms: ['View Real-time Dashboard', 'Export CSV Data', 'CDN Bandwidth Telemetry']
    }
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#171B26] border border-white/10">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#7C4DFF]" />
            <span>{language === 'bn' ? 'রোল-বেসড অ্যাক্সেস কন্ট্রোল (RBAC)' : 'Role-Based Access Control (RBAC)'}</span>
          </h2>
          <p className="text-xs text-[#A0A6B5] mt-0.5">
            {language === 'bn' ? 'প্ল্যাটফর্মের ৮টি সুরক্ষিত ভূমিকা ও দানাদার পারমিশন ম্যাট্রিক্স' : '8 distinct operational roles and granular capability governance'}
          </p>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => (
          <div key={role.code} className="p-5 rounded-2xl bg-[#171B26] border border-white/10 space-y-3 hover:border-white/20 transition-all shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${role.color}`}>
                  {role.code}
                </span>
                <h3 className="text-sm font-bold text-white mt-1">{role.name}</h3>
              </div>
              <span className="text-xs font-semibold text-[#A0A6B5] bg-black/40 px-2.5 py-1 rounded-xl border border-white/5">
                {role.users} {language === 'bn' ? 'জন কর্মী' : 'Staff'}
              </span>
            </div>

            <p className="text-xs text-[#A0A6B5] leading-relaxed">
              {role.desc}
            </p>

            <div className="pt-2 border-t border-white/5 space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                {language === 'bn' ? 'অনুমোদিত ক্ষমতা (Permissions)' : 'Authorized Capabilities'}
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {role.perms.map((p, pIdx) => (
                  <div key={pIdx} className="flex items-center gap-1.5 text-[11px] text-gray-300">
                    <Check className="w-3 h-3 text-[#00D6A3] shrink-0" />
                    <span className="truncate">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
