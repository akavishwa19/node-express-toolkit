import { rateLimit } from 'express-rate-limit';

const gloabalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  message: 'Too many requests from this IP, please try again after some time'
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  message: 'Too many requests from this IP, please try again after some time'
});

export { gloabalLimiter, authLimiter };
