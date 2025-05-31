/**
 * Rate limiter for API calls
 * Implements a simple token bucket algorithm
 */
export class RateLimiter {
  private maxRequests: number;
  private timeWindow: number;
  private tokens: number;
  private lastRefillTimestamp: number;

  /**
   * Create a new rate limiter
   * @param options Configuration options
   * @param options.maxRequests Maximum number of requests allowed in the time window
   * @param options.timeWindow Time window in milliseconds
   */
  constructor(options: { maxRequests: number; timeWindow: number }) {
    this.maxRequests = options.maxRequests;
    this.timeWindow = options.timeWindow;
    this.tokens = options.maxRequests;
    this.lastRefillTimestamp = Date.now();
  }

  /**
   * Check if a request is allowed under the current rate limit
   * @returns boolean indicating if the request is allowed
   */
  public allowRequest(): boolean {
    this.refillTokens();
    
    if (this.tokens > 0) {
      this.tokens -= 1;
      return true;
    }
    
    return false;
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refillTokens(): void {
    const now = Date.now();
    const elapsedTime = now - this.lastRefillTimestamp;
    
    if (elapsedTime > 0) {
      // Calculate tokens to add based on elapsed time
      const tokensToAdd = Math.floor((elapsedTime / this.timeWindow) * this.maxRequests);
      
      if (tokensToAdd > 0) {
        this.tokens = Math.min(this.maxRequests, this.tokens + tokensToAdd);
        this.lastRefillTimestamp = now;
      }
    }
  }
  
  /**
   * Get the number of seconds until the next token is available
   * @returns Number of seconds until next available token
   */
  public getTimeUntilNextToken(): number {
    if (this.tokens > 0) return 0;
    
    const now = Date.now();
    const elapsedTime = now - this.lastRefillTimestamp;
    const timePerToken = this.timeWindow / this.maxRequests;
    
    return Math.ceil((timePerToken - elapsedTime) / 1000);
  }
}
