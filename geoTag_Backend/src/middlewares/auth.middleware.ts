import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";


export const identifyUser = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = verifyAccessToken(token);
        if (typeof decoded === "string") {
            throw new Error("Decoded token is a string, expected an object.");
        }
        req.user = { id: decoded.id, email: decoded.email };
        next();
    } catch {
        return res.status(401).json({ message: "Unauthorized" });
    }

};
