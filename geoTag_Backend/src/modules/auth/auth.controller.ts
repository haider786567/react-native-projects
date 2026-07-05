import type { Request, Response } from "express";
import {
  ForgotPasswordService,
  GetmeService,
  LoginService,
  LogoutService,
  RefreshTokenService,
  RegisterService,
  ResetPasswordService,
} from "./auth.service.js";

const errorMessage = (error: unknown) => error instanceof Error ? error.message : "Internal server error.";

const statusFor = (error: unknown) => {
  const message = errorMessage(error);
  if (["Invalid credentials", "Invalid refresh token", "Invalid or expired reset token"].includes(message)) return 401;
  if (message === "User not found") return 404;
  if (message === "User already exists") return 409;
  if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) return 409;
  return 500;
};

const respondWithError = (res: Response, error: unknown) => {
  const status = statusFor(error);
  if (status === 500) console.error("Authentication error:", error);
  const message = status === 500 ? "Internal server error." :
    status === 409 ? "User already exists" : errorMessage(error);
  return res.status(status).json({ message });
};

export const LoginController = async (req: Request, res: Response) => {
  try {
    res.json(await LoginService(req.body));
  } catch (error) {
    respondWithError(res, error);
  }
};

export const RegisterController = async (req: Request, res: Response) => {
  try {
    res.status(201).json(await RegisterService(req.body));
  } catch (error) {
    respondWithError(res, error);
  }
};

export const LogoutController = async (req: Request, res: Response) => {
  try {
    res.json(await LogoutService(req.user.id));
  } catch (error) {
    respondWithError(res, error);
  }
};

export const ForgotPasswordController = async (req: Request, res: Response) => {
  try {
    const resetToken = await ForgotPasswordService(req.body);
    res.json({
      message: "If that email is registered, password reset instructions have been generated.",
      ...(process.env.NODE_ENV !== "production" && resetToken ? { resetToken } : {}),
    });
  } catch (error) {
    respondWithError(res, error);
  }
};

export const ResetPasswordController = async (req: Request, res: Response) => {
  try {
    res.json(await ResetPasswordService(req.body));
  } catch (error) {
    respondWithError(res, error);
  }
};

export const RefreshTokenController = async (req: Request, res: Response) => {
  try {
    res.json(await RefreshTokenService(req.body.refreshToken));
  } catch (error) {
    respondWithError(res, error);
  }
};

export const GetMeController = async (req: Request, res: Response) => {
  try {
    res.json(await GetmeService(req.user.id));
  } catch (error) {
    respondWithError(res, error);
  }
};
