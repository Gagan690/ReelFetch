import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Paste Video URL',
      desc: 'Copy the link of any YouTube Video, Shorts, or Instagram Reel and paste it into the downloader box above.',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'from-pink-500 to-rose-500',
    },
    {
      num: '02',
      title: 'Select Resolution',
      desc: 'Our system resolves the link immediately and provides progressive MP4 qualities (e.g. 720p, 360p) for your device.',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      ),
      color: 'from-purple-500 to-indigo-500',
    },
    {
      num: '03',
      title: 'Download Instantly',
      desc: 'Click "Download" and the file is streamed directly to your browser without local server storage buffering.',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      color: 'from-amber-500 to-orange-500',
    },
  ];

  const platforms = [
    { name: 'YouTube Video', color: 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400' },
    { name: 'YouTube Shorts', color: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400' },
    { name: 'Instagram Reels', color: 'bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400' },
    { name: 'Instagram Posts', color: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' },
  ];

  return (
    <section className="w-full py-12 md:py-16">
      {/* Supported Platforms Badges */}
      <div className="mb-16 text-center">
        <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase dark:text-gray-500">
          Supported Platforms
        </h3>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {platforms.map((p) => (
            <span
              key={p.name}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide shadow-xs border border-transparent dark:border-gray-800/40 ${p.color}`}
            >
              {p.name}
            </span>
          ))}
        </div>
      </div>

      {/* How It Works Steps */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          How it Works
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-gray-500 dark:text-gray-400">
          Download high-quality content in three easy steps. No signups or software installations required.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.num}
            className="group relative rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800/60 dark:bg-gray-900"
          >
            {/* Step Card Number background decoration */}
            <span className="absolute top-2 right-4 text-6xl font-extrabold text-gray-100 select-none dark:text-gray-800/35 transition-colors group-hover:text-gray-200 dark:group-hover:text-gray-800/50">
              {step.num}
            </span>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br text-white shadow-md ${step.color}`}
            >
              {step.icon}
            </div>
            <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
