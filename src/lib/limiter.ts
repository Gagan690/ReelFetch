interface RateLimitInfo {
  timestamps: number[];
}

class MemoryRateLimiter {
  private cache: Map<string, RateLimitInfo>;
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 10) {
    this.cache = new Map();
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Prune cache every 5 minutes to prevent memory leaks
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.prune(), 300000);
    }
  }

  public limit(ip: string): { success: boolean; limit: number; remaining: number; reset: number } {
    const now = Date.now();
    let record = this.cache.get(ip);

    if (!record) {
      record = { timestamps: [] };
      this.cache.set(ip, record);
    }

    // Filter out timestamps older than the window
    record.timestamps = record.timestamps.filter((timestamp) => now - timestamp < this.windowMs);

    if (record.timestamps.length >= this.maxRequests) {
      const oldestValid = record.timestamps[0];
      const reset = oldestValid + this.windowMs;
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset,
      };
    }

    // Record this request
    record.timestamps.push(now);
    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - record.timestamps.length,
      reset: now + this.windowMs,
    };
  }

  private prune() {
    const now = Date.now();
    for (const [ip, record] of this.cache.entries()) {
      record.timestamps = record.timestamps.filter((timestamp) => now - timestamp < this.windowMs);
      if (record.timestamps.length === 0) {
        this.cache.delete(ip);
      }
    }
  }
}

// Export a singleton rate limiter for general API requests (e.g., 10 requests per minute)
export const apiLimiter = new MemoryRateLimiter(60000, 10);

// Export a stricter rate limiter for downloads (e.g., 5 downloads per minute)
export const downloadLimiter = new MemoryRateLimiter(60000, 5);
