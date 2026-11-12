import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#171B26]/95 backdrop-blur-xl border border-[#00D6A3]/50 text-white shadow-2xl shadow-[#00D6A3]/20 animate-bounce">
      <CheckCircle2 className="w-4 h-4 text-[#00D6A3] flex-shrink-0" />
      <span className="text-xs font-semibold">{toastMessage}</span>
    </div>
  );
};
