
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/user.types.js";

export const genrateRefreshToken = (payload: JwtPayload) => {

    if (!process.env.JWT_REFRESH_SECRET) {
        throw new Error("JWT_REFRESH_SECRET is not defined in the environment variables.");
    }
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    if(typeof payload === "string"){
        throw new Error("Payload must be an object, not a string.");
    }
    return refreshToken;
}

export const genrateAccessToken = (payload: JwtPayload) => {
    if (!process.env.JWT_ACCESS_SECRET) {
        throw new Error("JWT_ACCESS_SECRET is not defined in the environment variables.");
    }
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    return accessToken;

}

export const verifyAccessToken = (token: string) => {
    if (!process.env.JWT_ACCESS_SECRET) {
        throw new Error("JWT_ACCESS_SECRET is not defined in the environment variables.");
    }
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}
export const verifyRefreshToken = (token: string):JwtPayload => {
    if (!process.env.JWT_REFRESH_SECRET) {
        throw new Error("JWT_REFRESH_SECRET is not defined in the environment variables.");
    }
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    if (typeof decoded === "string") {
        throw new Error("Decoded token is a string, expected an object.");
    }
    return decoded as JwtPayload;
}
