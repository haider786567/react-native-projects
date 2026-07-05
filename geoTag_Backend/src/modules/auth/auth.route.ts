import { Router } from "express";
import {
  ForgotPasswordController,
  GetMeController,
  LoginController,
  LogoutController,
  RefreshTokenController,
  RegisterController,
  ResetPasswordController,
} from "./auth.controller.js";
import {
  validateForgotPassword,
  validateLogin,
  validateRefreshToken,
  validateRegister,
  validateResetPassword,
} from "./auth.validation.js";
import { identifyUser } from "../../middlewares/auth.middleware.js";
import { createRateLimiter } from "../../middlewares/rate-limit.middleware.js";

const router = Router();
const authLimiter = createRateLimiter(10, 15 * 60 * 1000);
const passwordResetLimiter = createRateLimiter(5, 15 * 60 * 1000);

router.post("/register",  validateRegister, RegisterController);
router.post("/login", validateLogin, LoginController);
router.post("/logout", identifyUser, LogoutController);
router.post("/forgot-password", passwordResetLimiter, validateForgotPassword, ForgotPasswordController);
router.post("/reset-password", passwordResetLimiter, validateResetPassword, ResetPasswordController);
router.post("/refresh-token", authLimiter, validateRefreshToken, RefreshTokenController);
router.get("/me", identifyUser, GetMeController);

export default router;
