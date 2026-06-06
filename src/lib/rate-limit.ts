import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

// 5 enquiry submissions per IP per hour
export const enquiryLimiter = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  prefix: 'rl:enquiry',
})

// 3 magic link requests per IP per 15 minutes
export const authLimiter = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(3, '15 m'),
  prefix: 'rl:auth',
})

export function getIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}
