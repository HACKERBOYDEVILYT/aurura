import React, { useState } from 'react';
import { Users, Search, Shield, CheckCircle2, XCircle, MoreVertical, Smartphone, Key } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  avatar: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

interface UsersSectionProps {
  users: UserItem[];
  onRefresh: () => void;
}

export const UsersSection: React.FC<UsersSectionProps> = ({ users, onRefresh }) => {
  const { language, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleStatus = async (user: UserItem) => {
    setUpdatingId(user.id);
    try {
      const res = await fetch(`/api/v1/admin/users/${user.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !user.isActive })
      });
      if (res.ok) {
        showToast(language === 'bn' 
          ? `অ্যাকাউন্ট স্ট্যাটাস পরিবর্তন হয়েছে (${!user.isActive ? 'সক্রিয়' : 'স্থগিত'})`
          : `Account status updated (${!user.isActive ? 'Active' : 'Suspended'})`);
        onRefresh();
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleChangeRole = async (user: UserItem, newRole: string) => {
    try {
      const res = await fetch(`/api/v1/admin/users/${user.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        showToast(language === 'bn' ? `ভূমিকা পরিবর্তন করা হয়েছে: ${newRole}` : `Role updated: ${newRole}`);
        onRefresh();
      }
    } catch {
      showToast('Error updating user role');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#171B26] border border-white/10">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>{language === 'bn' ? 'ব্যবহারকারী ও অ্যাক্সেস কন্ট্রোল' : 'User Accounts & Access Control'}</span>
          </h2>
          <p className="text-xs text-[#A0A6B5] mt-0.5">
            {language === 'bn' ? 'নিবন্ধিত সদস্য, ভিআইপি সাবস্ক্রিপশন স্ট্যাটাস, সেশন ও সাসপেনশন ব্যবস্থাপনা' : 'Manage registered accounts, VIP statuses, security suspensions and roles'}
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#A0A6B5] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === 'bn' ? 'নাম বা ইমেইল দিয়ে খুঁজুন...' : 'Search by name or email...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#090B10] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#A0A6B5] focus:outline-none focus:border-[#7C4DFF]"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-[#171B26] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#A0A6B5]">
            <thead className="bg-[#090B10] text-[11px] font-bold text-gray-300 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="p-3.5 pl-4">{language === 'bn' ? 'ব্যবহারকারী' : 'User'}</th>
                <th className="p-3.5">{language === 'bn' ? 'প্ল্যান' : 'Plan'}</th>
                <th className="p-3.5">{language === 'bn' ? 'ভূমিকা (Role)' : 'Role'}</th>
                <th className="p-3.5">{language === 'bn' ? 'অ্যাকাউন্ট স্ট্যাটাস' : 'Status'}</th>
                <th className="p-3.5 text-right pr-4">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 pl-4 flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <p className="font-bold text-white text-xs">{user.name}</p>
                      <p className="text-[10px] text-gray-400">{user.email}</p>
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      user.plan === 'VIP Premium'
                        ? 'bg-[#00D6A3]/20 text-[#00D6A3] border border-[#00D6A3]/30'
                        : 'bg-white/10 text-gray-300'
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleChangeRole(user, e.target.value)}
                      className="bg-[#090B10] border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                    >
                      <option value="subscriber">Subscriber</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      user.isActive
                        ? 'bg-[#00D6A3]/20 text-[#00D6A3] border border-[#00D6A3]/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {user.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{user.isActive ? (language === 'bn' ? 'সক্রিয়' : 'Active') : (language === 'bn' ? 'স্থগিত' : 'Suspended')}</span>
                    </span>
                  </td>
                  <td className="p-3 text-right pr-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      disabled={updatingId === user.id}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        user.isActive
                          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                          : 'bg-[#00D6A3]/10 text-[#00D6A3] hover:bg-[#00D6A3]/20 border border-[#00D6A3]/20'
                      }`}
                    >
                      {user.isActive ? (language === 'bn' ? 'সাসপেন্ড করুন' : 'Suspend') : (language === 'bn' ? 'সক্রিয় করুন' : 'Activate')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
