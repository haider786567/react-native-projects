import type { NextFunction, Request, Response } from "express";
import zod from "zod";

const email = zod.string().trim().toLowerCase().email({ message: "Invalid email address" });
const password = zod.string().min(8, { message: "Password must be at least 8 characters long" });

export const loginSchema = zod.object({
  email,
  password: zod.string().min(1, { message: "Password is required" }),
});

export const registerSchema = zod.object({
  name: zod.string().trim().min(1, { message: "Name is required" }).max(100),
  email,
  password,
  confirmPassword: password,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const refreshTokenSchema = zod.object({
  refreshToken: zod.string().min(1, { message: "Refresh token is required" }),
});

export const forgotPasswordSchema = zod.object({ email });

export const resetPasswordSchema = zod.object({
  token: zod.string().min(32, { message: "Invalid reset token" }),
  password,
  confirmPassword: password,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).transform(({ token, password }) => ({ token, password }));

const validate = (schema: zod.ZodType) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten(),
      });
    }
    req.body = result.data;
    next();
  };

export const validateLogin = validate(loginSchema);
export const validateRegister = validate(registerSchema);
export const validateRefreshToken = validate(refreshTokenSchema);
export const validateForgotPassword = validate(forgotPasswordSchema);
export const validateResetPassword = validate(resetPasswordSchema);
