import type { JwtPayload } from "./user.types.js";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

export {};
