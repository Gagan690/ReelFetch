import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { validateUrl } from '@/lib/validate';
import { downloadLimiter } from '@/lib/limiter';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  let childProcess: any = null;

  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    const formatId = searchParams.get('formatId') || 'best';
    const title = searchParams.get('title') || 'video';

    // 1. Validate Input
    if (!url) {
      return new NextResponse('URL query parameter is required.', { status: 400 });
    }

    const validation = validateUrl(url);
    if (!validation.isValid) {
      return new NextResponse(`Invalid URL: ${validation.error}`, { status: 400 });
    }

    // 2. Apply Rate Limiter
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = downloadLimiter.limit(ip);
    if (!rateLimit.success) {
      return new NextResponse('Too many download requests. Please wait a minute before downloading again.', { status: 429 });
    }

    // 3. Sanitize filename
    // Keep alphanumeric, spaces, dashes, underscores, and foreign accent characters
    const sanitizedTitle = title
      .replace(/[^a-zA-Z0-9_\u00C0-\u017F\s-]/g, '')
      .trim()
      .substring(0, 100) || 'download';
    
    // Choose appropriate file extension (default to mp4)
    let ext = 'mp4';
    if (searchParams.get('ext')) {
      const paramExt = searchParams.get('ext')!.replace(/[^a-zA-Z0-9]/g, '');
      if (paramExt) ext = paramExt;
    }

    const filename = `${sanitizedTitle.replace(/\s+/g, '_')}.${ext}`;

    // 4. Spawn yt-dlp to stream to stdout
    // Argument '-o -' tells yt-dlp to output to stdout
    // --no-part tells yt-dlp to write directly to stdout instead of using .part files
    childProcess = spawn('python', [
      '-m',
      'yt_dlp',
      '-f',
      formatId,
      '-o',
      '-',
      '--no-cache-dir',
      '--no-playlist',
      '--no-part',
      validation.sanitizedUrl
    ]);

    // Create readable stream
    const stream = new ReadableStream({
      start(controller) {
        childProcess.stdout.on('data', (chunk: Buffer) => {
          controller.enqueue(chunk);
        });

        childProcess.stdout.on('end', () => {
          controller.close();
        });

        childProcess.stderr.on('data', (chunk: Buffer) => {
          // Log errors but don't break the stream unless fatal
          const msg = chunk.toString();
          if (msg.includes('ERROR:')) {
            console.error('yt-dlp error inside download stream:', msg);
          }
        });

        childProcess.on('error', (err: any) => {
          console.error('Failed to start yt-dlp child process:', err);
          controller.error(err);
        });
      },
      cancel() {
        // This is called when the client cancels the download or closes connection
        if (childProcess) {
          console.log('Client canceled download, killing yt-dlp process');
          childProcess.kill('SIGTERM');
        }
      }
    });

    // Return streaming response with appropriate headers
    return new NextResponse(stream, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error: any) {
    console.error('Error in download api route:', error);
    if (childProcess) {
      childProcess.kill('SIGTERM');
    }
    return new NextResponse('Internal Server Error inside streaming download.', { status: 500 });
  }
}
