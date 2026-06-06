'use client';

import { useState } from 'react';
import { VideoInfo, VideoFormat } from '@/types';

interface InfoCardProps {
  video: VideoInfo;
}

export default function InfoCard({ video }: InfoCardProps) {
  const [selectedFormat, setSelectedFormat] = useState<VideoFormat | null>(
    video.formats.length > 0 ? video.formats[0] : null
  );
  const [downloadStarted, setDownloadStarted] = useState(false);

  const formatDuration = (sec: number): string => {
    if (!sec) return '0:00';
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = Math.floor(sec % 60);

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSize = (bytes?: number): string => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `(${mb.toFixed(1)} MB)`;
  };

  const handleDownload = () => {
    if (!selectedFormat) return;

    setDownloadStarted(true);
    
    // Construct the download endpoint URL
    const downloadUrl = `/api/download?url=${encodeURIComponent(
      video.url
    )}&formatId=${selectedFormat.formatId}&title=${encodeURIComponent(
      video.title
    )}&ext=${selectedFormat.ext}`;

    // Create an anchor tag and click it programmatically to trigger native browser download
    // Since the API response sets Content-Disposition: attachment, it won't reload the page
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Reset status after a few seconds
    setTimeout(() => {
      setDownloadStarted(false);
    }, 4000);
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 dark:border-gray-800 dark:bg-gray-950/80 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row">
        {/* Left Column: Thumbnail & Platform Badge */}
        <div className="relative w-full shrink-0 sm:w-56 bg-gray-100 dark:bg-gray-900 flex items-center justify-center min-h-[160px] sm:min-h-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover aspect-video sm:aspect-square"
          />
          
          {/* Duration Badge */}
          {video.duration > 0 && (
            <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 text-xs font-semibold text-white tracking-wider">
              {formatDuration(video.duration)}
            </span>
          )}

          {/* Platform Badge overlay */}
          <span
            className={`absolute top-2 left-2 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase text-white shadow-xs ${
              video.source === 'youtube' ? 'bg-red-600' : 'bg-pink-600'
            }`}
          >
            {video.source}
          </span>
        </div>

        {/* Right Column: Title & Format Picker */}
        <div className="flex flex-col justify-between p-5 flex-1">
          <div>
            <h3 className="line-clamp-2 text-lg font-bold leading-snug text-gray-900 dark:text-white" title={video.title}>
              {video.title}
            </h3>
            
            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              Channel: <span className="text-gray-700 dark:text-gray-300 font-semibold">{video.author}</span>
            </p>
          </div>

          <div className="mt-5">
            {/* Format Selection Dropdown */}
            {video.formats.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="format-select" className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                    Select Quality / Format
                  </label>
                  <select
                    id="format-select"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm text-gray-800 focus:border-rose-500 focus:outline-hidden dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-amber-500"
                    value={selectedFormat?.formatId || ''}
                    onChange={(e) => {
                      const found = video.formats.find((f) => f.formatId === e.target.value);
                      if (found) setSelectedFormat(found);
                    }}
                  >
                    {video.formats.map((fmt) => (
                      <option key={fmt.formatId} value={fmt.formatId}>
                        {fmt.quality} - {fmt.ext.toUpperCase()} {formatSize(fmt.filesize)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Download Action Button */}
                <button
                  onClick={handleDownload}
                  disabled={downloadStarted}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 font-bold text-white shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-98 ${
                    downloadStarted
                      ? 'bg-emerald-500 shadow-emerald-500/10'
                      : 'bg-linear-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-rose-500/20'
                  }`}
                >
                  {downloadStarted ? (
                    <>
                      {/* Success / Spinner Icon */}
                      <svg className="h-5 w-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Download Started!
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Video
                    </>
                  )}
                </button>
              </div>
            ) : (
              <p className="text-sm font-semibold text-rose-500 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 text-center">
                No progressive download formats found. Try a different video.
              </p>
            )}
          </div>

          {downloadStarted && (
            <p className="mt-2 text-center text-[11px] font-semibold text-emerald-500 dark:text-emerald-400">
              The browser download manager has taken over. Please check your notifications.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
