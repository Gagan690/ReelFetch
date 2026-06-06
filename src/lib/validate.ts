export interface ValidatedUrl {
  isValid: boolean;
  platform: 'youtube' | 'instagram' | null;
  sanitizedUrl: string;
  error?: string;
}

const YOUTUBE_REGEX = /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[&?].*)?$/;
const INSTAGRAM_REGEX = /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)\/?(?:\?.*)?$/;

export function validateUrl(url: string): ValidatedUrl {
  const trimmed = url.trim();
  if (!trimmed) {
    return {
      isValid: false,
      platform: null,
      sanitizedUrl: '',
      error: 'Please enter a URL.',
    };
  }

  // Test YouTube
  if (YOUTUBE_REGEX.test(trimmed)) {
    const match = trimmed.match(YOUTUBE_REGEX);
    const videoId = match ? match[1] : '';
    if (videoId) {
      return {
        isValid: true,
        platform: 'youtube',
        sanitizedUrl: `https://www.youtube.com/watch?v=${videoId}`,
      };
    }
  }

  // Test Instagram
  if (INSTAGRAM_REGEX.test(trimmed)) {
    const match = trimmed.match(INSTAGRAM_REGEX);
    const mediaId = match ? match[1] : '';
    if (mediaId) {
      return {
        isValid: true,
        platform: 'instagram',
        sanitizedUrl: `https://www.instagram.com/reel/${mediaId}/`,
      };
    }
  }

  return {
    isValid: false,
    platform: null,
    sanitizedUrl: '',
    error: 'Invalid URL. Please enter a valid YouTube Video/Shorts link or Instagram Reel/Post link.',
  };
}
