import React from 'react';
import { 
  LayoutDashboard, Film, Tv, Clapperboard, Radio, Trophy, 
  Server, Users, ShieldCheck, CreditCard, DollarSign, Sparkles, 
  Music2, Bell, Settings, FileText, Activity, ChevronLeft, ChevronRight,
  Shield, LogOut, Plug, Lock 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type AdminTab = 
  | 'dashboard'
  | 'api_setup'
  | 'movies'
  | 'series'
  | 'bangla'
  | 'livetv'
  | 'sports'
  | 'streaming'
  | 'users'
  | 'roles'
  | 'subscriptions'
  | 'payments'
  | 'ai'
  | 'youtube'
  | 'notifications'
  | 'settings'
  | 'audit'
  | 'health';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  userCounts?: { users: number; movies: number; channels: number; sports: number };
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: any;
  count?: number;
  isHighlight?: boolean;
  isAi?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  userCounts
}) => {
  const { language, userProfile, setActiveTab, lockAdmin } = useApp();

  const navGroups: NavGroup[] = [
    {
      title: language === 'bn' ? 'প্রধান কন্ট্রোল' : 'Main Overview',
      items: [
        { id: 'dashboard' as AdminTab, label: language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard', icon: LayoutDashboard },
        { id: 'api_setup' as AdminTab, label: language === 'bn' ? 'যেকোনো API সেটআপ' : 'API Setup Hub', icon: Plug, isHighlight: true }
      ]
    },
    {
      title: language === 'bn' ? 'কনটেন্ট ম্যানেজমেন্ট' : 'Content Management',
      items: [
        { id: 'movies' as AdminTab, label: language === 'bn' ? 'সিনেমা (Movies)' : 'Movies', icon: Film, count: userCounts?.movies },
        { id: 'series' as AdminTab, label: language === 'bn' ? 'সিরিজ ও পর্ব' : 'Series & Episodes', icon: Tv },
        { id: 'bangla' as AdminTab, label: language === 'bn' ? 'বাংলা হাব' : 'Bangla Hub', icon: Clapperboard, isHighlight: true }
      ]
    },
    {
      title: language === 'bn' ? 'লাইভ ব্রডকাস্ট' : 'Live Broadcast',
      items: [
        { id: 'livetv' as AdminTab, label: language === 'bn' ? 'লাইভ টিভি ও EPG' : 'Live TV & EPG', icon: Radio, count: userCounts?.channels },
        { id: 'sports' as AdminTab, label: language === 'bn' ? 'লাইভ স্পোর্টস' : 'Live Sports', icon: Trophy, count: userCounts?.sports }
      ]
    },
    {
      title: language === 'bn' ? 'স্ট্রিমিং অবকাঠামো' : 'Streaming Infra',
      items: [
        { id: 'streaming' as AdminTab, label: language === 'bn' ? 'স্ট্রিমিং সোর্স (HLS/DASH)' : 'Streaming Sources', icon: Server }
      ]
    },
    {
      title: language === 'bn' ? 'ব্যবহারকারী ও অ্যাক্সেস' : 'Users & Access',
      items: [
        { id: 'users' as AdminTab, label: language === 'bn' ? 'ব্যবহারকারী' : 'User Accounts', icon: Users, count: userCounts?.users },
        { id: 'roles' as AdminTab, label: language === 'bn' ? 'RBAC ও ভূমিকা' : 'RBAC & Roles', icon: ShieldCheck }
      ]
    },
    {
      title: language === 'bn' ? 'মনিটাইজেশন' : 'Monetization',
      items: [
        { id: 'subscriptions' as AdminTab, label: language === 'bn' ? 'সাবস্ক্রিপশন প্ল্যান' : 'Subscription Plans', icon: CreditCard },
        { id: 'payments' as AdminTab, label: language === 'bn' ? 'পেমেন্ট ও রিফান্ড' : 'Payments & Refunds', icon: DollarSign }
      ]
    },
    {
      title: language === 'bn' ? 'স্মার্ট ইন্টিগ্রেশন' : 'Smart Engines',
      items: [
        { id: 'ai' as AdminTab, label: language === 'bn' ? 'Gemini AI সেটিংস' : 'Gemini AI Engine', icon: Sparkles, isAi: true },
        { id: 'youtube' as AdminTab, label: language === 'bn' ? 'ইউটিউব ও মিউজিক' : 'YouTube & Music', icon: Music2 }
      ]
    },
    {
      title: language === 'bn' ? 'অপারেশন ও অডিট' : 'Operations & Audit',
      items: [
        { id: 'notifications' as AdminTab, label: language === 'bn' ? 'নোটিফিকেশন সেন্টার' : 'Notifications', icon: Bell },
        { id: 'settings' as AdminTab, label: language === 'bn' ? 'সিস্টেম কনফিগ' : 'System Settings', icon: Settings },
        { id: 'audit' as AdminTab, label: language === 'bn' ? 'সিকিউরিটি অডিট লগ' : 'Audit Logs', icon: FileText },
        { id: 'health' as AdminTab, label: language === 'bn' ? 'সিস্টেম স্বাস্থ্য' : 'System Health', icon: Activity }
      ]
    }
  ];

  return (
    <aside 
      className={`shrink-0 bg-[#11141D] border-r border-white/10 flex flex-col transition-all duration-300 relative select-none z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C4DFF] to-[#00D6A3] flex items-center justify-center shrink-0 shadow-lg shadow-[#7C4DFF]/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="leading-tight truncate">
              <span className="font-extrabold text-sm tracking-wider text-white">ARURA CONTROL</span>
              <span className="block text-[10px] text-[#00D6A3] font-bold uppercase tracking-wider">Master Admin</span>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#A0A6B5] hover:text-white transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6 custom-scrollbar">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-3 text-[10px] font-bold text-[#A0A6B5]/70 uppercase tracking-wider mb-1.5">
                {group.title}
              </h4>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#7C4DFF] to-[#6839d3] text-white shadow-md shadow-[#7C4DFF]/30 font-bold'
                      : 'text-[#A0A6B5] hover:text-white hover:bg-white/5'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : item.isAi ? 'text-[#00D6A3]' : item.isHighlight ? 'text-amber-400' : 'text-[#A0A6B5]'
                  }`} />
                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {!isCollapsed && item.count !== undefined && item.count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-300'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Profile & Exit to User View */}
      <div className="p-3 border-t border-white/10 bg-[#090B10]/60 space-y-2">
        <div className={`flex items-center gap-2.5 p-2 rounded-xl bg-white/5 ${isCollapsed ? 'justify-center' : ''}`}>
          <img
            src={userProfile.avatar}
            alt="Admin"
            className="w-7 h-7 rounded-full object-cover border border-[#00D6A3] shrink-0"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{userProfile.name}</p>
              <p className="text-[10px] text-[#00D6A3] truncate">Super Administrator</p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={lockAdmin}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-[10px] font-semibold text-red-300 hover:bg-red-500/20 transition-all ${
              isCollapsed ? 'justify-center col-span-2' : ''
            }`}
            title={language === 'bn' ? 'অ্যাডমিন প্যানেল লক করুন' : 'Lock Admin Console'}
          >
            <Lock className="w-3 h-3 text-red-400 shrink-0" />
            {!isCollapsed && <span>{language === 'bn' ? 'লক করুন' : 'Lock'}</span>}
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 text-[10px] font-semibold text-[#A0A6B5] hover:text-white hover:border-[#7C4DFF] transition-all ${
              isCollapsed ? 'justify-center col-span-2' : ''
            }`}
            title={language === 'bn' ? 'ভিউয়ার মোডে ফিরে যান' : 'Exit to Viewer App'}
          >
            <LogOut className="w-3 h-3 text-amber-400 shrink-0" />
            {!isCollapsed && <span>{language === 'bn' ? 'ফিরে যান' : 'Exit'}</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
