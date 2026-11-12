import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Lock, Key, X, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminPasswordModal: React.FC = () => {
  const { 
    isAdminLockModalOpen, 
    setIsAdminLockModalOpen, 
    unlockAdminWithPassword,
    language 
  } = useApp();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdminLockModalOpen) {
      setPassword('');
      setError(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isAdminLockModalOpen]);

  if (!isAdminLockModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError(language === 'bn' ? 'অনুগ্রহ করে পাসওয়ার্ড দিন' : 'Please enter password');
      return;
    }

    setIsSubmitting(true);
    // Short realistic check delay
    setTimeout(() => {
      const isSuccess = unlockAdminWithPassword(password.trim());
      setIsSubmitting(false);
      if (!isSuccess) {
        setError(language === 'bn' ? 'ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিন।' : 'Incorrect admin password! Access denied.');
        setPassword('');
        inputRef.current?.focus();
      }
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-2xl bg-[#11141D] border border-amber-500/30 shadow-2xl shadow-amber-500/10 overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent border-b border-white/10 relative">
          <button
            onClick={() => setIsAdminLockModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black shadow-lg shadow-amber-500/30">
              <Lock className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <span>{language === 'bn' ? 'অ্যাডমিন প্যানেল সিকিউরিটি লক' : 'Admin Security Gateway'}</span>
              </h3>
              <p className="text-xs text-[#A0A6B5] mt-0.5">
                {language === 'bn' ? 'সুরক্ষিত কন্ট্রোল সেন্টারে প্রবেশ করতে পাসওয়ার্ড দিন' : 'Enter security password to access control center'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'bn' ? 'অ্যাডমিন সিকিউরিটি পাসওয়ার্ড' : 'Admin Master Password'}</span>
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder={language === 'bn' ? 'পাসওয়ার্ড দিন...' : 'Enter master password...'}
                className={`w-full px-4 py-3 rounded-xl bg-[#090B10] border ${
                  error ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/30' : 'border-white/20 focus:border-amber-400'
                } text-sm text-white focus:outline-none transition-colors pr-11 font-mono`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-medium animate-in fade-in">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-[#A0A6B5] flex items-start gap-2">
            <div className="p-1 rounded bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
              <Lock className="w-3 h-3" />
            </div>
            <div>
              {language === 'bn'
                ? 'অননুমোদিত প্রবেশ রোধে অ্যাডমিন প্যানেল পাসওয়ার্ড সুরক্ষিত রাখা হয়েছে।'
                : 'Protected master console for database, streaming and catalog management.'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsAdminLockModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black flex items-center gap-1.5 shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{language === 'bn' ? 'আনলক করুন' : 'Unlock Access'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
