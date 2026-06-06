'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HowItWorks from '@/components/HowItWorks';
import FAQ from '@/components/FAQ';
import InfoCard from '@/components/InfoCard';
import CaptchaModal from '@/components/CaptchaModal';
import { validateUrl } from '@/lib/validate';
import { VideoInfo, ApiResponse } from '@/types';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);

  // Clear input and state
  const handleClear = () => {
    setUrl('');
    setError(null);
    setVideoInfo(null);
  };

  // Paste from clipboard helper
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError(null);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  // Triggered when search form is submitted
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setVideoInfo(null);

    // 1. Client-side Validation
    const validation = validateUrl(url);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid URL.');
      return;
    }

    // 2. Open CAPTCHA before hitting the backend API
    setIsCaptchaOpen(true);
  };

  // Called when math CAPTCHA is solved successfully
  const handleCaptchaVerify = async (success: boolean) => {
    setIsCaptchaOpen(false);
    if (!success) return;

    setLoading(true);
    setLoadingStep('Validating link...');

    try {
      // Step simulation for good UX feedback
      setTimeout(() => setLoadingStep('Contacting video server...'), 800);
      setTimeout(() => setLoadingStep('Resolving format signatures...'), 1800);

      const response = await fetch('/api/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const result: ApiResponse<VideoInfo> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch video information.');
      }

      if (result.data) {
        setVideoInfo(result.data);
      } else {
        throw new Error('No formats resolved.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while resolving the video.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Dynamic Backdrops - Premium Aesthetic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Blurry glow blobs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-linear-to-br from-rose-400 to-pink-400 opacity-20 dark:opacity-10 blur-3xl animate-float-1" />
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-linear-to-br from-purple-400 to-indigo-400 opacity-15 dark:opacity-10 blur-3xl animate-float-2" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-100" />
      </div>

      <Navbar />

      <main className="relative flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 z-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-linear-to-r from-rose-500 via-purple-500 to-amber-500 bg-clip-text text-transparent mb-4 font-display leading-tight">
            Download Shorts & Reels Instantly
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            A premium, high-speed downloader for YouTube Shorts and Instagram Reels. Simple, public link streaming directly to your device.
          </p>
        </div>

        {/* Input Box Card */}
        <div className="max-w-2xl mx-auto rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-md backdrop-blur-md transition-all dark:border-slate-800 dark:bg-slate-900/60 mb-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="video-url" className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Paste YouTube or Instagram Link
              </label>
              
              <div className="relative flex items-center rounded-2xl border border-slate-250 bg-slate-50 shadow-xs focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500 dark:border-slate-800 dark:bg-slate-950 transition-all duration-200">
                {/* Input Field */}
                <input
                  id="video-url"
                  type="text"
                  placeholder="https://www.youtube.com/shorts/... or https://www.instagram.com/reel/..."
                  required
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full bg-transparent py-4 pl-4 pr-24 text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-hidden"
                />

                {/* Interactive Clear / Paste Buttons */}
                <div className="absolute right-3 flex items-center gap-2">
                  {url ? (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title="Clear text"
                    >
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePaste}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
                      title="Paste from clipboard"
                    >
                      Paste
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-rose-500 to-amber-500 py-4 font-bold text-white shadow-lg shadow-rose-500/20 transition-all duration-300 hover:from-rose-600 hover:to-amber-600 transform hover:scale-101 active:scale-99 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Resolving Video...
                </>
              ) : (
                <>
                  <span>Fetch Options</span>
                  <svg className="h-4 w-4 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Legal disclaimer below input */}
          <p className="mt-3.5 text-center text-[10.5px] text-slate-400 dark:text-slate-500 font-semibold tracking-wide leading-normal">
            Respect platform terms of service. Only download public content you have the rights to.
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="max-w-2xl mx-auto mb-10 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm font-semibold text-rose-500 text-center animate-scale-up">
            {error}
          </div>
        )}

        {/* Dynamic Loading State Feedback */}
        {loading && (
          <div className="max-w-2xl mx-auto mb-10 text-center py-8 rounded-2xl border border-slate-200 bg-white/40 dark:border-slate-800 dark:bg-slate-900/40 shadow-xs flex flex-col items-center justify-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center">
              <span className="absolute animate-ping h-8 w-8 rounded-full bg-rose-400 opacity-75" />
              <span className="relative rounded-full h-8 w-8 bg-rose-500" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 animate-pulse">
              {loadingStep || 'Processing link...'}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
              This may take 5–10 seconds for high-resolution formats.
            </p>
          </div>
        )}

        {/* Resolution Results Card */}
        {videoInfo && !loading && (
          <div className="mb-16 animate-scale-up">
            <InfoCard video={videoInfo} />
          </div>
        )}

        {/* Features / How It Works */}
        <HowItWorks />

        {/* Privacy & Safety Note */}
        <section className="my-12 max-w-3xl mx-auto rounded-3xl border border-slate-200/50 bg-white/40 p-6 shadow-xs backdrop-blur-xs text-center dark:border-slate-800/50 dark:bg-slate-950/20">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Privacy & Security Guaranteed
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            We do not log user IP addresses alongside video data. Downloads are resolved dynamically through direct pipes from public servers. Your data is encrypted in transit and no downloaded videos are ever buffered permanently on our servers.
          </p>
        </section>

        {/* FAQ Accordion Section */}
        <FAQ />

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/60 bg-white/50 py-8 dark:border-slate-800/60 dark:bg-slate-950/50 z-10 transition-colors">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs font-semibold text-slate-400 dark:text-slate-500">
          <div>
            <p>© {new Date().getFullYear()} ReelFetch. All rights reserved.</p>
            <p className="mt-1 text-[11px]">Designed for downloading personal and public-domain videos with rights holder consent.</p>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-600 dark:hover:text-slate-350 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-350 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-350 cursor-pointer">DMCA Notice</span>
          </div>
        </div>
      </footer>

      {/* CAPTCHA math pop-up puzzle */}
      <CaptchaModal
        isOpen={isCaptchaOpen}
        onVerify={handleCaptchaVerify}
        onClose={() => setIsCaptchaOpen(false)}
      />
    </div>
  );
}
