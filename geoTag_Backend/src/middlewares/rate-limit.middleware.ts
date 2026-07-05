import type { NextFunction, Request, Response } from "express";

type Entry = { count: number; resetAt: number };

export const createRateLimiter = (limit: number, windowMs: number) => {
  const attempts = new Map<string, Entry>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = req.ip ?? req.socket.remoteAddress ?? "unknown";
    const current = attempts.get(key);

    if (!current || current.resetAt <= now) {
      attempts.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    current.count += 1;
    if (current.count > limit) {
      res.setHeader("Retry-After", Math.ceil((current.resetAt - now) / 1000));
      return res.status(429).json({ message: "Too many attempts. Please try again later." });
    }

    next();
  };
};
