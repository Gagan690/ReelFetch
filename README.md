# ReelFetch - Video Downloader (YouTube & Instagram)

ReelFetch is a premium, full-stack video downloading website built using **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. It allows users to download public YouTube Videos, YouTube Shorts, and Instagram Reels in MP4 format.

## Features

- **Hero & Landing Section**: A clean, modern interface featuring custom gradient backdrops, floating mesh animations, and responsive card layouts.
- **Dynamic URL Validation**: Custom regex checks validate YouTube (video/shorts/mobile) and Instagram (reel/tv/post) links instantly.
- **Safety CAPTCHA Challenge**: Mathematical client-side verification popup to block automatic scrapers and endpoint spam.
- **In-Memory Rate Limiting**: IP-based rate throttling applied to searches and stream requests to prevent abuse.
- **Metadata Resolving**: Calls a python child process using `yt-dlp` to fetch progressive video resolutions (360p, 720p, etc.).
- **Zero-Storage Streaming**: Streams video downloads directly from the platform CDN chunk-by-chunk to the user's browser, bypassing local disk storage.
- **Auto-Cancellation**: Kills active `yt-dlp` command instances immediately if the user cancels the download in the browser.
- **Dark Mode**: Complete theme toggle support persisted in `localStorage`.

---

## Prerequisites

Before running the application, make sure your system has the following installed:

1. **Node.js** (v18 or higher)
2. **Python** (v3.8 or higher)
3. **yt-dlp** (installed via pip):
   ```bash
   python -m pip install -U yt-dlp
   ```

---

## Local Setup

1. **Clone or navigate to the directory**:
   ```bash
   cd ReelDownloader
   ```
2. **Install Node dependencies**:
   ```bash
   npm install
   ```
3. **Copy environment template**:
   ```bash
   copy .env.example .env.local
   ```
4. **Run the hot-reloading development server**:
   ```bash
   npm run dev
   ```
5. **Open the application**:
   Go to [http://localhost:3000](http://localhost:3000) in your web browser.

---

## Production Build & Run

To create an optimized production build:
```bash
npm run build
npm run start
```

---

## Docker Deployment

To build and run ReelFetch inside a Docker container:

1. **Build the Docker Image**:
   ```bash
   docker build -t reelfetch .
   ```
2. **Run the Container**:
   ```bash
   docker run -p 3000:3000 reelfetch
   ```

---

## Legal & Safety Notice

**Respect platform terms of service. Only download content you have the rights to.** This application is designed for personal, fair-use purposes and does not bypass DRM (Digital Rights Management) or platform blocks.
