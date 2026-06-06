import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { validateUrl } from '@/lib/validate';
import { apiLimiter } from '@/lib/limiter';
import { VideoInfo, VideoFormat, ApiResponse } from '@/types';

// Force dynamic execution for API route
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    // 1. Validate URL
    const validation = validateUrl(url);
    if (!validation.isValid) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // 2. Apply Rate Limiter
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = apiLimiter.limit(ip);
    if (!rateLimit.success) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }

    // 3. Invoke yt-dlp to get video information
    const sanitizedUrl = validation.sanitizedUrl;
    const videoData = await getInfoFromYtDlp(sanitizedUrl);

    // 4. Parse & filter formats
    const rawFormats = videoData.formats || [];
    const filteredFormats: VideoFormat[] = [];

    if (validation.platform === 'youtube') {
      // Find progressive formats (video + audio merged natively)
      // These usually have format_id '18' (360p) and '22' (720p)
      for (const fmt of rawFormats) {
        const hasVideo = fmt.vcodec && fmt.vcodec !== 'none';
        const hasAudio = fmt.acodec && fmt.acodec !== 'none';
        
        if (hasVideo && hasAudio) {
          const height = fmt.height || 0;
          let qualityLabel = `${height}p`;
          if (height === 720) qualityLabel = '720p (HD)';
          if (height === 360) qualityLabel = '360p';
          if (height === 1080) qualityLabel = '1080p (Full HD)';
          
          filteredFormats.push({
            formatId: fmt.format_id,
            quality: qualityLabel,
            ext: fmt.ext || 'mp4',
            fps: fmt.fps,
            filesize: fmt.filesize || fmt.filesize_approx || undefined,
            note: fmt.format_note || undefined,
            hasVideo: true,
            hasAudio: true,
          });
        }
      }

      // Sort formats by resolution height descending
      filteredFormats.sort((a, b) => {
        const hA = parseInt(a.quality) || 0;
        const hB = parseInt(b.quality) || 0;
        return hB - hA;
      });

      // If no progressive format was found (rare), add a fallback 'best' progressive format
      if (filteredFormats.length === 0) {
        filteredFormats.push({
          formatId: 'best',
          quality: 'Auto Quality',
          ext: 'mp4',
          hasVideo: true,
          hasAudio: true,
        });
      }
    } else {
      // Instagram: Reels are progressive mp4 streams, we usually just need the best combined quality format
      // In yt-dlp, the formats are listed. We'll pick the one with both video and audio.
      const bestProgressive = rawFormats
        .filter((fmt: any) => fmt.vcodec !== 'none' && fmt.acodec !== 'none')
        .sort((a: any, b: any) => (b.height || 0) - (a.height || 0))[0];

      if (bestProgressive) {
        filteredFormats.push({
          formatId: bestProgressive.format_id,
          quality: bestProgressive.height ? `${bestProgressive.height}p` : 'Best Quality',
          ext: bestProgressive.ext || 'mp4',
          fps: bestProgressive.fps,
          filesize: bestProgressive.filesize || bestProgressive.filesize_approx || undefined,
          hasVideo: true,
          hasAudio: true,
        });
      } else {
        // Fallback for Instagram
        filteredFormats.push({
          formatId: 'best',
          quality: 'Best Quality',
          ext: 'mp4',
          hasVideo: true,
          hasAudio: true,
        });
      }
    }

    const responseData: VideoInfo = {
      id: videoData.id || '',
      title: videoData.title || 'Untitled Video',
      thumbnail: videoData.thumbnail || videoData.thumbnails?.[0]?.url || '/placeholder.png',
      duration: videoData.duration || 0,
      author: videoData.uploader || videoData.channel || 'Unknown Creator',
      formats: filteredFormats,
      url: sanitizedUrl,
      source: validation.platform!,
    };

    return NextResponse.json<ApiResponse<VideoInfo>>({
      success: true,
      data: responseData,
    });

  } catch (error: any) {
    console.error('Error resolving video info:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: error.message || 'Failed to resolve video information. Make sure the video is public.' },
      { status: 500 }
    );
  }
}

// Spawns yt-dlp process to dump JSON metadata
function getInfoFromYtDlp(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // Run yt-dlp with python safely passing arguments
    const process = spawn('python', ['-m', 'yt_dlp', '--dump-json', '--no-warnings', '--no-playlist', url]);

    let stdoutData = '';
    let stderrData = '';

    process.stdout.on('data', (chunk) => {
      stdoutData += chunk.toString();
    });

    process.stderr.on('data', (chunk) => {
      stderrData += chunk.toString();
    });

    process.on('close', (code) => {
      if (code !== 0) {
        console.error('yt-dlp exited with error code:', code, 'stderr:', stderrData);
        reject(new Error('Failed to retrieve video metadata. The video might be private, deleted, or geoblocked.'));
        return;
      }

      try {
        const parsed = JSON.parse(stdoutData);
        resolve(parsed);
      } catch (err) {
        reject(new Error('Failed to parse video metadata.'));
      }
    });
  });
}
