import React, { useState } from 'react';
import { Sparkles, Send, RefreshCw, ThumbsUp, ThumbsDown, Play, Star, AlertCircle, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MEDIA_CATALOG } from '../data/catalog';
import { MediaItem } from '../types';
import { MediaCard } from './MediaCard';

interface AiRecommendationResult {
  detectedMood: string;
  explanation: string;
  matchedKeywords?: string[];
  suggestedGenres?: string[];
  recommendedIds: string[];
  confidence?: number;
}

export const AiDiscoveryView: React.FC = () => {
  const { language, t, openPlayer, openDetails } = useApp();

  const [inputMood, setInputMood] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiRecommendationResult | null>({
    detectedMood: language === 'bn' ? 'আবেগঘন ও মন ছোঁয়া (Heartfelt & Emotional)' : 'Heartfelt & Emotional',
    explanation: language === 'bn' 
      ? 'আপনার জন্য আফরান নিশো ও মেহজাবীনের জনপ্রিয় আবেগঘন নাটক এবং চঞ্চল চৌধুরীর কালজয়ী সিনেমা বাছাই করা হয়েছে।'
      : 'Curated heartfelt romantic drama and psychological mysteries for your reflective state of mind.',
    suggestedGenres: ['Drama', 'Romance', 'Mystery'],
    recommendedIds: ['bn-natok-1', 'bn-movie-1', 'bn-natok-2', 'bn-series-1'],
    confidence: 0.96
  });

  const [feedbackSent, setFeedbackSent] = useState<boolean | null>(null);

  const moodPromptSuggestions = language === 'bn' ? [
    'আজ মন খারাপ, একটা ইমোশনাল বাংলা নাটক বা সিনেমা সাজেস্ট কর',
    'একদম টানটান উত্তেজনাপূর্ণ ক্রাইম থ্রিলার সিরিজ দেখতে চাই',
    'বৃষ্টির রাতে হালকা মিষ্টি প্রেমের রোমান্টিক নাটক সাজেস্ট কর',
    'পরিবার নিয়ে দেখার মতো হাসির ও পারিবারিক ভালো নাটক',
    'গভীর রাতের জন্য মহাবিশ্ব ও সাইন্স ফিকশন মুভি'
  ] : [
    'I feel sad today. Recommend an emotional Bangla movie or drama',
    'A high-stakes edge-of-the-seat psychological crime thriller series',
    'A cozy romantic feel-good story for a rainy night',
    'Wholesome family comedy to enjoy together',
    'Mind-bending space exploration sci-fi blockbuster'
  ];

  const handleSearchMood = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputMood;
    if (!promptToSend.trim()) return;

    setIsLoading(true);
    setFeedbackSent(null);

    try {
      const response = await fetch('/api/recommendations/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moodPrompt: promptToSend,
          language,
          currentCategory: 'all'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data: AiRecommendationResult = await response.json();
      setResult(data);
    } catch (err) {
      console.error('AI Recommendation Error:', err);
      // Fallback
      setResult({
        detectedMood: language === 'bn' ? 'অনুভূতি ও বিনোদন' : 'Entertainment & Feeling',
        explanation: language === 'bn' 
          ? 'আপনার অনুরোধ অনুযায়ী আমাদের শীর্ষ রেটেড কনটেন্ট লাইব্রেরি থেকে নির্বাচিত।' 
          : 'Curated from our top rated library to match your feelings.',
        recommendedIds: ['bn-natok-1', 'bn-movie-1', 'movie-1', 'bn-series-2'],
        suggestedGenres: ['Drama', 'Natok', 'Thriller'],
        confidence: 0.90
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Find matching items from catalog
  const recommendedItems: MediaItem[] = result?.recommendedIds
    ? result.recommendedIds
        .map(id => MEDIA_CATALOG.find(m => m.id === id))
        .filter((item): item is MediaItem => Boolean(item))
    : [];

  // Fallback if empty
  const displayItems = recommendedItems.length > 0 ? recommendedItems : MEDIA_CATALOG.slice(0, 4);

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 bg-gradient-to-r from-[#171B26] via-[#202636] to-[#090B10] border border-[#00D6A3]/30 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#00D6A3]/20 text-[#00D6A3] border border-[#00D6A3]/40 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ARURA AI ENGINE 3.8</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {t.aiRecommenderTitle}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-300">
            {t.aiRecommenderSubtitle}
          </p>

          {/* Interactive Input Form */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputMood}
                onChange={(e) => setInputMood(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchMood()}
                placeholder={t.aiPlaceholder}
                className="w-full bg-[#090B10]/80 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3.5 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-[#00D6A3] shadow-inner transition-colors"
              />
            </div>

            <button
              onClick={() => handleSearchMood()}
              disabled={isLoading || !inputMood.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#7C4DFF] to-[#00D6A3] hover:from-[#6c38f8] hover:to-[#00be90] disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-[#7C4DFF]/30 transition-all active:scale-95 whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t.aiAnalyzing}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.aiSubmit}</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Suggestions Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400">
              {language === 'bn' ? 'সরাসরি ক্লিক করুন:' : 'Quick Prompts:'}
            </span>
            {moodPromptSuggestions.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputMood(prompt);
                  handleSearchMood(prompt);
                }}
                className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 border border-white/10 hover:border-[#00D6A3]/50 transition-all text-left"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#00D6A3]/10 to-transparent pointer-events-none" />
      </div>

      {/* AI Analysis Result Card */}
      {result && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#171B26] border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#A0A6B5] uppercase tracking-wider">
                  {t.aiDetectedMood}
                </span>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#7C4DFF]/20 text-[#00D6A3] border border-[#00D6A3]/30">
                  {result.detectedMood}
                </span>
              </div>
              <p className="mt-2 text-sm sm:text-base text-gray-200 leading-relaxed max-w-3xl">
                {result.explanation}
              </p>
            </div>

            {/* Recommendation Feedback */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-xs text-gray-400">
                {language === 'bn' ? 'ম্যাচ করেছে?' : 'Accurate?'}
              </span>
              <button
                onClick={() => setFeedbackSent(true)}
                className={`p-2 rounded-lg border transition-all ${
                  feedbackSent === true
                    ? 'bg-[#00D6A3] text-black border-[#00D6A3]'
                    : 'bg-white/5 text-gray-400 hover:text-white border-white/10'
                }`}
                title="Helpful"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFeedbackSent(false)}
                className={`p-2 rounded-lg border transition-all ${
                  feedbackSent === false
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-white/5 text-gray-400 hover:text-white border-white/10'
                }`}
                title="Not helpful"
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Curated Recommendations Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00D6A3]" />
                <span>{t.aiCuratedTitle}</span>
              </h3>
              <span className="text-xs text-[#00D6A3] font-semibold">
                {displayItems.length} {language === 'bn' ? 'টি সেরা বাছাই' : 'top picks'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {displayItems.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
