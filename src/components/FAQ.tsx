'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'Is this video downloader free to use?',
      answer: 'Yes! ReelFetch is 100% free to use. There are no registration forms, subscriptions, or hidden charges. You can download as many public videos as you like.',
    },
    {
      question: 'Does this work on mobile phones (iOS / Android)?',
      answer: 'Absolutely! Our site is fully mobile-responsive. On Android, you can download directly to your downloads folder. On iOS (iPhone/iPad), we recommend using the default Safari browser, which supports native file downloads seamlessly.',
    },
    {
      question: 'Why are only some resolutions (like 720p or 360p) listed for YouTube?',
      answer: 'YouTube stores high-definition video formats (1080p and higher) with video and audio separated. To deliver fast, immediate streaming downloads without buffering and rendering delays on our servers, we prioritize progressive formats (pre-merged audio and video tracks) which download instantly.',
    },
    {
      question: 'Can I download private videos, posts, or stories?',
      answer: 'No. To respect user privacy and social platform policies, we only support downloads for public videos, Shorts, and Reels. The downloader cannot resolve restricted content or profiles that require user credentials.',
    },
    {
      question: 'Are the downloaded videos stored on your servers?',
      answer: 'No. We do not store or host any videos. All downloads are parsed and streamed directly from YouTube and Instagram servers straight to your browser stream. Your downloads remain private and secure.',
    },
    {
      question: 'Where are my videos saved after download completes?',
      answer: 'By default, your web browser saves downloaded files to your system’s designated "Downloads" folder. You can customize this location inside your browser settings.',
    },
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-12 md:py-16 border-t border-gray-150 dark:border-gray-900">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Have questions about how to use ReelFetch? Find answers here.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white/50 transition-all duration-300 dark:border-gray-800/80 dark:bg-gray-950/40"
              >
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between p-5 text-left font-semibold text-gray-800 transition-colors hover:text-rose-500 dark:text-gray-200 dark:hover:text-amber-500"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                    <svg
                      className={`h-4 w-4 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-60 border-t border-gray-250 p-5 dark:border-gray-800' : 'max-h-0'
                  } overflow-hidden`}
                >
                  <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
