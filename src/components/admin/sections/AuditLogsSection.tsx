import React, { useState } from 'react';
import { FileText, Search, Shield, Filter, Clock } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

interface AuditLogItem {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetModel: string;
  targetId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

interface AuditLogsSectionProps {
  logs: AuditLogItem[];
}

export const AuditLogsSection: React.FC<AuditLogsSectionProps> = ({ logs }) => {
  const { language } = useApp();
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.details.toLowerCase().includes(search.toLowerCase()) || 
                          l.adminName.toLowerCase().includes(search.toLowerCase()) ||
                          l.action.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterAction === 'all' || l.action.includes(filterAction);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#171B26] border border-white/10">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#7C4DFF]" />
            <span>{language === 'bn' ? 'সিকিউরিটি ও অ্যাডমিন অডিট লগ' : 'Security & Administrative Audit Logs'}</span>
          </h2>
          <p className="text-xs text-[#A0A6B5] mt-0.5">
            {language === 'bn' ? 'অ্যাডমিনদের প্রতিটি কর্মকাণ্ড, কনটেন্ট মোডিফিকেশন এবং আইপি ঠিকানার অপরিবর্তনীয় ট্র্যাকিং' : 'Tamper-evident audit trail tracking sensitive operations, administrative IPs, and timestamps'}
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#A0A6B5] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === 'bn' ? 'অডিট লগ খুঁজুন...' : 'Search logs...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#090B10] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#A0A6B5] focus:outline-none focus:border-[#7C4DFF]"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl bg-[#171B26] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#A0A6B5]">
            <thead className="bg-[#090B10] text-[11px] font-bold text-gray-300 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="p-3.5 pl-4">{language === 'bn' ? 'অ্যাকশন ও মডেল' : 'Action & Target'}</th>
                <th className="p-3.5">{language === 'bn' ? 'অ্যাডমিন ও আইপি' : 'Admin & IP'}</th>
                <th className="p-3.5">{language === 'bn' ? 'বিস্তারিত বিবরণ' : 'Details'}</th>
                <th className="p-3.5 text-right pr-4">{language === 'bn' ? 'সময়' : 'Timestamp'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 pl-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#7C4DFF]/20 text-[#7C4DFF] block max-w-fit mb-0.5">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-gray-400">{log.targetModel} ({log.targetId})</span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <strong className="text-white block font-semibold">{log.adminName}</strong>
                    <span className="text-[10px] text-gray-400 font-mono">{log.ipAddress}</span>
                  </td>
                  <td className="p-3 max-w-md">
                    <p className="text-gray-300 leading-relaxed text-xs">{log.details}</p>
                  </td>
                  <td className="p-3 text-right pr-4 whitespace-nowrap text-gray-400">
                    {new Date(log.timestamp).toLocaleString()}
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
