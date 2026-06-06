export interface VideoFormat {
  formatId: string;
  quality: string;
  ext: string;
  fps?: number;
  filesize?: number;
  note?: string;
  hasVideo: boolean;
  hasAudio: boolean;
}

export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: number; // in seconds
  author: string;
  formats: VideoFormat[];
  url: string;
  source: 'youtube' | 'instagram';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
