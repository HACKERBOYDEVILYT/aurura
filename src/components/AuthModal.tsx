import React, { useState } from 'react';
import { X, Mail, Lock, User, Shield, CheckCircle2, AlertCircle, LogIn, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { language, updateUserProfile, showToast } = useApp();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      if (data.user) {
        updateUserProfile({
          name: data.user.name,
          email: data.user.email,
          avatar: data.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          plan: data.user.plan === 'VIP Premium' ? 'VIP Premium' : 'Free Standard',
        });
        localStorage.setItem('arura_jwt_token', data.tokens?.access || '');
        showToast(language === 'bn' ? `স্বাগতম, ${data.user.name}!` : `Welcome, ${data.user.name}!`);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      if (data.user) {
        updateUserProfile({
          name: data.user.name,
          email: data.user.email,
          avatar: data.user.avatar,
          plan: 'VIP Premium',
        });
        localStorage.setItem('arura_jwt_token', data.tokens?.access || '');
        showToast(language === 'bn' ? 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!' : 'Account registered successfully!');
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Error registering');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: 'google-oauth-mock-token' }),
      });
      const data = await res.json();
      if (data.user) {
        updateUserProfile({
          name: data.user.name,
          email: data.user.email,
          avatar: data.user.avatar,
          plan: data.user.plan || 'VIP Premium',
        });
        localStorage.setItem('arura_jwt_token', data.tokens?.access || '');
        showToast(language === 'bn' ? 'গুগল সাইন-ইন সফল!' : 'Google sign-in successful!');
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Google Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-[#171B26] border border-white/10 shadow-2xl p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C4DFF] to-[#00D6A3] mb-3 shadow-lg shadow-[#7C4DFF]/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {mode === 'login' ? (language === 'bn' ? 'সাইন ইন করুন' : 'Sign In to Arura') :
             mode === 'register' ? (language === 'bn' ? 'নতুন অ্যাকাউন্ট খুলুন' : 'Create an Account') :
             (language === 'bn' ? 'পাসওয়ার্ড রিসেট' : 'Reset Password')}
          </h2>
          <p className="text-xs text-[#A0A6B5] mt-1">
            {language === 'bn' ? 'এইচডি স্ট্রিমিং ও ব্যক্তিগত বিনোদন কনটেন্ট উপভোগ করুন' : 'Enjoy HD streaming & personalized entertainment'}
          </p>
        </div>

        {/* Tab switchers */}
        {mode !== 'forgot' && (
          <div className="flex bg-[#090B10] p-1 rounded-xl mb-6 border border-white/5">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login' ? 'bg-[#7C4DFF] text-white shadow' : 'text-[#A0A6B5] hover:text-white'
              }`}
            >
              {language === 'bn' ? 'লগইন' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register' ? 'bg-[#7C4DFF] text-white shadow' : 'text-[#A0A6B5] hover:text-white'
              }`}
            >
              {language === 'bn' ? 'রেজিস্ট্রেশন' : 'Register'}
            </button>
          </div>
        )}

        {/* Google SSO Button */}
        {mode !== 'forgot' && (
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-800 text-xs font-bold transition-all shadow-md mb-4"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{language === 'bn' ? 'Google অ্যাকাউন্ট দিয়ে সাইন ইন করুন' : 'Continue with Google'}</span>
          </button>
        )}

        {mode !== 'forgot' && (
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] uppercase font-bold text-[#A0A6B5] tracking-wider">
              {language === 'bn' ? 'অথবা ইমেইল' : 'or with email'}
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={mode === 'register' ? handleRegister : handleLogin} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                {language === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === 'bn' ? 'আয়ান আহমেদ' : 'Jane Doe'}
                  className="w-full bg-[#090B10] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              {language === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ayanislam10000@gmail.com"
                className="w-full bg-[#090B10] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-300">
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-[#7C4DFF] hover:underline"
                >
                  {language === 'bn' ? 'ভুলে গেছেন?' : 'Forgot?'}
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#090B10] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#00D6A3] hover:opacity-95 text-white text-xs font-bold transition-all shadow-lg shadow-[#7C4DFF]/30 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <span>
                  {mode === 'login' ? (language === 'bn' ? 'লগইন করুন' : 'Sign In') :
                   mode === 'register' ? (language === 'bn' ? 'রেজিস্ট্রেশন সম্পন্ন করুন' : 'Create VIP Account') :
                   (language === 'bn' ? 'রিসেট লিঙ্ক পাঠান' : 'Send Reset Link')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {mode === 'forgot' && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setMode('login')}
              className="text-xs text-[#00D6A3] hover:underline"
            >
              {language === 'bn' ? '← লগইনে ফিরে যান' : '← Back to Login'}
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-[10px] text-[#A0A6B5]">
          {language === 'bn' ? 'লগইন করে আপনি আরুরার শর্তাবলী ও গোপনীয়তা নীতি মেনে নিচ্ছেন।' : 'By signing in, you agree to Arura Streaming Terms & Privacy Policy.'}
        </div>
      </div>
    </div>
  );
};
