import React, { useState } from 'react';
import { DollarSign, Search, CheckCircle2, RotateCcw, ShieldCheck, Download } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

interface TransactionItem {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';
  transactionRef: string;
  createdAt: string;
}

interface PaymentsSectionProps {
  transactions: TransactionItem[];
  onRefresh: () => void;
}

export const PaymentsSection: React.FC<PaymentsSectionProps> = ({ transactions, onRefresh }) => {
  const { language, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredTx = transactions.filter(t => 
    t.transactionRef.toLowerCase().includes(search.toLowerCase()) || 
    t.paymentMethod.toLowerCase().includes(search.toLowerCase())
  );

  const handleRefund = async (tx: TransactionItem) => {
    if (!window.confirm(language === 'bn' 
      ? `আপনি কি নিশ্চিতভাবে ${tx.amount} ${tx.currency} রিফান্ড করতে চান? (Ref: ${tx.transactionRef})` 
      : `Initiate refund of ${tx.amount} ${tx.currency}? (Ref: ${tx.transactionRef})`)) return;

    setProcessingId(tx.id);
    try {
      const res = await fetch(`/api/v1/admin/payments/${tx.id}/refund`, { method: 'POST' });
      if (res.ok) {
        showToast(language === 'bn' ? 'রিফান্ড সফলভাবে সম্পন্ন হয়েছে' : 'Refund processed successfully');
        onRefresh();
      }
    } catch {
      showToast('Error processing refund');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#171B26] border border-white/10">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#00D6A3]" />
            <span>{language === 'bn' ? 'পেমেন্ট গেটওয়ে ও লেনদেন অডিট' : 'Payment Transactions & Refunds'}</span>
          </h2>
          <p className="text-xs text-[#A0A6B5] mt-0.5">
            {language === 'bn' ? 'bKash, Nagad ও কার্ড লেনদেন যাচাইকরণ এবং সার্ভার-সাইড রিফান্ড প্রসেস' : 'Verify mobile banking/card transactions and authorize server-side refunds'}
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#A0A6B5] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === 'bn' ? 'ট্রানজ্যাকশন আইডি দিয়ে খুঁজুন...' : 'Search by transaction ref...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#090B10] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#A0A6B5] focus:outline-none focus:border-[#7C4DFF]"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl bg-[#171B26] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#A0A6B5]">
            <thead className="bg-[#090B10] text-[11px] font-bold text-gray-300 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="p-3.5 pl-4">{language === 'bn' ? 'রেফারেন্স আইডি' : 'Reference'}</th>
                <th className="p-3.5">{language === 'bn' ? 'পদ্ধতি' : 'Method'}</th>
                <th className="p-3.5">{language === 'bn' ? 'পরিমাণ (BDT)' : 'Amount'}</th>
                <th className="p-3.5">{language === 'bn' ? 'তারিখ ও সময়' : 'Timestamp'}</th>
                <th className="p-3.5">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="p-3.5 text-right pr-4">{language === 'bn' ? 'অ্যাকশন' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 pl-4">
                    <p className="font-mono font-bold text-white text-xs">{tx.transactionRef}</p>
                    <p className="text-[10px] text-gray-400">User: {tx.userId}</p>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white">
                      {tx.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <strong className="text-white text-sm font-black">{tx.amount}</strong> {tx.currency}
                  </td>
                  <td className="p-3 whitespace-nowrap text-gray-400">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      tx.status === 'COMPLETED'
                        ? 'bg-[#00D6A3]/20 text-[#00D6A3] border border-[#00D6A3]/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" />
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-3 text-right pr-4 whitespace-nowrap">
                    {tx.status === 'COMPLETED' ? (
                      <button
                        onClick={() => handleRefund(tx)}
                        disabled={processingId === tx.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold transition-colors"
                      >
                        <RotateCcw className={`w-3 h-3 ${processingId === tx.id ? 'animate-spin' : ''}`} />
                        <span>{processingId === tx.id ? 'Refunding...' : (language === 'bn' ? 'রিফান্ড করুন' : 'Refund')}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-gray-500">Refunded</span>
                    )}
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
