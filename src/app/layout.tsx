import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ReelFetch - Free YouTube Shorts & Instagram Reel Downloader',
  description: 'Download YouTube Videos, YouTube Shorts, and Instagram Reels quickly. Stream video files directly in MP4 format. No registration, no ads, completely free.',
  keywords: ['video downloader', 'youtube shorts downloader', 'instagram reels downloader', 'download youtube shorts', 'instagram reels', 'free mp4 downloader'],
  authors: [{ name: 'ReelFetch Team' }],
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} font-sans min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
